# AGENTS.md — Actor Hub Platform (SaaS / CPaaS)

## Présentation du Projet

**Actor Hub** est une plateforme SaaS/CPaaS multi-tenant conçue par Biar Group. Elle regroupe en une seule interface plusieurs solutions de communication autonomes déployables individuellement comme microservices indépendants :

| Module | Description |
|---|---|
| **Call Center** | Centre d'appels cloud avec IVR, ACD, softphone WebRTC |
| **SMS Bulk** | Marketing SMS, A2P, SMPP gateway, DLR reports |
| **Email Marketing** | Campagnes email, SMTP, automation flows, analytics |
| **WhatsApp Business** | WABA, broadcasts, chatbot IA, conversations multi-agents |
| **CPaaS API** | APIs unifiées REST/Webhook pour développeurs |
| **Landing Page Vitrine** | Site marketing public multi-langue |
| **Super Admin** | Gestion multi-tenant, facturation, support |

---

## Stack Technologique

### Frontend (commun à tous les modules)
- **Framework** : React 18 + TypeScript
- **Routing** : React Router v7 (170+ routes)
- **UI** : shadcn/ui + Radix UI + Tailwind CSS v4
- **State** : Zustand (app-store)
- **Internationalisation** : 10 langues (FR, EN, AR, ES, PT, DE, IT, ZH, TR, RU)
- **Thème** : Dark/Light mode

### Backend & Services
- **BaaS** : Supabase (Auth, DB PostgreSQL, Storage, Edge Functions)
- **Temps réel** : Supabase Realtime
- **Files d'attente** : Redis (Bull/BullMQ)
- **WebRTC** : Softphone intégré
- **Protocoles** : SMPP (SMS), SIP/WebRTC (Voice), SMTP (Email), WhatsApp Business API

### Déploiement
- **Frontend** : Vercel / Cloudflare Pages
- **Backend** : Supabase Edge Functions + Node.js microservices
- **CDN** : Cloudflare
- **Conteneurs** : Docker + Kubernetes (production)

---

## Architecture Multi-Tenant

```
Super Admin (Biar Group)
    └── Tenant A (Entreprise A)
            ├── Admin
            ├── Agents
            └── Customers
    └── Tenant B (Entreprise B)
            ├── Admin
            ├── Agents
            └── Customers
```

Chaque module est autonome et peut être activé/désactivé par tenant.

---

## Skills Disponibles

Les fichiers de skills ci-dessous décrivent les procédures détaillées à suivre pour chaque module :

| Fichier Skill | Quand l'utiliser |
|---|---|
| `skills/01-landing-page.md` | Développement du site vitrine public |
| `skills/02-auth-multitenancy.md` | Authentification, rôles, multi-tenant |
| `skills/03-call-center.md` | Module Call Center (IVR, ACD, Softphone) |
| `skills/04-sms-bulk.md` | Module SMS Marketing & A2P |
| `skills/05-email-marketing.md` | Module Email Marketing & Automation |
| `skills/06-whatsapp-business.md` | Module WhatsApp Business Platform |
| `skills/07-cpaas-api.md` | Couche API REST/Webhook unifiée |
| `skills/08-super-admin.md` | Dashboard Super Admin & multi-tenant |
| `skills/09-frontend-shared.md` | Composants UI partagés & design system |
| `skills/10-infra-deployment.md` | Infrastructure, Docker, CI/CD |

---

## Règles Générales de Développement

1. **Chaque microservice est autonome** : il doit avoir sa propre base de données (schéma isolé), ses propres APIs et son propre déploiement Docker.
2. **Multi-tenant obligatoire** : tout enregistrement doit inclure `tenant_id`.
3. **Sécurité first** : Row Level Security (RLS) Supabase activée sur toutes les tables.
4. **Internationalisation** : utiliser le hook `useLanguage()` et le fichier `src/app/i18n/translations.ts` pour tout texte visible.
5. **Responsive** : mobile-first avec breakpoints Tailwind (sm, md, lg, xl).
6. **Tests** : chaque service doit avoir des tests d'intégration pour les APIs critiques.
7. **Documentation API** : format OpenAPI 3.0 pour chaque endpoint.

---

## Environnement de Développement

```bash
# Installation
pnpm install

# Dev server
pnpm dev

# Build
pnpm build

# Tests
pnpm test
```

### Variables d'environnement requises
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SMPP_GATEWAY_URL=
VITE_SMTP_GATEWAY_URL=
VITE_WHATSAPP_API_URL=
VITE_SIP_SERVER_URL=
```

---

## Figma Design Source

- **Fichier Make** : `XDPnl4zhusx3vecuWQTYFx`
- **URL** : `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/`
- **Design System** : voir `src/styles/COLOR_PALETTE.css` et `src/styles/theme.css`
- **Couleur principale** : Rose/Pink (`#E91E8C` ou équivalent CSS var `--color-primary`)
