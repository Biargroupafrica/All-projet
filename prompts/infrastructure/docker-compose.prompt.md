# Prompt : Générer l'Infrastructure Docker/K8s

## Contexte
Tu vas créer l'infrastructure complète pour la plateforme ACTOR Hub : Docker Compose pour le développement local, et les manifestes Kubernetes pour la production.

## Tâche 1 : Docker Compose (infra/docker/docker-compose.dev.yml)

Crée un fichier Docker Compose complet qui permet de démarrer TOUTE la plateforme avec une seule commande `docker compose up`.

### Services requis :

**Bases de données :**
- PostgreSQL 16 (avec initialisation : créer 1 database par service : auth_db, sms_db, email_db, whatsapp_db, callcenter_db, billing_db, contacts_db)
- MongoDB 7 (pour logs et analytics)
- Redis 7 Alpine (avec persistance)

**Messaging :**
- Zookeeper + Kafka (Confluent Platform 7.6)
- Kafka UI (Provectus) pour visualisation des topics

**Stockage :**
- MinIO (S3-compatible) pour enregistrements, factures PDF, assets

**Téléphonie :**
- FreeSWITCH (si disponible en image Docker officielle, sinon commenté)

**Monitoring :**
- Prometheus + Grafana (avec datasource préconfigurée)
- Kafka UI

**Services Application :**
- auth-service (port 3001)
- sms-service (port 3002)
- email-service (port 3003)
- whatsapp-service (port 3004)
- callcenter-service (port 3005)
- billing-service (port 3006)
- ai-service (port 3007, Python)
- landing (port 4000)
- dashboard (port 4001)

### Configuration :
- Tous les services doivent avoir des health checks
- Les services doivent attendre que leurs dépendances soient saines (`condition: service_healthy`)
- Utiliser des variables d'environnement depuis `.env`
- Volumes nommés pour la persistance des données
- Network dédié `actor-hub-net`

## Tâche 2 : Fichier .env.example (infra/docker/.env.example)

Génère le fichier `.env.example` avec TOUTES les variables nécessaires, groupées par service, avec des commentaires explicatifs.

Exemple de structure :
```env
# ─────────────────────────────────────
# BASES DE DONNÉES
# ─────────────────────────────────────
POSTGRES_USER=actorhub
POSTGRES_PASSWORD=change-me-in-production
POSTGRES_HOST=postgres
# ...

# ─────────────────────────────────────
# AUTH SERVICE
# ─────────────────────────────────────
JWT_SECRET=your-256-bit-secret-minimum-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
# ...

# ─────────────────────────────────────
# SMS SERVICE
# ─────────────────────────────────────
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
# ...

# ─────────────────────────────────────
# STRIPE / BILLING
# ─────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_BUSINESS_MONTHLY=price_...
# ...
```

## Tâche 3 : Script de setup (infra/docker/setup.sh)

Script bash qui :
1. Vérifie que Docker et Docker Compose sont installés
2. Copie `.env.example` vers `.env` si `.env` n'existe pas
3. Lance `docker compose up -d`
4. Attend que tous les services soient healthy
5. Exécute les migrations DB de chaque service
6. Affiche les URLs de tous les services

```bash
#!/bin/bash
echo "🚀 Démarrage de ACTOR Hub..."
# ...
echo "✅ Plateforme démarrée !"
echo ""
echo "📡 Services disponibles :"
echo "  Landing:    http://localhost:4000"
echo "  Dashboard:  http://localhost:4001"
echo "  Auth API:   http://localhost:3001/docs"
echo "  SMS API:    http://localhost:3002/docs"
echo "  Grafana:    http://localhost:3030 (admin/admin)"
echo "  Kafka UI:   http://localhost:8080"
echo "  MinIO:      http://localhost:9001"
```

## Tâche 4 : Dockerfile type (pour chaque service Node.js)

```dockerfile
# Multi-stage build pour image finale légère
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
USER appuser
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
CMD ["node", "dist/app.js"]
```

## Tâche 5 : GitHub Actions CI/CD (.github/workflows/ci.yml)

Pipeline pour chaque microservice :
1. Checkout
2. Setup Node.js 20
3. npm ci + build
4. Tests (vitest)
5. Lint (ESLint + TypeScript check)
6. Build Docker image
7. Push vers GitHub Container Registry
8. Déploiement staging (auto sur push main)
9. Déploiement production (manuel, après approbation)

## Contraintes

- Les images de production ne doivent pas contenir de code source, seulement le build compilé
- Les secrets ne doivent JAMAIS être hardcodés dans les Dockerfiles ou docker-compose
- Les services doivent démarrer dans les 30 secondes
- `docker compose down -v` doit nettoyer proprement
