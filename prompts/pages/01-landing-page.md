# Prompt — Landing Page & Site Vitrine Actor Hub

## Contexte

Tu développes le **site vitrine marketing** de la plateforme **Actor Hub** (Biar Group Africa SARLU).
Ce site présente la plateforme SaaS/CPaaS aux prospects et clients.

**Fichier Figma Make de référence** : `XDPnl4zhusx3vecuWQTYFx`
**Stack** : React 18 + TypeScript + Tailwind CSS + shadcn/ui + React Router v7

---

## Pages à développer (Partie 1)

### 1. Page d'accueil (`/`)
**Composant** : `src/app/components/vitrine/home.tsx`

Éléments requis :
- **Hero section** : Titre accrocheur, sous-titre, CTA "Démarrer gratuitement" (→ `/login`) et "Voir la démo"
- **Section modules** : 4 cartes présentant Call Center, Bulk SMS, WhatsApp Marketing, Emailing
- **Section industrie** : Secteurs cibles (Banque, Assurance, Retail, Télécoms, Santé, E-commerce)
- **Section statistiques** : Chiffres clés (ex: 500+ clients, 99.9% uptime, 50M+ SMS/mois)
- **Section témoignages** : Avis clients avec photo, nom, entreprise
- **Section CTA final** : Appel à l'action avec formulaire email ou bouton
- **Footer** : Liens navigation, réseaux sociaux, mentions légales

Règles de style :
- Couleur primaire : violet `#5906AE`
- Couleur accent : rose `#FF006F`
- Texte blanc sur fonds colorés
- Animations légères (fade-in, slide-up) avec Tailwind

---

### 2. Page Services/Solutions (`/services`)
**Composant** : `src/app/components/vitrine/solutions.tsx`

Présenter les **4 solutions** avec :
- Description détaillée de chaque module
- Fonctionnalités clés listées (avec icônes Lucide)
- Cas d'usage concrets
- Boutons "En savoir plus" → pages `/fonctionnalites/{module}`
- Tableau comparatif des solutions

---

### 3. Page Fonctionnalités Call Center (`/fonctionnalites/call-center`)
**Composant** : `src/app/components/vitrine/features-call-center.tsx`

Couvrir :
- ACD (Distribution automatique des appels)
- IVR (Serveur Vocal Interactif) avec builder visuel
- Softphone WebRTC intégré
- Enregistrement des appels
- Supervision en temps réel (wallboard)
- Routage basé sur les compétences
- Intégration CTI (CRM, Salesforce, etc.)
- Dialers : Power, Predictive, Preview
- Scripts d'appel pour agents
- Rapports et analytics

---

### 4. Page Industries (`/industries`)
**Composant** : `src/app/components/industries.tsx`

Sections par secteur :
- **Banque & Finance** : Conformité, traçabilité, sécurité des données
- **Assurance** : Gestion sinistres, relance primes, satisfaction client
- **Retail & E-commerce** : Notifications commandes, SAV, fidélisation
- **Télécommunications** : Support technique, activation, facturation
- **Santé** : Rappels RDV, résultats labo, téléconsultation
- **Administration publique** : Information citoyens, alertes

---

### 5. Page Tarifs (`/tarifs`)
**Composant** : `src/app/components/vitrine/pricing.tsx`

Structure :
- Toggle mensuel / annuel (réduction 20%)
- **3 plans par module** :
  - Starter (PME)
  - Business (Entreprise)
  - Enterprise (Sur devis)
- Tableau comparatif des fonctionnalités incluses
- FAQ sur la facturation
- Bouton "Contacter les ventes" pour Enterprise

Règle : Les prix doivent être configurables via des variables/constantes (pas de valeurs hardcodées dispersées).

---

### 6. Page Actualités/Blog (`/actualites`)
**Composant** : `src/app/components/vitrine/actualites.tsx`

- Grille d'articles (cards avec image, titre, date, catégorie, extrait)
- Filtrage par catégorie (Produit, Secteur, Technologie, Entreprise)
- Pagination
- Sidebar avec articles populaires + newsletter signup

---

### 7. Page À propos (`/a-propos`)
**Composant** : `src/app/components/vitrine/about-enhanced.tsx`

- Histoire d'Actor Hub / Biar Group Africa SARLU
- Mission, Vision, Valeurs
- Équipe dirigeante (photos, titres)
- Chiffres de l'entreprise
- Partenaires technologiques (Meta, Twilio, etc.)
- Certifications et conformités (RGPD, ISO 27001, etc.)

---

### 8. Page Contact (`/contact`)
**Composant** : `src/app/components/vitrine/contact.tsx`

- Formulaire de contact (Nom, Email, Téléphone, Société, Message, Module d'intérêt)
- Coordonnées (adresse, téléphone, email support)
- Carte (embed Google Maps ou alternative)
- Horaires de support
- Liens réseaux sociaux

---

### 9. Page Login — Sélection (`/login`)
**Composant** : `src/app/components/auth/login-selection.tsx`

Présenter **4 types de connexion** sous forme de cartes :
- Super Admin (plateforme globale)
- Admin (espace entreprise)
- Agent (interface opérationnelle)
- Client (espace client)

Chaque carte redirige vers le formulaire de login spécifique.

---

## Navigation (VitrineLayout)

**Fichier** : `src/app/components/vitrine/vitrine-layout.tsx`

La navigation principale doit contenir :
- Logo Actor Hub (SVG depuis `src/imports/`)
- Menu : Accueil, Services, Fonctionnalités (dropdown), Industries, Tarifs, Actualités, À propos, Contact
- Bouton "Se connecter" (→ `/login`)
- Bouton "Essai gratuit" (CTA, couleur accent rose)
- Sélecteur de langue (FR / EN / AR)
- Toggle dark/light mode

---

## Consignes techniques

1. **Toujours** importer et utiliser les composants de `src/app/components/ui/`
2. **Ne jamais** dupliquer de code CSS inline quand une classe Tailwind suffit
3. Chaque page exporte un composant **nommé** (ex: `export function VitrineHome()`)
4. Ajouter la route dans `src/app/routes.ts` après création
5. Tester visuellement en mode light ET dark
6. Vérifier le responsive sur mobile (375px), tablette (768px), desktop (1280px+)
