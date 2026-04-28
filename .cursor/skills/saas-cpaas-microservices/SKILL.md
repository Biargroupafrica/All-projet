# Skill: Conception d'une plateforme SaaS + CPaaS en microservices autonomes

## Quand utiliser ce skill
Utiliser ce skill quand il faut concevoir, cadrer, ou découper une plateforme SaaS/CPaaS où chaque solution métier doit rester autonome (code, données, déploiement, scalabilité, observabilité).

## Objectif
Produire un blueprint exécutable:
- Architecture par domaines métier.
- Catalogue de microservices indépendants.
- Contrats API et événements inter-services.
- Standards transverses (sécurité, IAM, billing, SRE, gouvernance).
- Plan de livraison par lots.

## Entrées minimales
- Vision produit et segments clients.
- Parcours cibles (ex: routes marketing et login).
- Liste des capacités attendues (call center, messaging, voice, etc.).
- Contraintes techniques (cloud, compliance, budget, SLA).

## Entrées utiles déjà connues
- Références UX/positionnement:
  - `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1`
  - `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fservices`
  - `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ffonctionnalites%2Fcall-center`
  - `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Findustries`
  - `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ftarifs`
  - `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Factualites`
  - `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fa-propos`
  - `https://actorhub.figma.site/contact`
  - `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Flogin`

## Principes d'autonomie obligatoire par solution
1. **Base de données par service** (pas de schéma partagé en écriture).
2. **Déploiement indépendant** (pipeline, versioning, rollback propres).
3. **Contrat explicite** (API versionnée + événements documentés).
4. **Isolation des pannes** (timeouts, retries, circuit breaker, bulkhead).
5. **Ownership fort** (équipe et backlog par domaine).
6. **Observabilité native** (logs, metrics, traces par service).
7. **Sécurité by default** (mTLS interne, RBAC/ABAC, secrets manager).

## Méthode en 8 étapes
1. **Cadrer les domaines**
   - Exemples: Identité, Tenancy, Billing, Catalog, CPaaS Voice, CPaaS Messaging, Contact Center, Campaigns, Analytics.
2. **Définir les bounded contexts**
   - Frontières métier nettes; éviter les entités partagées en écriture.
3. **Créer le catalogue de microservices**
   - Pour chaque service: mission, API, événements publiés/consommés, datastore, SLO.
4. **Concevoir l'intégration**
   - Synchrone pour lecture critique (API Gateway/BFF), asynchrone pour découplage (bus d'événements).
5. **Poser le modèle de tenancy**
   - Single-tenant, pooled multi-tenant, ou hybride selon offres.
6. **Concevoir le modèle commercial**
   - Packaging SaaS, tarification usage CPaaS, quotas, rate limit, facturation.
7. **Structurer la livraison**
   - MVP -> Wave 2 -> Wave 3, avec dépendances minimales entre équipes.
8. **Valider avec une checklist d'autonomie**
   - Aucun service ne doit bloquer les cycles de release d'un autre.

## Sorties attendues
- Carte des domaines et dépendances.
- Fiches microservices prêtes à implémenter.
- Matrice API/Event.
- Stratégie sécurité/compliance.
- Roadmap technique multi-phases.

## Template de fiche microservice (copier-coller)
```md
### Service: <nom>
- Domaine: <bounded context>
- Mission: <valeur métier>
- Expose: <REST/gRPC/GraphQL + endpoints>
- Publie événements: <event-name:v1>
- Consomme événements: <event-name:v1>
- Données: <type DB + ownership>
- SLO: <latence/uptime>
- Sécurité: <IAM, chiffrement, PII>
- Déploiement: <pipeline + stratégie release>
- Runbook: <alertes, dashboards, incidents>
```

## Checklist de qualité finale
- [ ] Chaque solution fonctionne en autonomie fonctionnelle et opérationnelle.
- [ ] Aucun couplage base-à-base entre services.
- [ ] Contrats API/événements versionnés.
- [ ] Traçabilité des flux critiques de bout en bout.
- [ ] Plan de montée en charge et de résilience validé.
