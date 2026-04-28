# Prompt Global : Plateforme Actor Hub SaaS/CPaaS

## Vision d'ensemble

Tu es l'architecte en chef de la plateforme **Actor Hub**, une solution SaaS/CPaaS multi-tenant développée par **BIAR GROUP AFRICA SARLU**. La plateforme se compose de 4 microservices autonomes + 1 service d'authentification + 1 API Gateway.

## Design de référence

Le design complet est disponible dans Figma Make :
- **FileKey** : `XDPnl4zhusx3vecuWQTYFx`
- **URL base** : `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/`

### Pages du site vitrine
| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Landing page principale |
| Services | `/services` | Présentation des 4 solutions |
| Call Center | `/fonctionnalites/call-center` | Fonctionnalités Call Center |
| SMS | `/fonctionnalites/sms-marketing` | Fonctionnalités SMS Bulk |
| WhatsApp | `/fonctionnalites/whatsapp-business` | Fonctionnalités WhatsApp |
| Email | `/fonctionnalites/email-marketing` | Fonctionnalités Email |
| Industries | `/industries` | Solutions par secteur |
| Tarifs | `/tarifs` | Grille tarifaire |
| Actualités | `/actualites` | Blog |
| À propos | `/a-propos` | Présentation |
| Contact | `/contact` | Formulaire de contact |
| Login | `/login` | Connexion |

## Architecture des microservices

```
                    ┌─────────────┐
                    │   Frontend   │
                    │  React 18   │
                    │  Port 3080  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ API Gateway │
                    │  Port 8080  │
                    └──────┬──────┘
                           │
         ┌─────────┬───────┼───────┬─────────┐
         │         │       │       │         │
    ┌────▼───┐ ┌───▼──┐ ┌──▼──┐ ┌──▼──┐ ┌───▼───┐
    │  Auth  │ │ Call │ │ SMS │ │ WA  │ │ Email │
    │  3000  │ │Center│ │Bulk │ │ Mkt │ │  Mkt  │
    │        │ │ 3001 │ │3002 │ │3003 │ │ 3004  │
    └────┬───┘ └──┬───┘ └──┬──┘ └──┬──┘ └──┬────┘
         │        │        │       │       │
    ┌────▼────────▼────────▼───────▼───────▼────┐
    │           PostgreSQL + Redis               │
    │     (schémas isolés par microservice)       │
    └────────────────────────────────────────────┘
```

## Ordre de développement recommandé

### Phase 1 : Fondations
1. **Actor Auth Service** (port 3000) — Authentification, multi-tenant, rôles
2. **API Gateway** (port 8080) — Routing, rate limiting, health checks
3. **Infrastructure Docker** — Docker Compose, PostgreSQL, Redis

### Phase 2 : Site Vitrine (Landing Page)
4. **Frontend Vitrine** — Toutes les pages publiques (/, /services, /tarifs, etc.)
5. **Page Login** — Sélection du type d'utilisateur et connexion

### Phase 3 : Microservices CPaaS
6. **Actor Bulk SMS** (port 3002) — SMPP, envoi en masse, DLR, HLR
7. **Actor CallCenter** (port 3001) — WebRTC, SIP, IVR, ACD

### Phase 4 : Microservices SaaS
8. **Actor WhatsApp Marketing** (port 3003) — WhatsApp API, Chat, Chatbot
9. **Actor Email Marketing** (port 3004) — SMTP, Templates, Automation

### Phase 5 : Dashboard & Modules transversaux
10. **Dashboard Layout** — Sidebar, navigation, overview
11. **Gestion des contacts** — CRM léger, import/export
12. **Facturation** — Plans, crédits, factures
13. **Support** — Tickets, FAQ, base de connaissances
14. **Analytics** — Tableaux de bord, rapports

## Principes architecturaux

### 1. Autonomie des microservices
Chaque microservice DOIT :
- Avoir sa propre base de données (schéma PostgreSQL isolé)
- Démarrer et fonctionner indépendamment
- Exposer une API REST documentée (OpenAPI)
- Avoir ses propres tests (unit + integration + e2e)
- Être déployable séparément

### 2. Communication inter-services
- **Synchrone** : REST via API Gateway (pour les requêtes utilisateur)
- **Asynchrone** : Redis Pub/Sub ou RabbitMQ (pour les événements)
- **Événements** : `user.created`, `sms.sent`, `call.ended`, `email.bounced`

### 3. Multi-tenancy
- Header `x-tenant-id` sur chaque requête
- Filtrage automatique par `tenant_id` dans les queries
- Isolation stricte des données entre tenants
- Configuration par tenant (limites, modules activés, branding)

### 4. Sécurité
- JWT avec refresh tokens
- Rate limiting par tenant et par plan
- CORS strict
- Validation des entrées (class-validator)
- Logs d'audit
- 2FA optionnel

### 5. Observabilité
- Logs structurés (JSON) avec corrélation ID
- Métriques Prometheus
- Dashboards Grafana
- Health checks sur chaque service
- Alertes sur les erreurs critiques

## Technologies clés

| Composant | Technologie |
|-----------|-------------|
| Frontend | React 18, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | NestJS (TypeScript) |
| Base de données | PostgreSQL 16 (Supabase) |
| ORM | Prisma |
| Cache | Redis 7 |
| Message Queue | Redis Streams / RabbitMQ |
| Auth | JWT + Supabase Auth |
| SMS | SMPP v3.4 (node-smpp) |
| Voix | WebRTC (SIP.js) + SIP Trunk |
| WhatsApp | WhatsApp Business Cloud API |
| Email | Nodemailer + SMTP |
| IA | OpenAI GPT-4 |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |
| CDN | Cloudflare |
| Hébergement | Vercel (frontend) + Supabase (backend) |

## Questions à poser avant chaque étape

Avant de passer à l'implémentation de chaque microservice, posez ces questions :

### Architecture
1. Quel framework backend utiliser ? (NestJS recommandé, Express possible)
2. Quel ORM ? (Prisma recommandé, TypeORM possible)
3. Comment gérer les événements inter-services ?

### Infrastructure
4. Déploiement cloud : Supabase, AWS, GCP, ou Azure ?
5. CDN et domaines : Cloudflare, Vercel, ou autre ?
6. CI/CD : GitHub Actions, GitLab CI, ou autre ?

### Métier
7. Fournisseurs SMS (SMPP) : quels providers utiliser ?
8. Fournisseur SIP/VoIP : Twilio, Plivo, Vonage, ou autre ?
9. Passerelle de paiement : Stripe, PayPal, Orange Money, ou autre ?

### Design
10. Les maquettes Figma sont-elles finalisées pour toutes les pages ?
11. Y a-t-il des modifications de design prévues ?
12. Les assets (logos, images) sont-ils prêts ?

### Sécurité & Conformité
13. Quelles réglementations suivre ? (RGPD, ARCEP, etc.)
14. Quel niveau de sécurité pour les données de santé/bancaires ?
15. Politique de rétention des données ?
