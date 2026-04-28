# Prompt: Actor Gateway Service - API Gateway & Orchestration

## Contexte
Tu es un développeur senior spécialisé en architecture distribuée et API Gateway. Tu dois créer le microservice **Actor Gateway** qui sert de point d'entrée unique pour toute la plateforme Actor Hub.

## Mission
Créer un API Gateway autonome qui gère le routage, l'authentification, le rate limiting, le load balancing, et l'orchestration des requêtes vers les microservices internes.

## Spécifications techniques

### Stack
- **Runtime** : Node.js 20+ / NestJS ou Express
- **Proxy** : http-proxy-middleware ou custom
- **Rate limiting** : Redis + sliding window
- **Cache** : Redis
- **Monitoring** : Prometheus metrics
- **Logs** : Winston + structured JSON

### Fonctionnalités
```
┌────────────────────────────────────────────────────┐
│                  API Gateway                        │
├────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │   Routing    │  │ Rate Limiting │               │
│  │              │  │ (per tenant) │               │
│  └──────────────┘  └──────────────┘               │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │    Auth      │  │   Caching    │               │
│  │ Middleware   │  │  (Redis)     │               │
│  └──────────────┘  └──────────────┘               │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │   Logging    │  │  Monitoring  │               │
│  │ & Tracing    │  │ (Prometheus) │               │
│  └──────────────┘  └──────────────┘               │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐               │
│  │   CORS       │  │  API Key     │               │
│  │  Handler     │  │ Validation   │               │
│  └──────────────┘  └──────────────┘               │
│                                                     │
└────────────────────────────────────────────────────┘
```

### Configuration de routage
```yaml
routes:
  - path: /api/v1/auth/**
    service: actor-auth
    port: 3001
    rateLimit: 20/minute
    
  - path: /api/v1/calls/**
    service: actor-callcenter
    port: 3002
    rateLimit: 100/minute
    websocket: true
    
  - path: /api/v1/sms/**
    service: actor-sms
    port: 3003
    rateLimit: 500/minute
    
  - path: /api/v1/whatsapp/**
    service: actor-whatsapp
    port: 3004
    rateLimit: 200/minute
    
  - path: /api/v1/email/**
    service: actor-email
    port: 3005
    rateLimit: 100/minute
    
  - path: /api/v1/billing/**
    service: actor-billing
    port: 3006
    rateLimit: 50/minute
    
  - path: /api/v1/analytics/**
    service: actor-analytics
    port: 3007
    rateLimit: 100/minute
    cache: 60s
    
  - path: /api/v1/contacts/**
    service: actor-crm
    port: 3008
    rateLimit: 200/minute
```

### Endpoints propres
```
GET    /health                    # Health check gateway
GET    /ready                     # Readiness (tous les services)
GET    /api/v1/status             # Statut de tous les services
GET    /api/v1/docs               # Documentation agrégée (Swagger)
GET    /metrics                   # Métriques Prometheus
```

### Rate Limiting par plan
```typescript
const RATE_LIMITS = {
  starter: {
    sms: { perMinute: 100, perDay: 5000 },
    whatsapp: { perMinute: 50, perDay: 2000 },
    email: { perMinute: 50, perDay: 5000 },
    calls: { concurrent: 5, perDay: 500 },
    api: { perMinute: 100 },
  },
  pro: {
    sms: { perMinute: 500, perDay: 50000 },
    whatsapp: { perMinute: 200, perDay: 20000 },
    email: { perMinute: 200, perDay: 50000 },
    calls: { concurrent: 25, perDay: 5000 },
    api: { perMinute: 500 },
  },
  enterprise: {
    sms: { perMinute: 2000, perDay: -1 },
    whatsapp: { perMinute: 1000, perDay: -1 },
    email: { perMinute: 1000, perDay: -1 },
    calls: { concurrent: 100, perDay: -1 },
    api: { perMinute: 2000 },
  },
};
```

## Critères d'acceptation
- [ ] Routage dynamique vers tous les microservices
- [ ] Authentification JWT centralisée
- [ ] Validation des API keys
- [ ] Rate limiting par tenant et par plan
- [ ] Cache Redis pour les réponses fréquentes
- [ ] CORS configurable par tenant
- [ ] Circuit breaker pour les services en panne
- [ ] Health checks agrégés
- [ ] Métriques Prometheus
- [ ] Logging structuré avec correlation ID
- [ ] Documentation Swagger agrégée
