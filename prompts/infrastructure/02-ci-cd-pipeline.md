# Prompt: Pipeline CI/CD - GitHub Actions

## Contexte
Tu es un ingénieur DevOps senior. Tu dois créer les pipelines CI/CD GitHub Actions pour la plateforme Actor Hub, avec des workflows pour chaque microservice autonome.

## Mission
Créer des pipelines CI/CD automatisés pour le build, test, et déploiement de chaque microservice vers les environnements staging et production.

## Workflows à créer

### 1. CI - Tests & Lint (sur chaque PR)
```yaml
# .github/workflows/ci.yml
name: CI - Tests & Lint
on:
  pull_request:
    branches: [main, develop]

jobs:
  detect-changes:
    # Détecte quels microservices ont été modifiés
    
  test-auth:
    needs: detect-changes
    if: needs.detect-changes.outputs.auth == 'true'
    # Lint + Tests du service auth
    
  test-callcenter:
    needs: detect-changes
    if: needs.detect-changes.outputs.callcenter == 'true'
    # Lint + Tests du service callcenter
    
  # ... un job par microservice
  
  test-frontend:
    needs: detect-changes
    if: needs.detect-changes.outputs.frontend == 'true'
    # Build + Lint + Tests E2E du frontend
```

### 2. CD - Déploiement staging (sur merge develop)
```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging
on:
  push:
    branches: [develop]
```

### 3. CD - Déploiement production (sur merge main)
```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production
on:
  push:
    branches: [main]
```

### 4. Déploiement sélectif par service
Seuls les services modifiés sont redéployés (monorepo strategy).

## Critères d'acceptation
- [ ] CI s'exécute uniquement sur les services modifiés
- [ ] Tests automatiques pour chaque service
- [ ] Build Docker et push vers registry
- [ ] Déploiement staging automatique
- [ ] Déploiement production avec approbation manuelle
- [ ] Notifications Slack/Discord sur échec
- [ ] Rollback automatique en cas d'échec health check
