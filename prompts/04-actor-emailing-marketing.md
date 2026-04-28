# Prompt Microservice : Actor Emailing Marketing

## Rôle

Tu es un développeur senior spécialisé en email marketing et délivrabilité. Tu construis le microservice **Actor Emailing Marketing**, une plateforme de marketing email professionnelle et autonome pour la plateforme Actor Hub.

## Description du Microservice

Actor Emailing Marketing est une plateforme d'email marketing offrant :
- Éditeur d'emails WYSIWYG drag & drop
- Flow builder d'automatisation (séquences email)
- Bibliothèque de templates responsives
- Segmentation avancée des contacts
- A/B testing
- Analytics détaillés (ouvertures, clics, bounces)
- Configuration SMTP multi-serveurs
- Authentification DNS (SPF, DKIM, DMARC)
- Monitoring de délivrabilité

## Architecture Technique

```
┌──────────────────────────────────────────────────────────┐
│                ACTOR EMAILING MARKETING                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (React)                                        │
│  ├── EmailMarketing           (Dashboard campagnes)      │
│  ├── EmailMarketingHub        (Hub central)              │
│  ├── EmailEditor              (Éditeur WYSIWYG)          │
│  ├── EmailTemplates           (Bibliothèque templates)   │
│  ├── EmailFlowBuilder         (Flow automation)          │
│  ├── EmailFlowEditor          (Éditeur de flux)          │
│  ├── EmailAnalytics           (Analytics)                │
│  ├── EmailSegmentation        (Segmentation contacts)    │
│  ├── SmtpConfiguration        (Config SMTP)              │
│  ├── EmailDNSAuthentication   (DNS SPF/DKIM/DMARC)      │
│  └── EmailDeliverability      (Monitoring délivrabilité) │
│                                                          │
│  Backend (Edge Functions + Workers)                      │
│  ├── SMTP Send Service       (Envoi via SMTP/API)       │
│  ├── Campaign Scheduler      (Planification)            │
│  ├── Automation Flow Engine  (Exécution des flux)       │
│  ├── Template Renderer       (HTML + variables)         │
│  ├── Bounce Handler          (Traitement bounces)       │
│  ├── Open/Click Tracker      (Pixel + redirect)        │
│  ├── Unsubscribe Handler     (Désinscription)          │
│  ├── A/B Test Engine         (Split testing)           │
│  ├── Deliverability Monitor  (Réputation IP/domaine)   │
│  ├── DNS Validator           (Vérification SPF/DKIM)   │
│  └── Analytics Aggregator    (Métriques temps réel)    │
│                                                          │
│  Passerelle                                              │
│  └── SMTP Gateway (/dashboard/smtp-gateway-config)       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Tables Base de Données

```sql
-- Campagnes Email
email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  from_name TEXT NOT NULL,
  from_email TEXT NOT NULL,
  reply_to TEXT,
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_id UUID REFERENCES email_templates(id),
  contact_list_id UUID REFERENCES contact_lists(id),
  segment_id UUID REFERENCES email_segments(id),
  campaign_type TEXT DEFAULT 'regular' CHECK (campaign_type IN ('regular', 'ab_test', 'automated', 'transactional')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled', 'completed')),
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  unique_opens INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  complained_count INTEGER DEFAULT 0,
  ab_test_config JSONB,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages Email individuels
email_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  campaign_id UUID REFERENCES email_campaigns(id),
  flow_id UUID REFERENCES email_flows(id),
  to_email TEXT NOT NULL,
  to_name TEXT,
  from_email TEXT NOT NULL,
  from_name TEXT,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'sent', 'delivered', 'bounced', 'rejected', 'deferred')),
  bounce_type TEXT CHECK (bounce_type IN ('hard', 'soft')),
  bounce_reason TEXT,
  opened BOOLEAN DEFAULT false,
  open_count INTEGER DEFAULT 0,
  first_opened_at TIMESTAMPTZ,
  last_opened_at TIMESTAMPTZ,
  clicked BOOLEAN DEFAULT false,
  click_count INTEGER DEFAULT 0,
  first_clicked_at TIMESTAMPTZ,
  unsubscribed BOOLEAN DEFAULT false,
  unsubscribed_at TIMESTAMPTZ,
  complained BOOLEAN DEFAULT false,
  smtp_response TEXT,
  message_id_header TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates Email
email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'welcome', 'newsletter', 'promotion', 'notification', 'transactional', 'event')),
  html_content TEXT NOT NULL,
  text_content TEXT,
  thumbnail_url TEXT,
  variables TEXT[] DEFAULT '{}',
  is_system BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flows d'automatisation
email_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('signup', 'tag_added', 'list_joined', 'date_based', 'event', 'manual', 'api')),
  trigger_config JSONB NOT NULL,
  flow_config JSONB NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  total_entered INTEGER DEFAULT 0,
  total_completed INTEGER DEFAULT 0,
  total_exited INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Étapes de flow (pour tracking)
email_flow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID NOT NULL REFERENCES email_flows(id),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  step_index INTEGER NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('send_email', 'wait', 'condition', 'action', 'split')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'skipped', 'failed')),
  email_message_id UUID REFERENCES email_messages(id),
  execute_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Segments
email_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  conditions JSONB NOT NULL,
  contacts_count INTEGER DEFAULT 0,
  is_dynamic BOOLEAN DEFAULT true,
  last_computed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuration SMTP
smtp_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  provider TEXT CHECK (provider IN ('custom', 'sendgrid', 'aws_ses', 'mailgun', 'postmark', 'sparkpost')),
  host TEXT NOT NULL,
  port INTEGER DEFAULT 587,
  username TEXT,
  password_encrypted TEXT,
  encryption TEXT DEFAULT 'tls' CHECK (encryption IN ('none', 'ssl', 'tls', 'starttls')),
  from_email TEXT NOT NULL,
  from_name TEXT,
  daily_limit INTEGER DEFAULT 10000,
  hourly_limit INTEGER DEFAULT 500,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1,
  sent_today INTEGER DEFAULT 0,
  sent_this_hour INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DNS Authentication
email_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  domain TEXT NOT NULL,
  spf_record TEXT,
  spf_valid BOOLEAN DEFAULT false,
  dkim_selector TEXT,
  dkim_public_key TEXT,
  dkim_valid BOOLEAN DEFAULT false,
  dmarc_record TEXT,
  dmarc_valid BOOLEAN DEFAULT false,
  verification_token TEXT,
  is_verified BOOLEAN DEFAULT false,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, domain)
);

-- Tracking des clics
email_link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES email_messages(id),
  original_url TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  device_type TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Liste de désinscription
email_unsubscribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email TEXT NOT NULL,
  reason TEXT,
  source TEXT DEFAULT 'link' CHECK (source IN ('link', 'manual', 'complaint', 'bounce', 'api')),
  campaign_id UUID REFERENCES email_campaigns(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

-- Bounces
email_bounces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email TEXT NOT NULL,
  bounce_type TEXT NOT NULL CHECK (bounce_type IN ('hard', 'soft')),
  bounce_reason TEXT,
  bounce_code TEXT,
  message_id UUID REFERENCES email_messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

```
# Campagnes
POST   /api/email/campaigns                  # Créer une campagne
GET    /api/email/campaigns                  # Lister les campagnes
GET    /api/email/campaigns/:id              # Détails campagne
PUT    /api/email/campaigns/:id              # Modifier
POST   /api/email/campaigns/:id/send         # Envoyer
POST   /api/email/campaigns/:id/schedule     # Programmer
POST   /api/email/campaigns/:id/test         # Envoyer un test
GET    /api/email/campaigns/:id/report       # Rapport
DELETE /api/email/campaigns/:id              # Supprimer

# Email transactionnel
POST   /api/email/send                       # Envoyer un email

# Templates
GET    /api/email/templates                  # Lister
POST   /api/email/templates                  # Créer
PUT    /api/email/templates/:id              # Modifier
DELETE /api/email/templates/:id              # Supprimer
POST   /api/email/templates/:id/duplicate    # Dupliquer
GET    /api/email/templates/system           # Templates système

# Flow Builder (Automatisation)
GET    /api/email/flows                      # Lister les flows
POST   /api/email/flows                      # Créer un flow
PUT    /api/email/flows/:id                  # Modifier
POST   /api/email/flows/:id/activate         # Activer
POST   /api/email/flows/:id/pause            # Pause
GET    /api/email/flows/:id/stats            # Statistiques

# Segmentation
GET    /api/email/segments                   # Lister les segments
POST   /api/email/segments                   # Créer
PUT    /api/email/segments/:id               # Modifier
POST   /api/email/segments/:id/compute       # Recalculer
GET    /api/email/segments/:id/contacts      # Contacts du segment

# Analytics
GET    /api/email/analytics/overview         # Vue d'ensemble
GET    /api/email/analytics/campaigns        # Stats par campagne
GET    /api/email/analytics/deliverability   # Délivrabilité
GET    /api/email/analytics/engagement       # Engagement (opens, clicks)
GET    /api/email/analytics/domains          # Stats par domaine

# SMTP Configuration
GET    /api/email/smtp                       # Lister les configs
POST   /api/email/smtp                       # Ajouter
PUT    /api/email/smtp/:id                   # Modifier
POST   /api/email/smtp/:id/test              # Tester connexion
DELETE /api/email/smtp/:id                   # Supprimer

# DNS / Domaines
GET    /api/email/domains                    # Lister les domaines
POST   /api/email/domains                    # Ajouter un domaine
POST   /api/email/domains/:id/verify         # Vérifier DNS
GET    /api/email/domains/:id/records        # Records à configurer
DELETE /api/email/domains/:id                # Supprimer

# Désinscription (public)
GET    /api/email/unsubscribe/:token         # Page de désinscription
POST   /api/email/unsubscribe/:token         # Confirmer désinscription

# Tracking (public)
GET    /api/email/track/open/:token          # Pixel d'ouverture
GET    /api/email/track/click/:token         # Tracking de clic

# Webhooks (providers SMTP)
POST   /api/email/webhooks/bounce            # Webhook bounces
POST   /api/email/webhooks/complaint         # Webhook complaints
POST   /api/email/webhooks/delivery          # Webhook deliveries
```

## Événements Émis

```typescript
type EmailEvent =
  | { type: 'email.queued'; data: { messageId, campaignId, to } }
  | { type: 'email.sent'; data: { messageId, to, sentAt } }
  | { type: 'email.delivered'; data: { messageId, deliveredAt } }
  | { type: 'email.opened'; data: { messageId, openedAt, ip, userAgent } }
  | { type: 'email.clicked'; data: { messageId, link, clickedAt } }
  | { type: 'email.bounced'; data: { messageId, bounceType, reason } }
  | { type: 'email.unsubscribed'; data: { email, campaignId } }
  | { type: 'email.complained'; data: { email, campaignId } }
  | { type: 'campaign.started'; data: { campaignId, totalRecipients } }
  | { type: 'campaign.completed'; data: { campaignId, stats } }
  | { type: 'flow.contact_entered'; data: { flowId, contactId } }
  | { type: 'flow.step_completed'; data: { flowId, contactId, stepIndex } }
  | { type: 'flow.contact_completed'; data: { flowId, contactId } }
  | { type: 'domain.verified'; data: { domainId, domain, checks } }
  | { type: 'domain.verification_failed'; data: { domainId, domain, errors } }
```

## Logique Métier Critique

### Processus d'Envoi de Campagne
```
1. Validation de la campagne (sujet, contenu, destinataires)
2. Vérification du domaine d'envoi (SPF/DKIM valides)
3. Filtrage des bounces hard, unsubscribes et complaints
4. Personnalisation du contenu (variables par contact)
5. Injection du pixel d'ouverture et réécriture des liens
6. Ajout du lien de désinscription (obligatoire)
7. Mise en queue (Redis/BullMQ) avec rate limiting
8. Envoi via SMTP avec rotation des serveurs
9. Traitement des réponses SMTP (succès, bounce, defer)
10. Tracking asynchrone (opens, clicks, bounces)
```

### Flow d'Automatisation
```
Trigger → [Wait 1h] → [Send Email 1] → [Wait 3 days]
  → [Condition: Opened?]
    → Yes: [Send Email 2A] → [Tag: Engaged]
    → No:  [Send Email 2B] → [Wait 2 days]
           → [Condition: Opened?]
              → Yes: [Tag: Engaged]
              → No:  [Tag: Cold] → [Remove from flow]
```

### A/B Testing
```
- Split 50/50 ou personnalisé (10% test, 90% gagnant)
- Variantes : sujet, contenu, heure d'envoi, from name
- Critère de victoire : taux d'ouverture ou taux de clic
- Durée du test configurable
- Envoi automatique du gagnant au reste de la liste
```

## Métriques Clés

- Taux d'ouverture (Open Rate) unique et total
- Taux de clic (Click Rate) unique et total
- Taux de rebond (Bounce Rate) hard et soft
- Taux de désinscription
- Taux de plainte (Spam Complaint Rate)
- Délivrabilité par domaine (Gmail, Outlook, Yahoo, etc.)
- Score de réputation expéditeur
- Heat map des clics

## Instructions Spécifiques

1. L'éditeur d'email doit être WYSIWYG avec drag & drop (type Unlayer ou GrapeJS)
2. Le flow builder doit être visuel avec React Flow
3. Ajoute obligatoirement un lien de désinscription dans chaque email
4. Le pixel de tracking doit être une image 1x1 transparente
5. Les liens doivent être réécrits pour le tracking des clics
6. Implémente la rotation des serveurs SMTP pour la délivrabilité
7. Respecte les limites d'envoi par serveur (horaire + quotidien)
8. Valide les records DNS (SPF, DKIM, DMARC) avec des requêtes DNS réelles
9. Gère les bounces hard (suppression automatique après 3 bounces)
10. Supporte les templates responsives (compatible mobile)
