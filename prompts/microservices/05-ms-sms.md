# Prompt: ms-sms - SMS Bulk Marketing (SMPP)

## Rôle
Tu es un développeur backend senior spécialisé en messagerie SMS et protocole SMPP. Tu dois créer le microservice `ms-sms` pour la plateforme Actor Hub.

## Mission
Créer un service SMS complet supportant l'envoi unitaire, bulk, bidirectionnel (Two-Way), OTP, USSD, MMS, avec gestion des campagnes, DLR, HLR Lookup et intégration SMPP.

## Spécifications techniques

### Stack
- **Framework:** NestJS
- **Port:** 8004
- **Base de données:** PostgreSQL - schema `sms`
- **Protocole:** SMPP v3.4
- **Queue:** Redis / Bull (job queue pour envois massifs)

### Fonctionnalités requises

1. **Types d'envoi**
   - SMS Single (unitaire)
   - SMS Bulk (envoi massif par fichier CSV/contact list)
   - SMS One-Way (envoi sans réponse)
   - SMS Two-Way (bidirectionnel avec réponse)
   - SMS Two-Way Bulk (conversations en masse)
   - SMS OTP (code de vérification, TTL configurable)
   - SMS Vocal (Text-to-Speech)
   - MMS (images, vidéos)
   - USSD (menus interactifs)

2. **SMS Avancé (MT/MO/SMART)**
   - **MT** (Mobile Terminated): envoi vers mobile
   - **MO** (Mobile Originated): réception depuis mobile (numéro dédié)
   - **SMART**: routage intelligent (meilleur provider, meilleur prix)

3. **Gestion des campagnes**
   - Création de campagne avec planification
   - Programmation date/heure d'envoi
   - Envoi récurrent (quotidien, hebdomadaire, mensuel)
   - A/B Testing (message A vs B)
   - Personnalisation avec variables (`{nom}`, `{prenom}`, etc.)

4. **DLR (Delivery Reports)**
   - Réception et traitement des accusés de réception
   - Statuts: DELIVRD, UNDELIV, EXPIRED, REJECTD, ACCEPTD
   - Callbacks HTTP vers le client

5. **HLR Lookup**
   - Vérification de validité des numéros
   - Détection de l'opérateur
   - Statut du numéro (actif, inactif, roaming)

6. **Sender ID Management**
   - CRUD des identifiants expéditeur
   - Validation par pays/opérateur
   - Alpha-numérique ou numérique

7. **Blacklist / Opt-out**
   - Liste noire globale et par tenant
   - Gestion des désabonnements (STOP)
   - Conformité RGPD

8. **Templates**
   - CRUD templates SMS
   - Variables dynamiques
   - Approbation des templates

9. **API SMS**
   - REST API pour intégration tierce
   - Documentation Swagger/OpenAPI
   - SDKs (PHP, Python, Node.js, Java)

### Schéma Base de Données
```sql
CREATE TABLE sms_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  sender_id VARCHAR(20),
  message TEXT NOT NULL,
  message_b TEXT, -- pour A/B testing
  contact_list_id UUID,
  status VARCHAR(20) DEFAULT 'draft',
  type VARCHAR(20) DEFAULT 'bulk',
  total_contacts INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP,
  recurring_schedule JSONB,
  completed_at TIMESTAMP,
  cost DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  campaign_id UUID REFERENCES sms_campaigns(id),
  from_number VARCHAR(20),
  to_number VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  direction VARCHAR(10) DEFAULT 'outbound',
  status VARCHAR(20) DEFAULT 'pending',
  dlr_status VARCHAR(20),
  provider_message_id VARCHAR(255),
  segments INTEGER DEFAULT 1,
  cost DECIMAL(10,4),
  error_code VARCHAR(20),
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sender_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  sender_id VARCHAR(20) NOT NULL,
  type VARCHAR(20) DEFAULT 'alphanumeric',
  countries VARCHAR[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  variables VARCHAR[] DEFAULT '{}',
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  reason VARCHAR(255),
  source VARCHAR(50) DEFAULT 'manual',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, phone_number)
);
```

### API Endpoints
```
POST   /api/v1/sms/send               # Envoi unitaire
POST   /api/v1/sms/bulk               # Envoi en masse
POST   /api/v1/sms/otp                # Envoi OTP
POST   /api/v1/sms/otp/verify         # Vérifier OTP

CRUD   /api/v1/sms/campaigns          # Campagnes
POST   /api/v1/sms/campaigns/:id/send # Lancer campagne
GET    /api/v1/sms/campaigns/:id/stats # Stats campagne

GET    /api/v1/sms/messages            # Historique messages
GET    /api/v1/sms/dlr                 # Rapports de livraison
POST   /api/v1/sms/dlr/callback        # Callback DLR (webhook)

POST   /api/v1/sms/hlr                # HLR Lookup
CRUD   /api/v1/sms/sender-ids         # Sender IDs
CRUD   /api/v1/sms/templates          # Templates
CRUD   /api/v1/sms/blacklist          # Liste noire

GET    /api/v1/sms/analytics           # Analytics
GET    /api/v1/sms/pricing             # Tarifs par pays
```

### Events publiés
```
sms.sent         → { messageId, to, campaignId }
sms.delivered    → { messageId, dlrStatus }
sms.failed       → { messageId, errorCode }
sms.received     → { messageId, from, content }
campaign.started → { campaignId, totalContacts }
campaign.ended   → { campaignId, stats }
```

## Contraintes
- Débit: 500 SMS/seconde minimum via SMPP
- File d'attente pour les envois massifs (Bull Queue)
- Retry automatique pour les échecs temporaires (3 tentatives)
- Encodage GSM7 / UCS2 automatique
- Calcul automatique du nombre de segments
- Tarification par pays/opérateur en temps réel
