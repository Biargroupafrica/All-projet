# Skill: Plateforme SaaS + CPaaS en microservices autonomes

## Objectif
Concevoir et implémenter une plateforme SaaS/CPaaS modulaire où chaque solution fonctionne de manière autonome (déploiement, scaling, base de données, observabilité, sécurité et cycle de vie indépendants).

## Quand utiliser ce skill
- Quand il faut créer une plateforme multi-produits SaaS/CPaaS.
- Quand chaque solution doit rester découplée des autres.
- Quand il faut transformer une maquette Figma en architecture technique et backlog d'implémentation.

## Entrées attendues
- Maquettes/pages fonctionnelles (ex: landing, services, call-center, industries, tarifs, actualités, à propos, contact, login).
- Contraintes métier (B2B/B2C, conformité, pays cibles, SLA).
- Contraintes techniques (cloud, stack, coût, volumétrie, canaux CPaaS).

## Sorties attendues
- Architecture cible (domaines, microservices, APIs/events, IAM, data).
- Plan d'implémentation incrémental par service autonome.
- Prompts d'exécution pour générer code, infra, tests et documentation.
- Checklist de validation (fonctionnelle, sécurité, performance, exploitation).

## Principes d'architecture (autonomie par solution)
1. **Bounded Context par solution**: chaque solution = domaine, API et backlog dédiés.
2. **Base de données par service**: pas de schéma partagé entre domaines.
3. **Contrats explicites**: OpenAPI/AsyncAPI versionnés + compatibilité rétro.
4. **Communication hybride**:
   - Synchrone (API Gateway / BFF) pour lecture/commande immédiate.
   - Asynchrone (bus d'événements) pour découplage et résilience.
5. **Déploiement indépendant**: pipeline CI/CD, versioning et rollbacks propres.
6. **Observabilité par service**: logs structurés, traces, métriques, SLO/SLA.
7. **Sécurité Zero Trust**: OAuth2/OIDC, RBAC/ABAC, secrets vault, audit.
8. **Résilience native**: circuit breaker, retry idempotent, DLQ, rate limit.

## Macro-domaines recommandés
- `identity-access` (IAM, tenant, rôles, SSO, auth, MFA).
- `billing-subscription` (plans, quota, facturation, paiements).
- `customer-360` (comptes, contacts, segmentation).
- `cpaas-orchestration` (routage canaux voix/SMS/WhatsApp/email/chat).
- `call-center` (agents, campagnes, scripts, dispositions, qualité).
- `campaign-automation` (journeys, triggers, templates).
- `analytics-insights` (KPI, dashboards, export, alerting).
- `content-cms` (actualités, pages institutionnelles).
- `notification-service` (notifications système/métier).
- `api-gateway-bff` (agrégation front, politiques d'accès, throttling).

## Pattern d'implémentation par microservice
1. Définir frontières métier + événements produits/consommés.
2. Définir API (OpenAPI) + schéma data local.
3. Implémenter service + persistance + tests unitaires/intégration.
4. Ajouter instrumentation (logs, traces, métriques).
5. Ajouter sécurité (authN/authZ, gestion secrets, audit trail).
6. Exposer via gateway + feature flags.
7. Déployer via pipeline dédié + tests E2E ciblés.

## Contrat standard d'un service autonome
- Dossier `service-name/`
  - `src/` (code métier)
  - `api/openapi.yaml`
  - `events/asyncapi.yaml`
  - `db/migrations/`
  - `tests/` (unit, integration, contract)
  - `deploy/` (docker, helm/terraform/bicep)
  - `docs/adr/` (décisions d'architecture)

## Exigences non fonctionnelles minimales
- Multi-tenant strict (isolation logique, potentiellement physique pour comptes premium).
- RTO/RPO définis par service.
- Chiffrement en transit et au repos.
- Journal d'audit immuable pour actions sensibles.
- Tests de charge sur flux critiques CPaaS (envoi, réception, routage).

## Workflow recommandé avec les maquettes fournies
1. Mapper chaque route/page Figma à un ou plusieurs domaines métier.
2. Identifier les parcours utilisateur (découverte, conversion, onboarding, exploitation).
3. Déduire les APIs et événements nécessaires.
4. Prioriser un MVP vertical (de bout en bout) avant extension.
5. Générer prompts de build par page + par microservice.

## Critères de succès
- Chaque solution peut être livrée et exploitée sans couplage bloquant.
- Les pannes d'une solution n'impactent pas les autres (dégradation contrôlée).
- Le front peut consommer des contrats stables, versionnés et testés.
- L'exploitation dispose de métriques et alertes actionnables par service.
