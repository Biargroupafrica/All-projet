# Prompt : Génération Landing Page – Actor Hub

## Contexte
Tu génères du code pour le site marketing public de **Actor Hub**, plateforme **SaaS & CPaaS** de Biar Group.  
Stack : **Next.js 15 App Router, TypeScript, Tailwind CSS v4, shadcn/ui**.

## Tâche
Génère la page `{PAGE_NAME}` (`{PAGE_PATH}`) avec le contenu suivant :

### Contenu de la page
{PAGE_CONTENT}

## Contraintes impératives

1. **Next.js App Router** : utiliser `async function Page()` + metadata export pour le SEO.
2. **Responsive** : mobile-first (sm → md → lg → xl).
3. **Dark mode** : classes `dark:` pour chaque élément de couleur.
4. **Internationalisation** : textes en français, attributs `lang="fr"` sur la page.
5. **Performance** : images avec `next/image`, lazy loading, pas de CSS inutile.
6. **Accessibilité** : attributs ARIA, focus ring visible, contraste WCAG AA.
7. **SEO** : export `metadata` avec title, description, OG tags.
8. **Design tokens** : utiliser les variables CSS de marque (`--brand-primary`, etc.) et les classes Tailwind du design system.
9. **Composants** : importer depuis `@actor-hub/ui`, ne pas recréer des composants existants.
10. **Server/Client** : garder les composants en Server Components par défaut, ajouter `'use client'` uniquement si nécessaire (interactivité, état).

## Structure attendue

```typescript
// app/(marketing)/{path}/page.tsx

import type { Metadata } from 'next'
import { ComponentA } from '@actor-hub/ui'

export const metadata: Metadata = {
  title: '...',
  description: '...',
  openGraph: {
    title: '...',
    description: '...',
    images: ['/og/{page}.png'],
  },
}

export default async function PageName() {
  // fetch data si nécessaire (API calls côté serveur)
  return (
    <main>
      {/* sections */}
    </main>
  )
}
```

## Variables à remplacer

| Variable | Description |
|----------|-------------|
| `{PAGE_NAME}` | Nom de la page (ex: Services, Tarifs) |
| `{PAGE_PATH}` | Chemin URL (ex: /services, /tarifs) |
| `{PAGE_CONTENT}` | Contenu détaillé des sections |
