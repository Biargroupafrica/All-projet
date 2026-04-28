## Prompt 01 - Architecture microservices SaaS + CPaaS

Contexte:
- Je construis une plateforme SaaS + CPaaS.
- Chaque solution doit etre autonome et deployable independamment.
- Maquettes source:
  - Home: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1
  - Services: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fservices
  - Call center: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ffonctionnalites%2Fcall-center
  - Industries: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Findustries
  - Tarifs: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ftarifs
  - Actualites: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Factualites
  - A propos: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fa-propos
  - Contact: https://actorhub.figma.site/contact
  - Login: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Flogin

Mission:
Propose une architecture microservices orientee DDD avec une autonomie forte par domaine (database per service, ownership clair, API/events versionnes, deploiement independant).

Contraintes obligatoires:
1) Pas de base partagee entre services.
2) Limiter synchrone aux besoins critiques.
3) Favoriser event-driven pour decouplage.
4) Idempotence et retries sur traitements critiques.
5) Observabilite complete (logs, traces, metrics) par service.

Sortie attendue:
1. Bounded contexts SaaS et CPaaS.
2. Catalogue des microservices (nom, role, APIs, events, data store, SLO, owner).
3. Diagramme logique texte des flux inter-services.
4. Regles de versioning API et evenements.
5. Risques d'architecture + mitigations.
