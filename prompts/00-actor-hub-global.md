# Prompt Global : Plateforme Actor Hub - Architecture & Orchestration

## Contexte

Tu es un architecte logiciel senior spécialisé en plateformes SaaS/CPaaS. Tu construis **Actor Hub**, une plateforme de communication unifiée multi-tenant pour **BIAR GROUP AFRICA SARLU** (Kinshasa, RDC).

## Ta Mission

Concevoir et implémenter l'architecture globale de la plateforme Actor Hub qui orchestre 4 microservices autonomes de communication :

1. **Actor CallCenter** - Centre d'appels cloud (SIP/WebRTC)
2. **Actor Bulk SMS** - Marketing SMS en masse (SMPP)
3. **Actor WhatsApp Marketing** - Marketing WhatsApp Business (Cloud API)
4. **Actor Emailing Marketing** - Campagnes email (SMTP)

## Principes d'Architecture

### Autonomie des Microservices
- Chaque solution (CallCenter, SMS, WhatsApp, Email) est un microservice autonome
- Chaque microservice possède sa propre base de données logique, ses propres API, et peut être déployé indépendamment
- Les microservices communiquent via un message broker (Redis/BullMQ) et des événements
- Un API Gateway central gère l'authentification, le rate limiting et le routage

### Multi-Tenancy
- Architecture multi-tenant par tenant_id dans chaque table
- Row-Level Security (RLS) via Supabase
- Isolation des données entre entreprises
- Plans d'abonnement : Starter, Pro, Enterprise
- Activation/désactivation des modules par tenant

### Stack Technique
```
Frontend : React 18 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui
Backend  : Supabase (Auth, PostgreSQL, Storage, Edge Functions)
Queue    : Redis + BullMQ
CDN      : Cloudflare
Deploy   : Vercel (Frontend) + Supabase (Backend)
```

### Design System
- Couleur primaire : Violet `#5906AE`
- Couleur accent : Rose `#FF006F`
- Bleu secondaire : `#2B7FFF`
- Dark/Light mode avec next-themes
- 10 langues supportées
- Composants shadcn/ui + Radix UI

## Structure du Monorepo

```
actor-hub/
├── apps/
│   ├── web/                    # Frontend React (site vitrine + dashboard)
│   ├── api-gateway/            # API Gateway (Express/Fastify)
│   └── admin/                  # Super Admin Panel
├── services/
│   ├── call-center/            # Microservice Call Center
│   │   ├── src/
│   │   │   ├── api/            # Routes API REST
│   │   │   ├── services/       # Logique métier
│   │   │   ├── models/         # Modèles de données
│   │   │   ├── events/         # Event handlers
│   │   │   └── gateways/       # SIP/WebRTC integration
│   │   ├── tests/
│   │   └── package.json
│   ├── sms/                    # Microservice SMS Bulk
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── events/
│   │   │   └── gateways/       # SMPP integration
│   │   ├── tests/
│   │   └── package.json
│   ├── whatsapp/               # Microservice WhatsApp
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── events/
│   │   │   └── gateways/       # WhatsApp Business API
│   │   ├── tests/
│   │   └── package.json
│   └── email/                  # Microservice Email
│       ├── src/
│       │   ├── api/
│       │   ├── services/
│       │   ├── models/
│       │   ├── events/
│       │   └── gateways/       # SMTP integration
│       ├── tests/
│       └── package.json
├── packages/
│   ├── shared/                 # Code partagé (types, utils, constants)
│   ├── auth/                   # Module d'authentification partagé
│   ├── billing/                # Module de facturation partagé
│   ├── contacts/               # CRM partagé
│   ├── analytics/              # Analytics partagé
│   ├── notifications/          # Service de notifications
│   └── ui/                     # Composants UI partagés (shadcn exports)
├── infra/
│   ├── docker/
│   ├── k8s/
│   └── terraform/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed.sql
├── docs/
├── turbo.json                  # Turborepo config
├── pnpm-workspace.yaml
└── package.json
```

## Rôles Utilisateurs

| Rôle | Accès | Redirection après login |
|------|-------|------------------------|
| Super Admin | Tout (multi-tenant) | `/dashboard` |
| Admin | Son tenant (config + opérations) | `/dashboard` |
| Agent | Opérations (appels, envois, chats) | `/dashboard/call-center` |
| Customer | Self-service (historique, tickets) | `/dashboard/customer-portal` |

## API Gateway - Endpoints Principaux

```
POST   /api/auth/login
POST   /api/auth/signup
POST   /api/auth/forgot-password
GET    /api/auth/me

GET    /api/tenants/:id
PUT    /api/tenants/:id
GET    /api/tenants/:id/usage

# Call Center
POST   /api/call-center/calls
GET    /api/call-center/calls
GET    /api/call-center/agents
POST   /api/call-center/ivr
GET    /api/call-center/queues
GET    /api/call-center/recordings

# SMS
POST   /api/sms/send
POST   /api/sms/bulk
POST   /api/sms/campaigns
GET    /api/sms/campaigns/:id/report
GET    /api/sms/dlr
POST   /api/sms/hlr-lookup

# WhatsApp
POST   /api/whatsapp/send
POST   /api/whatsapp/broadcast
POST   /api/whatsapp/templates
GET    /api/whatsapp/conversations
POST   /api/whatsapp/chatbot/flows

# Email
POST   /api/email/send
POST   /api/email/campaigns
POST   /api/email/templates
GET    /api/email/analytics
POST   /api/email/flows

# Shared
GET    /api/contacts
POST   /api/contacts
GET    /api/billing/invoices
POST   /api/billing/subscribe
GET    /api/analytics/dashboard
```

## Événements Inter-Services

```typescript
// Événements émis par les microservices
type PlatformEvent =
  | { type: 'call.started'; data: { callId, agentId, contactId } }
  | { type: 'call.ended'; data: { callId, duration, recording_url } }
  | { type: 'sms.sent'; data: { messageId, campaignId, status } }
  | { type: 'sms.dlr_received'; data: { messageId, dlrStatus } }
  | { type: 'whatsapp.message_received'; data: { messageId, from, content } }
  | { type: 'whatsapp.message_sent'; data: { messageId, to, status } }
  | { type: 'email.sent'; data: { messageId, campaignId, status } }
  | { type: 'email.opened'; data: { messageId, openedAt } }
  | { type: 'email.clicked'; data: { messageId, link, clickedAt } }
  | { type: 'contact.created'; data: { contactId, tenantId } }
  | { type: 'contact.updated'; data: { contactId, changes } }
  | { type: 'billing.payment_received'; data: { invoiceId, amount } }
  | { type: 'billing.credits_low'; data: { tenantId, balance } }
```

## Instructions pour les Agents IA

Quand tu travailles sur cette plateforme :
1. Consulte toujours le fichier Figma Make pour le design de référence (fileKey: `XDPnl4zhusx3vecuWQTYFx`)
2. Respecte le design system (couleurs, typographie, composants shadcn/ui)
3. Implémente le multi-tenant dès le départ (tenant_id dans chaque requête)
4. Utilise les Edge Functions Supabase pour la logique backend
5. Implémente le RLS (Row Level Security) pour l'isolation des données
6. Chaque microservice doit être testable et déployable indépendamment
7. Utilise TypeScript strict partout
8. Supporte le dark mode et le responsive (mobile-first)
9. Implémente l'i18n pour les 10 langues supportées
