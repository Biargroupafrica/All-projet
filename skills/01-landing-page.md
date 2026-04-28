# Skill : Landing Page — ACTOR Hub

## Scénario d'utilisation
Utiliser ce skill quand on doit construire, modifier ou étendre le site vitrine public de la plateforme ACTOR Hub (`apps/landing/`).

## Contexte Métier
Le site vitrine est le premier point de contact avec les prospects. Il doit :
- Communiquer la valeur de la plateforme en 5 secondes
- Convertir les visiteurs en leads (formulaires, CTA)
- Être multilingue (10 langues) dès le lancement
- Scorer 95+ sur Lighthouse (performance, SEO, accessibilité)

## Pages à Implémenter

### Page d'Accueil `/`
- **Hero** : Slider 5 slides avec Ken Burns effect, CTA primaire + secondaire
- **Stats Bar** : 5000+ entreprises, 190+ pays, 99.9% uptime, 24/7 support
- **Solutions Grid** : 4 cartes (SMS, Email, WhatsApp, Call Center)
- **Avantages** : 6 métriques ROI avec icônes animées
- **Logos clients** : MTN, Orange, Moov, Airtel, Vodafone, Camtel + banques
- **Logos partenaires** : Microsoft, Google Cloud, AWS, Twilio, SendGrid, WhatsApp
- **Témoignages** : 3 cartes avec photo, nom, poste, pays, note 5 étoiles
- **CTA Final** : Bande colorée avec formulaire de capture email

### Page Services `/services`
- Interface à onglets (SMS, Email, WhatsApp, Call Center)
- Pour chaque onglet : fonctionnalités, image produit, stats clés
- Section intégrations (CRM, E-commerce, ERP, Webhooks)

### Page Fonctionnalités — Call Center `/fonctionnalites/call-center`
- Hero avec stat overlay (99.9% Uptime)
- Grille 6 features (Softphone, IVR, Supervision, Enregistrement, Dialer, Multi-Agents)
- Tableau Inbound vs Outbound
- Features Analytics
- CRM Intégrations grid
- Section "Pourquoi Actor Hub" (4 piliers)

### Page Industries `/industries`
- Hero avec 3 feature cards (Multi-Canal, ROI, Marché Africain)
- Grille 14 secteurs avec icônes colorées
- Catégories utilisateurs (PME, Entrepreneurs, Individus, Grandes Entreprises)
- Stats (14 secteurs, 2500+ clients, 5M+ msg/jour, 98% satisfaction)

### Page Tarifs `/tarifs`
- Toggle mensuel/annuel (-17% badge)
- 3 plans : Starter (49€), Business (199€)⭐, Enterprise (sur devis)
- Add-ons (SMS, Email, WhatsApp, Agent, Numéros, Stockage)
- Tableau comparatif complet
- FAQ (8 questions)

### Page Actualités `/actualites`
- Blog/news grid avec filtres par catégorie
- Articles avec image, titre, date, extrait, tag catégorie
- Pagination

### Page À Propos `/a-propos`
- Mission et valeurs de BIAR GROUP AFRICA SARLU
- Timeline de l'entreprise
- Équipe dirigeante
- Présence géographique

### Page Contact (site externe actorhub.figma.site/contact)
- Formulaire de contact (nom, email, téléphone, message, sujet)
- Adresse et coordonnées
- Carte Google Maps
- Réseaux sociaux

### Page Login `/login`
- Split-screen : formulaire (gauche) + features panel (droite)
- Sélecteur langue 10 drapeaux
- Formulaire email + password + remember me + forgot password
- Boutons SSO Google & Microsoft
- Lien vers inscription

## Structure de Fichiers

```
apps/landing/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Layout avec Navigation + Footer
│   │   ├── page.tsx            # Page d'accueil
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── fonctionnalites/
│   │   │   └── call-center/
│   │   │       └── page.tsx
│   │   ├── industries/
│   │   │   └── page.tsx
│   │   ├── tarifs/
│   │   │   └── page.tsx
│   │   ├── actualites/
│   │   │   └── page.tsx
│   │   ├── a-propos/
│   │   │   └── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   ├── api/
│   │   └── contact/
│   │       └── route.ts        # API Route pour formulaire contact
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx      # Navbar responsive avec mega menu
│   │   ├── Footer.tsx
│   │   └── LanguageSelector.tsx
│   ├── home/
│   │   ├── HeroSlider.tsx      # Slider 5 slides Ken Burns
│   │   ├── StatsBar.tsx
│   │   ├── SolutionsGrid.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── ClientLogos.tsx
│   │   ├── Testimonials.tsx
│   │   └── FinalCTA.tsx
│   ├── services/
│   │   └── ServicesTabs.tsx
│   ├── pricing/
│   │   ├── PricingCard.tsx
│   │   ├── PricingToggle.tsx
│   │   ├── AddOnsTable.tsx
│   │   └── ComparisonTable.tsx
│   ├── auth/
│   │   └── LoginForm.tsx
│   └── shared/
│       ├── SectionHeader.tsx
│       ├── FeatureCard.tsx
│       ├── StatCard.tsx
│       └── CTAButton.tsx
├── messages/
│   ├── fr.json
│   ├── en.json
│   ├── es.json
│   ├── ar.json
│   ├── pt.json
│   ├── de.json
│   ├── zh.json
│   ├── ru.json
│   ├── sw.json
│   └── am.json
├── public/
│   ├── images/
│   ├── logos/
│   └── icons/
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

## Dépendances Clés

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "next-intl": "^3.14.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-toggle-group": "latest",
    "embla-carousel-react": "^8.0.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.23.0"
  }
}
```

## Critères de Succès

- [ ] Toutes les pages rendues correctement sur mobile, tablette, desktop
- [ ] Score Lighthouse ≥ 95 sur toutes les pages
- [ ] Changement de langue fonctionnel (10 langues)
- [ ] Formulaires validés et soumis avec succès
- [ ] SSO Google/Microsoft redirige vers le bon service
- [ ] Animations fluides (60fps)
- [ ] Aucune erreur TypeScript ni ESLint

## Tests Requis

```bash
# Dev server
cd apps/landing && npm run dev

# Build production
cd apps/landing && npm run build

# Tests E2E Playwright
cd apps/landing && npx playwright test

# Lighthouse CI
npx lhci autorun
```

## Pièges à Éviter

1. Ne pas oublier les balises `<html lang="...">` dynamiques par locale
2. Le slider Hero doit être `prefers-reduced-motion` compatible
3. Les images clients/partenaires : utiliser `next/image` avec `sizes` approprié
4. Le formulaire de contact doit avoir une protection CSRF et rate limiting
5. Les CTA "Démarrer gratuitement" doivent pointer vers `/[locale]/login` (pas une URL absolue)
6. Le sélecteur de langue doit persister dans les cookies (pas seulement URL)
