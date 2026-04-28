# Skill 01 — Landing Page Vitrine (Site Public)

## Quand utiliser ce skill
Lorsque vous travaillez sur le site vitrine public d'Actor Hub : pages home, services, fonctionnalités, tarifs, actualités, à propos, contact.

## Routes concernées
```
/ → Home
/services → Solutions
/fonctionnalites → Fonctionnalités (hub)
/fonctionnalites/call-center
/fonctionnalites/sms-marketing
/fonctionnalites/whatsapp-business
/fonctionnalites/email-marketing
/industries → Industries
/tarifs → Pricing
/actualites → Blog/Actualités
/a-propos → About
/contact → Contact
/login → Sélection login
```

## Composants clés
- `src/app/components/vitrine/vitrine-layout.tsx` — Layout avec navbar et footer
- `src/app/components/vitrine/home.tsx` — Page d'accueil complète
- `src/app/components/vitrine/pricing.tsx` — Tableau de tarifs
- `src/app/components/vitrine/contact.tsx` — Formulaire de contact
- `src/app/components/vitrine/about-enhanced.tsx` — À propos enrichi
- `src/app/components/vitrine/solutions.tsx` — Page solutions

## Design System (Landing)
```css
/* Couleurs primaires */
--color-primary: #E91E8C; /* Rose Actor Hub */
--color-secondary: #1E3A8A; /* Bleu foncé */
--color-accent: #7C3AED; /* Violet */

/* Typographie */
font-family: 'Inter', sans-serif;
h1: font-size: 4rem; font-weight: 800;
h2: font-size: 2.5rem; font-weight: 700;

/* Gradients */
background: linear-gradient(135deg, #E91E8C 0%, #7C3AED 100%);
```

## Structure des Sections (Home)

### 1. Hero Section
```tsx
<section className="hero">
  <h1>Une plateforme, des connexions infinies</h1>
  <p>Call Center • SMS • Email • WhatsApp</p>
  <Button>Démarrer gratuitement</Button>
  <Button variant="outline">Voir la démo</Button>
</section>
```

### 2. Section Statistiques
```
500K+ Messages envoyés/jour
98.5% Taux de livraison
150+ Pays couverts
24/7 Support disponible
```

### 3. Section Modules
Afficher les 4 modules principaux en cards :
- Call Center IA
- SMS Marketing
- WhatsApp Business
- Email Marketing

### 4. Section Tarifs
3 plans : Starter / Pro / Enterprise
- Toggle mensuel/annuel
- Mise en avant du plan recommandé

### 5. Sections Industries
- Banque & Finance
- Retail & E-commerce
- Santé
- Éducation
- Immobilier
- Transport & Logistique

## Prompts pour la Landing Page

### Prompt — Hero Section
```
Crée une section hero moderne pour la landing page d'Actor Hub, une plateforme CPaaS/SaaS multi-canal. 
La section doit inclure :
- Un titre accrocheur avec dégradé rose-violet
- Un sous-titre décrivant les 4 canaux (Call Center, SMS, WhatsApp, Email)
- 2 boutons CTA : "Démarrer gratuitement" (rose) et "Voir la démo" (outline)
- Une illustration ou mockup de dashboard flottant à droite
- Des stats animées en dessous (messages/jour, taux livraison, pays)
Stack: React, Tailwind CSS, shadcn/ui
```

### Prompt — Page Tarifs
```
Crée une page de tarification pour Actor Hub avec 3 plans :
1. Starter : 0€/mois - SMS, Email basique, 1 agent
2. Pro : 49€/mois - Tous canaux, 10 agents, Analytics avancé
3. Enterprise : Sur devis - Illimité, API dédiée, SLA garanti
Inclure un toggle mensuel/annuel (-20%), mise en avant du plan Pro,
boutons CTA distincts par plan, tableau comparatif des fonctionnalités.
Couleurs : rose (#E91E8C) pour le plan recommandé.
```

### Prompt — Section Industries
```
Crée une section "Industries" pour Actor Hub présentant 6 secteurs cibles :
Banque, Retail, Santé, Éducation, Immobilier, Transport.
Pour chaque industrie : icône, nom, description 2 lignes, cas d'usage spécifique.
Design en grille 3x2 avec hover animé, fond alterné clair/foncé.
```

## Tests à réaliser
- [ ] Navigation entre toutes les pages vitrine
- [ ] Formulaire de contact (validation, envoi)
- [ ] Responsive mobile (320px, 768px, 1024px)
- [ ] Toggle dark/light mode
- [ ] Changement de langue (FR → EN → AR)
- [ ] Boutons CTA redirigent vers /login ou /signup
- [ ] SEO : meta tags, Open Graph, sitemap
