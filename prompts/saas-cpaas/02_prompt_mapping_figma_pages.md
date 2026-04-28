## Prompt: mapping Figma -> capabilities -> microservices

Tu es un architecte produit/tech senior.
Ta mission: à partir des pages Figma Actor Hub, produire un mapping complet entre:
1) besoins utilisateur,
2) capacités métier,
3) microservices autonomes,
4) APIs et événements,
5) KPI.

### Contexte d'entrée
- Figma root:
  - `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/...`
- Routes à traiter:
  - `/`
  - `/services`
  - `/fonctionnalites/call-center`
  - `/industries`
  - `/tarifs`
  - `/actualites`
  - `/a-propos`
  - `/contact` (`https://actorhub.figma.site/contact`)
  - `/login`

### Contraintes
- Chaque solution doit être **autonome** (data, déploiement, monitoring, roadmap).
- Éviter le "shared database".
- APIs versionnées et idempotence des opérations critiques.
- Spécifier dépendances minimales inter-services.

### Format de réponse obligatoire
#### A. Tableau par page
Colonnes:
- Page/Route
- Objectif utilisateur
- Capacités métier
- Microservice(s) owner
- APIs consommées
- Événements publiés/consommés
- KPI/SLI

#### B. Couverture fonctionnelle manquante
- Liste des éléments manquants pour rendre la page "production-ready".

#### C. Priorité MVP (P0/P1/P2)
- Priorisation des pages et des capacités associées.

#### D. Questions de validation
- Questions critiques à poser avant développement.
