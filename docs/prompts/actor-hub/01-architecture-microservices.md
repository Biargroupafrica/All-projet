# Prompt 01 - Architecture microservices SaaS/CPaaS

## Role

Tu es architecte logiciel senior SaaS/CPaaS. Tu dois concevoir Actor Hub comme une plateforme multi-tenant en microservices autonomes.

## Entrees

- Vision: plateforme SaaS/CPaaS multi-tenant Actor Hub.
- Modules: Call Center, SMS, WhatsApp, Email, Auth/RBAC, Billing, Analytics, Support, Frontend CMS, API/Integrations.
- Contraintes: autonomie par solution, contrats publics, observabilite, scalabilite, securite, isolation tenant.
- References Figma: routes vitrine et dashboard listees dans `README.md`.

## Tache

Produis une architecture cible avec:

1. Vue systeme.
2. Decoupage des microservices.
3. Responsabilites de chaque service.
4. Communications synchrones et asynchrones.
5. Frontend/BFF/API Gateway.
6. Strategie multi-tenant.
7. Authentification et autorisation.
8. Donnees et ownership par service.
9. Observabilite, logs, traces, metriques.
10. Deploiement et environnements.

## Microservices de depart

- `identity-service`: utilisateurs, tenants, roles, permissions, sessions, MFA.
- `billing-service`: plans, abonnements, invoices, paiements, credits, usage rating.
- `contact-service`: contacts, listes, segments, consentements, attributs.
- `campaign-service`: campagnes omnicanales, calendrier, orchestration transverse.
- `sms-service`: SMS MT/MO, SMPP, DLR, sender IDs, HLR, short links, quotas.
- `whatsapp-service`: WABA, templates, conversations, webhooks, media, chatbot.
- `email-service`: SMTP, campagnes email, templates, tracking, bounce handling.
- `call-center-service`: appels, files, agents, routage, IVR, softphone, enregistrements.
- `analytics-service`: agrégation, dashboards, KPIs, exports.
- `notification-service`: notifications internes, alertes, emails transactionnels.
- `integration-service`: webhooks sortants, API keys, SDK, connecteurs tiers.
- `support-service`: tickets, FAQ, live chat, documentation.
- `frontend-cms-service`: pages vitrine, menus, medias, SEO.
- `audit-service`: audit logs, compliance, traces d'actions sensibles.

## Format de sortie

- Architecture en sections courtes.
- Tableau `service | ownership | API | events | data store | jobs | SLO`.
- Liste des evenements de domaine.
- Decisions techniques explicites.
- Risques et arbitrages.

## Critere de qualite

Chaque solution doit rester exploitable seule. Si un service tombe, les autres doivent degrader proprement sans perte de donnees critique.
