# Skill: Plateforme SaaS et CPaaS autonome

## Quand utiliser ce skill

Utilise ce skill lorsqu'il faut concevoir, générer, auditer ou faire evoluer une plateforme SaaS et CPaaS inspiree des maquettes Actor Hub / Biar Group, avec des microservices ou solutions capables de fonctionner de maniere autonome.

Sources de reference fournies:

- Landing page: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1`
- Services: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fservices`
- Call center: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ffonctionnalites%2Fcall-center`
- Industries: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Findustries`
- Tarifs: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ftarifs`
- Actualites: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Factualites`
- A propos: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fa-propos`
- Contact: `https://actorhub.figma.site/contact`
- Login: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Flogin`

## Objectif

Produire une plateforme modulaire ou chaque solution peut etre livree, deployee, testee, supervisee et facturee de facon independante, tout en partageant des contrats standards: identite, tenant, audit, observabilite, catalogue, facturation, consentement et API gateway.

## Principes non negociables

- Chaque solution expose sa propre API, sa base de donnees logique, ses migrations, ses tests et son runbook.
- Aucune solution metier ne depend directement de la base de donnees d'une autre solution.
- Les integrations inter-services passent par API contractuelle, evenements ou commandes asynchrones.
- Les contrats publics sont versionnes et documentes avec exemples de payload.
- Le multi-tenant est explicite dans les modeles, les politiques d'acces, la facturation et les traces.
- Les operations CPaaS respectent consentement, opt-in, opt-out, journalisation, delivrabilite et limites d'usage.
- Les donnees sensibles sont chiffrees au repos et en transit; les secrets ne sont jamais commites.
- L'interface doit rester coherente avec les parcours Figma fournis: accueil, services, fonctionnalites, industries, tarifs, actualites, a propos, contact et login.

## Carte de solutions autonomes

| Domaine | Solution autonome | Responsabilite principale |
| --- | --- | --- |
| Fondation | Identity & Access | Authentification, SSO, RBAC, MFA, sessions, comptes de service |
| Fondation | Tenant & Organization | Organisations, espaces clients, domaines, invitations, quotas |
| Fondation | Billing & Metering | Plans, abonnements, credits, taxes, factures, usages CPaaS |
| Fondation | API Gateway & Developer Portal | Routage, cles API, limites, webhooks, documentation |
| SaaS | CRM / Contacts | Contacts, entreprises, segments, consentements, listes |
| SaaS | Campaign Manager | Campagnes omnicanales, templates, planification, A/B tests |
| SaaS | Analytics & BI | KPIs, dashboards, exports, attribution, alertes |
| SaaS | CMS / Website | Pages marketing, actualites, SEO, formulaires |
| CPaaS | Voice | Numeros, appels, IVR, enregistrements, routage vocal |
| CPaaS | SMS | Envoi, reception, templates, STOP, rapports operateurs |
| CPaaS | WhatsApp / Messaging | Conversations, templates approuves, files, pieces jointes |
| CPaaS | Email | Domaines, delivrabilite, templates, tracking |
| Centre de contact | Call Center | Files, agents, presence, routage, scripts, supervision |
| Plateforme | Notification Orchestrator | Notifications internes, preferences, canaux, retries |
| Plateforme | Audit & Compliance | Traces immuables, export legal, retention, rapports |

## Workflow recommande

1. Lire les prompts dans `prompts/saas-cpaas-platform/README.md`.
2. Demarrer par `00-master-orchestrator.md` pour cadrer le programme.
3. Utiliser `01-product-discovery.md` pour transformer les liens Figma en parcours produit.
4. Utiliser `02-architecture-microservices.md` pour decouper les solutions autonomes.
5. Utiliser `03-frontend-from-figma.md` pour generer l'experience web a partir des routes Figma.
6. Utiliser les prompts specialises CPaaS, SaaS, DevOps et template de solution selon le module a construire.
7. Terminer par `08-questions-next-steps.md` afin de collecter les decisions bloquantes avant implementation.

## Definition of Done

- Le perimetre fonctionnel est mappe par route Figma et par solution autonome.
- Chaque solution a son README, son modele de donnees, ses API, ses evenements, ses variables d'environnement, ses tests et ses criteres d'acceptation.
- Les parcours publics et prives sont distingues: landing, services, tarifs, actualites, contact, login, espaces client et back-office.
- Les risques principaux sont traites: tenancy, isolation des donnees, facturation usage, conformite communications, resilence CPaaS, securite API.
- Les questions ouvertes sont listees avec des choix proposes.
