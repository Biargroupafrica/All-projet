# AGENTS.md — Actor Hub Platform

## Vue d'ensemble du projet

**Actor Hub** (Biar Group Africa SARLU) est une plateforme **SaaS multi-tenant + CPaaS** composée de 4 modules de communication autonomes :
- **Actor CallCenter** : Centre d'appels cloud (SIP/WebRTC, IVR, ACD)
- **Actor Bulk SMS** : Marketing SMS en masse (SMPP, HLR, A2P)
- **Actor WhatsApp Marketing** : WhatsApp Business API (Meta)
- **Actor Emailing Marketing** : Campagnes email (SMTP, MJML, automation)

**Figma Make (source de vérité du design)** : `XDPnl4zhusx3vecuWQTYFx`

---

## Structure du workspace

```
/workspace/
├── skills/
│   └── saas-cpaas-platform.md      # Skill principal — TOUJOURS lire en premier
├── prompts/
│   ├── pages/
│   │   ├── 01-landing-page.md      # Site vitrine (toutes les pages publiques)
│   │   └── 10-questions-etapes-suivantes.md  # Questions de cadrage
│   ├── microservices/
│   │   ├── 02-auth-multitenancy.md # Auth & Multi-tenant
│   │   ├── 03-call-center.md       # Microservice Call Center
│   │   ├── 04-bulk-sms.md          # Microservice SMS
│   │   ├── 05-whatsapp-business.md # Microservice WhatsApp
│   │   └── 06-email-marketing.md   # Microservice Email
│   └── architecture/
│       ├── 07-super-admin.md       # Interface Super Admin
│       ├── 08-microservices-architecture.md  # Architecture globale
│       └── 09-api-cpaas.md         # API CPaaS publique
└── README.md                       # Racine du projet
```

---

## Skills disponibles

### `skills/saas-cpaas-platform.md`
**Quand l'utiliser** : Pour TOUTE tâche sur Actor Hub.
Ce skill définit :
- La stack technique (React + TypeScript + Tailwind + shadcn/ui)
- L'architecture microservices et les principes d'autonomie
- Les règles de développement (composants, routes, conventions)
- Les rôles utilisateurs (Super Admin, Admin, Manager, Agent, Customer)
- Les références aux composants existants (Figma Make)

---

## Instructions de développement

### Avant de coder
1. **Lire `skills/saas-cpaas-platform.md`** pour le contexte global
2. **Lire le prompt spécifique** dans `prompts/` pour le module concerné
3. **Consulter le Figma Make** si un composant visuel est impliqué (clé `XDPnl4zhusx3vecuWQTYFx`)

### Conventions de code

**Composants React**
- Exports nommés uniquement : `export function MonComposant()` (jamais `export default`)
- Props typées avec des interfaces TypeScript
- Pas de valeurs hardcodées (couleurs, textes) — utiliser les classes Tailwind et les variables CSS

**Routes**
- Toujours ajouter dans `src/app/routes.ts` après création d'un composant de page
- Pages vitrine : sous `VitrineLayout` (path `/`)
- Pages dashboard : sous `DashboardLayout` (path `/dashboard`)
- Auth : routes standalone (ex: `/login`)

**Styles**
- Primaire : violet `#5906AE` → classe `bg-[#5906AE]` ou variable CSS `--color-primary`
- Accent : rose `#FF006F` → classe `bg-[#FF006F]` ou variable CSS `--color-accent`
- Toujours texte blanc sur fond coloré
- Mobile-first : commencer par le mobile, étendre avec `sm:`, `md:`, `lg:`

**Microservices**
- Chaque service expose `GET /health` (health check)
- Chaque service expose `GET /metrics` (Prometheus)
- Logging JSON structuré avec `correlation-id`
- Variables d'environnement documentées dans `.env.example`

### Tests
- Avant tout commit : `npm run build` doit passer sans erreur
- Pour les nouvelles pages : vérifier l'affichage en mode light ET dark
- Pour les microservices : les endpoints critiques doivent avoir des tests d'intégration

---

## Cursor Cloud — Instructions spécifiques

### Développement frontend
- Stack : React + Vite (pas de Next.js)
- Le projet frontend est basé sur le code exporté de Figma Make
- Pour installer les dépendances : `npm install` à la racine du projet frontend

### Variables d'environnement
- Les secrets sont injectés via Cursor Cloud > Secrets
- Nommer les secrets : `SERVICE_NAME_VARIABLE` (ex: `AUTH_JWT_SECRET`, `SMS_SMPP_PASSWORD`)

### Commandes de développement
```bash
# Frontend
npm run dev        # Démarrer le serveur de dev (Vite)
npm run build      # Build de production
npm run preview    # Prévisualiser le build

# Microservices (depuis le dossier du service)
npm run dev        # Mode développement avec hot-reload
npm run build      # Compilation TypeScript
npm run start      # Démarrer en production
npm test           # Tests
```

---

## Ordre de priorité de développement

1. **Site vitrine** (landing page, pages publiques) — Partie 1
2. **Auth & Multi-tenant** — Partie 2
3. **Module SMS** (le plus rapide, protocoles simples) — Partie 4
4. **Dashboard & Analytics** — transversal
5. **Module WhatsApp** — Partie 5
6. **Module Call Center** (le plus complexe) — Partie 3
7. **Module Email** — Partie 6
8. **API CPaaS publique** — Architecture 09
9. **Super Admin avancé** — Architecture 07

---

## Références importantes

| Ressource | URL / Chemin |
|---|---|
| Figma Make | `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/` |
| Landing page | `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/?preview-route=/` |
| Services | `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/?preview-route=/services` |
| Call Center Features | `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/?preview-route=/fonctionnalites/call-center` |
| Industries | `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/?preview-route=/industries` |
| Tarifs | `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/?preview-route=/tarifs` |
| Actualités | `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/?preview-route=/actualites` |
| À propos | `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/?preview-route=/a-propos` |
| Contact | `https://actorhub.figma.site/contact` |
| Login | `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/?preview-route=/login` |
