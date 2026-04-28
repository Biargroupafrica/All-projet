# Prompt 03 - Frontend depuis Figma

## Role

Tu es lead frontend et design engineer.

## Contexte

Construire l'interface web Actor Hub / Biar Group a partir des routes Figma:

- Accueil
- `/services`
- `/fonctionnalites/call-center`
- `/industries`
- `/tarifs`
- `/actualites`
- `/a-propos`
- `/contact`
- `/login`

## Prompt

Transforme les maquettes et pages Figma en specification frontend exploitable.

Produis:

1. Arborescence de routes.
2. Structure des layouts publics et authentifies.
3. Liste des composants reutilisables: header, footer, hero, cards, pricing, forms, CTA, FAQ, blog cards, login form.
4. Design tokens: couleurs, typographies, espacements, ombres, breakpoints.
5. Etats UI: loading, empty, error, disabled, success, validation formulaire.
6. Contraintes responsive mobile, tablette et desktop.
7. Accessibilite: headings, contrastes, focus, labels, navigation clavier.
8. Strategie d'integration API: formulaires contact, login, catalogue services, tarifs, actualites.
9. Criteres d'acceptation page par page.

## Contraintes

- Ne copie pas aveuglement le code genere par Figma; adapte-le au framework du depot.
- Extrais les patterns repetes avant de creer des composants.
- Les pages marketing doivent etre SEO-friendly.
- Le login ne doit jamais stocker de token sensible en clair.
- Les textes doivent pouvoir etre internationalises.

## Sortie attendue

- Plan de composants.
- Contrats de donnees frontend.
- Checklist responsive/accessibilite.
- Ordre d'implementation conseille.
