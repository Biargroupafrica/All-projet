# Skill : Plateforme Actor Hub - SaaS & CPaaS

## Contexte

Actor Hub est une plateforme SaaS/CPaaS multi-tenant développée par **BIAR GROUP AFRICA SARLU**. Elle regroupe 4 modules principaux autonomes, chacun étant un microservice indépendant capable de fonctionner seul ou intégré à l'écosystème global.

**Slogan** : "One platform — Infinite connections"

## Design de référence (Figma Make)

- **FileKey** : `XDPnl4zhusx3vecuWQTYFx`
- **Homepage** : `/` — Landing page vitrine
- **Services** : `/services` — Présentation des solutions
- **Call Center** : `/fonctionnalites/call-center`
- **Industries** : `/industries`
- **Tarifs** : `/tarifs`
- **Actualités** : `/actualites`
- **À propos** : `/a-propos`
- **Contact** : `/contact`
- **Login** : `/login`

## Architecture technique

### Stack Frontend
- **Framework** : React 18 + TypeScript
- **Routing** : React Router v7 (170+ routes)
- **Styling** : Tailwind CSS v4 + shadcn/ui + Radix UI
- **Thème** : Dark/Light mode (next-themes)
- **i18n** : 10 langues supportées
- **Couleurs** : Primary Violet `#5906AE`, Accent Rose `#FF006F`

### Stack Backend (cible)
- **API Gateway** : Node.js / Express ou NestJS
- **Microservices** : Node.js (TypeScript) ou Go
- **Base de données** : PostgreSQL (Supabase)
- **Cache** : Redis
- **Message Queue** : RabbitMQ ou Redis Streams
- **Stockage** : Supabase Storage / S3
- **Auth** : Supabase Auth (JWT, multi-rôles)

### Infrastructure
- **Frontend** : Vercel
- **Backend** : Supabase + services cloud
- **CDN** : Cloudflare
- **CI/CD** : GitHub Actions

## Les 4 modules autonomes (Microservices)

### 1. Actor CallCenter (CPaaS)
- Softphone WebRTC intégré
- SIP Gateway / Trunk SIP
- IVR Builder visuel
- ACD (Distribution automatique d'appels)
- File d'attente intelligente
- Enregistrement des appels
- Power/Predictive/Preview Dialer
- Supervision en temps réel
- Scripts d'appels
- Analytics et reporting

### 2. Actor Bulk SMS (CPaaS)
- Envoi SMS unitaire et en masse
- Connexion SMPP Gateway
- Gestion des Sender ID
- Rapports DLR (Delivery)
- HLR Lookup
- SMS A2P / OTP
- RCS Messages
- Planification de campagnes
- API REST pour intégration
- Gestion de contacts et listes

### 3. Actor WhatsApp Marketing (SaaS)
- WhatsApp Business API
- Chat multi-agent
- Broadcast / Envoi en masse
- Chatbot IA (OpenAI)
- Flow Builder visuel
- Templates WhatsApp
- QR Code connexion
- Anti-blocage
- Analytics marketing
- OTP WhatsApp

### 4. Actor Email Marketing (SaaS)
- Éditeur email WYSIWYG
- Templates email
- Flow Builder (automatisation)
- Configuration SMTP
- DNS Authentication (SPF, DKIM, DMARC)
- Segmentation avancée
- A/B Testing
- Analytics (ouvertures, clics, bounces)
- Délivrabilité

## Modules transversaux

### Authentification & Autorisation
- 4 rôles : Super Admin, Admin, Agent, Customer
- Multi-tenant (isolation des données par entreprise)
- JWT tokens via Supabase Auth
- 2FA optionnel

### Gestion des contacts
- CRM léger intégré
- Import/Export CSV
- Géolocalisation
- Tags et champs personnalisés
- Pipeline de vente

### Facturation & Abonnements
- 3 plans : Starter, Pro, Enterprise
- Gestion des crédits (SMS, appels)
- Historique de paiements
- Factures automatiques

### Support & Assistance
- Tickets de support
- Base de connaissances
- FAQ
- Chat en direct
- Signalement de bugs
- Tutoriels vidéo

### Frontend Management (CMS)
- Gestion des pages
- Sections et widgets
- Gestionnaire de médias
- Menus et navigation
- SEO et métadonnées

## Règles de développement

1. **Autonomie** : Chaque microservice DOIT pouvoir fonctionner indépendamment
2. **API-first** : Toute communication inter-services passe par des API REST/gRPC
3. **Multi-tenant** : Chaque donnée est isolée par `tenant_id`
4. **Responsive** : Mobile-first, tous les breakpoints supportés
5. **Accessibilité** : WCAG 2.1 AA minimum
6. **Performance** : Lazy loading, code splitting, cache agressif
7. **Sécurité** : OWASP Top 10, rate limiting, validation des entrées
8. **Tests** : Unit tests + Integration tests + E2E tests
9. **Documentation** : OpenAPI/Swagger pour chaque service
10. **Monitoring** : Logs structurés, métriques, alertes

## Quand utiliser ce skill

- Lors de la création ou modification de tout composant de la plateforme Actor Hub
- Pour comprendre l'architecture globale et les relations entre microservices
- Pour référencer le design Figma lors du développement frontend
- Pour configurer l'infrastructure et les pipelines CI/CD
