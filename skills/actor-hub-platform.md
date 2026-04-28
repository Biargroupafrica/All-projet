# Skill: Actor Hub Platform - SaaS & CPaaS

## Contexte

**Actor Hub** est une plateforme SaaS/CPaaS multi-tenant de Biar Group Africa SARLU, conçue en architecture microservices. Chaque module est autonome et peut être déployé, scalé et maintenu indépendamment.

**Figma Make (Source de vérité UI):** `XDPnl4zhusx3vecuWQTYFx`

## Architecture Microservices

La plateforme est découpée en **12 microservices autonomes** :

| # | Microservice | Domaine | Port par défaut |
|---|---|---|---|
| 1 | `ms-gateway` | API Gateway & Load Balancer | 8000 |
| 2 | `ms-auth` | Authentification & Autorisation | 8001 |
| 3 | `ms-tenant` | Multi-tenancy & Abonnements | 8002 |
| 4 | `ms-call-center` | Centre d'Appels Cloud (SIP/WebRTC) | 8003 |
| 5 | `ms-sms` | SMS Bulk Marketing (SMPP) | 8004 |
| 6 | `ms-email` | Email Marketing (SMTP) | 8005 |
| 7 | `ms-whatsapp` | WhatsApp Business API | 8006 |
| 8 | `ms-contacts` | Gestion des Contacts & CRM | 8007 |
| 9 | `ms-billing` | Facturation & Paiements (Stripe) | 8008 |
| 10 | `ms-analytics` | Analytics & Rapports | 8009 |
| 11 | `ms-notification` | Notifications temps réel (WebSocket) | 8010 |
| 12 | `ms-frontend` | Landing Page & Dashboard (Next.js) | 3000 |

## Stack Technologique

### Backend (par microservice)
- **Runtime:** Node.js 20+ / Deno (Edge Functions)
- **Framework:** NestJS (microservices) ou Hono (edge)
- **Base de données:** PostgreSQL (Supabase) par service
- **Cache:** Redis (sessions, queues, rate limiting)
- **Message Broker:** RabbitMQ ou Redis Streams
- **ORM:** Prisma ou Drizzle ORM

### Frontend
- **Framework:** React 18 + TypeScript
- **Router:** React Router v7
- **UI:** Tailwind CSS v4 + shadcn/ui + Radix UI
- **State:** Zustand
- **Charts:** Recharts
- **Icons:** Lucide React
- **i18n:** 10 langues (FR, EN, AR, ZH, RU, SW, PT, HI, ES, NL)
- **Theme:** Dark/Light mode (next-themes)

### Infrastructure
- **Hosting Frontend:** Vercel
- **Backend:** Supabase Edge Functions / AWS Lambda
- **Base de données:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage / S3
- **CDN:** Cloudflare
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry + Datadog

## Design System

### Couleurs principales
- **Primary (Violet):** `#5906AE`
- **Accent (Rose):** `#FF006F`
- **Footer/Header Blue:** `#2B7FFF`
- **Background:** `#FAFBFC`
- **Card:** `#FFFFFF`

### Typographie
- Font: System UI, sans-serif
- H1: 32px, H2: 24px, H3: 20px, Body: 16px, Small: 14px

### Composants UI (shadcn/ui)
- Button, Card, Dialog, Input, Select, Tabs, Badge, Sheet, Tooltip
- Composants spécialisés: Softphone, IVR Builder, Flow Builder, Email Editor

## Rôles Utilisateurs

| Rôle | Accès |
|---|---|
| Super Admin | Tout accès, gestion multi-tenant |
| Admin | Gestion entreprise, modules, analytics |
| Agent | Opérationnel (appels, SMS, email, WhatsApp) |
| Superviseur | Monitoring, écoute, rapports |
| Customer | Self-service, historique, tickets |

## Pages Landing (Site Vitrine)

| Route | Description |
|---|---|
| `/` | Homepage - Hero, Features, Stats, CTA |
| `/services` | Solutions par canal (4 modules) |
| `/fonctionnalites/call-center` | Détail Call Center |
| `/fonctionnalites/sms-marketing` | Détail SMS Marketing |
| `/fonctionnalites/whatsapp-business` | Détail WhatsApp |
| `/fonctionnalites/email-marketing` | Détail Email Marketing |
| `/industries` | Secteurs cibles (Banque, E-commerce, Santé...) |
| `/tarifs` | Plans tarifaires (Starter, Business, Enterprise) |
| `/actualites` | Blog & Actualités |
| `/a-propos` | À propos de Biar Group |
| `/contact` | Formulaire de contact |
| `/login` | Sélection type + Login |

## Conventions de développement

### Nommage
- Composants: PascalCase (`CallCenterDashboard.tsx`)
- Fichiers: kebab-case (`call-center-dashboard.tsx`)
- Variables: camelCase
- Constantes: UPPER_SNAKE_CASE
- Routes: kebab-case (`/dashboard/call-center-live`)

### Structure fichiers par microservice
```
ms-{service}/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── dto/
│   ├── middlewares/
│   ├── events/
│   └── utils/
├── prisma/
│   └── schema.prisma
├── tests/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

### Communication inter-services
- **Synchrone:** REST API via API Gateway (ms-gateway)
- **Asynchrone:** Events via RabbitMQ / Redis Streams
- **Temps réel:** WebSocket via ms-notification

### Protocoles télécom
- **SMS:** SMPP v3.4
- **Email:** SMTP + SPF/DKIM/DMARC
- **VoIP:** SIP/RTP + WebRTC
- **WhatsApp:** Meta Business API (Cloud API)

## Comment utiliser ce skill

1. Lire le prompt du microservice concerné dans `prompts/microservices/`
2. Suivre l'architecture décrite dans `docs/architecture/`
3. Respecter le design system et les conventions
4. Chaque microservice doit être autonome avec sa propre base de données
5. La communication inter-services passe par l'API Gateway ou le message broker
