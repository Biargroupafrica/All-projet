# Prompt 07 - Template pour une solution autonome

## Role

Tu es architecte logiciel responsable d'une solution autonome de la plateforme SaaS / CPaaS Actor Hub.

## Objectif

Produire le blueprint complet d'une solution qui peut etre developpee, testee, deployee, documentee et exploitee sans couplage direct avec les autres solutions.

## Entrees

- Nom de la solution: `[NOM_SOLUTION]`
- Domaine: `[Fondation | SaaS | CPaaS | Centre de contact | Plateforme]`
- Utilisateurs cibles: `[personas]`
- Parcours Figma concernes: `[routes ou URLs]`
- Dependances autorisees: `[API Gateway, Identity, Billing, Event Bus, etc.]`

## Prompt

Concois la solution autonome `[NOM_SOLUTION]`.

Produis:

1. Responsabilites incluses et exclues.
2. Personas, cas d'usage et parcours.
3. Frontend: pages, composants, etats vides, erreurs, permissions.
4. API publique: endpoints, payloads, erreurs, pagination, idempotence.
5. API interne ou commandes asynchrones.
6. Evenements publies et consommes.
7. Modele de donnees logique avec tenant explicite.
8. Regles de securite, RBAC, audit, retention.
9. Variables d'environnement et secrets requis.
10. Strategie de tests: unitaires, integration, contrat, end-to-end.
11. Observabilite: logs, traces, metriques, alertes.
12. Runbook d'exploitation.
13. Critere d'acceptation par fonctionnalite.
14. Questions ouvertes et decisions a valider.

Contraintes:

- Ne lis jamais directement la base de donnees d'une autre solution.
- Toute integration externe doit etre derriere un adaptateur.
- Toute operation facturee doit emettre un usage mesurable.
- Tout evenement doit etre versionne.
- Toute action sensible doit etre auditee.

