# AGENTS.md - Actor Hub Platform

## Projet
**Actor Hub** - Plateforme SaaS/CPaaS multi-tenant par Biar Group Africa SARLU

## Skills disponibles
- `skills/actor-hub-platform.md` : Skill principal avec architecture, stack, design system et conventions

## Prompts Microservices
Chaque microservice a son propre prompt détaillé dans `prompts/microservices/` :
- `01-ms-gateway.md` : API Gateway
- `02-ms-auth.md` : Authentification
- `03-ms-tenant.md` : Multi-tenancy
- `04-ms-call-center.md` : Centre d'Appels Cloud
- `05-ms-sms.md` : SMS Bulk Marketing
- `06-ms-email.md` : Email Marketing
- `07-ms-whatsapp.md` : WhatsApp Business
- `08-ms-contacts.md` : Gestion Contacts
- `09-ms-billing.md` : Facturation
- `10-ms-analytics.md` : Analytics
- `11-ms-notification.md` : Notifications temps réel
- `12-ms-frontend.md` : Frontend React

## Prompts additionnels
- `prompts/landing-page/` : Prompts pour le site vitrine
- `prompts/dashboard/` : Prompts pour le dashboard

## Architecture
- `docs/architecture/microservices-overview.md` : Vue d'ensemble de l'architecture

## Référence Design
- **Figma Make fileKey:** `XDPnl4zhusx3vecuWQTYFx`

## Conventions
- Branches: `cursor/<description>-<suffix>`
- Commits: messages descriptifs en anglais
- Code: TypeScript strict, ESLint, Prettier
- Nommage fichiers: kebab-case
- Nommage composants: PascalCase
