# Prompt : Microservice Actor CallCenter (CPaaS)

## Objectif

Créer le microservice autonome de centre d'appels cloud (CPaaS) avec softphone WebRTC, IVR, ACD, et gestion complète des appels entrants/sortants.

## Contexte Figma

- **FileKey** : `XDPnl4zhusx3vecuWQTYFx`
- **Route principale** : `/fonctionnalites/call-center`
- **Dashboard** : `/dashboard/call-center`

## Prompt de création

```
Tu es un architecte logiciel senior spécialisé en télécommunications et CPaaS.

Crée le microservice "Actor CallCenter" — un centre d'appels cloud complet et autonome.

### Architecture du microservice

Nom : actor-callcenter-service
Port : 3001
Base de données : PostgreSQL (schéma dédié "callcenter")

### Structure du projet

actor-callcenter-service/
├── src/
│   ├── main.ts                          # Point d'entrée
│   ├── app.module.ts                    # Module principal NestJS
│   ├── config/
│   │   ├── database.config.ts           # Config PostgreSQL
│   │   ├── redis.config.ts              # Config Redis
│   │   ├── webrtc.config.ts             # Config WebRTC/SIP
│   │   └── environment.ts               # Variables d'env
│   ├── modules/
│   │   ├── calls/
│   │   │   ├── calls.module.ts
│   │   │   ├── calls.controller.ts      # API REST appels
│   │   │   ├── calls.service.ts         # Logique métier
│   │   │   ├── calls.gateway.ts         # WebSocket temps réel
│   │   │   ├── dto/
│   │   │   │   ├── create-call.dto.ts
│   │   │   │   ├── update-call.dto.ts
│   │   │   │   └── call-filter.dto.ts
│   │   │   └── entities/
│   │   │       ├── call.entity.ts
│   │   │       └── call-recording.entity.ts
│   │   ├── ivr/
│   │   │   ├── ivr.module.ts
│   │   │   ├── ivr.controller.ts        # API IVR
│   │   │   ├── ivr.service.ts           # Moteur IVR
│   │   │   ├── ivr-flow.engine.ts       # Exécution des flows
│   │   │   └── entities/
│   │   │       ├── ivr-flow.entity.ts
│   │   │       └── ivr-node.entity.ts
│   │   ├── acd/
│   │   │   ├── acd.module.ts
│   │   │   ├── acd.service.ts           # Distribution automatique
│   │   │   ├── queue.service.ts         # Gestion files d'attente
│   │   │   ├── routing.service.ts       # Routage intelligent
│   │   │   └── entities/
│   │   │       ├── queue.entity.ts
│   │   │       └── routing-rule.entity.ts
│   │   ├── agents/
│   │   │   ├── agents.module.ts
│   │   │   ├── agents.controller.ts
│   │   │   ├── agents.service.ts
│   │   │   ├── presence.service.ts      # Statut en temps réel
│   │   │   └── entities/
│   │   │       └── agent.entity.ts
│   │   ├── recordings/
│   │   │   ├── recordings.module.ts
│   │   │   ├── recordings.controller.ts
│   │   │   ├── recordings.service.ts
│   │   │   └── storage.service.ts       # Upload S3/Supabase
│   │   ├── dialers/
│   │   │   ├── dialers.module.ts
│   │   │   ├── power-dialer.service.ts
│   │   │   ├── predictive-dialer.service.ts
│   │   │   └── preview-dialer.service.ts
│   │   ├── sip/
│   │   │   ├── sip.module.ts
│   │   │   ├── sip-gateway.service.ts   # Connexion SIP trunk
│   │   │   └── webrtc-signaling.service.ts
│   │   ├── supervision/
│   │   │   ├── supervision.module.ts
│   │   │   ├── wallboard.service.ts     # Tableau de bord temps réel
│   │   │   └── monitoring.service.ts
│   │   └── analytics/
│   │       ├── analytics.module.ts
│   │       ├── analytics.service.ts
│   │       └── metrics.service.ts
│   ├── common/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── tenant.guard.ts
│   │   ├── interceptors/
│   │   │   └── tenant.interceptor.ts
│   │   ├── decorators/
│   │   │   └── tenant.decorator.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   └── shared/
│       ├── interfaces/
│       │   ├── call.interface.ts
│       │   └── agent.interface.ts
│       └── constants/
│           └── call-status.enum.ts
├── prisma/
│   ├── schema.prisma                    # Schéma BDD
│   └── migrations/
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── docs/
│   └── openapi.yaml                     # Documentation API
├── package.json
├── tsconfig.json
├── .env.example
└── README.md

### Tables de base de données

- calls : Historique complet des appels
- call_recordings : Enregistrements audio
- agents : Profils agents avec compétences
- queues : Files d'attente configurées
- routing_rules : Règles de routage
- ivr_flows : Arbres IVR (JSON flow)
- ivr_nodes : Nœuds IVR individuels
- campaigns : Campagnes sortantes
- call_scripts : Scripts d'appels
- dispositions : Codes de fin d'appel

### API Endpoints principaux

POST   /api/v1/calls              # Initier un appel
GET    /api/v1/calls              # Lister les appels
GET    /api/v1/calls/:id          # Détail d'un appel
PUT    /api/v1/calls/:id/hold     # Mettre en attente
PUT    /api/v1/calls/:id/transfer # Transférer
DELETE /api/v1/calls/:id          # Raccrocher

GET    /api/v1/agents             # Lister les agents
PUT    /api/v1/agents/:id/status  # Changer le statut
GET    /api/v1/agents/:id/stats   # Statistiques agent

GET    /api/v1/queues             # Lister les files
POST   /api/v1/queues             # Créer une file
GET    /api/v1/queues/:id/status  # État temps réel

POST   /api/v1/ivr                # Créer un IVR
GET    /api/v1/ivr/:id            # Récupérer un IVR
PUT    /api/v1/ivr/:id            # Modifier un IVR

GET    /api/v1/recordings         # Lister les enregistrements
GET    /api/v1/recordings/:id/url # URL de téléchargement

POST   /api/v1/campaigns          # Créer campagne sortante
GET    /api/v1/campaigns          # Lister les campagnes

WebSocket /ws/calls               # Événements temps réel
WebSocket /ws/agents              # Présence agents
WebSocket /ws/wallboard           # Données wallboard

### Fonctionnalités clés

1. Softphone WebRTC (SIP.js)
2. IVR Builder visuel (arbre décisionnel)
3. ACD avec routage basé sur les compétences
4. Power Dialer / Predictive Dialer / Preview Dialer
5. Enregistrement et stockage des appels
6. Supervision en temps réel (écoute, chuchotement, intrusion)
7. Wallboard avec KPIs temps réel
8. Scripts d'appels interactifs
9. Géolocalisation des appels
10. Analytics et rapports détaillés

### Intégrations externes

- SIP Trunk Providers : Twilio, Plivo, Vonage
- WebRTC : SIP.js / JsSIP
- Stockage : Supabase Storage / AWS S3
- Notifications : WebSocket + Push notifications

### Variables d'environnement

CALLCENTER_PORT=3001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SIP_SERVER=sip.provider.com
SIP_USERNAME=...
SIP_PASSWORD=...
WEBRTC_ICE_SERVERS=stun:stun.l.google.com:19302
STORAGE_BUCKET=call-recordings
JWT_SECRET=...
TENANT_HEADER=x-tenant-id
```

## Critères d'acceptation

- [ ] Le service démarre indépendamment sur le port 3001
- [ ] Les appels WebRTC fonctionnent (entrant/sortant)
- [ ] L'IVR exécute correctement les arbres décisionnels
- [ ] L'ACD distribue les appels selon les règles configurées
- [ ] Les enregistrements sont stockés et accessibles
- [ ] Le wallboard affiche les métriques en temps réel
- [ ] L'isolation multi-tenant est effective
- [ ] L'API est documentée en OpenAPI
- [ ] Les tests unitaires et d'intégration passent
