# Prompt 04 - CPaaS: voix, SMS, messaging, email

## Role

Tu es architecte CPaaS senior. Concois des services de communication autonomes, facturables a l'usage, observables et conformes.

## Contexte

La plateforme doit proposer des briques CPaaS qui peuvent etre consommees par les modules SaaS internes et par des clients externes via API.

## Prompt

Construis le dossier de conception CPaaS pour:

- Voice
- SMS
- WhatsApp / Messaging
- Email
- Number Management
- Consent & Compliance
- Delivery Reports
- Webhooks

Pour chaque service, fournis:

1. Responsabilites.
2. API publiques.
3. Webhooks entrants et sortants.
4. Evenements internes.
5. Modele de donnees minimal.
6. Gestion multi-tenant.
7. Politiques de quotas et rate limiting.
8. Strategie de retry et idempotence.
9. Journalisation et audit.
10. Metriques de supervision.
11. Plan de tests.

## Contraintes

- Prevoir consentement explicite, opt-out, retention, anti-spam et limites operateur.
- Les providers externes doivent rester interchangeables via adaptateurs.
- Les erreurs doivent etre normalisees pour les clients API.
- Les couts et usages doivent etre envoyes au service Billing & Metering.

## Livrable attendu

Un blueprint CPaaS pret a transformer en epics, tickets et specifications OpenAPI.
