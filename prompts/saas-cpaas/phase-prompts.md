# Prompts par phase - Plateforme SaaS/CPaaS Actor Hub

Ces prompts servent a enchainer les etapes apres validation du cadrage. Chaque prompt doit etre complete avec les reponses du questionnaire.

## 1. Cadrage produit et domaines

```text
Tu es product architect senior. A partir des liens Figma Make Actor Hub, du questionnaire rempli et du contexte suivant, cree un cadrage produit complet pour une plateforme SaaS/CPaaS en microservices autonomes.

Contexte:
- Routes vitrine: /, /services, /fonctionnalites/call-center, /industries, /tarifs, /actualites, /a-propos, /contact, /login.
- Modules internes observes: SMS, WhatsApp, email, call center, IVR, dialers, contacts, campagnes, analytics, billing, credits, API, webhooks, support, admin, super admin.
- Principe non negociable: chaque solution doit pouvoir etre vendue, deployee, testee et exploitee comme produit autonome.

Livrables attendus:
1. Vision produit.
2. Personas et parcours principaux.
3. Carte des domaines metier.
4. Liste des solutions autonomes avec perimetre, exclusions, donnees, evenements et dependances.
5. Matrice SaaS vs CPaaS.
6. Risques, hypotheses et decisions a valider.
7. Backlog epique priorise par solution.

Contraintes:
- Reponds en francais.
- Distingue les faits du prototype, les hypotheses et les questions ouvertes.
- Ne propose pas une architecture monolithique.
```

## 2. Architecture microservices cible

```text
Tu es architecte logiciel et cloud. Concois l'architecture cible d'une plateforme SaaS/CPaaS multi-tenant composee de microservices autonomes.

Entrees:
- Cadrage produit valide.
- Solutions autonomes: Identity & Access, Tenant, Billing/Credits, Contact, Campaign, SMS, WhatsApp, Email, Voice/Call Center, IVR, AI Assistant, Analytics, Notification, API Gateway, Webhook, Support, Backoffice.

Livrables attendus:
1. Diagramme textuel C4 niveau conteneurs.
2. Frontends et backends par solution.
3. Responsabilites de chaque service.
4. Base de donnees par service et proprietaire des donnees.
5. API synchrones exposees.
6. Evenements asynchrones publies et consommes.
7. Strategie multi-tenant.
8. Strategie d'authentification, autorisation et roles.
9. Observabilite, audit, quotas et rate limits.
10. Plan de decoupage en repositories ou packages.

Contraintes:
- Chaque service doit pouvoir etre lance et teste independamment.
- Aucun service metier ne doit acceder directement a la base d'un autre service.
- Les integrations telecom doivent etre isolees par adaptateurs fournisseurs.
```

## 3. Contrats API et evenements

```text
Tu es API designer. Definis les contrats API et evenements pour les solutions autonomes de la plateforme Actor Hub.

Pour chaque solution:
1. Ressources REST ou RPC publiques.
2. Endpoints d'administration.
3. Schemas de requete/reponse.
4. Codes d'erreur.
5. Evenements publies.
6. Evenements consommes.
7. Idempotence, correlationId, tenantId, actorId.
8. Webhooks clients.
9. Exemples de payload JSON.

Solutions prioritaires:
- Identity & Access.
- Tenant.
- Billing/Credits.
- Contacts.
- Campaigns.
- SMS.
- WhatsApp.
- Email.
- Voice/Call Center.
- IVR.
- Analytics.
- Support.

Contraintes:
- Tous les contrats doivent etre versionnes.
- Les donnees sensibles doivent etre minimisables et auditables.
- Les operations d'envoi doivent etre idempotentes.
```

## 4. Implementation initiale

```text
Tu es tech lead full-stack. Genere le plan d'implementation initial d'une plateforme SaaS/CPaaS Actor Hub en microservices autonomes.

Stack a confirmer:
- Frontend web: React/Next.js ou equivalent.
- Backend services: Node.js/NestJS, Java/Spring, Go ou autre selon decision.
- Messaging: broker d'evenements.
- Databases: une base logique par service.
- API Gateway: routage, auth, rate limiting.

Livrables attendus:
1. Structure de repositories ou monorepo.
2. Arborescence cible.
3. Services a creer en premier et justification technique.
4. Contrats minimaux pour lancer un vertical slice.
5. Docker Compose local ou environnement equivalent.
6. Strategie de tests par service.
7. CI/CD minimale.
8. Definition of Done par service autonome.

Contraintes:
- Ne code pas tant que les choix de stack ne sont pas confirmes.
- Prepare une implementation incrementale par vertical slice.
- Inclure un exemple de slice: login -> tenant -> credits -> envoi SMS -> DLR -> analytics.
```

## 5. UX/UI depuis Figma Make

```text
Tu es designer-engineer. Transforme les routes Figma Make Actor Hub en specifications UI exploitables pour une plateforme SaaS/CPaaS.

Routes a couvrir:
- / landing page.
- /services.
- /fonctionnalites/call-center.
- /industries.
- /tarifs.
- /actualites.
- /a-propos.
- /contact.
- /login.

Modules dashboard a couvrir:
- SMS, WhatsApp, Email, Call Center, IVR, Contacts, Campagnes, Analytics, Billing, API, Support, Admin.

Livrables attendus:
1. Inventaire des pages.
2. Composants design system.
3. Navigation publique et privee.
4. Etats responsive.
5. Etats vides, chargement, erreurs, succes.
6. Regles d'accessibilite.
7. Mapping page -> service backend.
8. User stories UI.

Contraintes:
- Respecter le prototype Figma comme reference visuelle.
- Signaler les zones ou le prototype ne definit pas assez le comportement.
```

## 6. Securite, conformite et exploitation

```text
Tu es security architect SaaS/CPaaS. Etablis le modele de securite, conformite et exploitation pour Actor Hub.

Livrables attendus:
1. Modele RBAC/ABAC par profil: super admin, admin tenant, agent, client.
2. Isolation tenant.
3. Gestion des secrets et cles API.
4. Journalisation et audit.
5. Protection anti-abus: quotas, rate limits, spam, DNC, opt-in/opt-out.
6. Conformite telecom: consentement, DLR, conservation, tracabilite.
7. Strategie de backup et disaster recovery.
8. Observabilite: logs, traces, metriques, alertes.
9. Checklist de revue securite avant production.

Contraintes:
- Prioriser les risques CPaaS: envois frauduleux, usurpation Sender ID, couts operateurs, webhooks non verifies.
- Inclure des controles par service autonome.
```
