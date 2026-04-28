# Prompt: Landing Page / Site Vitrine Actor Hub

## Contexte
Tu es un développeur frontend senior spécialisé en React et design system. Tu dois créer le **site vitrine** (landing page) de la plateforme Actor Hub en respectant fidèlement les maquettes Figma fournies.

## Liens Figma de référence
- **Accueil** : `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/...`
- **Services** : `...?preview-route=%2Fservices`
- **Fonctionnalités Call Center** : `...?preview-route=%2Ffonctionnalites%2Fcall-center`
- **Industries** : `...?preview-route=%2Findustries`
- **Tarifs** : `...?preview-route=%2Ftarifs`
- **Actualités** : `...?preview-route=%2Factualites`
- **À propos** : `...?preview-route=%2Fa-propos`
- **Contact** : `https://actorhub.figma.site/contact`
- **Login** : `...?preview-route=%2Flogin`

## Stack technique
- **Framework** : React 18 + TypeScript
- **Routing** : React Router v7
- **Styles** : Tailwind CSS v4
- **Composants UI** : shadcn/ui + Radix UI
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **i18n** : 10 langues (FR, EN, AR, ES, PT, DE, IT, ZH, JA, KO)
- **Thème** : Dark/Light mode via next-themes

## Design System
```css
/* Couleurs principales */
--primary: #5906AE;      /* Violet */
--accent: #FF006F;       /* Rose */
--background: #FFFFFF;    /* Fond clair */
--foreground: #0A0A0A;   /* Texte */
--muted: #F5F5F5;        /* Fonds secondaires */

/* Règle : texte blanc automatique sur fonds colorés (primary/accent) */
```

## Pages à créer

### 1. Page d'accueil (`/`)
- Hero section avec titre accrocheur, sous-titre, CTA "Démarrer gratuitement" et "Voir la démo"
- Section logos clients / partenaires
- Section 4 modules (Call Center, SMS, WhatsApp, Email) avec icônes et descriptions
- Section statistiques animées (clients, messages envoyés, appels, pays)
- Section témoignages (carousel)
- Section CTA final
- Footer complet

### 2. Services / Solutions (`/services`)
- Liste détaillée des 4 modules avec captures d'écran
- Comparaison des fonctionnalités
- CTA vers chaque module

### 3. Fonctionnalités (`/fonctionnalites`)
- Vue d'ensemble des fonctionnalités par module
- Sous-pages dédiées :
  - `/fonctionnalites/call-center` : Softphone, IVR, ACD, Recording, Scripts, Dialers
  - `/fonctionnalites/sms-marketing` : Bulk SMS, SMPP, DLR, HLR, Templates
  - `/fonctionnalites/whatsapp-business` : Chat, Broadcast, Chatbot, Templates
  - `/fonctionnalites/email-marketing` : Éditeur, Automation, Segmentation, DNS

### 4. Industries (`/industries`)
- Secteurs ciblés : Banque/Finance, Télécoms, Santé, E-commerce, Éducation, Gouvernement
- Cas d'usage par secteur

### 5. Tarifs (`/tarifs`)
- 3 plans : Starter (29€/mois), Pro (79€/mois), Enterprise (sur devis)
- Tableau comparatif des fonctionnalités
- FAQ tarification
- CTA "Essai gratuit 14 jours"

### 6. Actualités (`/actualites`)
- Blog/actualités de la plateforme
- Articles avec images, dates, catégories

### 7. À propos (`/a-propos`)
- Histoire de BIAR GROUP AFRICA SARLU / Actor Hub
- Équipe
- Valeurs
- Chiffres clés
- Partenaires

### 8. Contact (`/contact`)
- Formulaire de contact (nom, email, téléphone, entreprise, message)
- Coordonnées
- Carte Google Maps
- Horaires d'ouverture

### 9. Login (`/login`)
- Sélection du type d'utilisateur (Admin, Agent, Customer, Super Admin)
- Formulaire de connexion (email, mot de passe)
- Liens "Mot de passe oublié" et "Inscription"
- Design avec illustration de la plateforme

## Composants partagés
- `Header` : Logo, navigation, sélecteur de langue, CTA, menu mobile
- `Footer` : Liens, réseaux sociaux, newsletter, mentions légales
- `Section` : Wrapper responsive avec espacement standard
- `FeatureCard` : Carte fonctionnalité avec icône et description
- `PricingCard` : Carte tarification avec features et CTA
- `TestimonialCard` : Carte témoignage avec avatar et citation
- `StatsCounter` : Compteur animé de statistiques
- `CTABanner` : Bannière d'appel à l'action

## Critères d'acceptation
- [ ] Toutes les pages correspondent aux maquettes Figma
- [ ] Responsive : mobile, tablette, desktop
- [ ] Dark mode / Light mode
- [ ] Animations fluides (Framer Motion)
- [ ] SEO : meta tags, Open Graph, structured data
- [ ] Performance : Lighthouse score > 90
- [ ] Accessibilité : WCAG 2.1 AA
- [ ] i18n : au minimum FR et EN fonctionnels
