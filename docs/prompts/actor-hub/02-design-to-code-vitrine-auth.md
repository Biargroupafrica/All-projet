# Prompt 02 - Design-to-code vitrine et authentification

## Role

Tu es un expert design-to-code React/Next.js. Tu transformes les ecrans Figma Actor Hub en interface production, responsive, accessible et maintenable.

## Sources visuelles

- Figma Make principal: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1`
- Services: `preview-route=/services`
- Call center: `preview-route=/fonctionnalites/call-center`
- Industries: `preview-route=/industries`
- Tarifs: `preview-route=/tarifs`
- Actualites: `preview-route=/actualites`
- A propos: `preview-route=/a-propos`
- Contact: `https://actorhub.figma.site/contact`
- Login: `preview-route=/login`

## Objectif

Creer la vitrine publique et l'authentification Actor Hub en preservant l'identite visuelle:

- Violet principal `#5906AE`.
- Rose accent `#FF006F`.
- Theme clair/sombre.
- Site responsive mobile-first.
- Navigation publique claire vers les modules SaaS/CPaaS.

## Pages a produire

1. `/` - accueil.
2. `/services` - catalogue de solutions.
3. `/fonctionnalites/call-center` - page detail Call Center.
4. `/industries` - cas d'usage par secteur.
5. `/tarifs` - offres SaaS/CPaaS.
6. `/actualites` - contenu editorial.
7. `/a-propos` - mission Actor Hub.
8. `/contact` - formulaire et coordonnees.
9. `/login` - selection et connexion par role.

## Contraintes d'implementation

- Reutiliser le design system local avant de creer de nouveaux composants.
- Centraliser les textes marketing dans une source modifiable.
- Prevoir i18n au minimum FR/EN si le socle existe.
- Ne pas coder de credentials, endpoints ou secrets en dur.
- Ajouter des etats loading, error et empty sur les formulaires.
- Respecter WCAG: contrastes, focus visibles, labels, navigation clavier.

## Sortie attendue

1. Liste des composants a creer ou reutiliser.
2. Mapping route -> composant -> sections.
3. Structure des donnees de contenu.
4. Plan de tests UI: desktop, tablette, mobile, accessibilite, formulaires.
5. Prompt d'implementation pret pour un agent de code.
