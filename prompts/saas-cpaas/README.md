# Prompts SaaS/CPaaS Actor Hub

Ce dossier contient les prompts et questions pour transformer le prototype Figma Actor Hub en plateforme SaaS/CPaaS composee de microservices autonomes.

## Fichiers

- `master-platform-prompt.md` : prompt global pour cadrer la plateforme complete.
- `phase-prompts.md` : prompts specialises par etape : cadrage, architecture, API, frontend, backend, DevOps, QA.
- `questions-cadrage.md` : questions a poser avant de passer a la suite.
- `../../skills/saas-cpaas-platform.md` : skill a charger quand un agent travaille sur ce sujet.

## Utilisation recommandee

1. Charger le skill `skills/saas-cpaas-platform.md`.
2. Repondre au questionnaire `questions-cadrage.md`.
3. Lancer `master-platform-prompt.md` avec les reponses obtenues.
4. Utiliser `phase-prompts.md` pour produire les livrables suivants dans l'ordre :
   - cadrage produit ;
   - architecture microservices ;
   - contrats API et evenements ;
   - implementation backend par service ;
   - implementation frontend ;
   - DevOps et observabilite ;
   - validation QA.

## Questions prioritaires a poser au client

1. Quelle solution doit etre construite en premier : SMS, WhatsApp, call center, email, portail client, portail admin ou vitrine ?
2. Chaque solution doit-elle etre deployable seule avec son frontend, son backend, sa base et ses workers ?
3. Quelle stack technique est preferee pour frontend, backend, base de donnees et deploiement ?
4. Quels fournisseurs CPaaS sont obligatoires au lancement ?
5. Quel modele de facturation faut-il supporter : abonnement, credits, usage, utilisateurs ou hybride ?
