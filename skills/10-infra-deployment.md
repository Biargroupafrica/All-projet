# Skill 10 — Infrastructure & Déploiement

## Quand utiliser ce skill
Lorsque vous travaillez sur l'infrastructure, Docker, Kubernetes, CI/CD, configurations serveur, monitoring, scalabilité.

## Architecture de Déploiement

```
┌──────────────────────────────────────────────────────────────┐
│                      PRODUCTION INFRA                        │
├──────────────┬───────────────────┬──────────────────────────┤
│  FRONTEND    │    BACKEND        │    EXTERNAL SERVICES      │
│              │                   │                          │
│ Vercel /     │ Supabase          │ Twilio (Voice)           │
│ Cloudflare   │ (DB + Auth +      │ Vonage (SMS)             │
│ Pages        │  Storage +        │ Meta WhatsApp API        │
│              │  Edge Functions)  │ SendGrid (Email)         │
│              │                   │ Stripe (Payments)        │
│              │ Node.js           │ Cloudflare (CDN)         │
│              │ Microservices     │ Redis (Queue)            │
│              │ (Kubernetes)      │ AWS S3 (Storage)         │
└──────────────┴───────────────────┴──────────────────────────┘
```

## Structure Monorepo

```
actor-hub/
├── apps/
│   ├── web/                    # Frontend React (Vite)
│   ├── api-gateway/            # API Gateway Express
│   ├── sms-service/            # Microservice SMS (Node.js)
│   ├── call-center-service/    # Microservice Call Center
│   ├── email-service/          # Microservice Email
│   └── whatsapp-service/       # Microservice WhatsApp
├── packages/
│   ├── shared-types/           # TypeScript types partagés
│   ├── shared-utils/           # Utilitaires communs
│   ├── db-schema/              # Migrations Supabase
│   └── ui-components/          # Design system (shadcn)
├── infra/
│   ├── docker/                 # Dockerfiles
│   ├── kubernetes/             # Manifestes K8s
│   └── terraform/              # IaC (Vercel, Supabase, etc.)
├── scripts/
│   ├── db-migrate.sh
│   └── seed-data.sh
├── pnpm-workspace.yaml
└── turbo.json
```

## Docker — Configuration par Service

### SMS Service
```dockerfile
# apps/sms-service/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base AS build
COPY . .
RUN pnpm build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### Docker Compose (Développement local)
```yaml
# docker-compose.yml
version: '3.8'

services:
  # Base de données PostgreSQL (dev local si pas Supabase)
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: actorhub
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: localpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis (file d'attente)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # API Gateway
  api-gateway:
    build: ./apps/api-gateway
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://admin:localpassword@postgres:5432/actorhub
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  # SMS Service
  sms-service:
    build: ./apps/sms-service
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://admin:localpassword@postgres:5432/actorhub
      - REDIS_URL=redis://redis:6379
      - SMPP_HOST=${SMPP_HOST}
      - SMPP_PORT=${SMPP_PORT}
      - SMPP_SYSTEM_ID=${SMPP_SYSTEM_ID}
      - SMPP_PASSWORD=${SMPP_PASSWORD}
    depends_on:
      - redis
      - postgres

  # Call Center Service
  call-center-service:
    build: ./apps/call-center-service
    ports:
      - "3002:3002"
    environment:
      - DATABASE_URL=postgresql://admin:localpassword@postgres:5432/actorhub
      - REDIS_URL=redis://redis:6379
      - SIP_SERVER=${SIP_SERVER}
      - TURN_SERVER=${TURN_SERVER}
    depends_on:
      - redis
      - postgres

  # Email Service
  email-service:
    build: ./apps/email-service
    ports:
      - "3003:3003"
    environment:
      - DATABASE_URL=postgresql://admin:localpassword@postgres:5432/actorhub
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}

  # WhatsApp Service
  whatsapp-service:
    build: ./apps/whatsapp-service
    ports:
      - "3004:3004"
    environment:
      - DATABASE_URL=postgresql://admin:localpassword@postgres:5432/actorhub
      - REDIS_URL=redis://redis:6379
      - WHATSAPP_API_URL=https://graph.facebook.com/v17.0
      - WHATSAPP_VERIFY_TOKEN=${WHATSAPP_VERIFY_TOKEN}

  # Frontend (dev)
  web:
    build: ./apps/web
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:8080
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

volumes:
  postgres_data:
```

## Kubernetes — Production

```yaml
# infra/kubernetes/sms-service/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sms-service
  namespace: actorhub
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sms-service
  template:
    metadata:
      labels:
        app: sms-service
    spec:
      containers:
      - name: sms-service
        image: actorhub/sms-service:latest
        ports:
        - containerPort: 3001
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: actorhub-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: actorhub-secrets
              key: redis-url
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: sms-service
  namespace: actorhub
spec:
  selector:
    app: sms-service
  ports:
  - port: 80
    targetPort: 3001
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sms-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sms-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## CI/CD — GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Actor Hub

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v3
      with:
        version: 8
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'
    - run: pnpm install --frozen-lockfile
    - run: pnpm test
    - run: pnpm lint
    - run: pnpm build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: pnpm install
    - run: pnpm --filter web build
    - uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: actorhub-web
        directory: apps/web/dist

  deploy-services:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    - name: Build & Push Docker images
      run: |
        docker build -t actorhub/sms-service:${{ github.sha }} ./apps/sms-service
        docker push actorhub/sms-service:${{ github.sha }}
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/sms-service sms-service=actorhub/sms-service:${{ github.sha }}
        kubectl rollout status deployment/sms-service
```

## Monitoring & Observabilité

```typescript
// Prometheus metrics pour chaque service
import { Counter, Histogram, register } from 'prom-client'

const smsCounter = new Counter({
  name: 'actorhub_sms_sent_total',
  help: 'Total number of SMS sent',
  labelNames: ['tenant_id', 'status', 'provider'],
})

const apiLatency = new Histogram({
  name: 'actorhub_api_request_duration_seconds',
  help: 'API request duration in seconds',
  labelNames: ['method', 'endpoint', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: process.env.APP_VERSION,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

// Metrics endpoint pour Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})
```

## Prompts pour l'Infrastructure

### Prompt — Script de Démarrage Local
```
Crée un script shell de démarrage pour l'environnement de développement Actor Hub.
Le script doit :
1. Vérifier les prérequis (Docker, Node, pnpm, Supabase CLI)
2. Copier .env.example vers .env si non existant
3. Démarrer les services Docker (PostgreSQL, Redis)
4. Lancer les migrations Supabase
5. Seeder la DB avec données de test
6. Démarrer tous les services en parallèle avec pm2 ou concurrently
7. Afficher les URLs de chaque service
Gérer les erreurs proprement et afficher des logs colorés.
```

### Prompt — Health Dashboard
```
Crée un dashboard de santé des services pour l'équipe technique Actor Hub.
Services à monitorer :
- Frontend (Vercel) : statut, temps de réponse
- API Gateway : req/min, erreurs, latence
- SMS Service : queue size, msgs/min, taux succès
- Call Center : appels actifs, agents connectés
- Email Service : queue size, msgs/min
- WhatsApp Service : messages/min
- Base de données (Supabase) : connexions, latence requêtes
- Redis : mémoire utilisée, commandes/sec
Interface : grille de cards avec indicateurs vert/orange/rouge
Actualisation toutes les 30 secondes. 
Historique de disponibilité 24h en mini graphique.
```

## Variables d'Environnement Complètes

```env
# Base
NODE_ENV=production
APP_VERSION=1.0.0

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://xxx:6379

# SMS / SMPP
SMPP_HOST=smpp.provider.com
SMPP_PORT=2775
SMPP_SYSTEM_ID=actorhub
SMPP_PASSWORD=xxx
SMPP_SYSTEM_TYPE=CMT

# Voice / SIP
SIP_SERVER=sip.actorhub.io
SIP_PORT=5060
TURN_SERVER=turn:turn.actorhub.io:3478
TURN_USERNAME=xxx
TURN_PASSWORD=xxx

# Email / SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=xxx
SENDGRID_API_KEY=SG.xxx

# WhatsApp / Meta
WHATSAPP_API_URL=https://graph.facebook.com/v17.0
WHATSAPP_VERIFY_TOKEN=xxx
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx

# Paiements
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# JWT
JWT_SECRET=xxx
JWT_EXPIRES_IN=24h

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
PROMETHEUS_PORT=9090

# Stockage
AWS_S3_BUCKET=actorhub-media
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=eu-west-1
```

## Tests à réaliser
- [ ] docker compose up : tous les services démarrent
- [ ] Health check /health de chaque service → 200 OK
- [ ] API Gateway route vers le bon service
- [ ] CI/CD : PR → tests → build → deploy automatique
- [ ] Scalabilité : HPA K8s démarre 2ème pod sous charge
- [ ] Migration DB : nouvelle migration appliquée sans downtime
- [ ] Monitoring : métriques visibles dans Prometheus/Grafana
- [ ] Logging : logs centralisés et queryables
