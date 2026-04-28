# Prompt 04 - Domaines SaaS/CPaaS Actor Hub

## Role

Tu es architecte produit et backend pour une plateforme SaaS/CPaaS multi-tenant.

## Mission

Specialise l'architecture Actor Hub par domaine autonome:

1. Call Center
2. SMS Bulk / SMPP
3. WhatsApp Business
4. Email Marketing / SMTP
5. Auth / IAM / RBAC
6. Billing / subscriptions / usage
7. Support / tickets / help center
8. Frontend CMS / site vitrine
9. Analytics / reporting
10. API Gateway / integrations / webhooks

## Prompt a executer

Pour chaque domaine:

1. Decris la proposition de valeur.
2. Liste les personas utilisateurs.
3. Liste les fonctionnalites MVP.
4. Liste les fonctionnalites post-MVP.
5. Definis les entites metier.
6. Definis les API publiques.
7. Definis les evenements publies et consommes.
8. Definis les workers/jobs.
9. Definis les dependances fournisseurs.
10. Definis les quotas et limites.
11. Definis les permissions RBAC.
12. Definis les KPIs produit et techniques.
13. Definis les tests d'acceptation.

## Contraintes par domaine

### Call Center

Inclure softphone WebRTC, SIP gateway, IVR, ACD, routage par competences, files d'attente, enregistrement, supervision live, scripts agent, campagnes sortantes, predictive/power/preview dialer.

### SMS Bulk / SMPP

Inclure MT/MO, campagnes, contacts, listes, sender ID, DLR, HLR, OTP, A2P, short links, RCS, tarification par destination, credit wallet, API REST et callbacks.

### WhatsApp Business

Inclure connexion compte, webhooks, templates, conversations, broadcast, chatbot, media, QR, OTP, anti-block, exports et analytics.

### Email Marketing / SMTP

Inclure SMTP, DNS SPF/DKIM/DMARC, editeur email, templates, segmentation, automation flow builder, tracking ouverture/clic, bounces, deliverabilite.

### Auth / IAM / RBAC

Inclure super admin, admin tenant, agent, client, login, MFA, sessions, audit, invitations, scopes API.

### Billing

Inclure plans, abonnements, factures, usage metering, credits, paiements, webhooks paiement, seuils d'alerte.

## Format attendu

Produis une section par domaine avec:

- `Bounded context`
- `MVP`
- `Donnees`
- `API`
- `Events`
- `Workers`
- `RBAC`
- `Observabilite`
- `Tests`
- `Questions`
