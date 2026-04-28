# Skill : Infrastructure — ACTOR Hub

## Scénario d'utilisation
Déploiement, CI/CD, infrastructure as code, monitoring.

## Architecture de Déploiement

```
Internet
    │
    ▼
Cloudflare (CDN + WAF + DDoS protection)
    │
    ▼
AWS ALB (Application Load Balancer)
    │
    ├── /api/*        → Kong API Gateway (K8s)
    │                        │
    │                        ├── auth-service
    │                        ├── sms-service
    │                        ├── email-service
    │                        ├── whatsapp-service
    │                        ├── callcenter-service
    │                        ├── billing-service
    │                        ├── contacts-service
    │                        ├── analytics-service
    │                        └── ai-service
    │
    ├── /             → Next.js (landing) — Vercel ou K8s
    └── /app/*        → Next.js (dashboard) — Vercel ou K8s
```

## Docker Compose (Développement Local)

```yaml
# infra/docker/docker-compose.dev.yml
version: '3.8'
services:
  # Bases de données
  postgres:
    image: postgres:16
    ports: ["5432:5432"]
  
  mongodb:
    image: mongo:7
    ports: ["27017:27017"]
  
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  
  # Messaging
  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.0
  
  kafka:
    image: confluentinc/cp-kafka:7.6.0
    ports: ["9092:9092"]
  
  # Stockage
  minio:
    image: minio/minio
    ports: ["9000:9000", "9001:9001"]  # API + Console
  
  # Monitoring
  prometheus:
    image: prom/prometheus
    ports: ["9090:9090"]
  
  grafana:
    image: grafana/grafana
    ports: ["3000:3000"]
  
  # Services
  auth-service:
    build: ../../services/auth-service
    ports: ["3001:3001"]
    env_file: .env
    depends_on: [postgres, redis, kafka]
  
  sms-service:
    build: ../../services/sms-service
    ports: ["3002:3002"]
    depends_on: [postgres, redis, kafka]
  
  email-service:
    build: ../../services/email-service
    ports: ["3003:3003"]
    depends_on: [postgres, redis, kafka]
  
  whatsapp-service:
    build: ../../services/whatsapp-service
    ports: ["3004:3004"]
    depends_on: [postgres, redis, kafka]
  
  callcenter-service:
    build: ../../services/callcenter-service
    ports: ["3005:3005"]
    depends_on: [postgres, redis, kafka]
  
  billing-service:
    build: ../../services/billing-service
    ports: ["3006:3006"]
    depends_on: [postgres, redis, kafka]
  
  ai-service:
    build: ../../services/ai-service
    ports: ["3007:3007"]
    depends_on: [redis, kafka, minio]
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]  # GPU optionnel pour Whisper

  # Apps Frontend
  landing:
    build: ../../apps/landing
    ports: ["4000:3000"]
  
  dashboard:
    build: ../../apps/dashboard
    ports: ["4001:3000"]
```

## Kubernetes (Production)

### Namespaces
```
actor-hub-prod/
├── auth
├── sms
├── email
├── whatsapp
├── callcenter
├── billing
├── ai
├── monitoring
└── infra (kafka, redis, postgres)
```

### Ressources par service (exemple auth-service)
```yaml
# infra/kubernetes/services/auth-service/deployment.yaml
apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
  template:
    spec:
      containers:
      - name: auth-service
        image: registry.actorhub.com/auth-service:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
```

## CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy-service.yml
name: Deploy Service
on:
  push:
    branches: [main]
    paths: ['services/${{ matrix.service }}/**']

jobs:
  build-and-deploy:
    strategy:
      matrix:
        service: [auth, sms, email, whatsapp, callcenter, billing, ai]
    steps:
      - uses: actions/checkout@v4
      - name: Build & Push Docker image
      - name: Run tests
      - name: Deploy to K8s (staging)
      - name: Run smoke tests
      - name: Deploy to K8s (prod) # après approbation manuelle
```

## Monitoring

### Métriques Prometheus (par service)
```
actor_hub_requests_total{service, method, status}
actor_hub_request_duration_seconds{service, endpoint}
actor_hub_active_connections{service}
actor_hub_queue_size{service, queue}
actor_hub_error_rate{service}
```

### Dashboards Grafana
- Service Health Overview
- Business KPIs (messages envoyés/livrés par heure)
- Infrastructure (CPU, RAM, réseau par pod)
- Call Center (agents actifs, appels en cours)
- Billing (revenus temps réel)

## Critères de Succès

- [ ] `docker compose up` démarre tous les services en < 2 minutes
- [ ] Tous les services passent leur health check
- [ ] Un push sur `main` déclenche le pipeline CI/CD
- [ ] Déploiement zero-downtime en production
- [ ] Grafana affiche les métriques de tous les services
- [ ] Alerting Prometheus configuré (email + Slack)
