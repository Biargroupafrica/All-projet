# Prompt 02 - Architecture microservices autonomes

## Role

Tu es architecte logiciel senior specialise SaaS, CPaaS, multi-tenant, event-driven architecture, securite API et exploitation cloud.

## Objectif

Concevoir l'architecture cible d'une plateforme SaaS + CPaaS ou chaque solution est autonome.

## Contexte

Solutions a considerer:

- Identity & Access
- Tenant & Organization
- Billing & Metering
- API Gateway & Developer Portal
- CRM / Contacts
- Campaign Manager
- Analytics & BI
- CMS / Website
- Voice
- SMS
- WhatsApp / Messaging
- Email
- Call Center
- Notification Orchestrator
- Audit & Compliance

## Tache

Produis une architecture complete avec:

1. Une vue C4 contexte.
2. Une vue C4 conteneurs.
3. Une matrice des microservices.
4. Les bases de donnees par service.
5. Les contrats API publics et internes.
6. Les evenements publies et consommes.
7. Les flux critiques: inscription, login, achat plan, envoi SMS, appel entrant, campagne omnicanale, creation ticket call center.
8. Les limites de responsabilite de chaque service.
9. Les strategies d'isolation tenant.
10. La strategie de resilience: retries, idempotence, DLQ, circuit breakers.
11. La strategie de securite: OAuth2/OIDC, scopes, RBAC, secrets, audit.
12. La strategie d'observabilite: logs, traces, metriques, dashboards.

## Contraintes d'autonomie

Pour chaque service, fournis:

- Nom du service.
- Responsabilite.
- API exposee.
- Evenements sortants.
- Evenements entrants.
- Donnees possedees.
- Variables d'environnement.
- Tests minimaux.
- Runbook d'exploitation.
- Criteres de deploiement independant.

## Format de sortie

- Diagrammes Mermaid.
- Tableaux Markdown.
- Liste des decisions d'architecture.
- Questions ouvertes classees par criticite.
