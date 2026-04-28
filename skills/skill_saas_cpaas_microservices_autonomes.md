# Skill: Conception d'une plateforme SaaS + CPaaS en microservices autonomes

## Objectif
Concevoir une plateforme SaaS/CPaaS modulaire dans laquelle chaque solution est autonome (ownership fonctionnel, data ownership, déploiement indépendant, observabilité dédiée), tout en restant composable au niveau de la plateforme.

## Entrées minimales
- Liens Figma (pages marketing + login + contact).
- Vision business (segments, zones géographiques, secteurs prioritaires).
- Contraintes techniques (cloud, stack, sécurité, conformité, budget).
- Priorités produit (MVP, time-to-value, profondeur fonctionnelle CPaaS).

## Principes d'architecture obligatoires
1. **Autonomie par domaine**: chaque microservice possède son modèle de données, ses règles métier et son pipeline CI/CD.
2. **Contrats explicites**: API versionnées (REST/GraphQL/gRPC) + événements versionnés (schema registry recommandé).
3. **Isolation des pannes**: circuit breaker, retries bornés, timeout stricts, file de dead-letter.
4. **Multi-tenant by design**: isolation logique (minimum) et stratégie d'isolation forte pour clients sensibles.
5. **Sécurité native**: IAM central, RBAC/ABAC, chiffrement transit/at rest, journal d'audit.
6. **Observabilité par service**: logs structurés, métriques métier, traces distribuées, SLO.
7. **FinOps/Unit economics**: coût par message, coût par minute d'appel, coût par tenant.

## Domaines recommandés (autonomes)
- `identity-access` (SSO, MFA, sessions, rôles).
- `tenant-billing` (plans, abonnements, facturation, quotas).
- `cp-aas-messaging` (SMS/WhatsApp/email orchestration).
- `cp-aas-voice` (inbound/outbound, IVR, enregistrement, supervision).
- `cp-aas-call-center` (agents, files, campagnes, scripts).
- `campaign-automation` (workflows, triggers, segmentation).
- `notifications` (templates, canaux, préférences utilisateur).
- `analytics-insights` (KPI, dashboards, exports).
- `content-cms` (pages marketing, actualités, contenus statiques).
- `integration-hub` (connecteurs CRM/ERP/API tierces).

## Contrat d'autonomie attendu pour chaque microservice
- Repository/service ou module isolé.
- Schéma de données propriétaire.
- API et événements documentés.
- Stratégie de migration versionnée.
- Tests unitaires + contrat + intégration.
- SLO, alertes, dashboards dédiés.
- Runbook incident et playbook de rollback.

## Mapping UX (source Figma) -> domaines
- `/` (landing) -> `content-cms`, `analytics-insights`.
- `/services` -> `content-cms`, `integration-hub`.
- `/fonctionnalites/call-center` -> `cp-aas-call-center`, `cp-aas-voice`.
- `/industries` -> `content-cms`, `campaign-automation`.
- `/tarifs` -> `tenant-billing`, `content-cms`.
- `/actualites` -> `content-cms`.
- `/a-propos` -> `content-cms`.
- `/contact` -> `notifications`, `integration-hub` (CRM lead).
- `/login` -> `identity-access`.

## Processus opératoire (à répéter par itération)
1. Cadrage: persona, use cases, KPI, dépendances.
2. Découpage domaine: bounded contexts + ownership.
3. Contrats: API/events + versioning + erreurs.
4. Données: schémas, rétention, conformité.
5. Livraison: backlog vertical par valeur.
6. Validation: tests E2E + métriques métier + critères de go/no-go.

## Format de sortie attendu de l'agent
- Architecture cible (diagrammes textuels et responsabilités).
- Tableau microservices (owner, DB, API, événements, SLO, dépendances).
- Backlog MVP priorisé (user stories + critères d'acceptation).
- Risques majeurs + plans de mitigation.
- Questions ouvertes pour l'étape suivante.

## Définition de prêt (DoR)
- Objectifs business clarifiés.
- Pages/flux validés côté design.
- Exigences sécurité/compliance listées.
- KPIs de succès définis.

## Définition de terminé (DoD)
- Chaque service prioritaire a un contrat complet.
- Parcours critiques testables de bout en bout.
- Monitoring et alerting opérationnels définis.
- Plan de montée en charge et coût unitaire estimé.
