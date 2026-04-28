## Prompt maitre - Plateforme SaaS + CPaaS autonome

Contexte:
- Je construis une plateforme SaaS + CPaaS composee de microservices autonomes.
- Chaque solution doit etre independante, deployable seule, observable, et governable.
- Base-toi sur ces references UX:
  - Home: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1
  - Services: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fservices
  - Call center: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ffonctionnalites%2Fcall-center
  - Industries: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Findustries
  - Tarifs: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ftarifs
  - Actualites: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Factualites
  - A propos: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fa-propos
  - Contact: https://actorhub.figma.site/contact
  - Login: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Flogin

Objectif:
Produis un blueprint execution-ready pour une plateforme SaaS + CPaaS en microservices autonomes.

Contraintes obligatoires:
1. Un service = un domaine metier.
2. Database per service, zero schema partage.
3. APIs versionnees (OpenAPI) + events versionnes (AsyncAPI).
4. Communication event-driven par defaut; sync uniquement pour cas critiques.
5. Multi-tenant natif + isolation des donnees.
6. Observabilite by design (logs, metrics, traces, alerting).
7. Securite by design (IAM, RBAC/ABAC, chiffrement, audit).
8. Chaque service deployable independamment.

Sortie demandee:
1. Vision produit et hypotheses.
2. Bounded contexts et carte de domaines.
3. Catalogue microservices (nom, role, APIs, events, data owner, SLA/SLO).
4. Architecture technique (BFF/API Gateway, event bus, workflow, storage).
5. Securite, compliance, gouvernance.
6. Plan de livraison par vagues (MVP -> V1 -> V2).
7. Risques majeurs et mitigations.
8. Questions critiques a me poser pour lancer l'etape suivante.
