# Prompts Actor Hub SaaS/CPaaS

Ce dossier regroupe les prompts de travail pour transformer les maquettes Actor Hub en plateforme SaaS/CPaaS multi-tenant, composee de microservices autonomes.

## Sources Figma

- Accueil: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1`
- Services: meme URL avec `preview-route=/services`
- Call center: meme URL avec `preview-route=/fonctionnalites/call-center`
- Industries: meme URL avec `preview-route=/industries`
- Tarifs: meme URL avec `preview-route=/tarifs`
- Actualites: meme URL avec `preview-route=/actualites`
- A propos: meme URL avec `preview-route=/a-propos`
- Contact: `https://actorhub.figma.site/contact`
- Login: meme URL avec `preview-route=/login`

## Ordre d'utilisation

1. `00-cadrage.md`: clarifier vision, perimetre, priorites et hypotheses.
2. `01-architecture-microservices.md`: definir l'architecture cible et les frontieres de services.
3. `02-design-to-code-vitrine-auth.md`: convertir les pages vitrine et login en exigences UI.
4. `03-service-template-autonome.md`: specifier une solution autonome.
5. `04-domaines-saas-cpaas.md`: specialiser les domaines Actor Hub.
6. `05-api-events-data-contracts.md`: formaliser API, evenements et donnees.
7. `06-questions-prochaine-etape.md`: questions a valider avant la suite.

## Modules de reference

- Vitrine publique: accueil, services, fonctionnalites, industries, tarifs, actualites, a-propos, contact.
- Authentification: login, roles super admin, admin, agent, customer.
- CPaaS: Call Center, SMS/SMPP, WhatsApp Business, Email/SMTP.
- SaaS transverse: multi-tenant, billing, support, frontend CMS, analytics, API integrations, audit logs.
