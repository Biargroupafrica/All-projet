# Prompt : Générer la Landing Page ACTOR Hub

## Contexte
Tu vas créer le site vitrine public de la plateforme ACTOR Hub, une plateforme SaaS/CPaaS de communication unifiée (SMS, Email, WhatsApp, Call Center) développée par BIAR GROUP AFRICA SARLU.

**Stack :** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui + Framer Motion + next-intl (10 langues)

## Design

**Palette :**
- Gradient principal : `from-blue-600 to-indigo-600` (ou `from-blue-600 to-cyan-500`)
- Canaux : SMS=blue, Email=purple, WhatsApp=green, CallCenter=orange
- Fond sections alternées : white / gray-50
- Textes : gray-900 (headings), gray-600 (body)

**Style :** 
- Cards : `bg-white shadow-lg rounded-2xl`
- Boutons primaires : gradient blue→indigo, shadow
- Formes décoratives géométriques en arrière-plan (triangles, cercles en dégradé d'opacité)
- Images : `rounded-2xl shadow-xl`
- Icônes : Lucide React

## Tâche : Générer le fichier apps/landing/

### Page d'Accueil (app/[locale]/page.tsx)

Génère tous les composants de la home page dans leurs fichiers respectifs :

#### 1. HeroSlider (components/home/HeroSlider.tsx)

Slider plein écran avec 5 slides, effets Ken Burns et transition crossfade :
```
Slide 1: "Plateforme Unifiée de Communication Cloud"
         Sous-titre: "Connectez SMS, Email, WhatsApp et Call Center depuis une seule interface"
         CTA: [Commencer gratuitement] [Voir la démo]
         Fond: Image de personnes au travail avec overlay dark gradient

Slide 2: "Pourquoi les Entreprises et Opérateurs Télécom Choisissent ACTOR Hub"
         Stats: 5000+ clients, 190 pays, 99.9% uptime
         CTA: [Découvrir les solutions]

Slide 3: "Centre d'Appels Cloud Nouvelle Génération"
         Points: Softphone WebRTC • IVR Visuel • Power Dialer
         CTA: [Voir le Call Center]

Slide 4: "SMS Marketing Direct Opérateurs"
         Points: SMPP Direct • 800+ Opérateurs • 190 Pays
         CTA: [Explorer le SMS]

Slide 5: "WhatsApp Business API Officielle"
         Points: Chatbot IA • Broadcast • Multi-Agents
         CTA: [Voir WhatsApp Business]
```

Implémentation :
- Utilise Framer Motion `AnimatePresence` pour les transitions crossfade (opacité + légère translation Y)
- Ken Burns : `motion.div` avec `animate={{ scale: 1.1 }}` sur `transition={{ duration: 8 }}`
- Auto-play toutes les 7 secondes avec pause au hover
- Bullets de navigation en bas
- Flèches prev/next
- `prefers-reduced-motion` : désactiver animations si l'utilisateur préfère

#### 2. StatsBar (components/home/StatsBar.tsx)

Bande colorée (gradient blue-600 → indigo-700) sous le hero :
```
🏢 5 000+ Entreprises clientes
🌍 190+ Pays couverts  
⚡ 99.9% Uptime garanti
🎧 24/7 Support expert
```
Animation : les chiffres s'incrémentent quand la section entre dans le viewport (Intersection Observer + requestAnimationFrame).

#### 3. SolutionsGrid (components/home/SolutionsGrid.tsx)

Section avec titre "Notre Suite de Solutions" + sous-titre.

4 cartes en grille (md:grid-cols-2, lg:grid-cols-4) :

**Card SMS :** bg gradient blue-600→blue-700, icône `MessageSquare`
- "Centre d'Appels Cloud" → changer en "SMS Marketing"
- Features: Softphone WebRTC, IVR Visuel, Power Dialer → SMS Bulk, SMPP Direct, Two-Way SMS
- Bouton "En savoir plus" → /services#sms

**Card Email :** gradient purple-600→purple-700, icône `Mail`
- "Email Marketing Professionnel"
- Features: Drag & Drop, Automation, A/B Testing
- Bouton → /services#email

**Card WhatsApp :** gradient green-600→green-700, icône `MessageCircle`
- "WhatsApp Business API"
- Features: Chatbot IA, Broadcast, Multi-Agents
- Bouton → /services#whatsapp

**Card Call Center :** gradient orange-600→orange-700, icône `Phone`
- "Centre d'Appels Cloud"
- Features: Softphone WebRTC, IVR Visuel, Dialers Intelligents
- Bouton → /fonctionnalites/call-center

Style des cartes : blanc, hover élève légèrement (`translateY(-4px)`, `shadow-2xl`), transition 0.3s.

#### 4. BenefitsSection (components/home/BenefitsSection.tsx)

Fond gray-50. Titre "Pourquoi Actor Hub?" centré.

6 métriques en grille (2 colonnes mobile, 3 desktop) :
| Métrique | Icône | Couleur |
|----------|-------|---------|
| 98% Taux d'engagement client | `TrendingUp` | blue |
| 60% Réduction des coûts | `DollarSign` | green |
| 95% Satisfaction client | `Star` | yellow |
| 75% Gain de temps | `Clock` | purple |
| 4.2x ROI mesurable | `BarChart3` | orange |
| 24h Intégration rapide | `Zap` | cyan |

Chaque métrique : grand chiffre en couleur, label en dessous, icône à gauche.

#### 5. ClientLogos (components/home/ClientLogos.tsx)

Deux rangées avec défilement horizontal automatique (marquee infini) :
- Rangée 1 (opérateurs) : MTN, Orange, Moov, Airtel, Vodafone, Camtel, BICEC, Afriland, Ecobank, UBA, SCB, Total
- Rangée 2 (partenaires tech) : Microsoft, Google Cloud, AWS, Twilio, SendGrid, WhatsApp, Salesforce, HubSpot

Logos en niveaux de gris avec `hover:grayscale-0 transition` pour retrouver la couleur au survol.

#### 6. Testimonials (components/home/Testimonials.tsx)

3 cartes côte à côte (mobile : carrousel, desktop : grid) :

```
Amadou Diallo
CEO, TechAfrique SARL — Cameroun 🇨🇲
⭐⭐⭐⭐⭐
"ACTOR Hub a révolutionné notre service client. Nous gérons maintenant 3x plus d'appels avec la même équipe grâce au Centre d'Appels Cloud."

Li Wei Zhang
Marketing Director, AsiaConnect — Singapour 🇸🇬
⭐⭐⭐⭐⭐
"L'API SMS est fiable et rapide. Nos campagnes marketing atteignent 98% de taux de livraison en Asie du Sud-Est."

Sarah Miller
COO, EuroRetail Group — France 🇫🇷
⭐⭐⭐⭐⭐
"L'intégration WhatsApp Business nous a permis d'automatiser 70% des demandes clients. ROI de 4x en 6 mois."
```

#### 7. FinalCTA (components/home/FinalCTA.tsx)

Bande full-width avec gradient blue → indigo :
```
Titre : "Prêt à transformer votre communication ?"
Sous-titre : "Rejoignez 5 000+ entreprises qui font confiance à ACTOR Hub"
Input email + bouton "Démarrer gratuitement →"
Texte légal : "Essai gratuit 14 jours • Sans carte bancaire • Configuration en 5 minutes"
```

### Navigation (components/layout/Navigation.tsx)

Navbar fixe avec :
- Logo (icône téléphone bleu + "ACTOR Hub" en gras)
- Liens : Accueil | Services | Fonctionnalités (mega menu) | Industries | Tarifs | À propos | Contact
- Mega menu "Fonctionnalités" : 4 colonnes (SMS, Email, WhatsApp, Call Center)
- Boutons : "Se connecter" (outline) + "Démarrer" (gradient)
- Mobile : hamburger → drawer sidebar
- Sticky : bg transparent → bg-white/95 backdrop-blur au scroll (transition 200ms)

Sélecteur de langue : drapeau + code langue (FR, EN, ES, AR, PT, DE, ZH, RU, SW, AM)

### Footer (components/layout/Footer.tsx)

4 colonnes :
1. Logo + description + réseaux sociaux (LinkedIn, Twitter, Facebook, Instagram)
2. Produits : SMS, Email, WhatsApp, Call Center, API
3. Ressources : Documentation, Blog, Statut, Support
4. Légal : CGU, Politique confidentialité, Mentions légales, RGPD

Bas : "© 2026 BIAR GROUP AFRICA SARLU. Tous droits réservés." + badges sécurité (RGPD, SSL, ISO 27001)

### Page Tarifs (app/[locale]/tarifs/page.tsx)

Toggle mensuel/annuel :
```tsx
const [isAnnual, setIsAnnual] = useState(false);
const price = isAnnual ? monthly * 0.83 : monthly;
```

3 PricingCards :
```
Starter | 49€/mois | 41€/an
Business | 199€/mois | 165€/an ⭐ POPULAIRE
Enterprise | Sur devis
```

Le plan "Business" doit avoir : badge "Le plus populaire", bordure bleue, léger highlight.

### Page Login (app/[locale]/login/page.tsx)

Split screen 50/50 (hidden la partie droite sur mobile) :

**Gauche :**
```
LanguageSelector (10 drapeaux en ligne)
Logo ACTOR Hub
"Connexion à ACTOR Hub"
"ACTOR Hub est une plateforme de Biar group Africa Sarlu"

[Formulaire]
Email : input avec icône Mail
Mot de passe : input avec icône Lock + toggle show/hide

[Se souvenir de moi] ○     [Mot de passe oublié ?]

[Connexion] (gradient blue full width)

─── ou ───

[🔵 Continuer avec Google]
[🪟 Continuer avec Microsoft]

Pas encore de compte ? [Créer un compte]
```

**Droite (fond gradient blue + motif géométrique) :**
```
🛡️ Pourquoi ACTOR Hub ?

📞 Centre d'appels cloud complet
📱 SMS Bulk & Marketing
💬 WhatsApp Business intégré
📧 Email Marketing professionnel
🌍 Support multi-langue (10 langues)
🔒 Sécurité & conformité RGPD

© 2026 BIAR GROUP AFRICA SARLU
```

## i18n (messages/fr.json — extrait)

```json
{
  "nav": {
    "home": "Accueil",
    "services": "Services",
    "features": "Fonctionnalités",
    "industries": "Industries",
    "pricing": "Tarifs",
    "about": "À propos",
    "contact": "Contact",
    "login": "Se connecter",
    "start": "Démarrer"
  },
  "hero": {
    "slide1Title": "Plateforme Unifiée de Communication Cloud",
    "slide1Subtitle": "Connectez SMS, Email, WhatsApp et Call Center depuis une seule interface",
    "ctaStart": "Commencer gratuitement",
    "ctaDemo": "Voir la démo"
  },
  "stats": {
    "clients": "Entreprises clientes",
    "countries": "Pays couverts",
    "uptime": "Uptime garanti",
    "support": "Support expert"
  }
}
```

## Configuration Next.js

```typescript
// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  images: {
    domains: ['cdn.actorhub.io', 'images.unsplash.com'],
  },
  experimental: {
    optimizeCss: true,
  },
});
```

## Critères de Succès
- [ ] Score Lighthouse ≥ 95 sur toutes les pages (Performance, SEO, A11y)
- [ ] Changement de langue fonctionnel avec next-intl
- [ ] Slider Hero : 5 slides, auto-play, navigation fonctionnelle
- [ ] Menu mobile hamburger fonctionnel
- [ ] Page Tarifs : toggle mensuel/annuel fonctionnel
- [ ] Formulaire Login : validation en temps réel
- [ ] Toutes les images Next.js optimisées (`next/image`)
- [ ] Animations Framer Motion ne bloquent pas le LCP
- [ ] Compatible iOS Safari et Android Chrome

## Format Attendu
Génère chaque fichier complet avec son contenu TypeScript/TSX. Commence par `package.json` et `tailwind.config.ts`, puis composants dans l'ordre d'apparition sur la page.
