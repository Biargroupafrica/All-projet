# Skill : Création de la Plateforme SaaS & CPaaS — Actor Hub

## Quand utiliser ce skill

Ce skill s'applique dès qu'une tâche concerne la plateforme **Actor Hub** (Biar Group Africa SARLU) :
- Développement d'une nouvelle page ou d'un nouveau microservice
- Intégration d'une API de communication (SMS, voix, WhatsApp, email)
- Modification du site vitrine (landing page, tarifs, contact, à propos…)
- Développement du dashboard SaaS (Call Center, Bulk SMS, WhatsApp, Emailing)
- Mise en place d'une architecture microservices autonome
- Configuration des passerelles (SMPP, SIP/VoIP, SMTP, WhatsApp Business API)

---

## 1. Vue d'ensemble de la plateforme

**Actor Hub** est une plateforme SaaS multi-tenant **et** CPaaS (Communications Platform as a Service) composée de **4 modules indépendants**, chacun autonome et déployable séparément :

| Module | Description | Protocoles / APIs |
|---|---|---|
| **Actor CallCenter** | Centre d'appels cloud avec softphone intégré | SIP/WebRTC, CTI, ACD, IVR |
| **Actor Bulk SMS** | Marketing SMS en masse | SMPP 3.4, HTTP REST, HLR |
| **Actor WhatsApp Marketing** | Marketing WhatsApp Business | WhatsApp Business API (Meta) |
| **Actor Emailing Marketing** | Campagnes email professionnelles | SMTP, IMAP, API REST |

---

## 2. Stack technique de référence

### Frontend (site vitrine + dashboard)
- **Framework** : React 18 + TypeScript
- **Router** : React Router v7 (`createBrowserRouter`)
- **Styling** : Tailwind CSS + shadcn/ui (composants radix-based)
- **State** : Zustand (`stores/app-store.ts`)
- **Thème** : `next-themes` (dark/light/system)
- **i18n** : Context personnalisé (`i18n/language-context.tsx`), fichiers de traduction dans `locales/`
- **Build** : Vite + PostCSS

### Design System
- **Couleur primaire** : Violet `#5906AE`
- **Couleur accent** : Rose `#FF006F`
- **Règle** : Texte/icônes blancs sur fonds colorés
- **Composants UI** : `src/app/components/ui/` (badge, button, card, dialog, input, label, select, tabs, etc.)

### Structure des routes
```
/                          → Vitrine (VitrineLayout)
  /services                → Solutions
  /fonctionnalites/*       → Fonctionnalités par module
  /industries              → Secteurs
  /tarifs                  → Grilles tarifaires
  /actualites              → Blog/Actualités
  /a-propos                → À propos
  /contact                 → Formulaire de contact
/login                     → Sélection du type de login
/dashboard/*               → Application SaaS (DashboardLayout)
```

---

## 3. Architecture microservices (autonomie de chaque solution)

Chaque module est conçu pour fonctionner de manière **indépendante** :

```
actor-hub/
├── services/
│   ├── call-center/          # Microservice Call Center
│   │   ├── api/              # REST API + WebSocket
│   │   ├── sip-gateway/      # Passerelle SIP
│   │   ├── ivr-engine/       # Moteur IVR
│   │   └── acd-router/       # Routage ACD
│   ├── bulk-sms/             # Microservice SMS
│   │   ├── api/              # REST API
│   │   ├── smpp-gateway/     # Passerelle SMPP
│   │   └── scheduler/        # Planificateur campagnes
│   ├── whatsapp/             # Microservice WhatsApp
│   │   ├── api/              # REST API
│   │   ├── wa-business/      # Intégration Meta API
│   │   └── chatbot-engine/   # Moteur chatbot
│   └── emailing/             # Microservice Email
│       ├── api/              # REST API
│       ├── smtp-gateway/     # Passerelle SMTP
│       └── template-engine/  # Moteur de templates
├── shared/
│   ├── auth/                 # Auth multi-tenant (JWT, RBAC)
│   ├── billing/              # Facturation & crédits
│   ├── analytics/            # Analytics transversale
│   └── notifications/        # Notifications système
└── frontend/
    ├── vitrine/              # Site marketing
    └── dashboard/            # Application SaaS
```

---

## 4. Rôles & niveaux d'accès

La plateforme gère **5 niveaux d'accès** :

1. **Super Admin** — Accès total plateforme, gestion des tenants
2. **Admin** — Gestion de son tenant (organisation)
3. **Manager** — Supervision des agents, rapports
4. **Agent** — Interface opérationnelle (call center, chat)
5. **Customer** — Espace client (facturation, usage)

---

## 5. Règles de développement obligatoires

### Composants & UI
- Toujours utiliser les composants `src/app/components/ui/` existants (ne pas réinventer)
- Respecter le système de couleurs : primaire violet `#5906AE`, accent rose `#FF006F`
- Toute nouvelle page doit être responsive (mobile-first avec les classes Tailwind `sm:`, `md:`, `lg:`)
- Utiliser `shadcn/ui` pour tous les formulaires, tableaux, dialogues

### Routes
- Les pages vitrine s'intègrent sous `VitrineLayout` (navigation + footer inclus)
- Les pages dashboard s'intègrent sous `DashboardLayout` (sidebar + header inclus)
- Ajouter la route dans `src/app/routes.ts` après création du composant
- Exporter le composant nommément (pas de `export default` anonyme)

### Microservices
- Chaque microservice doit exposer une **API REST documentée** (OpenAPI 3.0)
- Chaque microservice doit avoir ses propres variables d'environnement
- Les services communiquent via **message queue** (pas d'appels synchrones directs entre services)
- Chaque service embarque sa propre logique de retry et circuit breaker

### Authentification
- JWT avec refresh token
- Multi-tenant : chaque requête porte un `tenant_id`
- RBAC granulaire par module et par action

### Tests
- Avant tout commit : vérifier que `npm run build` passe sans erreur
- Les nouveaux composants doivent être fonctionnels (pas de props `any` non typés)

---

## 6. Pages clés à connaître

| Fichier | Description |
|---|---|
| `src/app/App.tsx` | Point d'entrée, providers globaux |
| `src/app/routes.ts` | Toutes les routes de l'application |
| `src/app/components/vitrine/vitrine-layout.tsx` | Layout site marketing |
| `src/app/components/dashboard-layout.tsx` | Layout dashboard SaaS |
| `src/app/components/auth/login-selection.tsx` | Sélection du type de connexion |
| `src/app/components/auth/login-admin.tsx` | Login Admin |
| `src/app/components/auth/super-admin-dashboard.tsx` | Dashboard Super Admin |
| `src/app/components/overview.tsx` | Dashboard principal |
| `src/styles/index.css` | Variables CSS globales |
| `src/styles/COLOR_PALETTE.css` | Palette de couleurs officielle |

---

## 7. Questions à poser avant de démarrer une nouvelle tâche

Avant de commencer tout développement, confirmer avec l'utilisateur :

1. **Module cible** : Call Center ? SMS ? WhatsApp ? Email ? Vitrine ? Auth ?
2. **Rôle utilisateur** : Super Admin / Admin / Manager / Agent / Customer ?
3. **Nouvelle page ou nouveau microservice backend ?**
4. **Doit-il s'intégrer dans le dashboard existant ou être autonome ?**
5. **Y a-t-il une maquette Figma Make de référence ?** (clé : `XDPnl4zhusx3vecuWQTYFx`)
6. **Langues à supporter ?** (FR par défaut, EN, AR selon le marché cible)

---

## 8. Figma Make — Fichier de référence

- **Clé du fichier Figma Make** : `XDPnl4zhusx3vecuWQTYFx`
- **URL de prévisualisation** : `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/`
- Pour récupérer le code source d'un composant, utiliser `get_design_context` avec le `fileKey` ci-dessus
- Le code est en React + TypeScript + Tailwind (correspondance directe avec le projet)
