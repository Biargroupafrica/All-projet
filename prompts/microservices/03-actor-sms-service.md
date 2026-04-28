# Prompt: Actor SMS Service - Microservice SMS Marketing

## Contexte
Tu es un développeur senior spécialisé en télécommunications et protocole SMPP. Tu dois créer le microservice **Actor Bulk SMS** pour la plateforme Actor Hub. Ce service gère l'envoi massif de SMS, les campagnes marketing, le HLR lookup, et la gestion des Sender IDs.

## Mission
Créer un microservice SMS autonome et haute performance capable de traiter des millions de messages par jour via le protocole SMPP, avec gestion de campagnes, DLR, et analytics.

## Spécifications techniques

### Stack
- **Runtime** : Node.js 20+ / NestJS
- **Protocole** : SMPP v3.4 (via `smpp` npm package)
- **Base de données** : PostgreSQL (schéma `sms`)
- **Queue** : Redis + Bull (gestion des files de messages)
- **ORM** : Prisma

### Schéma de base de données
```sql
CREATE SCHEMA sms;

CREATE TABLE sms.sender_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  sender_id VARCHAR(11) NOT NULL,
  type VARCHAR(20) DEFAULT 'alphanumeric', -- alphanumeric, numeric, shortcode
  country_code VARCHAR(3),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sms.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  country_code VARCHAR(3),
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  is_blacklisted BOOLEAN DEFAULT false,
  opt_in_status VARCHAR(20) DEFAULT 'opted_in',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, phone)
);

CREATE TABLE sms.contact_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  contacts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sms.contact_list_members (
  contact_list_id UUID REFERENCES sms.contact_lists(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES sms.contacts(id) ON DELETE CASCADE,
  PRIMARY KEY (contact_list_id, contact_id)
);

CREATE TABLE sms.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}', -- {{name}}, {{code}}, etc.
  category VARCHAR(50),
  language VARCHAR(10) DEFAULT 'fr',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sms.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  sender_id_id UUID REFERENCES sms.sender_ids(id),
  contact_list_id UUID REFERENCES sms.contact_lists(id),
  template_id UUID REFERENCES sms.templates(id),
  status VARCHAR(20) DEFAULT 'draft', -- draft, scheduled, sending, completed, cancelled
  type VARCHAR(20) DEFAULT 'one_way', -- one_way, two_way, otp, flash
  scheduled_at TIMESTAMPTZ,
  timezone VARCHAR(50) DEFAULT 'Africa/Brazzaville',
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  cost_per_sms DECIMAL(10,4),
  total_cost DECIMAL(10,2),
  ab_test_enabled BOOLEAN DEFAULT false,
  ab_variant_a TEXT,
  ab_variant_b TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE sms.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  campaign_id UUID REFERENCES sms.campaigns(id),
  external_id VARCHAR(255), -- SMPP message_id
  from_sender VARCHAR(20) NOT NULL,
  to_number VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'mt', -- mt (mobile terminated), mo (mobile originated)
  encoding VARCHAR(20) DEFAULT 'gsm7', -- gsm7, ucs2
  parts_count INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'pending', -- pending, submitted, delivered, failed, rejected, expired
  dlr_status VARCHAR(20),
  dlr_error_code VARCHAR(10),
  dlr_received_at TIMESTAMPTZ,
  cost DECIMAL(10,4),
  operator VARCHAR(100),
  country_code VARCHAR(3),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sms.blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  phone VARCHAR(20) NOT NULL,
  reason VARCHAR(255),
  source VARCHAR(50), -- manual, opt_out, complaint
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, phone)
);

CREATE TABLE sms.hlr_lookups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  phone VARCHAR(20) NOT NULL,
  mcc VARCHAR(3),
  mnc VARCHAR(3),
  operator VARCHAR(100),
  country VARCHAR(100),
  country_code VARCHAR(3),
  is_valid BOOLEAN,
  is_ported BOOLEAN DEFAULT false,
  ported_to VARCHAR(100),
  is_roaming BOOLEAN DEFAULT false,
  status VARCHAR(20),
  cost DECIMAL(10,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sms.smpp_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  host VARCHAR(255) NOT NULL,
  port INTEGER NOT NULL DEFAULT 2775,
  system_id VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  system_type VARCHAR(20),
  interface_version INTEGER DEFAULT 52, -- 0x34 = SMPP v3.4
  addr_ton INTEGER DEFAULT 5,
  addr_npi INTEGER DEFAULT 0,
  throughput INTEGER DEFAULT 100, -- messages/seconde
  is_active BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'disconnected',
  last_connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Endpoints API
```
# Envoi de SMS
POST   /api/v1/sms/send                 # Envoyer un SMS unique
POST   /api/v1/sms/send-bulk            # Envoi en masse
POST   /api/v1/sms/send-otp             # Envoyer un OTP
POST   /api/v1/sms/verify-otp           # Vérifier un OTP

# Campagnes
GET    /api/v1/campaigns                 # Lister les campagnes
POST   /api/v1/campaigns                 # Créer une campagne
GET    /api/v1/campaigns/:id             # Détail
PUT    /api/v1/campaigns/:id             # Modifier
DELETE /api/v1/campaigns/:id             # Supprimer
POST   /api/v1/campaigns/:id/send        # Lancer l'envoi
POST   /api/v1/campaigns/:id/schedule    # Planifier
POST   /api/v1/campaigns/:id/cancel      # Annuler
GET    /api/v1/campaigns/:id/stats       # Statistiques

# Templates
GET    /api/v1/templates                 # Lister
POST   /api/v1/templates                 # Créer
PUT    /api/v1/templates/:id             # Modifier
DELETE /api/v1/templates/:id             # Supprimer
POST   /api/v1/templates/:id/preview     # Prévisualiser

# Contacts
GET    /api/v1/contacts                  # Lister
POST   /api/v1/contacts                  # Créer
POST   /api/v1/contacts/import           # Import CSV/Excel
GET    /api/v1/contacts/export           # Export
PUT    /api/v1/contacts/:id              # Modifier
DELETE /api/v1/contacts/:id              # Supprimer

# Listes de contacts
GET    /api/v1/contact-lists             # Lister
POST   /api/v1/contact-lists             # Créer
PUT    /api/v1/contact-lists/:id         # Modifier
DELETE /api/v1/contact-lists/:id         # Supprimer
POST   /api/v1/contact-lists/:id/add     # Ajouter des contacts
POST   /api/v1/contact-lists/:id/remove  # Retirer des contacts

# Sender IDs
GET    /api/v1/sender-ids                # Lister
POST   /api/v1/sender-ids               # Créer/Demander
DELETE /api/v1/sender-ids/:id            # Supprimer

# Rapports
GET    /api/v1/reports/dlr               # Rapports DLR
GET    /api/v1/reports/transactions       # Transactions
GET    /api/v1/reports/traffic            # Trafic par opérateur
GET    /api/v1/reports/analytics          # Analytics globaux

# HLR
POST   /api/v1/hlr/lookup               # Lookup unique
POST   /api/v1/hlr/lookup-bulk           # Lookup en masse

# Blacklist
GET    /api/v1/blacklist                 # Lister
POST   /api/v1/blacklist                 # Ajouter
DELETE /api/v1/blacklist/:id             # Retirer

# Configuration SMPP
GET    /api/v1/smpp/connections          # Lister les connexions
POST   /api/v1/smpp/connections          # Ajouter
PUT    /api/v1/smpp/connections/:id      # Modifier
POST   /api/v1/smpp/connections/:id/test # Tester
DELETE /api/v1/smpp/connections/:id      # Supprimer

# Webhooks
POST   /api/v1/webhooks/dlr             # Réception DLR
POST   /api/v1/webhooks/mo              # SMS entrant (MO)
```

### Événements Message Broker
```typescript
'sms.message.sent'           // { messageId, tenantId, to, status }
'sms.message.delivered'      // { messageId, dlrStatus }
'sms.message.failed'         // { messageId, errorCode, reason }
'sms.campaign.started'       // { campaignId, totalRecipients }
'sms.campaign.completed'     // { campaignId, stats }
'sms.campaign.failed'        // { campaignId, reason }
'sms.mo.received'            // { from, to, content, tenantId }
'sms.credits.low'            // { tenantId, remaining, threshold }
'sms.blacklist.added'        // { tenantId, phone, reason }
```

## Critères d'acceptation
- [ ] Connexion SMPP stable avec reconnexion automatique
- [ ] Envoi SMS unitaire et en masse (>10k/min)
- [ ] Campagnes avec planification et A/B testing
- [ ] Réception et traitement DLR en temps réel
- [ ] HLR Lookup fonctionnel
- [ ] Gestion blacklist et opt-out
- [ ] Import/Export contacts (CSV, Excel)
- [ ] Templates avec variables dynamiques
- [ ] API SMS REST complète avec documentation
- [ ] Gestion des crédits SMS par tenant
- [ ] Tests unitaires et d'intégration
