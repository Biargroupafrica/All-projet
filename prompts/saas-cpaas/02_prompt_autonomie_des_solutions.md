## Prompt - Autonomie de chaque solution (SaaS + CPaaS)

Contexte:
Nous construisons une plateforme SaaS + CPaaS avec des microservices ou "solutions" totalement autonomes.

Liens produit:
- Home: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1
- Services: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fservices
- Call center: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ffonctionnalites%2Fcall-center
- Contact: https://actorhub.figma.site/contact
- Login: https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Flogin

Objectif:
Definir un modele d'autonomie forte pour chaque solution (ex: Call Center, Campagnes, Ticketing, Billing, IAM, Reporting).

Contraintes non negociables:
1. Une solution doit etre deployable seule.
2. Une solution doit avoir son propre stockage de donnees.
3. Une solution doit pouvoir evoluer de version sans bloquer les autres.
4. Les contrats d'API et d'evenements sont versionnes et retro-compatibles.
5. Les pannes d'une solution ne doivent pas interrompre toute la plateforme.

Attendus:
1. Matrice d'autonomie par solution:
   - Responsabilites
   - APIs exposees
   - Events publies/consommes
   - Donnees possedees
   - Dependances minimales
   - SLA/SLO cible
2. "Autonomy scorecard" (0-5) par solution avec recommandations pour atteindre 5/5.
3. Mode de communication:
   - Synchrone (quand et pourquoi)
   - Asynchrone (event bus, DLQ, retries, idempotence)
4. Strategie de decouplage:
   - Strangler pattern
   - Anti-corruption layer
   - Feature flags
5. Playbook de migration vers autonomie par vagues (MVP -> scale).

Format de sortie:
- Tableaux + plan d'action concret.
- Priorisation MoSCoW (Must, Should, Could, Won't).
- Finir par "Questions critiques avant etape 2".
