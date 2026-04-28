# AGENTS.md — ACTOR Hub · Plateforme SaaS & CPaaS

## Contexte Projet

**Plateforme :** ACTOR Hub by BIAR GROUP AFRICA SARLU  
**Tagline :** "One platform - Infinite connections"  
**Nature :** Plateforme de communication unifiée Cloud (SaaS + CPaaS) avec microservices autonomes  
**Cible :** PME, Grandes Entreprises, Opérateurs Télécom, ONG, Individus — 190+ pays, focus Afrique  

## Architecture Globale

La plateforme est construite en **microservices autonomes** : chaque solution peut être déployée, vendue et opérée indépendamment ou en combinaison avec les autres.

```
actor-hub/
├── apps/
│   ├── landing/          # Next.js — site vitrine public
│   ├── dashboard/        # Next.js — espace client unifié
│   ├── admin/            # Next.js — backoffice opérateur
│   └── docs/             # Documentation API publique
├── services/
│   ├── auth-service/     # Authentification & SSO (Node/Fastify)
│   ├── sms-service/      # SMS Bulk, SMPP, Two-Way (Node/Fastify)
│   ├── email-service/    # Email Marketing & SMTP (Node/Fastify)
│   ├── whatsapp-service/ # WhatsApp Business API (Node/Fastify)
│   ├── callcenter-service/ # Centre d'Appels WebRTC (Node/Fastify)
│   ├── billing-service/  # Facturation, crédits, abonnements (Node/Fastify)
│   ├── contacts-service/ # Gestion des contacts & segmentation (Node/Fastify)
│   ├── analytics-service/# Rapports & tableaux de bord (Node/Fastify)
│   ├── notification-service/ # Notifications temps réel (Node/Fastify)
│   └── ai-service/       # IA, chatbots, transcription, sentiment (Python/FastAPI)
├── packages/
│   ├── ui/               # Design system partagé (React + Tailwind)
│   ├── sdk-js/           # SDK JavaScript public
│   ├── sdk-python/       # SDK Python public
│   └── config/           # Configuration partagée (ESLint, TS, etc.)
├── infra/
│   ├── terraform/        # Infrastructure as Code
│   ├── kubernetes/       # Manifestes K8s + Helm Charts
│   ├── docker/           # Dockerfiles par service
│   └── ci-cd/            # GitHub Actions workflows
└── docs/
    ├── api/              # OpenAPI specs par service
    ├── architecture/     # Diagrammes et ADRs
    └── skills/           # Fichiers de skills agents (ce dossier)
```

## Stack Technique

### Frontend
- **Framework :** Next.js 14+ (App Router)
- **Styling :** Tailwind CSS + shadcn/ui
- **State :** Zustand + React Query (TanStack)
- **i18n :** next-intl (10 langues : FR, EN, ES, AR, PT, DE, ZH, RU, SW, AM)
- **Icônes :** Lucide React
- **Animations :** Framer Motion

### Backend (Microservices)
- **Runtime :** Node.js 20 LTS (services API) + Python 3.11 (IA)
- **Framework :** Fastify (Node) / FastAPI (Python)
- **Messaging :** RabbitMQ / Apache Kafka
- **Cache :** Redis
- **DB principale :** PostgreSQL (par service — isolation stricte)
- **DB documents :** MongoDB (logs, analytics, contacts)
- **Search :** Elasticsearch
- **File storage :** MinIO (S3-compatible)

### Infrastructure
- **Container :** Docker + Kubernetes (K8s)
- **Cloud :** AWS (primaire) + Azure (secondaire) + GCP (IA/ML)
- **IaC :** Terraform
- **CI/CD :** GitHub Actions
- **Monitoring :** Prometheus + Grafana + Loki
- **APM :** OpenTelemetry
- **Gateway API :** Kong ou AWS API Gateway

### Communication Temps Réel
- **WebRTC :** mediasoup / FreeSWITCH pour le Call Center
- **WebSocket :** Socket.io pour la supervision en temps réel
- **SSE :** Server-Sent Events pour les notifications

## Microservices — Vue Détaillée

### 1. auth-service
- JWT + Refresh tokens
- OAuth2 / SSO (Google, Microsoft)
- RBAC (rôles : admin, agent, supervisor, manager, client)
- 2FA (TOTP, SMS)
- Multi-tenant (isolation par organisation)

### 2. sms-service
- SMPP v3.4 direct opérateurs
- REST API pour envoi simple
- SMS Bulk avec planification
- Two-Way (numéros virtuels dédiés)
- Webhooks pour accusés de réception
- 800+ opérateurs, 190 pays

### 3. email-service
- SMTP dédié par client
- Éditeur Drag & Drop (templates JSON)
- Automation (séquences, triggers)
- A/B Testing
- Analytics (opens, clicks, bounces)
- Délivrabilité 99.5% (SPF, DKIM, DMARC)

### 4. whatsapp-service
- WhatsApp Business API officielle (Meta Cloud API)
- Chatbot IA (intégration ai-service)
- Broadcast & Campagnes
- Multi-comptes & Multi-agents
- Templates approuvés Meta
- Conversations Two-Way

### 5. callcenter-service
- Softphone WebRTC (navigateur, sans plugin)
- IVR Visuel (workflow builder drag & drop)
- ACD (Automatic Call Distribution)
- Dialers : Power, Predictive, Progressive, Preview
- Supervision temps réel (écoute, chuchotement, double-écoute)
- Enregistrement + Transcription (via ai-service)
- Analyse sentiment temps réel
- Queue management avancé
- SVI/DTMF + Synthèse vocale TTS

### 6. billing-service
- Abonnements récurrents (Stripe / Flutterwave / CinetPay)
- Crédits prépayés
- Facturation à l'usage (métriques par service)
- Dépassement de quota (alertes + bloquage configurable)
- Multi-devises (EUR, USD, XAF, XOF, NGN, etc.)
- Devis & contrats Enterprise

### 7. contacts-service
- Import CSV/Excel
- Segmentation dynamique & statique
- Champs personnalisés
- Opt-in / Opt-out management
- Conformité RGPD (droit à l'oubli, export)
- Déduplication

### 8. analytics-service
- KPIs temps réel par canal
- Rapports personnalisables
- Export CSV/PDF
- Tableaux de bord par rôle
- Agrégation des métriques multi-services

### 9. notification-service
- Notifications in-app (WebSocket)
- Email de système
- Alertes seuils & anomalies
- Notifications push (PWA)

### 10. ai-service (Python/FastAPI)
- Transcription audio → texte (Whisper)
- Analyse sentiment (Transformers)
- Chatbot NLP (intentions, entités)
- Résumé automatique d'appels
- Détection de langue

## Design System

### Couleurs
```
Primary   : blue-600 (#2563eb) → indigo-600 (#4f46e5)
Secondary : cyan-500 (#06b6d4)
Accent    : purple-600, pink-500, green-500, orange-500
Neutral   : gray-50 → gray-900
Success   : green-500
Warning   : amber-500
Error     : red-500
```

### Typographie
- Police principale : Inter (Google Fonts)
- Headings : font-bold, text-4xl à text-6xl
- Body : text-base à text-xl, text-gray-600
- Muted : text-gray-500

### Composants clés
- Cards : white bg, shadow-lg, rounded-2xl
- Buttons : gradient fills (blue→indigo) ou outline
- Badges : colored pills avec icônes Lucide
- Formulaires : labels flottants, validation temps réel

## Instructions pour les Agents de Coding

### Règles générales
1. Toujours utiliser TypeScript strict (`.tsx`, `.ts`)
2. Jamais de `any` — utiliser des types explicites
3. Chaque microservice a sa propre base de données (pas de base partagée)
4. Chaque microservice expose une API REST + des événements Kafka/RabbitMQ
5. Chaque microservice doit pouvoir tourner de façon autonome avec Docker Compose
6. Utiliser des variables d'environnement pour toute configuration sensible
7. Internationalisation obligatoire (10 langues) pour le frontend
8. Tests unitaires obligatoires (vitest pour TS, pytest pour Python)
9. OpenAPI spec (`openapi.yaml`) obligatoire pour chaque service backend

### Conventions de nommage
- Fichiers React : PascalCase (`HeroSection.tsx`)
- Hooks : camelCase préfixé `use` (`useCallCenter.ts`)
- Services backend : kebab-case (`sms-service/`)
- Variables d'env : SCREAMING_SNAKE_CASE (`SMPP_HOST`, `JWT_SECRET`)
- Tables DB : snake_case pluriel (`sms_messages`, `call_recordings`)

### Sécurité
- RGPD / GDPR compliance obligatoire
- Chiffrement at-rest (AES-256) et in-transit (TLS 1.3)
- Rate limiting sur toutes les API publiques
- Audit logs pour toutes les actions sensibles
- Isolation multi-tenant stricte (Row-Level Security PostgreSQL)

## Cursor Cloud — Instructions Spécifiques

### Lancer le développement local
```bash
# Tous les services via Docker Compose
docker compose -f infra/docker/docker-compose.dev.yml up

# Landing page seule
cd apps/landing && npm run dev

# Dashboard seul
cd apps/dashboard && npm run dev

# Un microservice seul (ex: sms-service)
cd services/sms-service && npm run dev
```

### Tests
```bash
# Tests unitaires (tous)
npm run test --workspaces

# Tests E2E (landing)
cd apps/landing && npx playwright test

# Lint
npm run lint --workspaces
```

### Variables d'environnement requises
Voir `/infra/docker/.env.example` pour la liste complète.  
Pour Cursor Cloud : configurer les secrets dans Dashboard > Cloud Agents > Secrets.

## Roadmap Phases

- **Phase 1 (actuelle) :** Landing page publique + Auth + SMS + Email
- **Phase 2 :** WhatsApp Business + Call Center (base)
- **Phase 3 :** Call Center avancé (dialers, supervision) + IA
- **Phase 4 :** Analytics avancés + Marketplace intégrations
- **Phase 5 :** SDK publics + Programme partenaires + White-label
