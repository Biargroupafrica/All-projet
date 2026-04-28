# Skill : Landing Page – Actor Hub

## Quand utiliser ce skill
Utiliser ce skill pour toute tâche impliquant le site public `apps/landing/` :
- Création ou modification de pages marketing (accueil, services, tarifs, industries, actualités, à propos, contact, login)
- Ajout de composants UI marketing (hero, pricing table, feature grid, testimonials, FAQ)
- Intégration de formulaires (contact, demande de démo, inscription)

---

## Architecture du module landing

```
apps/landing/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                  # Accueil / Hero
│   │   ├── services/page.tsx         # Catalogue des services CPaaS & SaaS
│   │   ├── fonctionnalites/
│   │   │   ├── call-center/page.tsx  # Call center SVI/ACD/IVR
│   │   │   ├── sms/page.tsx
│   │   │   ├── voice/page.tsx
│   │   │   └── messaging/page.tsx
│   │   ├── industries/page.tsx       # Secteurs cibles
│   │   ├── tarifs/page.tsx           # Plans & pricing
│   │   ├── actualites/page.tsx       # Blog / News
│   │   ├── a-propos/page.tsx         # About
│   │   └── contact/page.tsx          # Formulaire contact
│   ├── (auth)/
│   │   ├── login/page.tsx            # Connexion
│   │   ├── register/page.tsx         # Inscription / Onboarding
│   │   └── forgot-password/page.tsx
│   ├── layout.tsx                    # Layout racine (navbar, footer)
│   └── globals.css
├── components/
│   ├── marketing/
│   │   ├── hero.tsx
│   │   ├── services-grid.tsx
│   │   ├── pricing-table.tsx
│   │   ├── industries-grid.tsx
│   │   ├── testimonials.tsx
│   │   └── cta-section.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   └── forms/
│       ├── contact-form.tsx
│       └── demo-request-form.tsx
├── lib/
│   ├── actions.ts                    # Server Actions Next.js
│   └── validations.ts               # Zod schemas
└── public/
    ├── images/
    └── icons/
```

---

## Design System

- **Framework** : Tailwind CSS v4 + shadcn/ui
- **Palette principale** : couleurs de la marque Biar Group (à définir via CSS variables dans `globals.css`)
- **Typographie** : Inter (headings) + DM Sans (body)
- **Dark mode** : supporté via `next-themes`

```css
/* globals.css – variables de marque */
:root {
  --brand-primary: #1A56DB;    /* Bleu Actor Hub */
  --brand-secondary: #7E3AF2;  /* Violet CPaaS */
  --brand-accent: #0E9F6E;     /* Vert SaaS */
  --brand-dark: #111827;
  --brand-light: #F9FAFB;
}
```

---

## Pages clés et contenu

### Page d'accueil (`/`)
- **Hero** : titre accrocheur, sous-titre, CTA « Démarrer gratuitement » + « Voir la démo »
- **Services grid** : 6 tuiles (Call Center, SMS, Voice, WhatsApp/RCS, Analytics, CRM)
- **Statistiques** : 3 métriques clés (ex: +500 clients, 99.99% uptime, 50M messages/mois)
- **Industries** : badges sectoriels (Banque, Retail, Santé, Logistique, Energie, Télécom)
- **Témoignages** : carousel de logos clients + quotes
- **CTA final** : formulaire mini d'inscription ou lien vers /tarifs

### Page Services (`/services`)
- Grille de cartes par catégorie CPaaS vs SaaS
- Chaque carte : icône, titre, description courte, lien "En savoir plus"

### Fonctionnalités Call Center (`/fonctionnalites/call-center`)
- **SVI (IVR)** : arbre d'appel visuel, DTMF/reconnaissance vocale
- **ACD** : routage intelligent, files d'attente, priorités
- **Enregistrement** : conformité RGPD, stockage sécurisé
- **Supervision en temps réel** : dashboard live, écoute discrète
- **Rapports** : exports, KPIs (FCR, AHT, CSAT)
- **Intégrations** : CRM natif, Salesforce, HubSpot

### Industries (`/industries`)
- Cartes sectorielles avec cas d'usage spécifiques
- Secteurs : Banque/Assurance, E-commerce/Retail, Santé, Logistique, Énergie, Télécoms, Collectivités

### Tarifs (`/tarifs`)
- 3 plans minimum : Starter, Pro, Enterprise
- Toggle mensuel/annuel
- Tableau comparatif de fonctionnalités
- Mention "Prix CPaaS à la consommation (à l'usage)"
- CTA par plan

### Login (`/login`)
- Formulaire email + mot de passe
- OAuth2 social (Google, Microsoft)
- Lien "Mot de passe oublié"
- Lien "Créer un compte"
- Redirection vers dashboard après authentification

---

## Patterns de code

### Server Action (formulaire contact)
```typescript
// lib/actions.ts
'use server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
})

export async function sendContact(formData: FormData) {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten() }
  // Appel notification-service ou email direct
  await fetch(`${process.env.NOTIFICATION_SERVICE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
  })
  return { success: true }
}
```

### Composant Hero
```typescript
// components/marketing/hero.tsx
import Link from 'next/link'
import { Button } from '@actor-hub/ui'

export function Hero() {
  return (
    <section className="relative bg-brand-dark text-white py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">
          La plateforme CPaaS & SaaS tout-en-un
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Unifiez vos communications : call center, SMS, voix, messaging —
          tout sur une seule plateforme cloud-native.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Démarrer gratuitement</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Voir la démo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

---

## Tests

```bash
# Unit / composants
pnpm --filter @actor-hub/landing test

# E2E (Playwright)
pnpm --filter @actor-hub/landing test:e2e

# Lint
pnpm --filter @actor-hub/landing lint
```

---

## Checklist avant PR

- [ ] Responsive mobile/tablet/desktop vérifié
- [ ] Dark mode fonctionnel
- [ ] Accessibilité (aria-labels, contrastes WCAG AA)
- [ ] SEO : metadata, OG tags, sitemap
- [ ] Formulaires validés côté client ET serveur
- [ ] Internationalisation (FR/EN)
- [ ] Performance : Core Web Vitals verts (Lighthouse ≥ 90)
