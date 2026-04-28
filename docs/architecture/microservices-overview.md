# Architecture Microservices - Actor Hub Platform

## Diagramme Global

```
                        ┌─────────────────────┐
                        │    Cloudflare CDN    │
                        │     + WAF + DDoS     │
                        └──────────┬──────────┘
                                   │
                        ┌──────────▼──────────┐
                        │   ms-frontend       │
                        │   (Next.js/React)   │
                        │   Port: 3000        │
                        └──────────┬──────────┘
                                   │
                        ┌──────────▼──────────┐
                        │   ms-gateway        │
                        │   API Gateway       │
                        │   Port: 8000        │
                        │   - Rate Limiting   │
                        │   - Auth Middleware  │
                        │   - Load Balancing  │
                        │   - Request Routing │
                        └──────────┬──────────┘
                                   │
        ┌──────────┬───────────┬───┴───┬───────────┬──────────┐
        │          │           │       │           │          │
   ┌────▼────┐ ┌──▼────┐ ┌───▼───┐ ┌─▼──────┐ ┌─▼──────┐  │
   │ms-auth  │ │ms-call│ │ms-sms │ │ms-email│ │ms-whats│  │
   │Port:8001│ │center │ │Port:  │ │Port:   │ │app     │  │
   │         │ │Port:  │ │8004   │ │8005    │ │Port:   │  │
   │JWT/OAuth│ │8003   │ │       │ │        │ │8006    │  │
   │2FA/RBAC │ │       │ │SMPP   │ │SMTP    │ │Meta API│  │
   └────┬────┘ │WebRTC │ │Gateway│ │Gateway │ │Cloud   │  │
        │      │SIP    │ │       │ │        │ │API     │  │
        │      └──┬────┘ └──┬────┘ └──┬─────┘ └──┬────┘  │
        │         │         │         │           │       │
   ┌────▼─────────▼─────────▼─────────▼───────────▼───┐   │
   │              Message Broker                       │   │
   │         (RabbitMQ / Redis Streams)               │   │
   │                                                   │   │
   │  Events: call.started, sms.sent, email.opened,   │   │
   │  whatsapp.delivered, user.created, payment.done   │   │
   └────┬─────────┬─────────┬─────────┬───────────┬───┘   │
        │         │         │         │           │       │
   ┌────▼────┐ ┌──▼─────┐ ┌▼────────┐│     ┌─────▼───┐   │
   │ms-tenant│ │ms-conta│ │ms-billi ││     │ms-notif │   │
   │Port:8002│ │cts     │ │ng      ││     │ication  │   │
   │         │ │Port:   │ │Port:   ││     │Port:8010│   │
   │Multi-   │ │8007    │ │8008    ││     │         │   │
   │tenancy  │ │        │ │        ││     │WebSocket│   │
   │Plans    │ │CRM     │ │Stripe  ││     │Push     │   │
   └────┬────┘ │Contacts│ │Credits ││     │Email    │   │
        │      └──┬─────┘ └┬───────┘│     └────┬────┘   │
        │         │        │        │          │         │
   ┌────▼─────────▼────────▼────────▼──────────▼─────┐   │
   │           PostgreSQL (Supabase)                  │   │
   │                                                   │   │
   │  Databases par service (isolation multi-tenant):  │   │
   │  - auth_db    - callcenter_db  - sms_db          │   │
   │  - email_db   - whatsapp_db   - contacts_db      │   │
   │  - billing_db - analytics_db  - tenant_db        │   │
   └──────────────────────────────────────────────────┘   │
                                                           │
   ┌──────────────────────────────────────────────────┐   │
   │           Redis Cluster                           │   │
   │                                                   │   │
   │  - Sessions & JWT cache                          │   │
   │  - Rate limiting counters                        │   │
   │  - Real-time presence (agents online)            │   │
   │  - Message queues (SMS batch, Email batch)       │   │
   │  - Pub/Sub (notifications temps réel)            │   │
   └──────────────────────────────────────────────────┘   │
                                                           │
   ┌──────────────────────────────────────────────────┐   │
   │           Supabase Storage / S3                   │   │
   │                                                   │   │
   │  - Call recordings (audio)                       │   │
   │  - Email attachments                             │   │
   │  - WhatsApp media (images, videos, docs)         │   │
   │  - User avatars & company logos                  │   │
   └──────────────────────────────────────────────────┘   │
                                                           │
   ┌─────────────▼────────────────────────────────────┐
   │           ms-analytics (Port: 8009)              │
   │                                                   │
   │  - Agrégation cross-service                      │
   │  - Dashboards temps réel                         │
   │  - Rapports planifiés (PDF/Excel/CSV)            │
   │  - Machine Learning (prédictions)                │
   └──────────────────────────────────────────────────┘
```

## Flux de données clés

### Flux Appel Entrant
```
Téléphone → SIP Trunk → ms-call-center → IVR Engine → ACD → Agent
                              │
                              ├── Enregistrement → Storage
                              ├── CDR → analytics_db
                              └── Event: call.started → Message Broker
                                    │
                                    ├── ms-notification → WebSocket → Dashboard
                                    ├── ms-analytics → Agrégation
                                    └── ms-contacts → Mise à jour fiche
```

### Flux Campagne SMS Bulk
```
Admin → ms-frontend → ms-gateway → ms-sms
                                      │
                                      ├── Validation contacts → ms-contacts
                                      ├── Vérification crédits → ms-billing
                                      ├── Envoi SMPP → Provider SMS
                                      │     └── DLR callback → ms-sms → sms_db
                                      ├── Event: campaign.started → Message Broker
                                      │     └── ms-notification → Admin (WebSocket)
                                      └── Event: sms.sent → ms-analytics
```

### Flux Email Marketing
```
Admin → ms-frontend → ms-gateway → ms-email
                                      │
                                      ├── Template rendering (personnalisation)
                                      ├── Vérification crédits → ms-billing
                                      ├── Envoi SMTP → Provider Email (SendGrid/SES)
                                      │     ├── Tracking pixel → ms-email (open)
                                      │     ├── Link redirect → ms-email (click)
                                      │     └── Bounce handler → ms-email
                                      └── Events → ms-analytics
```

### Flux WhatsApp
```
Client WhatsApp → Meta Webhook → ms-whatsapp
                                     │
                                     ├── Message reçu → whatsapp_db
                                     ├── Chatbot IA (OpenAI) → Réponse auto
                                     ├── Routage agent → ms-notification → Agent
                                     └── Events → ms-analytics
```

## Patterns d'architecture

### Event-Driven Architecture
Chaque microservice publie des événements métier sur le Message Broker :
- `call.started`, `call.ended`, `call.recorded`
- `sms.sent`, `sms.delivered`, `sms.failed`
- `email.sent`, `email.opened`, `email.clicked`, `email.bounced`
- `whatsapp.sent`, `whatsapp.delivered`, `whatsapp.read`
- `user.created`, `user.updated`, `user.deleted`
- `payment.succeeded`, `payment.failed`
- `tenant.created`, `subscription.changed`

### CQRS (Command Query Responsibility Segregation)
- **Commands** (écriture) : via API REST vers le microservice concerné
- **Queries** (lecture) : via ms-analytics pour les données agrégées cross-service

### Saga Pattern (transactions distribuées)
Exemple: Création de campagne SMS
1. ms-sms: Créer campagne (PENDING)
2. ms-billing: Réserver crédits
3. ms-contacts: Valider liste de contacts
4. ms-sms: Lancer envoi (ACTIVE)
5. En cas d'échec: compensation (rollback crédits)

### Circuit Breaker
Chaque appel inter-service utilise un circuit breaker pour éviter les cascades de pannes.
