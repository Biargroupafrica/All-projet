# Skill : SMS Service — ACTOR Hub

## Scénario d'utilisation
Utiliser ce skill pour développer ou modifier le microservice SMS (`services/sms-service/`).

## Contexte Métier
Le SMS Service est l'un des piliers principaux de la plateforme. Il supporte :
- **SMS Bulk** : envoi de masse (millions de messages par jour)
- **SMS One-Way** : envoi simple sans réponse
- **SMS Two-Way** : conversations bidirectionnelles avec numéros virtuels
- **SMPP Direct** : connexion directe aux opérateurs télécom (protocole SMPP v3.4)
- **APIs REST & SMPP** pour les intégrations tierces

## Capacités Techniques
- 800+ opérateurs connectés, 190 pays couverts
- Débit : jusqu'à 1000 TPS (messages/seconde) par tenant
- Accusés de réception (DLR) en temps réel
- Routage intelligent (meilleur opérateur par pays/coût)
- Black listing automatique des opt-out
- Planification avec fuseau horaire par destinataire

## Structure de Fichiers

```
services/sms-service/
├── src/
│   ├── app.ts
│   ├── config/
│   │   ├── database.ts         # PostgreSQL (messages) + MongoDB (logs)
│   │   ├── redis.ts            # Queue + cache
│   │   └── env.ts
│   ├── modules/
│   │   ├── messages/
│   │   │   ├── messages.router.ts
│   │   │   ├── messages.controller.ts
│   │   │   ├── messages.service.ts
│   │   │   └── messages.schema.ts
│   │   ├── campaigns/
│   │   │   ├── campaigns.router.ts
│   │   │   ├── campaigns.controller.ts
│   │   │   └── campaigns.service.ts
│   │   ├── senders/
│   │   │   └── senders.service.ts  # Gestion des expéditeurs/SenderIDs
│   │   ├── dlr/
│   │   │   └── dlr.service.ts      # Delivery Reports
│   │   ├── smpp/
│   │   │   ├── smpp.client.ts      # Client SMPP v3.4
│   │   │   └── smpp.router.ts      # Compte SMPP entrant
│   │   └── webhooks/
│   │       └── webhooks.service.ts
│   ├── queues/
│   │   ├── send.queue.ts           # Bull/BullMQ pour envoi différé
│   │   ├── dlr.queue.ts
│   │   └── campaign.queue.ts
│   ├── providers/
│   │   ├── provider.interface.ts
│   │   ├── twilio.provider.ts
│   │   ├── nexmo.provider.ts
│   │   ├── africastalking.provider.ts
│   │   └── smpp.provider.ts        # Connexions SMPP directes
│   ├── db/
│   │   ├── schema.ts
│   │   └── migrations/
│   └── events/
│       ├── publisher.ts
│       └── consumer.ts
├── openapi.yaml
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

## Schéma Base de Données

```sql
-- Messages individuels
CREATE TABLE sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  campaign_id UUID REFERENCES sms_campaigns(id),
  external_id VARCHAR(255),           -- ID chez le provider
  from_number VARCHAR(50) NOT NULL,   -- SenderID ou numéro
  to_number VARCHAR(50) NOT NULL,     -- E.164 format
  body TEXT NOT NULL,
  encoding VARCHAR(20) DEFAULT 'GSM7', -- GSM7, UCS2
  parts INTEGER DEFAULT 1,            -- nombre de segments
  direction VARCHAR(10) NOT NULL,     -- 'outbound', 'inbound'
  status VARCHAR(50) DEFAULT 'queued', -- queued, sent, delivered, failed, undelivered
  provider VARCHAR(50),               -- 'smpp', 'twilio', 'nexmo', etc.
  price DECIMAL(10, 6),              -- coût réel
  currency VARCHAR(3) DEFAULT 'EUR',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_code VARCHAR(50),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campagnes SMS
CREATE TABLE sms_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  from_number VARCHAR(50) NOT NULL,
  body_template TEXT NOT NULL,        -- avec variables {{prenom}}, {{nom}}
  contact_list_id UUID,               -- ou query SQL sur contacts
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, running, paused, completed, failed
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',        -- throttle rate, timezone, etc.
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SenderIDs (expéditeurs alphanumériques)
CREATE TABLE sms_senders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name VARCHAR(50) NOT NULL,          -- ex: "ACTORHUB"
  country_code VARCHAR(5),            -- null = global
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks DLR
CREATE TABLE sms_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT '{dlr,inbound}',
  secret VARCHAR(255),                -- HMAC-SHA256 signature
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opt-out (STOP)
CREATE TABLE sms_optouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, phone_number)
);
```

## Endpoints API

```
# Envoi simple
POST   /sms/send                    # Envoyer 1 SMS
POST   /sms/send-bulk               # Envoyer jusqu'à 1000 SMS en une requête

# Campagnes
GET    /sms/campaigns               # Lister campagnes
POST   /sms/campaigns               # Créer campagne
GET    /sms/campaigns/:id           # Détail campagne
PUT    /sms/campaigns/:id           # Modifier campagne
POST   /sms/campaigns/:id/send      # Lancer campagne
POST   /sms/campaigns/:id/pause     # Mettre en pause
POST   /sms/campaigns/:id/cancel    # Annuler
GET    /sms/campaigns/:id/stats     # Statistiques campagne

# Messages
GET    /sms/messages                # Historique messages
GET    /sms/messages/:id            # Détail message

# SenderIDs
GET    /sms/senders                 # Lister expéditeurs
POST   /sms/senders                 # Créer expéditeur
DELETE /sms/senders/:id

# Inbound (Two-Way)
GET    /sms/inbound                 # Messages entrants

# Webhooks
GET    /sms/webhooks
POST   /sms/webhooks
PUT    /sms/webhooks/:id
DELETE /sms/webhooks/:id

# Opt-out
GET    /sms/optouts
POST   /sms/optouts/:phone          # Opt-out manuel
DELETE /sms/optouts/:phone          # Réintégration

# SMPP
POST   /sms/smpp/accounts           # Config compte SMPP (Enterprise)
```

## Variables d'Environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/sms_db
MONGODB_URL=mongodb://localhost:27017/sms_logs
REDIS_URL=redis://localhost:6379

KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=sms-service

# Auth Service (pour vérif JWT)
AUTH_SERVICE_URL=http://auth-service:3001

# Providers SMS
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
NEXMO_API_KEY=
NEXMO_API_SECRET=
AFRICA_TALKING_API_KEY=
AFRICA_TALKING_USERNAME=

# SMPP Pool (connexions directes opérateurs)
SMPP_HOST_1=smpp.operator1.com
SMPP_PORT_1=2775
SMPP_SYSTEM_ID_1=
SMPP_PASSWORD_1=

# Queue
BULL_REDIS_URL=redis://localhost:6379
MAX_CONCURRENT_SENDS=500
SEND_RETRY_ATTEMPTS=3
SEND_RETRY_DELAY=5000
```

## Événements Kafka

```typescript
// Producer — Topic: sms.events
type SmsEvent =
  | { type: 'sms.sent'; payload: { messageId: string; orgId: string; to: string } }
  | { type: 'sms.delivered'; payload: { messageId: string; orgId: string; deliveredAt: string } }
  | { type: 'sms.failed'; payload: { messageId: string; orgId: string; errorCode: string } }
  | { type: 'sms.inbound'; payload: { from: string; to: string; body: string; orgId: string } }
  | { type: 'campaign.started'; payload: { campaignId: string; orgId: string; totalRecipients: number } }
  | { type: 'campaign.completed'; payload: { campaignId: string; orgId: string; stats: CampaignStats } }
  | { type: 'sms.optout'; payload: { phone: string; orgId: string } }

// Consumer — Topics: billing.credits (pour déduire crédits)
```

## Critères de Succès

- [ ] Envoi simple SMS via REST API (test Postman/curl)
- [ ] Campagne bulk avec 10 000 contacts lancée et complétée
- [ ] DLR reçus et mis à jour en base
- [ ] Webhooks DLR déclenchés en temps réel
- [ ] Opt-out STOP fonctionnel (numéro blacklisté automatiquement)
- [ ] SMPP client connecté et envoi via SMPP fonctionnel
- [ ] Planification avec timezone respectée
- [ ] Variables de template (`{{prenom}}`) substituées correctement
- [ ] Décompte crédits via billing-service après chaque envoi
