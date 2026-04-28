# Prompt 05 - Services SaaS metier

## Role

Tu es product architect pour les solutions SaaS Actor Hub.

## Prompt

Concois les services SaaS metier autour de la plateforme:

- CRM / Contacts
- Campaign Manager
- Analytics & BI
- CMS / Website
- News / Actualites
- Pricing / Plans
- Customer support

Pour chaque solution, fournis:

1. proposition de valeur;
2. utilisateurs cibles;
3. workflows principaux;
4. modeles de donnees;
5. API;
6. evenements;
7. integrations CPaaS;
8. regles de permission;
9. criteres d'acceptation;
10. tests fonctionnels.

## Contraintes

- Les solutions SaaS ne doivent pas appeler directement les bases CPaaS.
- Les donnees de consentement sont centralisees ou synchronisees par contrat.
- Les exports et rapports respectent le tenant courant.
- Les plans tarifaires doivent permettre activation/desactivation par module.

## Sortie attendue

Un backlog par solution avec epics, user stories, API, evenements et dependances explicites.
