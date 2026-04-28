# Prompt: Actor Email Service - Microservice Email Marketing

## Contexte
Tu es un développeur senior spécialisé en email marketing et délivrabilité. Tu dois créer le microservice **Actor Emailing** pour la plateforme Actor Hub. Ce service gère les campagnes email professionnelles, l'automatisation, l'éditeur d'emails, et le suivi de délivrabilité.

## Mission
Créer un microservice email marketing autonome avec envoi SMTP haute performance, éditeur drag & drop, automatisation par flux, segmentation avancée, et analytics de délivrabilité.

## Spécifications techniques

### Stack
- **Runtime** : Node.js 20+ / NestJS
- **Envoi** : Nodemailer + SMTP direct, ou SendGrid/AWS SES
- **Base de données** : PostgreSQL (schéma `email`)
- **Queue** : Redis + Bull (file d'envoi)
- **Template engine** : MJML (emails responsives)
- **ORM** : Prisma

### Schéma de base de données
```sql
CREATE SCHEMA email;

CREATE TABLE email.smtp_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  host VARCHAR(255) NOT NULL,
  port INTEGER NOT NULL DEFAULT 587,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  encryption VARCHAR(10) DEFAULT 'tls', -- none, ssl, tls
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255),
  reply_to VARCHAR(255),
  daily_limit INTEGER DEFAULT 10000,
  hourly_limit INTEGER DEFAULT 500,
  sent_today INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  domain VARCHAR(255) NOT NULL,
  spf_verified BOOLEAN DEFAULT false,
  dkim_verified BOOLEAN DEFAULT false,
  dmarc_verified BOOLEAN DEFAULT false,
  dkim_selector VARCHAR(100),
  dkim_public_key TEXT,
  dns_records JSONB, -- Records DNS à configurer
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, domain)
);

CREATE TABLE email.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  html_content TEXT NOT NULL,
  mjml_content TEXT, -- Source MJML
  text_content TEXT,
  thumbnail_url TEXT,
  category VARCHAR(100),
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  preview_text VARCHAR(200),
  from_email VARCHAR(255),
  from_name VARCHAR(255),
  reply_to VARCHAR(255),
  template_id UUID REFERENCES email.templates(id),
  smtp_config_id UUID REFERENCES email.smtp_configs(id),
  html_content TEXT NOT NULL,
  text_content TEXT,
  segment_id UUID,
  status VARCHAR(20) DEFAULT 'draft', -- draft, scheduled, sending, sent, cancelled
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  complained_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  bounce_rate DECIMAL(5,2),
  ab_test_enabled BOOLEAN DEFAULT false,
  ab_subject_b VARCHAR(500),
  ab_content_b TEXT,
  ab_winner VARCHAR(1), -- A or B
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email.emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  campaign_id UUID REFERENCES email.campaigns(id),
  to_email VARCHAR(255) NOT NULL,
  to_name VARCHAR(255),
  subject VARCHAR(500),
  status VARCHAR(20) DEFAULT 'queued', -- queued, sent, delivered, opened, clicked, bounced, complained, unsubscribed
  message_id VARCHAR(255), -- SMTP Message-ID
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  clicked_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  bounced_at TIMESTAMPTZ,
  bounce_type VARCHAR(20), -- hard, soft
  bounce_reason TEXT,
  unsubscribed_at TIMESTAMPTZ,
  complained_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email.click_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID REFERENCES email.emails(id),
  original_url TEXT NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

CREATE TABLE email.segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  conditions JSONB NOT NULL, -- Règles de segmentation
  contacts_count INTEGER DEFAULT 0,
  is_dynamic BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email.automation_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(50) NOT NULL, -- signup, tag_added, date_field, manual, webhook
  trigger_config JSONB,
  flow_data JSONB NOT NULL, -- Flux d'automatisation (noeuds et connexions)
  status VARCHAR(20) DEFAULT 'draft', -- draft, active, paused
  total_entered INTEGER DEFAULT 0,
  total_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email.unsubscribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  reason VARCHAR(255),
  campaign_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);
```

### Endpoints API
```
# Envoi
POST   /api/v1/emails/send              # Envoyer un email unique
POST   /api/v1/emails/send-template     # Envoyer via template

# Campagnes
GET    /api/v1/campaigns                 # Lister
POST   /api/v1/campaigns                 # Créer
GET    /api/v1/campaigns/:id             # Détail
PUT    /api/v1/campaigns/:id             # Modifier
DELETE /api/v1/campaigns/:id             # Supprimer
POST   /api/v1/campaigns/:id/send        # Lancer
POST   /api/v1/campaigns/:id/schedule    # Planifier
POST   /api/v1/campaigns/:id/test        # Envoyer un test
GET    /api/v1/campaigns/:id/stats       # Statistiques détaillées

# Templates
GET    /api/v1/templates                 # Lister
POST   /api/v1/templates                 # Créer
PUT    /api/v1/templates/:id             # Modifier
DELETE /api/v1/templates/:id             # Supprimer
POST   /api/v1/templates/:id/preview     # Prévisualiser
POST   /api/v1/templates/:id/duplicate   # Dupliquer

# Éditeur
POST   /api/v1/editor/mjml-to-html      # Convertir MJML en HTML
POST   /api/v1/editor/upload-image      # Upload image pour email

# Automatisation
GET    /api/v1/flows                     # Lister les flux
POST   /api/v1/flows                     # Créer
PUT    /api/v1/flows/:id                 # Modifier
POST   /api/v1/flows/:id/activate        # Activer
POST   /api/v1/flows/:id/pause           # Pause
GET    /api/v1/flows/:id/stats           # Statistiques

# Segmentation
GET    /api/v1/segments                  # Lister
POST   /api/v1/segments                  # Créer
PUT    /api/v1/segments/:id              # Modifier
GET    /api/v1/segments/:id/preview      # Prévisualiser les contacts

# Configuration SMTP
GET    /api/v1/smtp                      # Lister les configs
POST   /api/v1/smtp                      # Ajouter
PUT    /api/v1/smtp/:id                  # Modifier
POST   /api/v1/smtp/:id/test            # Tester la connexion
DELETE /api/v1/smtp/:id                  # Supprimer

# Domaines & DNS
GET    /api/v1/domains                   # Lister
POST   /api/v1/domains                   # Ajouter
POST   /api/v1/domains/:id/verify        # Vérifier DNS
GET    /api/v1/domains/:id/records       # Records DNS requis

# Analytics
GET    /api/v1/analytics/deliverability  # Taux de délivrabilité
GET    /api/v1/analytics/engagement      # Engagement (opens, clicks)
GET    /api/v1/analytics/bounces         # Analyse des bounces
GET    /api/v1/analytics/geo             # Géolocalisation opens

# Webhooks (réception événements)
POST   /api/v1/webhooks/bounce           # Bounces
POST   /api/v1/webhooks/complaint        # Plaintes
POST   /api/v1/webhooks/unsubscribe      # Désabonnements
```

### Événements Message Broker
```typescript
'email.campaign.sent'           // { campaignId, totalSent }
'email.campaign.completed'      // { campaignId, stats }
'email.email.opened'            // { emailId, openedAt, ip }
'email.email.clicked'           // { emailId, url, clickedAt }
'email.email.bounced'           // { emailId, bounceType, reason }
'email.email.unsubscribed'      // { emailId, email }
'email.email.complained'        // { emailId, email }
'email.flow.contact_entered'    // { flowId, contactEmail }
'email.flow.contact_completed'  // { flowId, contactEmail }
'email.domain.verified'         // { domainId, domain }
'email.deliverability.alert'    // { tenantId, bounceRate, threshold }
```

## Critères d'acceptation
- [ ] Envoi SMTP fiable avec gestion des queues
- [ ] Campagnes avec A/B testing
- [ ] Templates MJML responsives
- [ ] Flux d'automatisation visuels
- [ ] Tracking opens/clicks (pixel + redirection)
- [ ] Gestion des bounces (hard/soft)
- [ ] Segmentation dynamique
- [ ] Authentification DNS (SPF, DKIM, DMARC)
- [ ] Dashboard de délivrabilité
- [ ] Gestion des désabonnements (CAN-SPAM/RGPD)
