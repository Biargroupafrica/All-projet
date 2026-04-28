# Prompt : API Gateway & Service Mesh (Infrastructure)

## Objectif

Créer l'API Gateway central qui route les requêtes vers les microservices, gère l'authentification, le rate limiting, et la documentation unifiée.

## Prompt de création

```
Tu es un architecte logiciel senior spécialisé en architectures microservices et API Gateway.

Crée l'API Gateway "Actor Gateway" — le point d'entrée unique pour tous les microservices de la plateforme Actor Hub.

### Architecture

Nom : actor-gateway
Port : 8080
Type : API Gateway / Reverse Proxy

### Structure du projet

actor-gateway/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── gateway.config.ts            # Routes vers microservices
│   │   ├── rate-limit.config.ts
│   │   ├── cors.config.ts
│   │   └── environment.ts
│   ├── routes/
│   │   ├── auth.routes.ts               # → actor-auth-service:3000
│   │   ├── callcenter.routes.ts         # → actor-callcenter-service:3001
│   │   ├── sms.routes.ts               # → actor-sms-service:3002
│   │   ├── whatsapp.routes.ts          # → actor-whatsapp-service:3003
│   │   ├── email.routes.ts             # → actor-email-service:3004
│   │   └── health.routes.ts            # Health checks
│   ├── middleware/
│   │   ├── auth.middleware.ts           # Validation JWT
│   │   ├── tenant.middleware.ts         # Résolution tenant
│   │   ├── rate-limit.middleware.ts     # Rate limiting
│   │   ├── request-id.middleware.ts     # Traçabilité
│   │   ├── logging.middleware.ts        # Logs structurés
│   │   └── cors.middleware.ts
│   ├── proxy/
│   │   ├── proxy.service.ts             # Service de proxy
│   │   ├── load-balancer.service.ts     # Load balancing
│   │   └── circuit-breaker.service.ts   # Circuit breaker
│   ├── health/
│   │   ├── health.controller.ts
│   │   └── health.service.ts            # Health checks services
│   └── docs/
│       └── swagger-aggregator.ts        # OpenAPI unifié
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml               # Tous les services
├── docs/
│   └── openapi-unified.yaml
├── nginx/
│   └── nginx.conf                       # Config Nginx (production)
├── package.json
└── README.md

### Routing

/api/v1/auth/*       → actor-auth-service:3000
/api/v1/calls/*      → actor-callcenter-service:3001
/api/v1/agents/*     → actor-callcenter-service:3001
/api/v1/queues/*     → actor-callcenter-service:3001
/api/v1/ivr/*        → actor-callcenter-service:3001
/api/v1/sms/*        → actor-sms-service:3002
/api/v1/campaigns/*  → routage dynamique selon type
/api/v1/contacts/*   → routage dynamique selon module
/api/v1/whatsapp/*   → actor-whatsapp-service:3003
/api/v1/email/*      → actor-email-service:3004
/api/v1/health       → health checks agrégés

### Fonctionnalités

1. Reverse proxy vers tous les microservices
2. Validation JWT centralisée
3. Résolution multi-tenant (header x-tenant-id ou sous-domaine)
4. Rate limiting par tenant/plan
5. Circuit breaker (résilience)
6. Request ID pour traçabilité distribuée
7. Logs structurés (JSON)
8. CORS configuré par domaine
9. Health checks agrégés
10. Documentation OpenAPI unifiée

### Variables d'environnement

GATEWAY_PORT=8080
AUTH_SERVICE_URL=http://actor-auth-service:3000
CALLCENTER_SERVICE_URL=http://actor-callcenter-service:3001
SMS_SERVICE_URL=http://actor-sms-service:3002
WHATSAPP_SERVICE_URL=http://actor-whatsapp-service:3003
EMAIL_SERVICE_URL=http://actor-email-service:3004
JWT_SECRET=...
RATE_LIMIT_STARTER=100/min
RATE_LIMIT_PRO=500/min
RATE_LIMIT_ENTERPRISE=2000/min
CORS_ORIGINS=https://actorhub.com
```

## Critères d'acceptation

- [ ] Le gateway route correctement vers chaque microservice
- [ ] La validation JWT est centralisée
- [ ] Le rate limiting respecte les limites par plan
- [ ] Le circuit breaker se déclenche en cas de panne d'un service
- [ ] Les health checks détectent les services down
- [ ] La documentation OpenAPI est agrégée et accessible
