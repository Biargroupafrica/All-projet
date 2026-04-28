# AGENTS.md — Actor Hub Platform

## Aperçu du projet

Actor Hub est une plateforme SaaS/CPaaS multi-tenant développée par BIAR GROUP AFRICA SARLU. Elle comprend 4 microservices autonomes (Call Center, SMS Bulk, WhatsApp Marketing, Email Marketing), un service d'authentification, et un API Gateway.

## Structure du repository

```
/workspace/
├── AGENTS.md                           # Ce fichier
├── skills/
│   └── actor-hub-platform.md           # Skill principal de la plateforme
├── prompts/
│   ├── 00-global-platform-prompt.md    # Prompt global et architecture
│   ├── microservices/
│   │   ├── 01-actor-callcenter.md      # Microservice Call Center (CPaaS)
│   │   ├── 02-actor-bulk-sms.md        # Microservice SMS Bulk (CPaaS)
│   │   ├── 03-actor-whatsapp-marketing.md # Microservice WhatsApp (SaaS)
│   │   ├── 04-actor-email-marketing.md # Microservice Email (SaaS)
│   │   ├── 05-actor-auth-service.md    # Service Auth & Multi-tenant
│   │   └── 06-actor-api-gateway.md     # API Gateway
│   ├── landing-page/
│   │   └── 01-landing-page-vitrine.md  # Site vitrine complet
│   └── infrastructure/
│       └── 01-docker-compose.md        # Infrastructure Docker & CI/CD
└── README.md
```

## Skills disponibles

| Skill | Fichier | Utilisation |
|-------|---------|-------------|
| Plateforme Actor Hub | `skills/actor-hub-platform.md` | Architecture globale, design system, règles de dev |

## Prompts disponibles

| Prompt | Fichier | Description |
|--------|---------|-------------|
| Global | `prompts/00-global-platform-prompt.md` | Vision, architecture, ordre de dev, questions |
| Call Center | `prompts/microservices/01-actor-callcenter.md` | Microservice CPaaS — VoIP, SIP, WebRTC, IVR |
| SMS Bulk | `prompts/microservices/02-actor-bulk-sms.md` | Microservice CPaaS — SMPP, DLR, HLR |
| WhatsApp | `prompts/microservices/03-actor-whatsapp-marketing.md` | Microservice SaaS — WA API, Chat, Chatbot |
| Email | `prompts/microservices/04-actor-email-marketing.md` | Microservice SaaS — SMTP, Automation |
| Auth | `prompts/microservices/05-actor-auth-service.md` | Service transversal — JWT, Multi-tenant, RBAC |
| Gateway | `prompts/microservices/06-actor-api-gateway.md` | Infrastructure — Routing, Rate Limiting |
| Landing Page | `prompts/landing-page/01-landing-page-vitrine.md` | Site vitrine — Toutes les pages publiques |
| Infrastructure | `prompts/infrastructure/01-docker-compose.md` | Docker Compose, CI/CD, Monitoring |

## Référence Figma

- **FileKey** : `XDPnl4zhusx3vecuWQTYFx`
- **Nom** : Plateforme Biar group Actor hub VFinal 15-03-2026

## Conventions de code

- **Langage** : TypeScript (strict mode)
- **Style** : Prettier + ESLint
- **Commits** : Conventional Commits (feat:, fix:, chore:, docs:)
- **Branches** : feature/, bugfix/, hotfix/, release/
- **Tests** : Jest + Testing Library (frontend), Jest + Supertest (backend)

## Cursor Cloud specific instructions

- Le design Figma est accessible via les outils Figma MCP (fileKey: `XDPnl4zhusx3vecuWQTYFx`)
- Les screenshots du design peuvent être obtenues via `Figma-get_screenshot`
- Le code source des composants est accessible via `FetchMcpResource` avec le server "Figma"
- Toujours vérifier le design Figma avant d'implémenter une page ou un composant
