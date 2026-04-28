# Prompt: Infrastructure Docker & Docker Compose

## Contexte
Tu es un ingénieur DevOps/SRE senior. Tu dois créer l'infrastructure Docker pour l'ensemble de la plateforme Actor Hub, permettant de lancer tous les microservices en local ou en staging avec une seule commande.

## Mission
Créer les fichiers Docker et Docker Compose pour orchestrer tous les microservices, bases de données, et services annexes.

## Structure des fichiers
```
infrastructure/
├── docker-compose.yml           # Composition complète
├── docker-compose.dev.yml       # Override pour dev local
├── docker-compose.staging.yml   # Override pour staging
├── .env.example                 # Variables d'environnement
├── nginx/
│   └── nginx.conf               # Reverse proxy / API Gateway
├── services/
│   ├── actor-auth/
│   │   └── Dockerfile
│   ├── actor-callcenter/
│   │   └── Dockerfile
│   ├── actor-sms/
│   │   └── Dockerfile
│   ├── actor-whatsapp/
│   │   └── Dockerfile
│   ├── actor-email/
│   │   └── Dockerfile
│   ├── actor-gateway/
│   │   └── Dockerfile
│   ├── actor-billing/
│   │   └── Dockerfile
│   ├── actor-analytics/
│   │   └── Dockerfile
│   ├── actor-crm/
│   │   └── Dockerfile
│   └── actor-frontend/
│       └── Dockerfile
└── scripts/
    ├── init-db.sh               # Initialisation des schémas DB
    ├── seed-data.sh             # Données de test
    └── health-check.sh          # Vérification santé
```

## docker-compose.yml
```yaml
version: '3.9'

services:
  # --- Bases de données ---
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: actorhub
      POSTGRES_USER: actorhub
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sh:/docker-entrypoint-initdb.d/init.sh
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U actorhub"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  # --- Microservices ---
  actor-gateway:
    build: ./services/actor-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=3000
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      redis:
        condition: service_healthy

  actor-auth:
    build: ./services/actor-auth
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=3001
      - DATABASE_URL=postgresql://actorhub:${DB_PASSWORD}@postgres:5432/actorhub?schema=auth
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  actor-callcenter:
    build: ./services/actor-callcenter
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=3002
      - DATABASE_URL=postgresql://actorhub:${DB_PASSWORD}@postgres:5432/actorhub?schema=callcenter
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  actor-sms:
    build: ./services/actor-sms
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=3003
      - DATABASE_URL=postgresql://actorhub:${DB_PASSWORD}@postgres:5432/actorhub?schema=sms
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  actor-whatsapp:
    build: ./services/actor-whatsapp
    ports:
      - "3004:3004"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=3004
      - DATABASE_URL=postgresql://actorhub:${DB_PASSWORD}@postgres:5432/actorhub?schema=whatsapp
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - WHATSAPP_API_TOKEN=${WHATSAPP_API_TOKEN}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  actor-email:
    build: ./services/actor-email
    ports:
      - "3005:3005"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=3005
      - DATABASE_URL=postgresql://actorhub:${DB_PASSWORD}@postgres:5432/actorhub?schema=email
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  actor-billing:
    build: ./services/actor-billing
    ports:
      - "3006:3006"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=3006
      - DATABASE_URL=postgresql://actorhub:${DB_PASSWORD}@postgres:5432/actorhub?schema=billing
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  actor-analytics:
    build: ./services/actor-analytics
    ports:
      - "3007:3007"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=3007
      - DATABASE_URL=postgresql://actorhub:${DB_PASSWORD}@postgres:5432/actorhub?schema=analytics
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  actor-crm:
    build: ./services/actor-crm
    ports:
      - "3008:3008"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=3008
      - DATABASE_URL=postgresql://actorhub:${DB_PASSWORD}@postgres:5432/actorhub?schema=crm
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  actor-frontend:
    build: ./services/actor-frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://actor-gateway:3000
    depends_on:
      - actor-gateway

volumes:
  postgres_data:
  redis_data:
```

## Dockerfile standard (NestJS)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./
USER nestjs
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1
CMD ["node", "dist/main.js"]
```

## Critères d'acceptation
- [ ] `docker compose up` lance tous les services
- [ ] Health checks fonctionnels pour tous les services
- [ ] Volumes persistants pour PostgreSQL et Redis
- [ ] Variables d'environnement externalisées (.env)
- [ ] Réseau Docker isolé entre les services
- [ ] Scripts d'initialisation DB et seed
