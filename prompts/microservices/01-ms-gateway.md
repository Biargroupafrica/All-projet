# Prompt: ms-gateway - API Gateway & Load Balancer

## Rôle
Tu es un développeur backend senior spécialisé en API Gateway. Tu dois créer le microservice `ms-gateway` pour la plateforme Actor Hub (SaaS/CPaaS de Biar Group Africa).

## Mission
Créer l'API Gateway qui sert de point d'entrée unique pour tous les microservices de la plateforme. Il gère le routage, l'authentification, le rate limiting et le load balancing.

## Spécifications techniques

### Stack
- **Framework:** Express.js ou Hono avec http-proxy-middleware
- **Port:** 8000
- **Base de données:** Redis (cache, rate limiting, sessions)

### Fonctionnalités requises

1. **Reverse Proxy & Routage**
   - Routage vers chaque microservice selon le prefix URL
   - `/api/v1/auth/*` → ms-auth (8001)
   - `/api/v1/tenants/*` → ms-tenant (8002)
   - `/api/v1/calls/*` → ms-call-center (8003)
   - `/api/v1/sms/*` → ms-sms (8004)
   - `/api/v1/emails/*` → ms-email (8005)
   - `/api/v1/whatsapp/*` → ms-whatsapp (8006)
   - `/api/v1/contacts/*` → ms-contacts (8007)
   - `/api/v1/billing/*` → ms-billing (8008)
   - `/api/v1/analytics/*` → ms-analytics (8009)
   - `/api/v1/notifications/*` → ms-notification (8010)

2. **Authentification Middleware**
   - Vérification JWT sur chaque requête (sauf routes publiques)
   - Extraction du `tenant_id` depuis le token
   - Injection des headers `X-Tenant-Id`, `X-User-Id`, `X-User-Role`

3. **Rate Limiting**
   - Rate limiting par tenant (ex: 1000 req/min pour Starter, 10000 pour Enterprise)
   - Rate limiting par IP pour les routes publiques
   - Sliding window algorithm avec Redis

4. **CORS**
   - Configuration CORS dynamique par tenant (domaines autorisés)

5. **Health Check**
   - Endpoint `/health` qui vérifie la santé de chaque microservice
   - Circuit breaker: si un service est down, retourner 503

6. **Logging & Metrics**
   - Log de chaque requête (method, path, status, duration)
   - Métriques Prometheus-compatible

7. **API Versioning**
   - Support `/api/v1/`, `/api/v2/` etc.

8. **Request/Response Transformation**
   - Ajout de headers de sécurité (HSTS, X-Frame-Options, etc.)
   - Compression gzip/brotli

### Structure du projet
```
ms-gateway/
├── src/
│   ├── index.ts
│   ├── config/
│   │   ├── routes.ts          # Configuration du routage
│   │   └── services.ts        # Registry des microservices
│   ├── middlewares/
│   │   ├── auth.ts            # JWT verification
│   │   ├── rate-limiter.ts    # Rate limiting Redis
│   │   ├── cors.ts            # CORS dynamique
│   │   ├── logger.ts          # Request logging
│   │   ├── circuit-breaker.ts # Circuit breaker pattern
│   │   └── security.ts        # Security headers
│   ├── proxy/
│   │   └── service-proxy.ts   # Proxy configuration
│   └── health/
│       └── health-check.ts    # Health endpoint
├── tests/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

### Variables d'environnement
```env
PORT=8000
NODE_ENV=production
JWT_SECRET=xxx
REDIS_URL=redis://localhost:6379
MS_AUTH_URL=http://ms-auth:8001
MS_TENANT_URL=http://ms-tenant:8002
MS_CALLCENTER_URL=http://ms-call-center:8003
MS_SMS_URL=http://ms-sms:8004
MS_EMAIL_URL=http://ms-email:8005
MS_WHATSAPP_URL=http://ms-whatsapp:8006
MS_CONTACTS_URL=http://ms-contacts:8007
MS_BILLING_URL=http://ms-billing:8008
MS_ANALYTICS_URL=http://ms-analytics:8009
MS_NOTIFICATION_URL=http://ms-notification:8010
```

## Contraintes
- Temps de réponse du gateway < 10ms (overhead)
- Support 10 000 requêtes/seconde minimum
- Pas de state local (tout dans Redis)
- Logs structurés en JSON
- Docker-ready
