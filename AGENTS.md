# Actor Hub – Plateforme SaaS & CPaaS – AGENTS.md

## Vue d'ensemble du projet

**Actor Hub** (Biar Group) est une plateforme SaaS & CPaaS multi-tenant, multi-microservices.  
Chaque solution est **autonome** et peut être déployée indépendamment ou en bundle.

---

## Architecture générale

```
actor-hub/
├── apps/                        # Frontends Next.js (App Router)
│   ├── landing/                 # Site public / marketing
│   ├── dashboard/               # Portail client SaaS
│   ├── admin/                   # Back-office opérateur
│   └── docs/                    # Documentation produit
│
├── services/                    # Microservices Node.js / Python
│   ├── auth-service/            # Auth & IAM (OAuth2, JWT, SSO)
│   ├── billing-service/         # Facturation, abonnements, Stripe
│   ├── call-center-service/     # CPaaS : SVI, ACD, enregistrement, IVR
│   ├── sms-service/             # CPaaS : SMS A2P, OTP, campagnes
│   ├── voice-service/           # CPaaS : appels SIP, click-to-call
│   ├── messaging-service/       # CPaaS : WhatsApp, RCS, email
│   ├── analytics-service/       # Rapports, KPIs, tableaux de bord
│   ├── crm-service/             # CRM intégré (contacts, tickets)
│   ├── notification-service/    # Alertes push, webhooks
│   ├── tenant-service/          # Gestion multi-tenant, orgs, équipes
│   └── gateway/                 # API Gateway (Kong / custom)
│
├── packages/                    # Libs partagées (monorepo)
│   ├── ui/                      # Composants React (shadcn/ui)
│   ├── api-client/              # SDK TypeScript généré (openapi)
│   ├── config/                  # ESLint, TypeScript, Tailwind base
│   └── types/                   # Types partagés (Zod)
│
├── infra/                       # IaC (Terraform / Bicep)
│   ├── k8s/                     # Manifests Kubernetes
│   ├── docker/                  # Dockerfiles & docker-compose
│   └── ci/                      # GitHub Actions workflows
│
├── .cursor/
│   └── skills/                  # Skills Cursor Cloud Agent
│
└── prompts/                     # Prompts de génération IA
```

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js (Fastify) + Python (FastAPI) selon microservice |
| Temps réel | WebSocket (Socket.IO), gRPC inter-services |
| Base de données | PostgreSQL (Supabase), Redis (cache/queues), MongoDB (logs) |
| Message broker | RabbitMQ / Kafka |
| Auth | OAuth2 / OIDC, JWT, Auth.js |
| Téléphonie | Asterisk / FreeSWITCH, WebRTC, STIR/SHAKEN |
| SMS / Messaging | Twilio, Vonage, ou direct SMPP |
| Infra | Docker, Kubernetes (AKS/GKE), Terraform |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus, Grafana, OpenTelemetry |

---

## Skills disponibles

| Fichier | Usage |
|---------|-------|
| `.cursor/skills/skill-landing.md` | Générer / modifier le site landing |
| `.cursor/skills/skill-auth.md` | Auth-service (OAuth2, MFA, SSO) |
| `.cursor/skills/skill-call-center.md` | Call-center-service (SVI, ACD, IVR, WebRTC) |
| `.cursor/skills/skill-sms.md` | SMS-service (A2P, OTP, campagnes) |
| `.cursor/skills/skill-voice.md` | Voice-service (SIP, click-to-call) |
| `.cursor/skills/skill-messaging.md` | Messaging-service (WhatsApp, RCS, email) |
| `.cursor/skills/skill-billing.md` | Billing-service (Stripe, abonnements, usage-based) |
| `.cursor/skills/skill-analytics.md` | Analytics-service (KPIs, rapports, dashboards) |
| `.cursor/skills/skill-crm.md` | CRM-service (contacts, tickets, pipelines) |
| `.cursor/skills/skill-tenant.md` | Tenant-service (multi-tenant, RBAC, orgs) |
| `.cursor/skills/skill-gateway.md` | API Gateway (routing, rate-limit, auth) |
| `.cursor/skills/skill-infra.md` | Infra / DevOps (Docker, K8s, Terraform, CI/CD) |
| `.cursor/skills/skill-ui-components.md` | Composants UI partagés (shadcn/ui, design system) |

---

## Règles de développement

1. **Chaque microservice est autonome** : il a son propre `package.json`, sa propre DB, son propre Dockerfile.
2. **Communication inter-services** : via events (RabbitMQ/Kafka) ou gRPC (jamais d'imports directs).
3. **Multi-tenant par défaut** : toute donnée inclut `tenant_id`.
4. **API-first** : chaque service expose une API REST + OpenAPI spec.
5. **Tests obligatoires** : unit + integration avant tout merge.
6. **Secrets** : toujours via variables d'environnement ou Vault, jamais dans le code.
7. **Internationalisation** : FR / EN minimum sur le frontend.

---

## Environnement de développement

```bash
# Prérequis : Node.js 20+, pnpm, Docker, kubectl

# Installer les dépendances
pnpm install

# Lancer l'infrastructure locale
docker-compose -f infra/docker/docker-compose.dev.yml up -d

# Lancer tous les services
pnpm dev

# Lancer un service spécifique
pnpm --filter @actor-hub/call-center-service dev

# Tests
pnpm test
pnpm lint
```

---

## Cursor Cloud – Instructions spécifiques

- Utiliser les **skills** correspondant au microservice avant de générer du code.
- Lire les **prompts** dans `prompts/` avant de créer un nouveau module.
- Toujours créer une branche `cursor/<feature>-277b` pour chaque tâche.
- Valider le lint (`pnpm lint`) et les tests (`pnpm test`) avant de créer la PR.
- Pour les changements UI, utiliser le `computerUse` subagent pour tester visuellement.
