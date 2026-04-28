# Skill: Plateforme Actor Hub - SaaS & CPaaS

## Quand utiliser ce skill
Ce skill doit être utilisé pour toute tâche liée à la plateforme **Actor Hub** de **BIAR GROUP AFRICA SARLU** : développement, architecture, déploiement, et maintenance de la plateforme SaaS/CPaaS multi-tenant.

## Vue d'ensemble de la plateforme

**Actor Hub** est une plateforme cloud SaaS & CPaaS (Communication Platform as a Service) composée de **microservices autonomes**. Chaque module peut fonctionner indépendamment et communique via des APIs REST/GraphQL et des événements asynchrones (message broker).

### Modules principaux (microservices autonomes)
1. **Actor CallCenter** - Centre d'appels cloud (VoIP/WebRTC/SIP)
2. **Actor Bulk SMS** - Marketing SMS en masse (SMPP)
3. **Actor WhatsApp Marketing** - Marketing WhatsApp Business API
4. **Actor Emailing** - Campagnes email professionnelles (SMTP)
5. **Actor Gateway** - API Gateway & orchestration
6. **Actor Auth** - Authentification & gestion multi-tenant
7. **Actor Billing** - Facturation & abonnements
8. **Actor Analytics** - Reporting & tableaux de bord
9. **Actor CRM** - Gestion des contacts & pipeline
10. **Actor Frontend** - CMS & gestion du site vitrine
11. **Actor Support** - Ticketing & base de connaissances

### Stack technique
- **Frontend** : React 18, TypeScript, Tailwind CSS v4, shadcn/ui, Radix UI, React Router v7
- **Backend** : Node.js/NestJS (microservices), Supabase Edge Functions
- **Base de données** : PostgreSQL (Supabase), Redis (cache/queues)
- **Temps réel** : WebSocket, WebRTC, Server-Sent Events
- **Protocoles télécom** : SIP, SMPP, SMTP, WhatsApp Business API
- **Infrastructure** : Vercel (frontend), Supabase (backend/DB), Cloudflare (CDN)
- **CI/CD** : GitHub Actions
- **State management** : Zustand
- **i18n** : 10 langues supportées

### Design System
- **Couleur primaire** : Violet `#5906AE`
- **Couleur accent** : Rose `#FF006F`
- **Mode sombre/clair** : Supporté via next-themes
- **Responsive** : Mobile-first, breakpoints 320px → 1536px+

### Architecture multi-tenant
- Isolation par `tenant_id` sur toutes les tables
- 4 rôles : Super Admin, Admin, Agent, Customer
- Plans : Starter, Pro, Enterprise

## Liens Figma de référence
- **Accueil** : `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/`
- **Services** : `...?preview-route=%2Fservices`
- **Call Center** : `...?preview-route=%2Ffonctionnalites%2Fcall-center`
- **Industries** : `...?preview-route=%2Findustries`
- **Tarifs** : `...?preview-route=%2Ftarifs`
- **Actualités** : `...?preview-route=%2Factualites`
- **À propos** : `...?preview-route=%2Fa-propos`
- **Contact** : `https://actorhub.figma.site/contact`
- **Login** : `...?preview-route=%2Flogin`

## Conventions de code
- Composants React en PascalCase, fichiers en kebab-case
- Hooks personnalisés préfixés par `use`
- Texte blanc automatique sur fonds colorés (primaire/accent)
- Variables CSS pour les couleurs du thème
- Zustand pour le state global, React Context pour le state partagé
