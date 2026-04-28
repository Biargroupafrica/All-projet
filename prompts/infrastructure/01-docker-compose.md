# Prompt : Infrastructure Docker Compose & Déploiement

## Objectif

Créer l'infrastructure complète de la plateforme Actor Hub avec Docker Compose pour le développement local et les fichiers de déploiement pour la production.

## Prompt de création

```
Tu es un DevOps senior spécialisé en architectures microservices et containerisation.

Crée l'infrastructure complète "Actor Hub" avec Docker Compose orchestrant tous les microservices.

### Architecture des services

actor-hub/
├── docker-compose.yml                    # Orchestration complète
├── docker-compose.dev.yml                # Override dev
├── docker-compose.prod.yml               # Override production
├── .env.example                          # Variables d'environnement
├── services/
│   ├── actor-auth-service/              # Port 3000
│   │   ├── Dockerfile
│   │   └── .env.example
│   ├── actor-callcenter-service/        # Port 3001
│   │   ├── Dockerfile
│   │   └── .env.example
│   ├── actor-sms-service/               # Port 3002
│   │   ├── Dockerfile
│   │   └── .env.example
│   ├── actor-whatsapp-service/          # Port 3003
│   │   ├── Dockerfile
│   │   └── .env.example
│   ├── actor-email-service/             # Port 3004
│   │   ├── Dockerfile
│   │   └── .env.example
│   └── actor-gateway/                   # Port 8080
│       ├── Dockerfile
│       └── .env.example
├── frontend/
│   ├── Dockerfile
│   └── nginx.conf
├── infrastructure/
│   ├── postgres/
│   │   ├── init.sql                     # Création des schémas
│   │   └── pg_hba.conf
│   ├── redis/
│   │   └── redis.conf
│   ├── nginx/
│   │   └── nginx.conf                   # Reverse proxy prod
│   └── monitoring/
│       ├── prometheus/
│       │   └── prometheus.yml
│       ├── grafana/
│       │   └── dashboards/
│       └── loki/
│           └── loki.yml
├── scripts/
│   ├── setup.sh                         # Installation initiale
│   ├── seed.sh                          # Données de test
│   ├── migrate.sh                       # Migrations BDD
│   └── backup.sh                        # Backup BDD
├── ci-cd/
│   ├── .github/
│   │   └── workflows/
│   │       ├── ci.yml                   # Tests + Lint
│   │       ├── cd-staging.yml           # Déploiement staging
│   │       └── cd-production.yml        # Déploiement production
│   └── Makefile                         # Commandes rapides
└── docs/
    ├── architecture.md
    ├── api-reference.md
    └── deployment.md

### docker-compose.yml

version: '3.8'

services:
  # === BASE DE DONNÉES ===
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: actorhub
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: actorhub
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./infrastructure/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U actorhub"]
      interval: 10s
      timeout: 5s
      retries: 5

  # === CACHE & QUEUE ===
  redis:
    image: redis:7-alpine
    command: redis-server /usr/local/etc/redis/redis.conf
    volumes:
      - redis_data:/data
      - ./infrastructure/redis/redis.conf:/usr/local/etc/redis/redis.conf
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # === API GATEWAY ===
  gateway:
    build: ./services/actor-gateway
    ports:
      - "8080:8080"
    environment:
      - AUTH_SERVICE_URL=http://auth:3000
      - CALLCENTER_SERVICE_URL=http://callcenter:3001
      - SMS_SERVICE_URL=http://sms:3002
      - WHATSAPP_SERVICE_URL=http://whatsapp:3003
      - EMAIL_SERVICE_URL=http://email:3004
    depends_on:
      - auth
      - callcenter
      - sms
      - whatsapp
      - email

  # === MICROSERVICES ===
  auth:
    build: ./services/actor-auth-service
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://actorhub:${POSTGRES_PASSWORD}@postgres:5432/actorhub?schema=auth
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  callcenter:
    build: ./services/actor-callcenter-service
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://actorhub:${POSTGRES_PASSWORD}@postgres:5432/actorhub?schema=callcenter
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  sms:
    build: ./services/actor-sms-service
    ports:
      - "3002:3002"
    environment:
      - DATABASE_URL=postgresql://actorhub:${POSTGRES_PASSWORD}@postgres:5432/actorhub?schema=sms
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  whatsapp:
    build: ./services/actor-whatsapp-service
    ports:
      - "3003:3003"
    environment:
      - DATABASE_URL=postgresql://actorhub:${POSTGRES_PASSWORD}@postgres:5432/actorhub?schema=whatsapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  email:
    build: ./services/actor-email-service
    ports:
      - "3004:3004"
    environment:
      - DATABASE_URL=postgresql://actorhub:${POSTGRES_PASSWORD}@postgres:5432/actorhub?schema=email
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  # === FRONTEND ===
  frontend:
    build: ./frontend
    ports:
      - "3080:80"
    depends_on:
      - gateway

  # === MONITORING ===
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./infrastructure/monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3030:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}

volumes:
  postgres_data:
  redis_data:
  grafana_data:

networks:
  default:
    name: actorhub-network

### Script init.sql PostgreSQL

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS callcenter;
CREATE SCHEMA IF NOT EXISTS sms;
CREATE SCHEMA IF NOT EXISTS whatsapp;
CREATE SCHEMA IF NOT EXISTS email;

### Commandes Makefile

make setup        # Installation initiale
make dev          # Lancer en mode dev
make prod         # Lancer en mode production
make test         # Lancer tous les tests
make migrate      # Exécuter les migrations
make seed         # Insérer données de test
make logs         # Voir les logs
make stop         # Arrêter tous les services
make clean        # Tout nettoyer
make build        # Builder toutes les images
make push         # Push les images au registry

### GitHub Actions CI/CD

- Push sur feature/* : lint + tests unitaires
- Push sur develop : lint + tests + build + deploy staging
- Push sur main : lint + tests + build + deploy production
- PR : lint + tests + review automatique
```

## Critères d'acceptation

- [ ] `docker-compose up` démarre tous les services
- [ ] Chaque service est accessible sur son port dédié
- [ ] Le gateway route correctement les requêtes
- [ ] Les health checks fonctionnent
- [ ] Les données persistent entre les redémarrages
- [ ] Le monitoring (Prometheus + Grafana) est fonctionnel
- [ ] Les scripts de migration et de seed fonctionnent
- [ ] Le CI/CD déploie correctement
