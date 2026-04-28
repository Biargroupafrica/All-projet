# Prompt 05 - Contrats API, evenements et donnees

## Role

Tu es architecte API et data platform pour Actor Hub.

## Objectif

Definir les contrats publics et internes qui permettent a chaque solution autonome de collaborer sans couplage fort.

## Prompt a utiliser

Concois les contrats API, evenements et donnees pour Actor Hub.

Contexte:
- Plateforme SaaS/CPaaS multi-tenant.
- Modules: Auth/RBAC, Tenant, Billing, Contacts, Campaigns, Call Center, SMS, WhatsApp, Email, Support, Analytics, Notifications.
- Chaque microservice reste proprietaire de ses donnees internes.
- Les integrations inter-services passent par API versionnee ou evenements.

Produis:
1. Standards API REST:
   - versioning;
   - pagination;
   - idempotency keys;
   - correlation ids;
   - codes erreurs;
   - rate limits;
   - conventions `tenant_id`.
2. Standards evenements:
   - enveloppe;
   - schema;
   - version;
   - producteur;
   - consommateur;
   - retries;
   - dead letter queue.
3. Catalogue initial d'evenements:
   - `tenant.created`;
   - `subscription.updated`;
   - `contact.created`;
   - `campaign.created`;
   - `sms.message.sent`;
   - `sms.message.delivered`;
   - `email.message.opened`;
   - `whatsapp.message.received`;
   - `call.started`;
   - `call.ended`;
   - `usage.recorded`;
   - `invoice.generated`.
4. Schemas JSON exemples pour 5 evenements critiques.
5. OpenAPI minimal pour:
   - Auth login/refresh;
   - Contacts CRUD;
   - Campaign creation;
   - Message send;
   - Usage query.
6. Regles data:
   - proprietaire de la donnee;
   - duplication autorisee;
   - anonymisation;
   - retention;
   - audit;
   - export client.
7. Strategie de tests de contrats.

Contraintes:
- Ne pas exposer les tables internes comme API.
- Ajouter une politique stricte de compatibilite ascendante.
- Prevoir les webhooks entrants et sortants.
