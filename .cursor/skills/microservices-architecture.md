# Skill: Architecture Microservices Actor Hub

## Quand utiliser ce skill
Utiliser ce skill lors de la création, modification ou déploiement de tout microservice de la plateforme Actor Hub.

## Principes d'architecture

### Chaque microservice DOIT
1. **Être autonome** : déployable et exécutable indépendamment
2. **Posséder sa propre base de données** : schéma isolé dans PostgreSQL ou DB dédiée
3. **Exposer une API REST/GraphQL** documentée avec OpenAPI/Swagger
4. **Gérer ses propres événements** via un message broker (Redis Pub/Sub ou RabbitMQ)
5. **Avoir son propre Dockerfile** et configuration Docker Compose
6. **Inclure des health checks** : `/health` et `/ready` endpoints
7. **Logger de manière structurée** : JSON logs avec correlation ID
8. **Respecter le multi-tenant** : isolation par `tenant_id`

### Communication inter-services
```
┌──────────────────────────────────────────────────┐
│                 API Gateway                       │
│            (Actor Gateway Service)                │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │  Auth   │  │CallCenter│  │   SMS   │         │
│  │ Service │  │ Service  │  │ Service │         │
│  └────┬────┘  └────┬────┘  └────┬────┘         │
│       │            │            │                │
│  ┌────┴────────────┴────────────┴────┐          │
│  │        Message Broker              │          │
│  │     (Redis Pub/Sub / RabbitMQ)    │          │
│  └────┬────────────┬────────────┬────┘          │
│       │            │            │                │
│  ┌────┴────┐  ┌────┴────┐  ┌────┴────┐         │
│  │WhatsApp │  │  Email  │  │Analytics│         │
│  │ Service │  │ Service │  │ Service │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Patterns utilisés
- **API Gateway** : point d'entrée unique, routing, rate limiting
- **Event-Driven** : communication asynchrone entre services
- **CQRS** : séparation lecture/écriture pour les services à forte charge
- **Saga Pattern** : gestion des transactions distribuées
- **Circuit Breaker** : résilience aux pannes de services externes
- **Service Discovery** : enregistrement dynamique des services

### Structure standard d'un microservice
```
actor-{service-name}/
├── src/
│   ├── main.ts                 # Point d'entrée
│   ├── app.module.ts           # Module NestJS principal
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── service.config.ts
│   ├── modules/
│   │   └── {feature}/
│   │       ├── {feature}.module.ts
│   │       ├── {feature}.controller.ts
│   │       ├── {feature}.service.ts
│   │       ├── {feature}.repository.ts
│   │       ├── dto/
│   │       ├── entities/
│   │       └── events/
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   ├── decorators/
│   │   └── middleware/
│   └── shared/
│       ├── events/
│       ├── interfaces/
│       └── utils/
├── test/
├── prisma/ (ou migrations/)
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json
```

### Variables d'environnement communes
```env
NODE_ENV=development|staging|production
PORT=3001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
TENANT_ISOLATION=strict
LOG_LEVEL=info
CORS_ORIGINS=https://app.actorhub.com
SERVICE_NAME=actor-{name}
SERVICE_VERSION=1.0.0
```

### Standards API
- Versioning : `/api/v1/...`
- Pagination : `?page=1&limit=20`
- Filtrage : `?status=active&tenant_id=xxx`
- Tri : `?sort=created_at&order=desc`
- Réponse standard :
```json
{
  "success": true,
  "data": {},
  "meta": { "page": 1, "limit": 20, "total": 100 },
  "error": null
}
```
