# Prompt : Landing Page & Site Vitrine Actor Hub

## Objectif

Créer le site vitrine (landing page) complet de la plateforme Actor Hub, fidèle au design Figma, avec toutes les pages publiques.

## Contexte Figma

- **FileKey** : `XDPnl4zhusx3vecuWQTYFx`
- **Pages du site vitrine** :
  - `/` — Homepage (Hero, Features, Stats, Témoignages, CTA)
  - `/services` — Présentation des 4 solutions
  - `/fonctionnalites/call-center` — Fonctionnalités Call Center
  - `/fonctionnalites/sms-marketing` — Fonctionnalités SMS
  - `/fonctionnalites/whatsapp-business` — Fonctionnalités WhatsApp
  - `/fonctionnalites/email-marketing` — Fonctionnalités Email
  - `/industries` — Solutions par industrie
  - `/tarifs` — Grille tarifaire (3 plans)
  - `/actualites` — Blog / Actualités
  - `/a-propos` — À propos d'Actor Hub
  - `/contact` — Formulaire de contact
  - `/login` — Page de connexion

## Prompt de création

```
Tu es un développeur frontend senior spécialisé en React et en design de sites vitrines SaaS modernes.

Crée le site vitrine complet "Actor Hub" en suivant fidèlement le design Figma Make (fileKey: XDPnl4zhusx3vecuWQTYFx).

### Identité visuelle

- Nom : Actor Hub (filiale de BIAR GROUP AFRICA SARLU)
- Slogan : "One platform — Infinite connections"
- Tagline : "Pour vous, on se dépasse."
- Couleur primaire : Violet #5906AE
- Couleur accent : Rose #FF006F
- Texte sur fond coloré : toujours blanc
- Fond clair : #FFFFFF / #F8F9FA
- Fond sombre (dark mode) : #0A0A0A / #1A1A2E
- Typographie : Inter (Google Fonts)
- Icônes : Lucide React

### Stack technique

- React 18 + TypeScript
- React Router v7
- Tailwind CSS v4
- shadcn/ui + Radix UI
- next-themes (dark/light mode)
- Framer Motion (animations)
- i18n (10 langues : FR, EN, AR, ES, PT, DE, IT, ZH, JA, KO)

### Structure des pages

1. HOMEPAGE (/)
   - Header : Logo + Navigation + Boutons CTA (Connexion, Essai gratuit)
   - Hero Section : Titre accrocheur + sous-titre + 2 boutons CTA + illustration
   - Section partenaires/logos clients
   - Section 4 modules (Call Center, SMS, WhatsApp, Email) avec cartes
   - Section statistiques animées (clients, messages envoyés, pays, appels)
   - Section témoignages (carousel)
   - Section tarifs (aperçu 3 plans)
   - Section CTA finale
   - Footer : liens, réseaux sociaux, contact

2. SERVICES (/services)
   - Présentation détaillée des 4 solutions
   - Chaque solution avec icône, description, fonctionnalités clés
   - Bouton "En savoir plus" vers page fonctionnalités dédiée
   - Section comparatif avec concurrents

3. FONCTIONNALITÉS (/fonctionnalites)
   - Page index avec navigation vers les 4 modules
   - /fonctionnalites/call-center : Softphone, IVR, ACD, Dialers, etc.
   - /fonctionnalites/sms-marketing : SMPP, Bulk, API, DLR, etc.
   - /fonctionnalites/whatsapp-business : API, Chat, Broadcast, Chatbot, etc.
   - /fonctionnalites/email-marketing : Éditeur, Automation, SMTP, etc.

4. INDUSTRIES (/industries)
   - Solutions par secteur : Banque, Assurance, Telecom, E-commerce, Santé
   - Cas d'usage spécifiques par industrie

5. TARIFS (/tarifs)
   - 3 plans : Starter, Pro, Enterprise
   - Tableau comparatif des fonctionnalités
   - Toggle mensuel/annuel
   - CTA "Essai gratuit" et "Contactez-nous"

6. ACTUALITÉS (/actualites)
   - Liste d'articles (blog)
   - Catégories, tags, recherche
   - Layout carte avec image, titre, extrait, date

7. À PROPOS (/a-propos)
   - Histoire de la société
   - Équipe / Valeurs
   - Chiffres clés
   - Partenaires

8. CONTACT (/contact)
   - Formulaire de contact (nom, email, téléphone, message)
   - Informations de contact (adresse, email, téléphone)
   - Carte Google Maps intégrée

9. LOGIN (/login)
   - Sélection du type d'utilisateur (Admin, Agent, Customer, Super Admin)
   - Formulaire email/mot de passe
   - Lien mot de passe oublié
   - Lien inscription

### Composants réutilisables

- VitrineLayout : Header + Footer + slot contenu
- HeroSection : titre, sous-titre, CTA, image
- FeatureCard : icône, titre, description
- PricingCard : plan, prix, features, CTA
- TestimonialCard : avatar, nom, société, texte
- StatCounter : nombre animé + label
- CTABanner : titre + description + bouton
- FAQAccordion : questions/réponses

### Responsive

- Mobile : stack vertical, menu hamburger, 1 colonne
- Tablet : 2 colonnes, menu collapsible
- Desktop : 3-4 colonnes, menu sidebar fixe

### SEO & Performance

- Meta tags dynamiques par page
- Open Graph + Twitter Cards
- Lazy loading des images
- Code splitting par route
- Sitemap XML
- Robots.txt
```

## Critères d'acceptation

- [ ] Toutes les pages sont fidèles au design Figma
- [ ] Le site est responsive (mobile, tablet, desktop)
- [ ] Le dark/light mode fonctionne
- [ ] Les animations sont fluides
- [ ] Le i18n supporte les 10 langues
- [ ] Les liens de navigation fonctionnent
- [ ] Le formulaire de contact est fonctionnel
- [ ] Le SEO est optimisé (meta tags, Open Graph)
- [ ] Le score Lighthouse est > 90
