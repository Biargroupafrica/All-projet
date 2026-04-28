# Prompt Microservice : Actor Bulk SMS - Marketing SMS en Masse

## Rôle

Tu es un développeur senior spécialisé en télécommunications et messagerie SMPP. Tu construis le microservice **Actor Bulk SMS**, une plateforme d'envoi de SMS en masse autonome pour la plateforme Actor Hub.

## Description du Microservice

Actor Bulk SMS est une plateforme de marketing SMS offrant :
- Envoi de SMS unitaire et en masse (jusqu'à des millions de messages)
- Connexion directe aux opérateurs via SMPP
- Gestion de campagnes avec A/B testing
- HLR Lookup (vérification de numéros)
- Rapports DLR (Delivery Reports) en temps réel
- API REST complète pour l'intégration
- Sender ID Management
- SMS A2P / RCS Messages
- URL Shortener avec tracking
- Gestion de contacts et segmentation

## Architecture Technique

```
┌──────────────────────────────────────────────────────────┐
│                    ACTOR BULK SMS                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (React)                                        │
│  ├── SmsSingle              (SMS unitaire)               │
│  ├── SmsBulk                (SMS en masse)               │
│  ├── SmsCampaignReports     (Rapports campagnes)         │
│  ├── SmsTemplates           (Modèles SMS)                │
│  ├── SmsContacts            (Gestion contacts)           │
│  ├── SmsListsManager        (Gestion des listes)         │
│  ├── SmsScheduled           (Messages programmés)        │
│  ├── SmsAnalytics           (Analytics)                  │
│  ├── SmsReports             (Rapports détaillés)         │
│  ├── SmsHistory             (Historique)                 │
│  ├── TransactionReport      (Rapport transactions)       │
│  ├── DlrReport              (Rapport DLR)                │
│  ├── CustomerTrafficReport  (Trafic client)              │
│  ├── PricingCoverage        (Tarifs & couverture)        │
│  ├── HlrLookup              (Vérification numéros)       │
│  ├── AccountCredits         (Crédits compte)             │
│  ├── SenderId               (Identifiants expéditeur)    │
│  ├── SmsA2P                 (SMS A2P)                    │
│  ├── RcsMessages            (Messages RCS)               │
│  ├── UrlShortener           (Réducteur URL)              │
│  └── SmsApiUnified          (Documentation API)          │
│                                                          │
│  Backend (Edge Functions + Workers)                      │
│  ├── SMPP Client Service     (Connexion opérateurs)      │
│  ├── Campaign Scheduler      (Planification campagnes)   │
│  ├── Message Queue Manager   (Redis/BullMQ)              │
│  ├── DLR Processor           (Rapports de livraison)     │
│  ├── HLR Service             (Lookup API)                │
│  ├── SMS API Gateway         (REST API publique)         │
│  ├── Rate Limiter            (Contrôle de débit)         │
│  ├── URL Shortener Service   (Raccourcisseur + tracking) │
│  ├── Credit Manager          (Gestion crédits)           │
│  └── Analytics Aggregator    (Agrégation métriques)      │
│                                                          │
│  Passerelle                                              │
│  └── SMPP Gateway (/dashboard/smpp-gateway)              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Tables Base de Données

```sql
-- Campagnes SMS
sms_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  contact_list_id UUID REFERENCES contact_lists(id),
  campaign_type TEXT DEFAULT 'standard' CHECK (campaign_type IN ('standard', 'ab_test', 'recurring', 'triggered')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled', 'completed')),
  total_contacts INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  cost DECIMAL(10,4) DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages SMS individuels
sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  campaign_id UUID REFERENCES sms_campaigns(id),
  to_number TEXT NOT NULL,
  from_sender TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'mt' CHECK (message_type IN ('mt', 'mo')),
  encoding TEXT DEFAULT 'gsm7' CHECK (encoding IN ('gsm7', 'ucs2')),
  segments INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'submitted', 'sent', 'delivered', 'failed', 'rejected', 'expired', 'unknown')),
  dlr_status TEXT,
  dlr_received_at TIMESTAMPTZ,
  error_code TEXT,
  error_message TEXT,
  cost DECIMAL(10,6) DEFAULT 0,
  short_url TEXT,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modèles SMS
sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'general',
  is_approved BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sender IDs
sender_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'alphanumeric' CHECK (type IN ('alphanumeric', 'numeric', 'shortcode')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  countries TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuration SMPP
smpp_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  host TEXT NOT NULL,
  port INTEGER DEFAULT 2775,
  system_id TEXT NOT NULL,
  password_encrypted TEXT NOT NULL,
  system_type TEXT DEFAULT 'transceiver',
  bind_type TEXT DEFAULT 'transceiver' CHECK (bind_type IN ('transmitter', 'receiver', 'transceiver')),
  throughput INTEGER DEFAULT 100,
  encoding TEXT DEFAULT 'gsm7',
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1,
  countries TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crédits SMS
sms_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  balance DECIMAL(12,4) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  last_topup_amount DECIMAL(10,4),
  last_topup_at TIMESTAMPTZ,
  low_balance_threshold DECIMAL(10,4) DEFAULT 10,
  auto_topup_enabled BOOLEAN DEFAULT false,
  auto_topup_amount DECIMAL(10,4),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tarification par pays
sms_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  mcc TEXT,
  mnc TEXT,
  operator_name TEXT,
  price_per_sms DECIMAL(10,6) NOT NULL,
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HLR Lookups
hlr_lookups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  phone_number TEXT NOT NULL,
  mcc TEXT,
  mnc TEXT,
  operator TEXT,
  country TEXT,
  is_valid BOOLEAN,
  is_ported BOOLEAN DEFAULT false,
  original_network TEXT,
  current_network TEXT,
  status TEXT,
  cost DECIMAL(10,6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- URLs raccourcies
short_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  original_url TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  click_count INTEGER DEFAULT 0,
  campaign_id UUID REFERENCES sms_campaigns(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clics URL
url_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_url_id UUID NOT NULL REFERENCES short_urls(id),
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blacklist (DNC)
sms_blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  phone_number TEXT NOT NULL,
  reason TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'opt_out', 'bounce', 'complaint')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, phone_number)
);
```

## API Endpoints

```
# Envoi SMS
POST   /api/sms/send                 # Envoyer un SMS unique
POST   /api/sms/bulk                 # Envoyer SMS en masse
POST   /api/sms/send-template        # Envoyer via template

# Campagnes
POST   /api/sms/campaigns            # Créer une campagne
GET    /api/sms/campaigns            # Lister les campagnes
GET    /api/sms/campaigns/:id        # Détails campagne
PUT    /api/sms/campaigns/:id        # Modifier campagne
POST   /api/sms/campaigns/:id/start  # Démarrer
POST   /api/sms/campaigns/:id/pause  # Pause
DELETE /api/sms/campaigns/:id        # Supprimer
GET    /api/sms/campaigns/:id/report # Rapport campagne

# Messages
GET    /api/sms/messages             # Historique des messages
GET    /api/sms/messages/:id         # Détails message
GET    /api/sms/messages/:id/dlr     # Statut DLR

# Templates
GET    /api/sms/templates            # Lister les templates
POST   /api/sms/templates            # Créer un template
PUT    /api/sms/templates/:id        # Modifier
DELETE /api/sms/templates/:id        # Supprimer

# Contacts & Listes
GET    /api/sms/contacts             # Lister contacts
POST   /api/sms/contacts/import      # Importer (CSV/Excel)
GET    /api/sms/lists                # Lister les listes
POST   /api/sms/lists                # Créer une liste

# Sender ID
GET    /api/sms/sender-ids           # Lister
POST   /api/sms/sender-ids           # Demander un Sender ID
DELETE /api/sms/sender-ids/:id       # Supprimer

# HLR
POST   /api/sms/hlr/lookup           # Lookup unique
POST   /api/sms/hlr/bulk-lookup      # Lookup en masse

# Analytics & Rapports
GET    /api/sms/analytics/overview    # Vue d'ensemble
GET    /api/sms/analytics/dlr         # Rapport DLR
GET    /api/sms/analytics/traffic     # Trafic
GET    /api/sms/analytics/transactions # Transactions

# URL Shortener
POST   /api/sms/urls/shorten         # Raccourcir une URL
GET    /api/sms/urls/:code/stats     # Stats d'une URL
GET    /r/:code                       # Redirection (public)

# Crédits
GET    /api/sms/credits/balance      # Solde actuel
POST   /api/sms/credits/topup        # Recharger
GET    /api/sms/credits/history      # Historique

# Tarification
GET    /api/sms/pricing              # Tarifs par pays
GET    /api/sms/pricing/:country     # Tarif d'un pays

# DLR Webhook (réception des rapports de livraison)
POST   /api/sms/dlr/callback         # Webhook DLR (opérateurs)

# MO (Messages entrants)
POST   /api/sms/mo/callback          # Webhook MO (opérateurs)
```

## Événements Émis

```typescript
type SmsEvent =
  | { type: 'sms.submitted'; data: { messageId, to, from, campaignId } }
  | { type: 'sms.sent'; data: { messageId, submittedAt } }
  | { type: 'sms.delivered'; data: { messageId, deliveredAt } }
  | { type: 'sms.failed'; data: { messageId, errorCode, errorMessage } }
  | { type: 'sms.dlr_received'; data: { messageId, dlrStatus, timestamp } }
  | { type: 'sms.mo_received'; data: { from, to, message, timestamp } }
  | { type: 'campaign.started'; data: { campaignId, totalContacts } }
  | { type: 'campaign.progress'; data: { campaignId, sent, total, percentage } }
  | { type: 'campaign.completed'; data: { campaignId, sent, delivered, failed } }
  | { type: 'credits.low'; data: { tenantId, balance, threshold } }
  | { type: 'credits.depleted'; data: { tenantId } }
  | { type: 'url.clicked'; data: { shortUrlId, messageId, ip, userAgent } }
  | { type: 'hlr.completed'; data: { lookupId, phoneNumber, isValid, operator } }
```

## Logique Métier Critique

### Envoi en Masse (Throughput)
```
1. Réception de la campagne avec liste de contacts
2. Déduplication et vérification blacklist
3. Calcul du coût total et vérification des crédits
4. Découpage en lots (batches) de 1000 messages
5. Ajout dans la queue Redis (BullMQ)
6. Workers SMPP envoient les messages avec rate limiting
7. Réception des DLR et mise à jour des statuts
8. Agrégation des métriques en temps réel
```

### Encodage SMS
```
GSM-7  : 160 caractères / segment, 153 si multi-segment
UCS-2  : 70 caractères / segment, 67 si multi-segment
Détection automatique de l'encodage nécessaire
Calcul du nombre de segments avant envoi
```

### Personnalisation
```
Variables supportées : {nom}, {prenom}, {entreprise}, {custom_1}, etc.
Chaque message est personnalisé avant envoi
Preview en temps réel dans le compositeur
```

## Métriques Clés

- Taux de livraison (Delivery Rate)
- Taux de rejet / échec
- Coût par SMS / par campagne
- Throughput (messages/seconde)
- Temps de livraison moyen
- Taux de clic (pour URLs trackées)
- Balance crédits
- Top pays / opérateurs

## Instructions Spécifiques

1. Le client SMPP doit supporter les reconnexions automatiques
2. Implémente le rate limiting par gateway et par tenant
3. Les DLR doivent être traités de manière asynchrone
4. Le HLR Lookup doit supporter le batch processing
5. L'URL shortener doit tracker les clics avec géolocalisation
6. Implémente l'opt-out automatique (STOP = désinscription)
7. Respecte les réglementations anti-spam (heures d'envoi, DNC)
8. Le calcul des crédits doit être atomique (pas de double débit)
9. Supporte les SMS longs (multipart/concatenated)
10. Les templates doivent supporter les variables dynamiques
