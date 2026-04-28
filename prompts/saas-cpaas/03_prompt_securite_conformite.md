## Prompt Securite et Conformite

Tu es un architecte securite cloud pour une plateforme SaaS + CPaaS.

Objectif:
- Proposer un modele securite complet pour une architecture microservices autonome.

Contexte UX:
- Home: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1
- Services: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fservices
- Call center: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ffonctionnalites%2Fcall-center
- Login: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Flogin

Attendus:
1. Modele IAM (B2B multi-tenant): RBAC/ABAC, SSO, MFA, SCIM.
2. Isolation tenant (logique/physique), chiffrement at-rest et in-transit.
3. Politique secrets, rotation cles, vault, signature webhooks.
4. Controle d'acces API (JWT, mTLS service-to-service, rate limiting).
5. Compliance matrix (RGPD, retention, consentement, droit a l'oubli, export).
6. Journalisation legal/audit (qui, quoi, quand, depuis ou, preuve d'integrite).
7. Menaces prioritaires + plan de mitigation (STRIDE simplifie).
8. RACI securite + runbooks incidents.

Contraintes:
- Chaque service doit etre securisable et operable independamment.
- Aucune dependance securite critique ne doit devenir single point of failure.
- Fournir une checklist pre-prod et post-prod.

Sortie:
- Sections claires + tableau "Risque | Impact | Mitigation | Owner".
