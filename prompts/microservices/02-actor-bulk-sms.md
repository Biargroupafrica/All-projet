# Prompt : Microservice Actor Bulk SMS (CPaaS)

## Objectif

Créer le microservice autonome d'envoi de SMS en masse via le protocole SMPP, avec gestion de campagnes, DLR, HLR Lookup et API REST.

## Contexte Figma

- **FileKey** : `XDPnl4zhusx3vecuWQTYFx`
- **Route principale** : `/fonctionnalites/sms-marketing`
- **Dashboard** : `/dashboard/sms-*`

## Prompt de création

```
Tu es un architecte logiciel senior spécialisé en messagerie SMS et protocole SMPP.

Crée le microservice "Actor Bulk SMS" — une plateforme CPaaS complète d'envoi de SMS en masse.

### Architecture du microservice

Nom : actor-sms-service
Port : 3002
Base de données : PostgreSQL (schéma dédié "sms")

### Structure du projet

actor-sms-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── smpp.config.ts               # Config SMPP
│   │   └── environment.ts
│   ├── modules/
│   │   ├── messages/
│   │   │   ├── messages.module.ts
│   │   │   ├── messages.controller.ts    # API envoi SMS
│   │   │   ├── messages.service.ts
│   │   │   ├── single-sms.service.ts     # Envoi unitaire
│   │   │   ├── bulk-sms.service.ts       # Envoi en masse
│   │   │   ├── dto/
│   │   │   │   ├── send-sms.dto.ts
│   │   │   │   ├── send-bulk-sms.dto.ts
│   │   │   │   └── sms-filter.dto.ts
│   │   │   └── entities/
│   │   │       └── message.entity.ts
│   │   ├── campaigns/
│   │   │   ├── campaigns.module.ts
│   │   │   ├── campaigns.controller.ts
│   │   │   ├── campaigns.service.ts
│   │   │   ├── scheduler.service.ts      # Planification
│   │   │   └── entities/
│   │   │       └── campaign.entity.ts
│   │   ├── smpp/
│   │   │   ├── smpp.module.ts
│   │   │   ├── smpp-client.service.ts    # Connexion SMPP
│   │   │   ├── smpp-session.manager.ts   # Gestion sessions
│   │   │   └── smpp-pdu.handler.ts       # Gestion PDU
│   │   ├── dlr/
│   │   │   ├── dlr.module.ts
│   │   │   ├── dlr.controller.ts         # Webhook DLR
│   │   │   ├── dlr.service.ts            # Traitement DLR
│   │   │   └── entities/
│   │   │       └── delivery-report.entity.ts
│   │   ├── hlr/
│   │   │   ├── hlr.module.ts
│   │   │   ├── hlr.controller.ts
│   │   │   ├── hlr.service.ts            # HLR Lookup
│   │   │   └── entities/
│   │   │       └── hlr-result.entity.ts
│   │   ├── contacts/
│   │   │   ├── contacts.module.ts
│   │   │   ├── contacts.controller.ts
│   │   │   ├── contacts.service.ts
│   │   │   ├── groups.service.ts         # Groupes/Listes
│   │   │   ├── import.service.ts         # Import CSV
│   │   │   └── entities/
│   │   │       ├── contact.entity.ts
│   │   │       └── contact-group.entity.ts
│   │   ├── templates/
│   │   │   ├── templates.module.ts
│   │   │   ├── templates.controller.ts
│   │   │   ├── templates.service.ts
│   │   │   └── entities/
│   │   │       └── template.entity.ts
│   │   ├── sender-id/
│   │   │   ├── sender-id.module.ts
│   │   │   ├── sender-id.controller.ts
│   │   │   ├── sender-id.service.ts
│   │   │   └── entities/
│   │   │       └── sender-id.entity.ts
│   │   ├── credits/
│   │   │   ├── credits.module.ts
│   │   │   ├── credits.service.ts        # Gestion crédits SMS
│   │   │   └── entities/
│   │   │       └── credit-transaction.entity.ts
│   │   ├── analytics/
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── reports.service.ts
│   │   ├── api/
│   │   │   ├── api-keys.module.ts
│   │   │   ├── api-keys.controller.ts
│   │   │   ├── api-keys.service.ts       # Gestion clés API
│   │   │   └── entities/
│   │   │       └── api-key.entity.ts
│   │   └── rcs/
│   │       ├── rcs.module.ts
│   │       ├── rcs.service.ts            # Messages RCS
│   │       └── entities/
│   │           └── rcs-message.entity.ts
│   ├── queue/
│   │   ├── queue.module.ts
│   │   ├── sms-producer.service.ts       # Producteur de messages
│   │   └── sms-consumer.service.ts       # Consommateur (envoi réel)
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── filters/
│   └── shared/
│       ├── interfaces/
│       └── constants/
│           └── sms-status.enum.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── test/
├── docker/
├── docs/
│   └── openapi.yaml
├── package.json
└── README.md

### Tables de base de données

- messages : Tous les SMS envoyés
- campaigns : Campagnes SMS
- campaign_messages : Relation campagne-messages
- contacts : Contacts SMS
- contact_groups : Groupes de contacts
- contact_group_members : Membres des groupes
- templates : Templates SMS
- sender_ids : Identifiants d'expéditeur
- delivery_reports : Rapports de livraison (DLR)
- hlr_results : Résultats HLR Lookup
- credit_transactions : Transactions de crédits
- api_keys : Clés API client
- blacklist : Numéros en liste noire
- rcs_messages : Messages RCS

### API Endpoints principaux

# Messages
POST   /api/v1/sms/send           # Envoyer un SMS unitaire
POST   /api/v1/sms/send-bulk      # Envoi en masse
GET    /api/v1/sms/messages        # Historique messages
GET    /api/v1/sms/messages/:id    # Détail message

# Campagnes
POST   /api/v1/campaigns          # Créer campagne
GET    /api/v1/campaigns          # Lister campagnes
GET    /api/v1/campaigns/:id      # Détail campagne
PUT    /api/v1/campaigns/:id      # Modifier campagne
POST   /api/v1/campaigns/:id/send # Lancer campagne
DELETE /api/v1/campaigns/:id      # Supprimer campagne

# Contacts
POST   /api/v1/contacts           # Ajouter contact
GET    /api/v1/contacts           # Lister contacts
POST   /api/v1/contacts/import    # Import CSV
GET    /api/v1/groups             # Lister groupes
POST   /api/v1/groups             # Créer groupe

# Templates
POST   /api/v1/templates          # Créer template
GET    /api/v1/templates          # Lister templates

# DLR
POST   /api/v1/dlr/webhook        # Webhook DLR entrant
GET    /api/v1/dlr/reports        # Rapports DLR

# HLR
POST   /api/v1/hlr/lookup         # Vérifier un numéro
POST   /api/v1/hlr/bulk-lookup    # Vérification en masse

# Sender ID
POST   /api/v1/sender-ids        # Demander un Sender ID
GET    /api/v1/sender-ids        # Lister Sender IDs

# Crédits
GET    /api/v1/credits/balance    # Solde crédits
GET    /api/v1/credits/history    # Historique transactions

# Analytics
GET    /api/v1/analytics/overview # Vue d'ensemble
GET    /api/v1/analytics/delivery # Taux de livraison
GET    /api/v1/analytics/traffic  # Trafic par pays/opérateur

# API Keys
POST   /api/v1/api-keys           # Créer une clé API
GET    /api/v1/api-keys           # Lister les clés

### Fonctionnalités clés

1. Connexion SMPP multi-fournisseurs (load balancing)
2. File d'attente Redis/RabbitMQ pour envoi massif (rate limiting)
3. DLR tracking en temps réel
4. HLR Lookup (validation numéros avant envoi)
5. Gestion de crédits avec décompte automatique
6. Sender ID personnalisé par pays
7. Templates avec variables dynamiques ({nom}, {code}, etc.)
8. Import CSV de contacts (jusqu'à 1M lignes)
9. Planification d'envoi différé
10. Blacklist / opt-out automatique
11. A/B Testing de messages
12. SMS OTP (One-Time Password)
13. SMS bidirectionnels (MO/MT)
14. RCS Messages
15. URL Shortener intégré

### Protocole SMPP

- Support SMPP v3.4 et v5.0
- Modes : Transceiver, Transmitter, Receiver
- Gestion des PDU : submit_sm, deliver_sm, enquire_link
- Reconnexion automatique
- Heartbeat (enquire_link) configurable
- Gestion du throttling et backpressure

### Variables d'environnement

SMS_PORT=3002
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SMPP_HOST=smpp.provider.com
SMPP_PORT=2775
SMPP_SYSTEM_ID=...
SMPP_PASSWORD=...
SMPP_SYSTEM_TYPE=
SMPP_TON=5
SMPP_NPI=0
HLR_API_URL=https://hlr.provider.com
HLR_API_KEY=...
JWT_SECRET=...
RATE_LIMIT_PER_SECOND=100
MAX_BULK_SIZE=100000
```

## Critères d'acceptation

- [ ] Le service démarre indépendamment sur le port 3002
- [ ] La connexion SMPP est établie et maintenue
- [ ] L'envoi unitaire et en masse fonctionne
- [ ] Les DLR sont reçus et traités correctement
- [ ] Le HLR Lookup retourne les informations correctes
- [ ] La gestion de crédits est fiable (pas de double décompte)
- [ ] L'import CSV gère les fichiers volumineux
- [ ] Le rate limiting respecte les limites SMPP
- [ ] L'isolation multi-tenant est effective
- [ ] L'API est documentée en OpenAPI
