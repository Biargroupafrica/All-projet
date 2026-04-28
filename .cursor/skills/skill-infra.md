# Skill : Infrastructure & DevOps – Actor Hub

## Quand utiliser ce skill
Utiliser pour tout travail sur `infra/` :
- Dockerisation des microservices
- Docker Compose (développement local)
- Kubernetes (production : AKS/GKE)
- Terraform / Bicep (provisioning cloud)
- GitHub Actions (CI/CD pipelines)
- Monitoring (Prometheus, Grafana, OpenTelemetry)
- Secrets management (Vault / Azure Key Vault)

---

## Structure infra

```
infra/
├── docker/
│   ├── docker-compose.dev.yml       # Stack dev complète
│   ├── docker-compose.test.yml      # Stack tests integration
│   └── Dockerfile.base              # Image Node.js de base commune
├── k8s/
│   ├── namespaces/
│   │   ├── production.yaml
│   │   └── staging.yaml
│   ├── services/
│   │   ├── auth-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── hpa.yaml             # Horizontal Pod Autoscaler
│   │   ├── call-center-service/
│   │   └── ...                      # idem pour chaque service
│   ├── ingress/
│   │   └── nginx-ingress.yaml
│   ├── configmaps/
│   └── secrets/                     # Référencent Azure Key Vault / Vault
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── modules/
│       ├── aks/                     # Azure Kubernetes Service
│       ├── postgres/                # Azure Database for PostgreSQL
│       ├── redis/                   # Azure Cache for Redis
│       ├── rabbitmq/                # Azure Service Bus ou RabbitMQ helm
│       ├── storage/                 # Azure Blob Storage (enregistrements)
│       └── keyvault/                # Azure Key Vault
└── ci/
    ├── workflows/
    │   ├── ci.yml                   # Tests + lint sur PR
    │   ├── deploy-staging.yml       # Deploy auto sur merge main
    │   └── deploy-production.yml    # Deploy manuel avec approval
    └── scripts/
        ├── build.sh
        └── deploy.sh
```

---

## Docker Compose – Dev

```yaml
# infra/docker/docker-compose.dev.yml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: devpassword
      POSTGRES_USER: actorhub
    ports: ['5432:5432']
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports: ['6379:6379']

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - '5672:5672'
      - '15672:15672'     # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest

  # Observabilité
  prometheus:
    image: prom/prometheus:latest
    ports: ['9090:9090']
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports: ['3000:3000']
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin

volumes:
  postgres_data:
```

---

## Dockerfile microservice (base)

```dockerfile
# infra/docker/Dockerfile.base
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---

## Kubernetes – Deployment type

```yaml
# k8s/services/auth-service/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: production
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
        - name: auth-service
          image: actorhub.azurecr.io/auth-service:${IMAGE_TAG}
          ports:
            - containerPort: 3001
          envFrom:
            - secretRef:
                name: auth-service-secrets
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
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
```

---

## GitHub Actions – CI

```yaml
# ci/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v4

  build-images:
    runs-on: ubuntu-latest
    needs: lint-and-test
    steps:
      - uses: actions/checkout@v4
      - name: Build and push Docker images
        run: |
          for service in auth billing call-center sms voice crm messaging analytics tenant gateway; do
            docker build -t actorhub.azurecr.io/$service-service:${{ github.sha }} \
              -f services/$service-service/Dockerfile .
          done
```

---

## Checklist avant PR

- [ ] Chaque service a un `/health` et `/ready` endpoint
- [ ] HPA configuré (scale in/out selon CPU/mémoire)
- [ ] Secrets : jamais dans le code ni dans les images Docker
- [ ] Réseau K8s : services communiquent via ClusterIP (jamais exposé directement)
- [ ] Logging : logs JSON avec traceId, tenantId, serviceId
- [ ] Monitoring : métriques Prometheus exposées sur `/metrics`
- [ ] Backup DB : automated daily via Azure Backup
