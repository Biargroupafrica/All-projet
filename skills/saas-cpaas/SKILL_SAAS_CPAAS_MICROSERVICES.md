# Skill: Conception d une plateforme SaaS + CPaaS en microservices autonomes

## Quand utiliser ce skill
- Quand il faut concevoir une plateforme SaaS multi-tenant avec des capacites CPaaS (voix, SMS, messaging, call center, automation).
- Quand l objectif est d avoir des solutions **autonomes**: chaque domaine metier est isole, deployable et exploitable independamment.

## Entrees attendues
- Liens de reference UX/UI (Figma / pages publiques).
- Liste des routes ou modules cibles (ex: `/services`, `/fonctionnalites/call-center`, `/tarifs`, `/login`, `/contact`).
- Contraintes metier, techniques, securite, conformite, pays de deploiement.

## Sorties attendues
1. Cartographie des domaines (bounded contexts) et microservices.
2. Contrats API inter-services (REST/gRPC/events).
3. Modele d autonomie par service (codebase, donnees, CI/CD, observabilite, SLO).
4. Plan d implementation par lots (MVP -> scale).
5. Backlog de questions critiques avant passage a l etape suivante.

## References source (cette demande)
- Home: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1`
- Services: `...&preview-route=%2Fservices`
- Call center: `...&preview-route=%2Ffonctionnalites%2Fcall-center`
- Industries: `...&preview-route=%2Findustries`
- Tarifs: `...&preview-route=%2Ftarifs`
- Actualites: `...&preview-route=%2Factualites`
- A propos: `...&preview-route=%2Fa-propos`
- Contact: `https://actorhub.figma.site/contact`
- Login: `...&preview-route=%2Flogin`

## Definition d un microservice autonome
Un service est autonome si, au minimum:
- Il possede sa base de donnees (ou son schema dedie), sans acces direct aux donnees d un autre service.
- Il peut etre build, teste, versionne, deploye et rollbacke independamment.
- Il expose des contrats explicites (API/events versionnes).
- Il embarque sa telemetrie (logs, metriques, traces), ses alertes, et ses SLO.
- Il supporte une gouvernance de securite propre (IAM scopes, secrets, policies).

## Processus recommande
1. **Extraire le scope produit depuis les ecrans**
   - Lister les capacites visibles par page.
   - Identifier les workflows transverses (inscription, onboarding, paiement, usage CPaaS, support).
2. **Decouper en domaines metier**
   - Exemples frequents: Identity, Tenant, Billing, Product Catalog, Communication Orchestration, Call Center, Campaigns, Analytics, Notification, Support.
3. **Definir le modele d autonomie**
   - Ownership d equipe, stockage, pipeline de deploiement, runbook.
4. **Specifier les contrats**
   - API sync pour requetes interactives.
   - Evenements async pour integration lache.
5. **Concevoir les plans de resilience**
   - Retries, idempotence, circuit breaker, DLQ, compensation.
6. **Valider la conformite**
   - RGPD, chiffrement, audit trail, conservation, souverainete des donnees.
7. **Prioriser la livraison**
   - MVP metier + fondations plateforme, puis iterations.

## Modele de sortie structure (a appliquer a chaque proposition)
Pour chaque microservice:
- `Nom`
- `Responsabilite unique`
- `API exposees`
- `Evenements publies / consommes`
- `Base de donnees`
- `Dependances autorisees`
- `SLO (latence, disponibilite, erreurs)`
- `Runbook incidents`
- `Niveau d autonomie (1-5) + preuves`

## Checklist de validation finale
- [ ] Aucun couplage fort inter-services (hors contrats explicites).
- [ ] Chaque service peut etre deploye sans redeployer tout le systeme.
- [ ] Les flux critiques sont tracables de bout en bout.
- [ ] Les exigences securite et conformite sont couvertes.
- [ ] Les decisions d architecture sont justifiees par les besoins produits visibles dans les ecrans.

## Anti-patterns a eviter
- Base de donnees partagee entre services metier.
- "Microservices" qui ne sont que des couches techniques sans ownership metier.
- Communication synchrone partout (sans eventing ni resilience).
- Contrats non versionnes.
- Login/tenant/billing dissemines dans tous les services.
