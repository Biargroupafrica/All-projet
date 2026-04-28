# Prompt — Architecture Microservices Actor Hub

## Objectif

Définir l'architecture technique complète de la plateforme Actor Hub en tant que **système de microservices autonomes** où chaque solution (Call Center, SMS, WhatsApp, Email) peut être déployée et vendue indépendamment.

---

## Principes d'architecture

### 1. Autonomie des microservices (chaque service est indépendant)

Chaque microservice :
- A sa propre **base de données** (pas de base partagée)
- A sa propre **API REST** documentée (OpenAPI 3.0)
- A son propre **Dockerfile**
- Peut démarrer et fonctionner sans les autres services
- Communique via **messagerie asynchrone** (RabbitMQ / Kafka) pour les événements cross-services

### 2. Communication inter-services

```
Synchrone (HTTP/REST)   → Authentification uniquement (auth service)
Asynchrone (Message Bus) → Tous les autres événements cross-services

Exemples d'événements asynchrones :
- tenant.created        → Tous les services créent leur profil tenant
- user.created          → Call Center crée le profil agent
- call.ended            → Billing déduit les crédits voix
- sms.delivered         → Billing déduit les crédits SMS
- invoice.paid          → Activation des services tenant
```

### 3. API Gateway

Un seul point d'entrée public :

```
INTERNET → API Gateway (port 443)
              ├── /auth/*        → Auth Service (3001)
              ├── /call/*        → Call Center Service (3002)
              ├── /sms/*         → SMS Service (3003)
              ├── /whatsapp/*    → WhatsApp Service (3004)
              ├── /email/*       → Email Service (3005)
              ├── /billing/*     → Billing Service (3006)
              ├── /admin/*       → Admin Service (3000)
              └── /              → Frontend (React SPA)
```

---

## Diagramme d'architecture global

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  CDN + Load Balancer │
                    │  (CloudFront / nginx) │
                    └─────────┬────────────┘
                              │
              ┌───────────────▼────────────────┐
              │         API Gateway              │
              │   (Kong / Nginx / Traefik)       │
              │   - Rate limiting                │
              │   - JWT validation               │
              │   - Routing                      │
              └──┬──────┬──────┬──────┬──────┬──┘
                 │      │      │      │      │
         ┌───────┘   ┌──┘   ┌──┘   ┌──┘   ┌─┘
         ▼           ▼      ▼      ▼      ▼
    ┌─────────┐ ┌────────┐ ┌────┐ ┌────┐ ┌─────────┐
    │  Auth   │ │  Call  │ │SMS │ │ WA │ │  Email  │
    │Service  │ │Center  │ │Svc │ │Svc │ │Service  │
    │ :3001   │ │ :3002  │ │:3003│ │:3004│ │ :3005  │
    └────┬────┘ └───┬────┘ └─┬──┘ └─┬──┘ └────┬────┘
         │          │        │      │           │
         └──────────┴────────┴──────┴───────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Message Bus       │
                    │  (RabbitMQ / Kafka) │
                    └─────────┬──────────┘
                              │
              ┌───────────────┴────────────────┐
              │         Billing Service          │
              │            :3006                 │
              └────────────────────────────────┘
```

---

## Stack technique par couche

### Infrastructure
```yaml
Container: Docker + Docker Compose (dev) / Kubernetes (prod)
Service Mesh: Istio (optionnel pour prod)
API Gateway: Kong ou nginx
Message Bus: RabbitMQ (simple) ou Apache Kafka (haute volumétrie)
Service Discovery: Consul ou Kubernetes DNS
```

### Base de données par service
```yaml
Auth Service:       PostgreSQL + Redis (sessions)
Call Center:        PostgreSQL + Redis (état temps réel) + InfluxDB (métriques)
SMS Service:        PostgreSQL + Redis (queue) + ClickHouse (analytics)
WhatsApp Service:   PostgreSQL + Redis + MongoDB (conversations)
Email Service:      PostgreSQL + Redis
Billing Service:    PostgreSQL (ACID impératif)
```

### Observabilité
```yaml
Logs:    ELK Stack (Elasticsearch + Logstash + Kibana) ou Loki + Grafana
Metrics: Prometheus + Grafana
Tracing: Jaeger ou Zipkin (distributed tracing)
APM:     Datadog ou New Relic (optionnel)
```

---

## Fichiers de configuration requis par service

### docker-compose.yml (développement)

```yaml
version: '3.9'

services:
  # Databases
  postgres-auth:
    image: postgres:16
    environment:
      POSTGRES_DB: actor_auth
      POSTGRES_USER: actor
      POSTGRES_PASSWORD: dev_password
    ports: ["5432:5432"]

  postgres-sms:
    image: postgres:16
    environment:
      POSTGRES_DB: actor_sms
    ports: ["5433:5432"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  rabbitmq:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]

  # Services
  auth-service:
    build: ./services/auth
    env_file: ./services/auth/.env
    ports: ["3001:3001"]
    depends_on: [postgres-auth, redis]

  sms-service:
    build: ./services/bulk-sms
    env_file: ./services/bulk-sms/.env
    ports: ["3003:3003"]
    depends_on: [postgres-sms, redis, rabbitmq]

  # Frontend
  frontend:
    build: ./frontend
    ports: ["3000:80"]
```

---

## Structure du monorepo

```
actor-hub/
├── services/
│   ├── auth/                    # Microservice Auth
│   │   ├── src/
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   ├── openapi.yaml
│   │   └── package.json
│   ├── call-center/             # Microservice Call Center
│   ├── bulk-sms/                # Microservice SMS
│   ├── whatsapp/                # Microservice WhatsApp
│   ├── emailing/                # Microservice Email
│   └── billing/                 # Microservice Facturation
├── shared/
│   ├── types/                   # Types TypeScript partagés
│   │   ├── tenant.ts
│   │   ├── user.ts
│   │   └── events.ts            # Types des événements message bus
│   ├── utils/
│   │   ├── logger.ts            # Logger standardisé
│   │   ├── validator.ts         # Schémas Zod communs
│   │   └── circuit-breaker.ts   # Circuit breaker
│   └── middleware/
│       ├── auth.middleware.ts   # Vérification JWT (partagée)
│       └── tenant.middleware.ts  # Résolution tenant
├── frontend/                    # Application React (vitrine + dashboard)
│   └── src/app/                 # Code source Figma Make
├── api-gateway/                 # Configuration nginx/Kong
├── infrastructure/
│   ├── docker-compose.yml       # Dev
│   ├── docker-compose.prod.yml  # Prod
│   └── k8s/                     # Kubernetes manifests
├── docs/
│   ├── architecture.md
│   ├── api/                     # Specs OpenAPI par service
│   └── runbooks/                # Procédures opérationnelles
└── package.json                 # Workspace root (pnpm workspaces)
```

---

## Événements Message Bus (contrats entre services)

```typescript
// shared/types/events.ts

// Tenant
export type TenantCreated = {
  type: 'tenant.created';
  tenantId: string;
  plan: 'starter' | 'business' | 'enterprise';
  modules: string[];
};

export type TenantSuspended = {
  type: 'tenant.suspended';
  tenantId: string;
  reason: string;
};

// Billing
export type CreditConsumed = {
  type: 'credit.consumed';
  tenantId: string;
  module: 'sms' | 'voice' | 'whatsapp' | 'email';
  amount: number;
  reference: string;
};

export type CreditLow = {
  type: 'credit.low';
  tenantId: string;
  module: string;
  remainingCredits: number;
};

// Communication Events
export type SmsSent = {
  type: 'sms.sent';
  tenantId: string;
  messageId: string;
  to: string;
  cost: number;
};

export type CallEnded = {
  type: 'call.ended';
  tenantId: string;
  callId: string;
  duration: number;        // en secondes
  cost: number;            // en crédits
};
```

---

## Déploiement — Environnements

| Environnement | Description | Base de données |
|---|---|---|
| `development` | Local dev, Docker Compose | PostgreSQL local |
| `staging` | Pré-production, identique à prod | PostgreSQL staging |
| `production` | Infra cloud (AWS/OVH/GCP) | RDS PostgreSQL + Redis ElastiCache |

### Variables d'environnement communes

```env
# Environnement
NODE_ENV=production

# Auth Service URL (utilisée par tous les services pour valider les JWT)
AUTH_SERVICE_URL=http://auth-service:3001

# Message Bus
RABBITMQ_URL=amqp://actor:password@rabbitmq:5672
RABBITMQ_EXCHANGE=actor_events

# Tracing
JAEGER_ENDPOINT=http://jaeger:14268/api/traces
SERVICE_NAME=actor-sms-service  # Changer par service

# Observabilité
LOG_LEVEL=info
LOG_FORMAT=json
```

---

## Checklist de qualité pour chaque microservice

- [ ] API documentée avec OpenAPI 3.0 (`openapi.yaml`)
- [ ] Dockerfile présent et optimisé (multi-stage build)
- [ ] `.env.example` complet avec toutes les variables
- [ ] Tests unitaires (>70% de couverture)
- [ ] Tests d'intégration (endpoints critiques)
- [ ] Health check endpoint (`GET /health`)
- [ ] Graceful shutdown implémenté
- [ ] Circuit breaker sur les appels externes
- [ ] Rate limiting (protection contre les abus)
- [ ] Logging structuré (JSON) avec correlation ID
- [ ] Métriques Prometheus exposées (`GET /metrics`)
- [ ] README avec instructions de démarrage rapide
