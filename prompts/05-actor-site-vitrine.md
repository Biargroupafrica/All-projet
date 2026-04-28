# Prompt : Actor Hub - Site Vitrine (Landing Pages)

## Rôle

Tu es un développeur frontend senior et designer UX. Tu construis le **site vitrine** (landing pages) de la plateforme Actor Hub, le point d'entrée marketing qui présente les 4 solutions et convertit les visiteurs en clients.

## Description

Le site vitrine est la partie publique de la plateforme Actor Hub. Il présente les solutions, les fonctionnalités, les tarifs, et permet aux visiteurs de s'inscrire ou se connecter. Il doit être moderne, responsive, rapide, et optimisé SEO.

## Pages à Implémenter

### 1. Homepage (`/`)
**Composant** : `VitrineHome`
- Hero section avec titre principal, sous-titre et CTA ("Essai gratuit", "Voir les tarifs")
- Section des 4 modules (CallCenter, SMS, WhatsApp, Email) avec icônes et descriptions
- Section statistiques animées (clients, messages envoyés, appels traités, pays couverts)
- Section témoignages clients (carousel)
- Section tarifs résumée
- CTA final
- Footer avec coordonnées BIAR GROUP

### 2. Services / Solutions (`/services`)
**Composant** : `VitrineSolutions`
- Présentation détaillée de chaque solution
- Avantages clés par solution
- CTA par solution ("En savoir plus", "Essai gratuit")
- Comparatif des plans

### 3. Fonctionnalités (`/fonctionnalites`)
**Composant** : `VitrineFonctionnalites`
- Vue d'ensemble de toutes les fonctionnalités
- Liens vers les pages détaillées par module

### 4. Fonctionnalités Call Center (`/fonctionnalites/call-center`)
**Composant** : `VitrineFeaturesCallCenter`
- Softphone WebRTC
- IVR Builder visuel
- Routage intelligent (ACD, skill-based)
- Dialers (Power, Predictive, Preview)
- Enregistrement et IA
- Supervision temps réel
- Screenshots / mockups

### 5. Fonctionnalités SMS (`/fonctionnalites/sms-marketing`)
**Composant** : `VitrineFeaturesSMS`
- Envoi en masse SMPP
- Campagne Builder
- HLR Lookup
- API REST
- DLR Reports
- URL Shortener

### 6. Fonctionnalités WhatsApp (`/fonctionnalites/whatsapp-business`)
**Composant** : `VitrineFeaturesWhatsApp`
- Chatbot IA
- Broadcast
- Multi-agents
- Auto-répondeur
- Templates
- Analytics

### 7. Fonctionnalités Email (`/fonctionnalites/email-marketing`)
**Composant** : `VitrineFeaturesEmail`
- Éditeur WYSIWYG
- Flow Builder (Automatisation)
- Templates
- Segmentation
- A/B Testing
- Délivrabilité

### 8. Industries (`/industries`)
**Composant** : `Industries`
- Secteurs ciblés (Banque, Telecom, E-commerce, Santé, Éducation, Gouvernement, etc.)
- Cas d'usage par industrie

### 9. Tarifs (`/tarifs`)
**Composant** : `VitrinePricing`
- 3 plans : Starter, Pro, Enterprise
- Tableau comparatif des fonctionnalités
- CTA par plan
- FAQ tarifs

### 10. Actualités (`/actualites`)
**Composant** : `VitrineActualites`
- Articles de blog / news
- Catégories
- Recherche

### 11. À propos (`/a-propos`)
**Composant** : `VitrineAboutEnhanced`
- Histoire de BIAR GROUP / Actor Hub
- Mission et vision
- Équipe
- Valeurs
- Partenaires

### 12. Contact (`/contact`)
**Composant** : `VitrineContact`
- Formulaire de contact (Nom, Email, Téléphone, Message)
- Informations de contact :
  - Adresse : 5 Rue Gemena, Quartier Haut Commandement, Gombe, Kinshasa, RDC
  - Tél : +243 978 979 898 / +243 822 724 146
  - Email : contact@biargroup.com
- Carte (map)
- Réseaux sociaux

### 13. Login (`/login`)
**Composant** : `Login`
- Sélection du type d'utilisateur (Admin, Agent, Customer, Super Admin)
- Formulaire email + mot de passe
- "Remember me"
- Lien "Mot de passe oublié"
- Lien "Créer un compte"

## Layout Vitrine

**Composant** : `VitrineLayout`
- **Header** : Logo Actor Hub + Navigation (Services, Fonctionnalités, Industries, Tarifs, Actualités, À propos, Contact) + CTA "Essai Gratuit" + Menu mobile
- **Footer** : Logo, Adresse, Téléphone, Email, Liens rapides, Réseaux sociaux, Copyright
- **Responsive** : Mobile-first, breakpoints à 640px, 1024px, 1280px
- **Dark/Light mode** : via next-themes
- **Multi-langues** : 10 langues

## Design System du Site Vitrine

```css
/* Couleurs principales */
--primary: #5906AE;      /* Violet */
--accent: #FF006F;        /* Rose */
--secondary: #2B7FFF;     /* Bleu */
--background: #FFFFFF;    /* Fond clair */
--foreground: #1A1A2E;    /* Texte principal */

/* Typographie */
font-family: Inter, system-ui, sans-serif;
Titres : Bold, tailles 3xl à 6xl
Corps : Regular, taille base à lg
```

## Instructions Spécifiques

1. Réfère-toi au Figma Make (fileKey: `XDPnl4zhusx3vecuWQTYFx`) pour le design pixel-perfect
2. Utilise des animations subtiles (Framer Motion ou CSS transitions)
3. Optimise les images (WebP, lazy loading)
4. Implémente le SEO (meta tags, Open Graph, structured data)
5. Le site doit obtenir un score Lighthouse > 90
6. Les formulaires doivent avoir une validation côté client
7. Implémente les microinteractions (hover, focus, scroll)
8. Le hero doit avoir un gradient ou une illustration 3D
9. Utilise des icônes Lucide React cohérentes
10. Le footer doit contenir les coordonnées complètes de BIAR GROUP
