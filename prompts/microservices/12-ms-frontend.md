# Prompt: ms-frontend - Landing Page & Dashboard (React)

## Rôle
Tu es un développeur frontend senior spécialisé en React, TypeScript et UI/UX. Tu dois créer le frontend de la plateforme Actor Hub, incluant le site vitrine (landing pages) et le dashboard d'administration.

## Mission
Créer l'application frontend complète basée sur les designs Figma Make (fileKey: `XDPnl4zhusx3vecuWQTYFx`), avec le site vitrine public et le dashboard privé multi-module.

## Spécifications techniques

### Stack
- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Router:** React Router v7
- **UI:** Tailwind CSS v4 + shadcn/ui + Radix UI
- **State:** Zustand
- **Charts:** Recharts
- **Icons:** Lucide React
- **i18n:** Custom context (10 langues)
- **Theme:** next-themes (dark/light)
- **Port:** 3000

### Structure du projet
```
ms-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── vitrine/          # Landing pages
│   │   │   │   ├── home.tsx
│   │   │   │   ├── solutions.tsx
│   │   │   │   ├── pricing.tsx
│   │   │   │   ├── about.tsx
│   │   │   │   ├── contact.tsx
│   │   │   │   ├── actualites.tsx
│   │   │   │   ├── features-call-center.tsx
│   │   │   │   ├── features-sms.tsx
│   │   │   │   ├── features-email.tsx
│   │   │   │   ├── features-whatsapp.tsx
│   │   │   │   ├── industries.tsx
│   │   │   │   └── vitrine-layout.tsx
│   │   │   ├── auth/             # Authentification
│   │   │   │   ├── login-selection.tsx
│   │   │   │   ├── login-admin.tsx
│   │   │   │   ├── login-agent.tsx
│   │   │   │   ├── login-customer.tsx
│   │   │   │   └── login-super-admin.tsx
│   │   │   ├── dashboard/        # Dashboard & Overview
│   │   │   ├── call-center/      # Module Centre d'Appels
│   │   │   ├── sms/              # Module SMS
│   │   │   ├── email/            # Module Email
│   │   │   ├── whatsapp/         # Module WhatsApp
│   │   │   ├── contacts/         # Gestion Contacts
│   │   │   ├── billing/          # Facturation
│   │   │   ├── settings/         # Paramètres
│   │   │   ├── support/          # Support
│   │   │   └── ui/               # Composants shadcn/ui
│   │   ├── hooks/
│   │   ├── i18n/
│   │   ├── stores/
│   │   ├── utils/
│   │   ├── routes.ts
│   │   └── App.tsx
│   ├── styles/
│   │   ├── index.css
│   │   ├── theme.css
│   │   └── tailwind.css
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Design System

#### Couleurs
```css
--primary: #5906AE;        /* Violet */
--primary-dark: #4A058F;
--accent: #FF006F;         /* Rose */
--accent-dark: #D4005C;
--footer-blue: #2B7FFF;
--background: #FAFBFC;
--card: #FFFFFF;
--foreground: #1A202C;
--muted: #718096;
--border: #E2E8F0;
--success: #48BB78;
--warning: #ECC94B;
--destructive: #F56565;
```

#### Typographie
- System UI, sans-serif
- H1: 32px bold, H2: 24px semibold, H3: 20px medium, Body: 16px, Small: 14px

#### Breakpoints (Mobile First)
- `sm`: 640px (tablette)
- `md`: 1024px (desktop)
- `lg`: 1280px (large)
- `xl`: 1536px (xlarge)

### Pages Landing (Site Vitrine)

| Route | Composant | Description |
|---|---|---|
| `/` | VitrineHome | Hero, Features 4 modules, Stats, Testimonials, CTA |
| `/services` | VitrineSolutions | Liste des solutions par canal |
| `/fonctionnalites/call-center` | FeaturesCallCenter | Détail module Call Center |
| `/fonctionnalites/sms-marketing` | FeaturesSMS | Détail module SMS |
| `/fonctionnalites/whatsapp-business` | FeaturesWhatsApp | Détail module WhatsApp |
| `/fonctionnalites/email-marketing` | FeaturesEmail | Détail module Email |
| `/industries` | Industries | Secteurs cibles |
| `/tarifs` | VitrinePricing | Plans tarifaires |
| `/actualites` | VitrineActualites | Blog |
| `/a-propos` | VitrineAbout | À propos |
| `/contact` | VitrineContact | Formulaire contact |
| `/login` | LoginSelection | Sélection type utilisateur |

### Pages Dashboard (170+ routes)
Voir le fichier `routes.ts` du Figma Make pour la liste complète des routes dashboard.

### Référence Figma
Les designs sont dans le Figma Make `XDPnl4zhusx3vecuWQTYFx`. Utiliser `get_design_context` pour chaque composant.
