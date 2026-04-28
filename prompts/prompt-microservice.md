# Prompt : Génération Microservice – Actor Hub

## Contexte
Tu génères du code pour un microservice **autonome** de la plateforme **Actor Hub** (Biar Group).  
Stack backend : **Node.js, Fastify, TypeScript, Drizzle ORM, PostgreSQL, Redis, RabbitMQ**.

## Tâche
Génère le microservice `{SERVICE_NAME}` avec les fonctionnalités suivantes :

### Fonctionnalités requises
{FEATURES}

## Architecture obligatoire

Chaque microservice **doit** respecter cette structure :

```
services/{service-name}/
├── src/
│   ├── server.ts              # Point d'entrée Fastify
│   ├── routes/                # Handlers HTTP (1 fichier par domaine)
│   ├── services/              # Logique métier
│   ├── models/                # Types / interfaces
│   ├── db/
│   │   ├── schema.ts          # Drizzle ORM schema
│   │   └── migrations/
│   ├── events/                # Publish/consume RabbitMQ
│   ├── middleware/
│   └── config/
│       └── env.ts             # Zod validation des env vars
├── tests/
│   ├── unit/
│   └── integration/
├── Dockerfile
├── package.json
└── openapi.yaml
```

## Contraintes impératives

1. **Autonomie** : chaque service a sa propre DB, ses propres dépendances, son propre Dockerfile.
2. **Multi-tenant** : toute donnée stockée inclut `tenant_id`. Toute requête filtre sur `tenant_id`.
3. **API-first** : documenter chaque endpoint dans `openapi.yaml`.
4. **Events** : toute mutation importante publie un event sur RabbitMQ (format : `{service}.{entity}.{action}`).
5. **Sécurité** : valider tous les inputs (Zod), pas de SQL injection possible (ORM), secrets via env vars.
6. **Observabilité** : logs structurés JSON, métriques Prometheus sur `/metrics`, health check sur `/health`.
7. **Tests** : unit tests (Vitest) pour la logique métier, integration tests pour les routes.
8. **Typage strict** : TypeScript strict mode, no `any`.

## Server.ts type

```typescript
import Fastify from 'fastify'
import { env } from './config/env'

const app = Fastify({
  logger: {
    level: env.LOG_LEVEL,
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty' }
      : undefined,
  },
})

// Plugins
await app.register(import('@fastify/cors'), { origin: env.CORS_ORIGINS })
await app.register(import('@fastify/helmet'))
await app.register(import('@fastify/sensible'))  // Erreurs HTTP standardisées

// Health checks
app.get('/health', () => ({ status: 'ok', service: '{SERVICE_NAME}' }))
app.get('/metrics', metricsHandler)

// Routes
await app.register(import('./routes/{entity}.routes'), { prefix: '/{entity}' })

await app.listen({ port: env.PORT, host: '0.0.0.0' })
```

## Env config type (Zod)

```typescript
// config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  RABBITMQ_URL: z.string().url(),
  LOG_LEVEL: z.enum(['trace','debug','info','warn','error']).default('info'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  // Ajouter les vars spécifiques au service ici
})

export const env = envSchema.parse(process.env)
export type Env = z.infer<typeof envSchema>
```

## Event format RabbitMQ

```typescript
interface DomainEvent<T = unknown> {
  id: string           // UUID unique de l'event
  type: string         // ex: 'call-center.call.ended'
  tenantId: string
  userId?: string
  payload: T
  timestamp: string    // ISO 8601
  version: number      // Version du schema (1)
}
```

## Variables à remplacer

| Variable | Description |
|----------|-------------|
| `{SERVICE_NAME}` | Nom du service (ex: call-center-service) |
| `{FEATURES}` | Liste détaillée des fonctionnalités à implémenter |
| `{entity}` | Nom de l'entité principale (ex: calls, contacts) |
