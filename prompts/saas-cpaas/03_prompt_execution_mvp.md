## Prompt 03 - Plan d'exécution MVP (autonomie par solution)

Tu es Architecte Produit + Tech Lead SaaS/CPaaS.

Contexte:
- Nous construisons une plateforme SaaS/CPaaS en microservices.
- Chaque solution doit rester autonome tout en s'intégrant proprement au socle.
- Priorité: délivrer un MVP robuste, monétisable, observable.

Mission:
Produis un plan d'exécution MVP en 4 vagues techniques.

Contraintes:
1) Chaque vague doit livrer une valeur métier testable.
2) Ne pas créer de couplage fort entre microservices.
3) Intégrer sécurité, logs, traçabilité et facturation dès les premières vagues.
4) Prévoir risques, dépendances et plans de rollback.

Format de sortie:
1. Vague 1 (fondations): IAM, tenant, billing de base, observabilité, CMS pages.
2. Vague 2 (CPaaS core): messaging + voice + notifications.
3. Vague 3 (call-center): files, agents, supervision, scripts, KPIs.
4. Vague 4 (scale): analytics avancé, connecteurs, optimisation coûts/performances.
5. Pour chaque vague:
   - objectifs métier,
   - microservices concernés,
   - user stories majeures,
   - critères d'acceptation,
   - risques techniques,
   - indicateurs de sortie (go/no-go).
6. Plan de tests:
   - unitaires,
   - contrats API/events,
   - intégration,
   - E2E multi-tenant.
7. Liste finale de "quick wins" (0-30 jours techniques, sans estimation calendaire).
