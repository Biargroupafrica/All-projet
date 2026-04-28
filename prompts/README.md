# Prompts & Skills - Plateforme Actor Hub

## Vue d'ensemble

Ce dossier contient les prompts structurés et les skills pour la création de la plateforme **Actor Hub** par **BIAR GROUP AFRICA SARLU** - une plateforme SaaS & CPaaS (Communication Platform as a Service) composée de microservices autonomes.

## Architecture de la plateforme

```
                    ┌──────────────────────┐
                    │    Actor Frontend     │
                    │  (React/TypeScript)   │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │    Actor Gateway      │
                    │   (API Gateway)       │
                    └──────────┬───────────┘
                               │
        ┌──────────┬──────────┼──────────┬──────────┐
        │          │          │          │          │
   ┌────┴────┐ ┌──┴───┐ ┌───┴───┐ ┌───┴───┐ ┌───┴───┐
   │  Auth   │ │ Call  │ │  SMS  │ │Whats- │ │ Email │
   │Service  │ │Center │ │Service│ │ App   │ │Service│
   └─────────┘ └──────┘ └───────┘ └───────┘ └───────┘
        │          │          │          │          │
   ┌────┴──────────┴──────────┴──────────┴──────────┴───┐
   │              PostgreSQL + Redis                      │
   └─────────────────────────────────────────────────────┘
```

## Index des prompts

### Microservices (Backend)

| # | Service | Fichier | Description |
|---|---------|---------|-------------|
| 01 | Actor Auth | [`01-actor-auth-service.md`](microservices/01-actor-auth-service.md) | Authentification, multi-tenant, RBAC, 2FA, API keys |
| 02 | Actor CallCenter | [`02-actor-callcenter-service.md`](microservices/02-actor-callcenter-service.md) | Centre d'appels cloud, VoIP/WebRTC, IVR, ACD, dialers |
| 03 | Actor SMS | [`03-actor-sms-service.md`](microservices/03-actor-sms-service.md) | SMS marketing, SMPP, campagnes, DLR, HLR |
| 04 | Actor WhatsApp | [`04-actor-whatsapp-service.md`](microservices/04-actor-whatsapp-service.md) | WhatsApp Business API, chatbot IA, broadcasts |
| 05 | Actor Email | [`05-actor-email-service.md`](microservices/05-actor-email-service.md) | Email marketing, SMTP, automatisation, délivrabilité |
| 06 | Actor Gateway | [`06-actor-gateway-service.md`](microservices/06-actor-gateway-service.md) | API Gateway, routage, rate limiting, monitoring |
| 07 | Actor Billing | [`07-actor-billing-service.md`](microservices/07-actor-billing-service.md) | Facturation, abonnements, crédits, Stripe |
| 08 | Actor Analytics | [`08-actor-analytics-service.md`](microservices/08-actor-analytics-service.md) | Reporting, dashboards, KPIs temps réel |
| 09 | Actor CRM | [`09-actor-crm-service.md`](microservices/09-actor-crm-service.md) | Gestion contacts, listes, segments, pipeline |

### Landing Page (Frontend)

| # | Page | Fichier | Description |
|---|------|---------|-------------|
| 01 | Site Vitrine | [`01-landing-page-vitrine.md`](landing-page/01-landing-page-vitrine.md) | Toutes les pages du site vitrine (accueil, services, tarifs, etc.) |

### Infrastructure

| # | Composant | Fichier | Description |
|---|-----------|---------|-------------|
| 01 | Docker | [`01-docker-infrastructure.md`](infrastructure/01-docker-infrastructure.md) | Docker Compose, Dockerfiles, orchestration |
| 02 | CI/CD | [`02-ci-cd-pipeline.md`](infrastructure/02-ci-cd-pipeline.md) | GitHub Actions, pipelines de déploiement |

## Skills Cursor

Les skills se trouvent dans `.cursor/skills/` :
- `actor-hub-platform.md` - Skill général de la plateforme
- `microservices-architecture.md` - Skill architecture microservices

## Comment utiliser ces prompts

1. **Pour créer un microservice** : Ouvrir le prompt correspondant et le fournir à l'agent IA en contexte
2. **Pour créer le frontend** : Utiliser le prompt landing page + les liens Figma
3. **Pour l'infrastructure** : Utiliser les prompts Docker et CI/CD
4. **Ordre de création recommandé** :
   - Phase 1 : Auth Service + Gateway + Frontend (landing page)
   - Phase 2 : SMS Service + CRM Service
   - Phase 3 : CallCenter Service + Email Service
   - Phase 4 : WhatsApp Service + Analytics Service
   - Phase 5 : Billing Service + Infrastructure CI/CD

## Liens Figma

- **Accueil** : https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/
- **Services** : `?preview-route=%2Fservices`
- **Call Center** : `?preview-route=%2Ffonctionnalites%2Fcall-center`
- **Industries** : `?preview-route=%2Findustries`
- **Tarifs** : `?preview-route=%2Ftarifs`
- **Actualités** : `?preview-route=%2Factualites`
- **À propos** : `?preview-route=%2Fa-propos`
- **Contact** : https://actorhub.figma.site/contact
- **Login** : `?preview-route=%2Flogin`

## Entreprise

**BIAR GROUP AFRICA SARLU**
- Marque : **Actor Hub**
- Slogan : *"Pour vous, on se dépasse."* / *"One platform - Infinite connections"*
- Couleur primaire : `#5906AE` (Violet)
- Couleur accent : `#FF006F` (Rose)
