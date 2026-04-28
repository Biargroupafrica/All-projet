# Prompt: ms-email - Email Marketing (SMTP)

## Rôle
Tu es un développeur backend senior spécialisé en email marketing et délivrabilité. Tu dois créer le microservice `ms-email` pour la plateforme Actor Hub.

## Mission
Créer un service d'email marketing complet avec éditeur WYSIWYG, automation (flow builder), templates, segmentation, analytics, et gestion de la délivrabilité (SPF/DKIM/DMARC).

## Spécifications techniques

### Stack
- **Framework:** NestJS
- **Port:** 8005
- **Base de données:** PostgreSQL - schema `email`
- **Provider SMTP:** SendGrid, AWS SES, ou SMTP personnalisé (configurable par tenant)
- **Queue:** Bull (envois massifs)
- **Template Engine:** MJML → HTML

### Fonctionnalités requises

1. **Campagnes Email**
   - Création, planification, envoi
   - A/B Testing (sujet, contenu, heure d'envoi)
   - Personnalisation (merge tags: `{{first_name}}`, `{{company}}`, etc.)
   - Preview & test email

2. **Éditeur d'Emails**
   - Templates MJML responsives
   - Import HTML personnalisé
   - Bibliothèque d'images

3. **Flow Builder / Automation**
   - Drip campaigns (séquences automatiques)
   - Déclencheurs: inscription, achat, inactivité, date
   - Conditions: ouverture, clic, tag, segment
   - Actions: envoyer email, attendre, condition, webhook

4. **Segmentation**
   - Segments dynamiques basés sur des critères
   - Tags manuels et automatiques
   - Import/Export CSV

5. **Tracking & Analytics**
   - Pixel de tracking (ouvertures)
   - Redirect tracking (clics)
   - Taux: ouverture, clic, bounce, désabonnement, spam
   - Heatmap des clics

6. **Délivrabilité**
   - Configuration SPF, DKIM, DMARC par domaine
   - Vérification DNS automatique
   - Warmup IP
   - Gestion des bounces (hard/soft)
   - Gestion des plaintes spam (feedback loop)

7. **Conformité**
   - Lien de désabonnement obligatoire
   - Double opt-in
   - Adresse physique dans le footer
   - Conformité CAN-SPAM / RGPD

### Schéma Base de Données
```sql
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  subject_b VARCHAR(500),
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255),
  reply_to VARCHAR(255),
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_id UUID,
  segment_id UUID,
  status VARCHAR(20) DEFAULT 'draft',
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  spam_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  campaign_id UUID REFERENCES email_campaigns(id),
  to_email VARCHAR(255) NOT NULL,
  to_name VARCHAR(255),
  subject VARCHAR(500),
  status VARCHAR(20) DEFAULT 'queued',
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  bounced_at TIMESTAMP,
  bounce_type VARCHAR(20),
  unsubscribed_at TIMESTAMP,
  provider_message_id VARCHAR(255),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  mjml_content TEXT,
  html_content TEXT NOT NULL,
  thumbnail_url TEXT,
  variables VARCHAR[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  trigger_type VARCHAR(50) NOT NULL,
  trigger_config JSONB,
  flow_data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  enrolled_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  domain VARCHAR(255) NOT NULL,
  spf_verified BOOLEAN DEFAULT false,
  dkim_verified BOOLEAN DEFAULT false,
  dmarc_verified BOOLEAN DEFAULT false,
  dns_records JSONB,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
```
POST   /api/v1/emails/send              # Envoi unitaire
CRUD   /api/v1/emails/campaigns         # Campagnes
POST   /api/v1/emails/campaigns/:id/send # Lancer campagne
GET    /api/v1/emails/campaigns/:id/stats # Analytics campagne

CRUD   /api/v1/emails/templates          # Templates
CRUD   /api/v1/emails/flows              # Automation flows
CRUD   /api/v1/emails/segments           # Segments

GET    /api/v1/emails/track/open         # Pixel tracking (1x1 image)
GET    /api/v1/emails/track/click        # Redirect tracking
POST   /api/v1/emails/bounce             # Webhook bounces
POST   /api/v1/emails/unsubscribe        # Désabonnement

CRUD   /api/v1/emails/domains            # Domaines
POST   /api/v1/emails/domains/:id/verify # Vérifier DNS
GET    /api/v1/emails/analytics          # Analytics globaux
```

### Events publiés
```
email.sent          → { messageId, campaignId, to }
email.opened        → { messageId, openedAt }
email.clicked       → { messageId, url, clickedAt }
email.bounced       → { messageId, bounceType }
email.unsubscribed  → { email, reason }
email.spam          → { messageId, email }
campaign.completed  → { campaignId, stats }
```
