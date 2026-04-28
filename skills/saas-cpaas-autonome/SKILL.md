# Skill: SaaS + CPaaS Microservices Autonomes

## But du skill
Produire une architecture, un cadrage produit, et un plan d'execution pour une plateforme SaaS + CPaaS composee de microservices autonomes, deployables independamment, et gouvernes par des contrats API clairs.

## Quand utiliser ce skill
Utiliser ce skill quand le besoin porte sur:
- creation d'une plateforme SaaS multi-modules;
- ajout de capacites CPaaS (voix, SMS, WhatsApp, email, center de contact, campagnes);
- architecture microservices avec autonomie forte de chaque domaine;
- transformation de maquettes Figma en backlog produit/technique.

## Entrees minimales attendues
- Vision business (segments clients, proposition de valeur, geographies ciblees).
- Liens maquettes/flux UX.
- Contraintes de conformite (RGPD, retention, enregistrement appel, consentement).
- Contraintes d'integration (CRM, ERP, BI, paiements, IAM, partenaires telecom).

## Resultats attendus
Le skill doit toujours produire:
1. Carte des domaines (bounded contexts) SaaS + CPaaS.
2. Liste des microservices autonomes et leurs responsabilites.
3. Contrats API et evenements inter-services (versionnes).
4. Strategie data par service (database per service + ownership).
5. Modele de securite (tenant isolation, IAM, audit, secrets).
6. Plan DevOps (CI/CD, observabilite, SLO, runbooks).
7. Backlog MVP par vagues de livraison.
8. Registre des risques + mitigations.

## Regles d'architecture obligatoires
- Un microservice = un domaine fonctionnel clair.
- Pas de base de donnees partagee entre services.
- Communication synchrone reservee aux cas critiques; prioriser les evenements asynchrones.
- Contrat-first pour les APIs (OpenAPI/AsyncAPI).
- Idempotence sur traitements critiques (paiement, messaging, webhook).
- Feature flags pour chaque capability majeure.
- Chaque service doit etre deployable sans couplage de release avec les autres.

## Workflow recommande
1. **Discovery**: extraire personas, parcours, pain points depuis les maquettes.
2. **Domain design**: definir modules SaaS, modules CPaaS, et frontieres.
3. **Service catalog**: lister les services autonomes + owners + KPIs.
4. **Integration design**: definir APIs, events, webhooks, retries, DLQ.
5. **Security/compliance**: definir IAM, encryption, retention, legal hold.
6. **Ops model**: SLO, logs traces metrics, on-call, runbooks.
7. **Roadmap**: ordonner MVP, V1, V2 par valeur et dependances.
8. **Questionnaire suivant**: formaliser les inconnues bloquantes avant etape suivante.

## Format de sortie standard
Toujours repondre avec les sections:
1. Vision et hypothese produit.
2. Architecture cible (vue d'ensemble).
3. Microservices autonomes (table service -> role -> API -> events -> data).
4. Securite, conformite, souverainete.
5. Plan d'implementation en vagues.
6. Questions ouvertes pour passer a l'etape suivante.

## Contexte projet (liens de reference)
- Home: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1
- Services: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fservices
- Call center: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ffonctionnalites%2Fcall-center
- Industries: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Findustries
- Tarifs: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ftarifs
- Actualites: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Factualites
- A propos: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fa-propos
- Contact: https://actorhub.figma.site/contact
- Login: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Flogin

## Prompt de demarrage rapide
Utilise le skill "SaaS + CPaaS Microservices Autonomes". A partir des liens Figma, produis une proposition complete: decoupage des domaines, catalogue de microservices autonomes, contrats API/events, strategie securite/compliance, et roadmap MVP en vagues. Termine par les questions bloquantes a me poser avant execution.
