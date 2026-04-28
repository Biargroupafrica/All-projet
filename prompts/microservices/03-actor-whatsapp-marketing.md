# Prompt : Microservice Actor WhatsApp Marketing (SaaS)

## Objectif

Créer le microservice autonome de marketing WhatsApp avec WhatsApp Business API, chat multi-agent, chatbot IA, broadcast et flow builder.

## Contexte Figma

- **FileKey** : `XDPnl4zhusx3vecuWQTYFx`
- **Route principale** : `/fonctionnalites/whatsapp-business`
- **Dashboard** : `/dashboard/whatsapp-*`

## Prompt de création

```
Tu es un architecte logiciel senior spécialisé en WhatsApp Business API et marketing conversationnel.

Crée le microservice "Actor WhatsApp Marketing" — une plateforme SaaS de marketing WhatsApp complète et autonome.

### Architecture du microservice

Nom : actor-whatsapp-service
Port : 3003
Base de données : PostgreSQL (schéma dédié "whatsapp")

### Structure du projet

actor-whatsapp-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── whatsapp.config.ts           # Config WhatsApp API
│   │   └── environment.ts
│   ├── modules/
│   │   ├── messages/
│   │   │   ├── messages.module.ts
│   │   │   ├── messages.controller.ts
│   │   │   ├── messages.service.ts
│   │   │   ├── media.service.ts          # Gestion médias
│   │   │   ├── dto/
│   │   │   │   ├── send-message.dto.ts
│   │   │   │   ├── send-template.dto.ts
│   │   │   │   └── send-media.dto.ts
│   │   │   └── entities/
│   │   │       ├── message.entity.ts
│   │   │       └── media.entity.ts
│   │   ├── conversations/
│   │   │   ├── conversations.module.ts
│   │   │   ├── conversations.controller.ts
│   │   │   ├── conversations.service.ts
│   │   │   ├── conversations.gateway.ts  # WebSocket temps réel
│   │   │   ├── assignment.service.ts     # Attribution agents
│   │   │   └── entities/
│   │   │       └── conversation.entity.ts
│   │   ├── chat/
│   │   │   ├── chat.module.ts
│   │   │   ├── chat.controller.ts
│   │   │   ├── chat.service.ts           # Chat multi-agent
│   │   │   └── entities/
│   │   │       └── chat-session.entity.ts
│   │   ├── broadcast/
│   │   │   ├── broadcast.module.ts
│   │   │   ├── broadcast.controller.ts
│   │   │   ├── broadcast.service.ts      # Envoi en masse
│   │   │   ├── scheduler.service.ts
│   │   │   └── entities/
│   │   │       ├── broadcast.entity.ts
│   │   │       └── broadcast-recipient.entity.ts
│   │   ├── chatbot/
│   │   │   ├── chatbot.module.ts
│   │   │   ├── chatbot.controller.ts
│   │   │   ├── chatbot.service.ts
│   │   │   ├── ai-engine.service.ts      # Moteur IA (OpenAI)
│   │   │   ├── flow-engine.service.ts    # Exécution flows
│   │   │   └── entities/
│   │   │       ├── chatbot.entity.ts
│   │   │       └── chatbot-flow.entity.ts
│   │   ├── templates/
│   │   │   ├── templates.module.ts
│   │   │   ├── templates.controller.ts
│   │   │   ├── templates.service.ts
│   │   │   ├── template-sync.service.ts  # Sync avec Meta
│   │   │   └── entities/
│   │   │       └── template.entity.ts
│   │   ├── contacts/
│   │   │   ├── contacts.module.ts
│   │   │   ├── contacts.controller.ts
│   │   │   ├── contacts.service.ts
│   │   │   ├── groups.service.ts
│   │   │   └── entities/
│   │   │       ├── contact.entity.ts
│   │   │       └── contact-group.entity.ts
│   │   ├── flow-builder/
│   │   │   ├── flow-builder.module.ts
│   │   │   ├── flow-builder.controller.ts
│   │   │   ├── flow-builder.service.ts
│   │   │   └── entities/
│   │   │       ├── flow.entity.ts
│   │   │       └── flow-node.entity.ts
│   │   ├── accounts/
│   │   │   ├── accounts.module.ts
│   │   │   ├── accounts.controller.ts
│   │   │   ├── accounts.service.ts       # Gestion comptes WA
│   │   │   ├── qr-code.service.ts        # Connexion QR
│   │   │   └── entities/
│   │   │       └── whatsapp-account.entity.ts
│   │   ├── anti-block/
│   │   │   ├── anti-block.module.ts
│   │   │   ├── anti-block.service.ts     # Protection blocage
│   │   │   └── warmup.service.ts         # Warmup progressif
│   │   ├── analytics/
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── marketing-analytics.service.ts
│   │   ├── ads/
│   │   │   ├── ads.module.ts
│   │   │   ├── ads.controller.ts
│   │   │   └── ads.service.ts            # Click-to-WhatsApp ads
│   │   └── webhook/
│   │       ├── webhook.module.ts
│   │       ├── webhook.controller.ts     # Webhooks Meta
│   │       └── webhook.service.ts
│   ├── queue/
│   │   ├── queue.module.ts
│   │   ├── message-producer.service.ts
│   │   └── message-consumer.service.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── filters/
│   └── shared/
│       ├── interfaces/
│       └── constants/
├── prisma/
├── test/
├── docker/
├── docs/
│   └── openapi.yaml
├── package.json
└── README.md

### Tables de base de données

- whatsapp_accounts : Comptes WhatsApp Business
- messages : Messages envoyés/reçus
- conversations : Conversations avec contacts
- contacts : Contacts WhatsApp
- contact_groups : Groupes de contacts
- templates : Templates WhatsApp (sync Meta)
- broadcasts : Campagnes de broadcast
- broadcast_recipients : Destinataires broadcast
- chatbots : Configurations chatbot
- chatbot_flows : Flows de chatbot (JSON)
- flows : Flow builder visuel
- flow_nodes : Nœuds de flow
- media_files : Fichiers médias (images, vidéos, docs)
- chat_sessions : Sessions de chat agent
- analytics_events : Événements analytics
- ads_campaigns : Campagnes publicitaires

### API Endpoints principaux

# Messages
POST   /api/v1/messages/send         # Envoyer un message
POST   /api/v1/messages/send-template # Envoyer un template
POST   /api/v1/messages/send-media   # Envoyer un média
GET    /api/v1/messages              # Historique messages

# Conversations
GET    /api/v1/conversations         # Lister conversations
GET    /api/v1/conversations/:id     # Détail conversation
PUT    /api/v1/conversations/:id/assign # Assigner à agent
PUT    /api/v1/conversations/:id/close  # Fermer conversation

# Broadcast
POST   /api/v1/broadcasts            # Créer broadcast
GET    /api/v1/broadcasts            # Lister broadcasts
POST   /api/v1/broadcasts/:id/send   # Lancer broadcast
GET    /api/v1/broadcasts/:id/status # Statut broadcast

# Chatbot
POST   /api/v1/chatbots              # Créer chatbot
GET    /api/v1/chatbots              # Lister chatbots
PUT    /api/v1/chatbots/:id          # Configurer chatbot
POST   /api/v1/chatbots/:id/toggle   # Activer/désactiver

# Templates
GET    /api/v1/templates             # Lister templates
POST   /api/v1/templates/sync        # Sync avec Meta
POST   /api/v1/templates             # Créer template

# Flow Builder
POST   /api/v1/flows                 # Créer flow
GET    /api/v1/flows                 # Lister flows
PUT    /api/v1/flows/:id             # Modifier flow

# Comptes
POST   /api/v1/accounts              # Connecter compte
GET    /api/v1/accounts              # Lister comptes
GET    /api/v1/accounts/:id/qr       # Obtenir QR code
GET    /api/v1/accounts/:id/health   # Santé du compte

# Webhook Meta
POST   /api/v1/webhook               # Recevoir webhooks
GET    /api/v1/webhook               # Vérification Meta

# Analytics
GET    /api/v1/analytics/dashboard   # Dashboard analytics
GET    /api/v1/analytics/marketing   # Analytics marketing

WebSocket /ws/conversations          # Chat temps réel
WebSocket /ws/notifications          # Notifications

### Fonctionnalités clés

1. WhatsApp Business API (Cloud API Meta)
2. Chat multi-agent avec attribution automatique
3. Broadcast vers listes segmentées
4. Chatbot IA avec OpenAI GPT
5. Flow Builder visuel (drag & drop)
6. Templates WhatsApp avec approbation Meta
7. Anti-blocage (warmup progressif, délais aléatoires)
8. QR Code pour connexion rapide
9. Gestion médias (images, vidéos, documents, audio)
10. Analytics marketing complet
11. Autorépondeur configurable
12. OTP via WhatsApp
13. Intégration publicités Click-to-WhatsApp
14. Export de données et rapports

### Variables d'environnement

WHATSAPP_PORT=3003
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_BUSINESS_ACCOUNT_ID=...
WHATSAPP_WEBHOOK_VERIFY_TOKEN=...
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4
STORAGE_BUCKET=whatsapp-media
JWT_SECRET=...
RATE_LIMIT_PER_SECOND=80
BROADCAST_DELAY_MS=1000
```

## Critères d'acceptation

- [ ] Le service démarre indépendamment sur le port 3003
- [ ] La connexion WhatsApp Business API fonctionne
- [ ] L'envoi et la réception de messages fonctionnent
- [ ] Le chat multi-agent distribue correctement les conversations
- [ ] Le chatbot IA répond de manière contextuelle
- [ ] Le broadcast respecte les limites de taux
- [ ] L'anti-blocage est actif (délais, warmup)
- [ ] Les templates sont synchronisés avec Meta
- [ ] L'isolation multi-tenant est effective
- [ ] L'API est documentée en OpenAPI
