---
name: actor-hub-saas-cpaas
description: Utiliser ce skill pour cadrer, concevoir ou generer la plateforme Actor Hub SaaS/CPaaS en microservices autonomes a partir des maquettes Figma Make et des modules metier.
---

# Skill: Actor Hub SaaS/CPaaS

## Objectif

Construire Actor Hub comme une plateforme SaaS/CPaaS multi-tenant composee de solutions autonomes. Chaque solution doit pouvoir etre developpee, testee, deployee et exploitee sans dependance forte aux autres domaines.

## Sources de reference

- Figma Make: `XDPnl4zhusx3vecuWQTYFx`
- Routes vitrine: `/`, `/services`, `/fonctionnalites/call-center`, `/industries`, `/tarifs`, `/actualites`, `/a-propos`, `/contact`
- Route auth: `/login`
- Modules principaux identifies: Call Center, SMS Bulk/SMPP, WhatsApp Business, Email Marketing/SMTP, Billing, Auth/RBAC, Support, Frontend CMS, Analytics, API/Integrations.

## Principes non negociables

1. Chaque solution est autonome: base de donnees logique, API, worker, files d'attente, tests, observabilite et configuration propres.
2. Les integrations entre solutions passent par des contrats publics: API versionnees, evenements, webhooks ou messages asynchrones.
3. Le multi-tenant est transverse: `tenant_id`, isolation des donnees, quotas, facturation, audit logs et permissions par role.
4. Le frontend consomme des BFF/API Gateway stables, jamais les tables internes d'un service.
5. Les services CPaaS doivent etre concus pour la delivrabilite, les quotas, la conformite, les retries, les statuts de livraison et la tracabilite.

## Demarche recommandee

1. Lire les prompts dans `docs/prompts/actor-hub/README.md`.
2. Demarrer par `00-cadrage.md` pour transformer les besoins en backlog executable.
3. Produire l'architecture avec `01-architecture-microservices.md`.
4. Deriver les pages publiques et auth avec `02-design-to-code-vitrine-auth.md`.
5. Generer chaque solution avec `03-service-template-autonome.md` puis specialiser avec `04-domaines-saas-cpaas.md`.
6. Verrouiller les contrats avec `05-api-events-data-contracts.md`.
7. Completer les reponses aux questions de `06-questions-prochaine-etape.md` avant implementation full stack.

## Definition d'une solution autonome

Une solution autonome contient au minimum:

- Un domaine metier clair et un proprietaire fonctionnel.
- Un service API public et un service interne si necessaire.
- Un schema de donnees versionne et des migrations propres.
- Une file d'evenements ou de jobs pour les traitements longs.
- Des connecteurs fournisseurs isoles derriere des ports/adapters.
- Des tests unitaires, integration API, contrats et smoke tests.
- Des metriques SLO: disponibilite, latence, taux d'erreur, consommation, cout.
- Un runbook: configuration, secrets, incidents, rollback, monitoring.

## Livrables attendus par iteration

- Decision d'architecture documentee.
- Contrats API/evenements.
- Modele de donnees.
- Plan de tests.
- Prompt specialise pour l'agent de code.
- Questions ouvertes bloquantes ou hypotheses explicites.
