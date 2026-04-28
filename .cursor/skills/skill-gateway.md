# Skill : API Gateway – Actor Hub

## Quand utiliser ce skill
Utiliser pour tout travail sur `services/gateway/` :
- Routing des requêtes vers les microservices
- Authentification centralisée (validation JWT)
- Rate limiting par tenant / IP
- CORS, headers de sécurité
- Logging centralisé des requêtes
- Circuit breaker (résilience)
- API versioning

---

## Architecture

```
services/gateway/
├── src/
│   ├── server.ts                    # Fastify avec plugins
│   ├── plugins/
│   │   ├── auth.plugin.ts           # Validation JWT (appel auth-service)
│   │   ├── ratelimit.plugin.ts      # Rate limiting (Redis)
│   │   ├── cors.plugin.ts
│   │   ├── logging.plugin.ts        # Request/response logging
│   │   └── circuitbreaker.plugin.ts
│   ├── routes/
│   │   └── proxy.routes.ts          # Reverse proxy vers services
│   ├── config/
│   │   ├── services.ts              # Registry des services et leurs URLs
│   │   └── env.ts
│   └── middleware/
│       └── tenant.middleware.ts     # Extraction et injection tenant_id
├── Dockerfile
└── openapi.yaml                     # Spec API unifiée (agrégée)
```

---

## Registry des services

```typescript
// config/services.ts
export const SERVICE_REGISTRY = {
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    prefix: '/api/v1/auth',
    public: ['/auth/login', '/auth/register', '/auth/oauth/*', '/auth/forgot-password', '/auth/reset-password'],
  },
  billing: {
    url: process.env.BILLING_SERVICE_URL || 'http://billing-service:3002',
    prefix: '/api/v1/billing',
    roles: ['admin', 'owner'],
  },
  callCenter: {
    url: process.env.CALL_CENTER_SERVICE_URL || 'http://call-center-service:3003',
    prefix: '/api/v1/call-center',
    roles: ['admin', 'supervisor', 'agent'],
  },
  sms: {
    url: process.env.SMS_SERVICE_URL || 'http://sms-service:3004',
    prefix: '/api/v1/sms',
  },
  voice: {
    url: process.env.VOICE_SERVICE_URL || 'http://voice-service:3005',
    prefix: '/api/v1/voice',
  },
  crm: {
    url: process.env.CRM_SERVICE_URL || 'http://crm-service:3006',
    prefix: '/api/v1/crm',
  },
  messaging: {
    url: process.env.MESSAGING_SERVICE_URL || 'http://messaging-service:3007',
    prefix: '/api/v1/messaging',
  },
  analytics: {
    url: process.env.ANALYTICS_SERVICE_URL || 'http://analytics-service:3008',
    prefix: '/api/v1/analytics',
    roles: ['admin', 'supervisor'],
  },
  tenant: {
    url: process.env.TENANT_SERVICE_URL || 'http://tenant-service:3009',
    prefix: '/api/v1/tenant',
  },
}
```

---

## Rate Limiting

```typescript
// Rate limits par plan
const RATE_LIMITS = {
  starter: {
    windowMs: 60_000,        // 1 minute
    max: 100,                // requêtes
  },
  pro: {
    windowMs: 60_000,
    max: 500,
  },
  enterprise: {
    windowMs: 60_000,
    max: 2000,
  },
  public: {               // Routes non authentifiées
    windowMs: 60_000,
    max: 20,
  },
}
```

---

## Variables d'environnement

```typescript
PORT=3000
AUTH_SERVICE_URL=http://auth-service:3001
BILLING_SERVICE_URL=http://billing-service:3002
CALL_CENTER_SERVICE_URL=http://call-center-service:3003
SMS_SERVICE_URL=http://sms-service:3004
VOICE_SERVICE_URL=http://voice-service:3005
CRM_SERVICE_URL=http://crm-service:3006
MESSAGING_SERVICE_URL=http://messaging-service:3007
ANALYTICS_SERVICE_URL=http://analytics-service:3008
TENANT_SERVICE_URL=http://tenant-service:3009
REDIS_URL=redis://localhost:6379
JWT_SECRET=<same-as-auth-service>
CORS_ORIGINS=https://app.actorhub.io,https://actorhub.io
```

---

## Checklist avant PR

- [ ] Toutes les routes publiques listées dans le registry (pas de faille d'accès)
- [ ] JWT validé sur toutes les routes protégées (sans appel auth-service en prod — vérification locale)
- [ ] tenant_id injecté dans les headers avant proxy (`X-Tenant-Id`)
- [ ] Circuit breaker : 5 échecs → ouverture, retry après 30s
- [ ] Rate limit : headers `X-RateLimit-*` retournés au client
- [ ] Logs structurés (JSON) avec request_id tracé de bout en bout
