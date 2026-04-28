## Prompt 01 - Architecture microservices autonomes

Tu es architecte principal SaaS/CPaaS.

Conçois une architecture où chaque solution est autonome:
- équipe dédiée,
- base de données dédiée,
- API dédiée,
- pipeline de déploiement dédié,
- observabilité dédiée.

### Sources UX à intégrer
- `/`
- `/services`
- `/fonctionnalites/call-center`
- `/industries`
- `/tarifs`
- `/actualites`
- `/a-propos`
- `/contact`
- `/login`

### Livrables obligatoires
1. **Carte des bounded contexts** (noms clairs, responsabilités, frontières).
2. **Tableau des microservices**:
   - nom,
   - mission,
   - type de DB,
   - endpoints principaux,
   - événements émis/consommés,
   - dépendances,
   - SLO cible,
   - risques.
3. **Patterns transverses**:
   - authN/authZ,
   - multi-tenant,
   - facturation/quotas,
   - observabilité,
   - résilience.
4. **Plan de versioning API/events**.
5. **Scénarios de pannes** (au moins 5) + comportement attendu.

### Contraintes
- Zéro base de données partagée entre domaines métiers.
- Aucune logique métier critique dans le frontend.
- Communication synchrone minimale, asynchrone privilégiée pour découplage.
- Prévoir conformité (journal d'audit, rétention, droit à l'effacement).

### Format de réponse
- Section 1: Vision architecture.
- Section 2: Tableau microservices.
- Section 3: Flux inter-services (texte séquentiel).
- Section 4: Risques + mitigations.
- Section 5: Décisions à trancher.
