# Skill : Email Service — ACTOR Hub

## Scénario d'utilisation
Utiliser ce skill pour développer le microservice Email Marketing (`services/email-service/`).

## Contexte Métier
Plateforme d'email marketing professionnelle avec :
- Éditeur Drag & Drop (templates visuels)
- Automation (séquences, triggers événementiels)
- SMTP dédié par client (meilleure délivrabilité)
- Délivrabilité 99.5% (SPF, DKIM, DMARC configurés)
- A/B Testing sur objet, contenu, heure d'envoi

## Fonctionnalités Clés

### Envoi
- Envoi transactionnel (1-to-1) via API
- Campagnes marketing (1-to-many)
- Séquences automatisées (drip campaigns)
- A/B Testing (jusqu'à 4 variantes)
- Planification avec timezone

### Templates
- Éditeur Drag & Drop (JSON → HTML)
- Bibliothèque de templates prêts à l'emploi
- Variables dynamiques (`{{prenom}}`, `{{lien_desinscription}}`)
- Responsive design garanti
- Import HTML brut (avancé)

### Analytics
- Taux d'ouverture (pixel tracking 1x1)
- Taux de clics (liens tracés avec redirect)
- Bounces (hard & soft)
- Désabonnements (one-click unsubscribe RFC 8058)
- Spam complaints
- Heatmap des clics (optionnel)

### Délivrabilité
- SMTP dédié par organisation
- SPF, DKIM, DMARC automatiquement configurés
- Warm-up IP automatique pour nouveaux domaines
- Suppression auto des bounces durs
- Gestion des listes de suppression globales

## Structure de Fichiers

```
services/email-service/
├── src/
│   ├── app.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── modules/
│   │   ├── emails/
│   │   │   ├── emails.router.ts
│   │   │   ├── emails.controller.ts
│   │   │   └── emails.service.ts
│   │   ├── campaigns/
│   │   │   ├── campaigns.router.ts
│   │   │   ├── campaigns.controller.ts
│   │   │   └── campaigns.service.ts
│   │   ├── templates/
│   │   │   ├── templates.router.ts
│   │   │   ├── templates.controller.ts
│   │   │   ├── templates.service.ts
│   │   │   └── renderer.ts         # JSON → HTML (MJML ou custom)
│   │   ├── automation/
│   │   │   ├── automation.router.ts
│   │   │   └── automation.service.ts # Séquences & triggers
│   │   ├── tracking/
│   │   │   ├── tracking.router.ts   # /t/open/:id, /t/click/:id
│   │   │   └── tracking.service.ts
│   │   ├── smtp/
│   │   │   └── smtp.service.ts      # Gestion SMTP pool (Nodemailer)
│   │   └── unsubscribe/
│   │       ├── unsubscribe.router.ts
│   │       └── unsubscribe.service.ts
│   ├── queues/
│   │   ├── send.queue.ts
│   │   └── campaign.queue.ts
│   ├── providers/
│   │   ├── sendgrid.provider.ts
│   │   ├── mailgun.provider.ts
│   │   └── smtp.provider.ts
│   └── db/
│       ├── schema.ts
│       └── migrations/
├── openapi.yaml
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Schéma Base de Données

```sql
-- Emails individuels (transactionnel + campagne)
CREATE TABLE email_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  campaign_id UUID REFERENCES email_campaigns(id),
  message_id VARCHAR(255) UNIQUE,       -- Message-ID header
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255),
  to_email VARCHAR(255) NOT NULL,
  to_name VARCHAR(255),
  reply_to VARCHAR(255),
  subject TEXT NOT NULL,
  html_body TEXT,
  text_body TEXT,
  template_id UUID REFERENCES email_templates(id),
  template_vars JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'queued',  -- queued, sent, delivered, opened, clicked, bounced, spam, unsubscribed
  provider VARCHAR(50),
  provider_message_id VARCHAR(255),
  send_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  bounce_type VARCHAR(20),              -- 'hard', 'soft'
  unsubscribed_at TIMESTAMPTZ,
  spam_at TIMESTAMPTZ,
  ip_address INET,                      -- IP d'ouverture
  user_agent TEXT,                      -- User-Agent d'ouverture
  click_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campagnes Email
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  subject_line TEXT NOT NULL,
  preview_text TEXT,
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255),
  template_id UUID REFERENCES email_templates(id),
  html_content TEXT,
  contact_list_ids UUID[],
  excluded_list_ids UUID[],
  ab_test BOOLEAN DEFAULT FALSE,
  ab_variants JSONB DEFAULT '[]',       -- [{subject, html, percentage}]
  ab_winner_criteria VARCHAR(50),       -- 'open_rate', 'click_rate'
  status VARCHAR(50) DEFAULT 'draft',
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2) DEFAULT 0,
  click_rate DECIMAL(5,2) DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  unsubscribe_rate DECIMAL(5,2) DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates Email
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID,                          -- null = template système/global
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),                -- 'marketing', 'transactionnel', 'automation'
  thumbnail_url TEXT,
  json_content JSONB NOT NULL,          -- Structure JSON de l'éditeur drag & drop
  html_content TEXT,                    -- HTML compilé depuis JSON
  text_content TEXT,
  variables TEXT[] DEFAULT '{}',        -- Liste des variables disponibles
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Séquences Automation
CREATE TABLE email_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  trigger_type VARCHAR(100) NOT NULL,   -- 'contact_added', 'tag_added', 'date_field', 'api_trigger'
  trigger_config JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'inactive', -- inactive, active, paused
  steps JSONB NOT NULL DEFAULT '[]',    -- [{delay, template_id, subject, ...}]
  enrolled_count INTEGER DEFAULT 0,
  completed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listes de suppression
CREATE TABLE email_suppressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  reason VARCHAR(50) NOT NULL,          -- 'unsubscribe', 'bounce_hard', 'spam'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, email)
);

-- Domaines SMTP dédiés
CREATE TABLE email_sending_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL UNIQUE,
  domain VARCHAR(255) NOT NULL,
  smtp_host VARCHAR(255),
  smtp_port INTEGER DEFAULT 587,
  smtp_user VARCHAR(255),
  smtp_pass_encrypted TEXT,
  dkim_selector VARCHAR(50),
  dkim_private_key_encrypted TEXT,
  spf_record TEXT,
  dmarc_record TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Endpoints API

```
POST   /emails/send                  # Envoi transactionnel
POST   /emails/send-batch            # Envoi batch (max 1000)

GET    /emails/campaigns
POST   /emails/campaigns
GET    /emails/campaigns/:id
PUT    /emails/campaigns/:id
POST   /emails/campaigns/:id/send
POST   /emails/campaigns/:id/schedule
GET    /emails/campaigns/:id/stats
GET    /emails/campaigns/:id/recipients

GET    /emails/templates
POST   /emails/templates
GET    /emails/templates/:id
PUT    /emails/templates/:id
DELETE /emails/templates/:id
POST   /emails/templates/:id/preview  # Prévisualiser avec données test

GET    /emails/automations
POST   /emails/automations
PUT    /emails/automations/:id
POST   /emails/automations/:id/activate
POST   /emails/automations/:id/pause

GET    /emails/domains
POST   /emails/domains               # Ajouter domaine d'envoi
GET    /emails/domains/:id/verify    # Vérifier DNS

# Tracking (URLs publiques)
GET    /t/open/:messageId/:hash      # Pixel de tracking ouverture
GET    /t/click/:messageId/:linkId/:hash # Redirect lien tracé

# Désabonnement (URL publique)
GET    /unsubscribe/:token
POST   /unsubscribe/:token

GET    /emails/suppressions
DELETE /emails/suppressions/:email   # Réintégration manuelle
```

## Critères de Succès

- [ ] Envoi d'email transactionnel via API en < 500ms
- [ ] Campagne de 50 000 contacts envoyée avec succès
- [ ] Tracking ouverture (pixel) fonctionnel
- [ ] Tracking clics avec redirect fonctionnel
- [ ] Templates Drag & Drop compilés en HTML valide
- [ ] A/B Test lancé avec 2 variantes, gagnant sélectionné automatiquement
- [ ] Séquence automation déclenchée par API trigger
- [ ] Bounces durs ajoutés automatiquement à la liste de suppression
- [ ] Désabonnement one-click fonctionnel (RFC 8058)
- [ ] Domaine d'envoi dédié configuré avec DKIM vérifié
