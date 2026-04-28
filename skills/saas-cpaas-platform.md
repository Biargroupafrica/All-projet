# Skill: Plateforme SaaS/CPaaS Actor Hub en microservices autonomes

## Quand utiliser ce skill

Utiliser ce skill pour concevoir, decouper, generer ou faire evoluer une plateforme SaaS/CPaaS inspiree d'Actor Hub, avec des microservices capables d'etre developpes, testes, deployes et exploites de facon autonome.

Ce skill s'applique notamment aux modules suivants :

- Site vitrine : accueil, services, fonctionnalites, industries, tarifs, actualites, a propos, contact.
- Authentification : login client, agent, admin, super-admin, 2FA, recuperation de mot de passe.
- Administration SaaS : tenants, utilisateurs, roles, permissions, facturation, credits, audit logs.
- CPaaS messaging : SMS, WhatsApp, email, RCS, OTP, short links, templates, campagnes, rapports DLR.
- CPaaS voice : call center, softphone, IVR, ACD, files d'attente, routage, dialers, SIP, enregistrements.
- Data et analytics : tableaux de bord, rapports, logs API, supervision, export.
- Support : tickets, chat support, documentation, base de connaissances.
- Integrations : webhooks, API publique, CRM, CTI, Twilio, Plivo, Nexmo, SMTP, SMPP.

## Sources design et parcours a prendre en compte

- Figma Make principal : `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-`
- Routes vitrine : `/`, `/services`, `/fonctionnalites/call-center`, `/industries`, `/tarifs`, `/actualites`, `/a-propos`, `/contact`.
- Route login : `/login`.
- Site public contact : `https://actorhub.figma.site/contact`.

## Objectif produit

Construire une plateforme multi-tenant ou chaque solution peut fonctionner comme produit autonome :

- SaaS core : identity, tenant management, billing, credits, roles, audit, support.
- CPaaS SMS : envoi unitaire, bulk, campagnes, SMPP, sender ID, DLR, OTP, HLR, opt-out.
- CPaaS WhatsApp : conversations, templates, broadcast, chatbot, media, analytics, anti-block.
- CPaaS email : campagnes, SMTP, domaines, DNS auth, templates, segmentation, automation.
- CPaaS voice/call center : agents, queues, ACD, IVR, dialers, softphone, monitoring, reporting.
- API platform : API keys, webhooks, rate limits, logs, monitoring, SDKs, documentation.

Chaque solution autonome doit avoir :

- Son bounded context et son domaine.
- Son API publique et interne.
- Sa base de donnees ou son schema isole.
- Ses workers et files d'evenements si necessaire.
- Ses tests automatises.
- Son pipeline de deploiement.
- Sa documentation d'exploitation.
- Son observabilite : logs, metriques, traces, alertes.

## Principes d'architecture

1. Commencer par les parcours utilisateurs et les contrats API, pas par la technologie.
2. Preferer des microservices par capacite metier stable plutot que par ecran.
3. Eviter qu'un service lise directement la base d'un autre service.
4. Utiliser des evenements pour les changements importants : message envoye, DLR recu, appel termine, facture creee, credit consomme.
5. Centraliser les decisions transverses dans des services dedies : identity, tenant, billing, audit.
6. Garder les connecteurs operateurs remplacables : SMPP, SMTP, WhatsApp Business, SIP trunk, fournisseurs SMS.
7. Definir une strategie de degradation : retry, idempotence, dead-letter queue, statut final fiable.
8. Isoler les donnees tenant et appliquer RBAC/ABAC a chaque appel.
9. Documenter les limites de chaque service : proprietaire des donnees, SLA, quotas, dependances.
10. Livrer par increments verticaux testables.

## Processus de travail

### 1. Cadrer

- Lire les prompts de cadrage.
- Identifier le persona cible : visiteur, client, agent, superviseur, admin, super-admin, support.
- Lister les parcours obligatoires et les routes Figma associees.
- Poser les questions bloquantes avant de figer l'architecture.

### 2. Decouper

- Produire une carte des domaines.
- Definir les microservices autonomes.
- Identifier les donnees maitres et les evenements.
- Definir les contrats API et les integrations.

### 3. Generer

- Creer une structure monorepo ou polyrepo selon le choix projet.
- Generer un squelette par service : API, domaine, persistence, tests, documentation.
- Ajouter une passerelle API, une UI shell et les modules front par solution.
- Ajouter les contrats OpenAPI/AsyncAPI.

### 4. Verifier

- Tester chaque service seul.
- Tester les contrats API.
- Tester les parcours bout en bout par solution.
- Verifier multi-tenancy, RBAC, facturation, idempotence et observabilite.

### 5. Documenter

- Documenter decisions d'architecture.
- Maintenir la matrice services/domaines/evenements.
- Ajouter les questions ouvertes et les hypotheses.
- Preparer les prompts de la phase suivante.

## Definition of Done

Un lot est termine seulement si :

- Le service ou module est autonome et lanceable sans dependances implicites non documentees.
- Les contrats API sont versionnes.
- Les migrations de donnees sont presentes si necessaire.
- Les tests critiques passent.
- Les risques securite et tenant isolation sont traites.
- Les evenements sortants et entrants sont documentes.
- La documentation indique comment developper, tester, deployer et diagnostiquer le lot.

## Sorties attendues

Selon la phase, produire :

- Architecture cible.
- Backlog epics/features/user stories.
- Carte des microservices.
- Contrats API.
- Modeles de donnees.
- Schema d'evenements.
- Plan de securite.
- Plan de tests.
- Prompts d'implementation par service.
- Liste de questions pour l'etape suivante.
