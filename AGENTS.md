# AGENTS.md - Actor Hub Platform

## Projet
Plateforme **Actor Hub** par **BIAR GROUP AFRICA SARLU** - SaaS & CPaaS multi-tenant avec microservices autonomes.

## Skills disponibles

### `.cursor/skills/actor-hub-platform.md`
**Quand l'utiliser** : Pour toute tâche liée à la plateforme Actor Hub (développement, architecture, design system, conventions).

### `.cursor/skills/microservices-architecture.md`
**Quand l'utiliser** : Lors de la création ou modification d'un microservice (structure, patterns, communication inter-services).

## Structure du projet

```
/workspace
├── AGENTS.md                          # Ce fichier
├── .cursor/skills/                    # Skills Cursor
│   ├── actor-hub-platform.md          # Skill plateforme
│   └── microservices-architecture.md  # Skill microservices
├── prompts/                           # Prompts détaillés
│   ├── README.md                      # Index des prompts
│   ├── microservices/                 # Prompts par microservice
│   │   ├── 01-actor-auth-service.md
│   │   ├── 02-actor-callcenter-service.md
│   │   ├── 03-actor-sms-service.md
│   │   ├── 04-actor-whatsapp-service.md
│   │   ├── 05-actor-email-service.md
│   │   ├── 06-actor-gateway-service.md
│   │   ├── 07-actor-billing-service.md
│   │   ├── 08-actor-analytics-service.md
│   │   └── 09-actor-crm-service.md
│   ├── landing-page/                  # Prompts frontend
│   │   └── 01-landing-page-vitrine.md
│   └── infrastructure/               # Prompts DevOps
│       ├── 01-docker-infrastructure.md
│       └── 02-ci-cd-pipeline.md
```

## Conventions de code

### Backend (NestJS/Node.js)
- TypeScript strict mode
- Modules NestJS par domaine fonctionnel
- DTOs avec class-validator
- Prisma ORM pour la base de données
- Tests avec Jest
- Logs structurés JSON

### Frontend (React/TypeScript)
- Composants React en PascalCase
- Fichiers en kebab-case
- Tailwind CSS pour les styles
- shadcn/ui pour les composants UI
- Zustand pour le state management
- React Router v7 pour le routing

### Design System
- Primaire : `#5906AE` (Violet)
- Accent : `#FF006F` (Rose)
- Texte blanc sur fonds colorés
- Dark/Light mode supporté
- Mobile-first responsive

### API
- REST avec versioning `/api/v1/`
- Réponses JSON standardisées
- Pagination, filtrage, tri
- OpenAPI/Swagger documentation

## Figma
Le projet de référence Figma est un fichier Figma Make avec file key `XDPnl4zhusx3vecuWQTYFx`.

## Langue
Répondre en **français** par défaut.
