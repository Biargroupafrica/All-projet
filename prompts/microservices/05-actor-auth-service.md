# Prompt : Microservice Actor Auth & Multi-Tenant (Transversal)

## Objectif

Créer le microservice transversal d'authentification, d'autorisation et de gestion multi-tenant qui sert de fondation à tous les autres services.

## Contexte Figma

- **FileKey** : `XDPnl4zhusx3vecuWQTYFx`
- **Login** : `/login` (sélection Super Admin / Admin / Agent / Customer)
- **Signup** : composant `signup.tsx`
- **Auth components** : `src/app/components/auth/`

## Prompt de création

```
Tu es un architecte logiciel senior spécialisé en sécurité, authentification et systèmes multi-tenant.

Crée le microservice "Actor Auth Service" — le service transversal d'authentification et de gestion multi-tenant.

### Architecture du microservice

Nom : actor-auth-service
Port : 3000
Base de données : PostgreSQL (schéma dédié "auth")

### Structure du projet

actor-auth-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── jwt.config.ts
│   │   └── environment.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── local.strategy.ts
│   │   │   ├── refresh-token.service.ts
│   │   │   ├── two-factor.service.ts     # 2FA TOTP
│   │   │   ├── password-reset.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── refresh-token.dto.ts
│   │   │   │   ├── reset-password.dto.ts
│   │   │   │   └── two-factor.dto.ts
│   │   │   └── entities/
│   │   │       ├── refresh-token.entity.ts
│   │   │       └── password-reset.entity.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   ├── tenants/
│   │   │   ├── tenants.module.ts
│   │   │   ├── tenants.controller.ts
│   │   │   ├── tenants.service.ts
│   │   │   ├── tenant-provisioning.service.ts # Création tenant
│   │   │   ├── dto/
│   │   │   │   ├── create-tenant.dto.ts
│   │   │   │   └── update-tenant.dto.ts
│   │   │   └── entities/
│   │   │       ├── tenant.entity.ts
│   │   │       └── tenant-settings.entity.ts
│   │   ├── roles/
│   │   │   ├── roles.module.ts
│   │   │   ├── roles.controller.ts
│   │   │   ├── roles.service.ts
│   │   │   ├── permissions.service.ts
│   │   │   └── entities/
│   │   │       ├── role.entity.ts
│   │   │       └── permission.entity.ts
│   │   ├── subscriptions/
│   │   │   ├── subscriptions.module.ts
│   │   │   ├── subscriptions.controller.ts
│   │   │   ├── subscriptions.service.ts
│   │   │   ├── plan-limits.service.ts    # Limites par plan
│   │   │   └── entities/
│   │   │       ├── subscription.entity.ts
│   │   │       └── plan.entity.ts
│   │   ├── billing/
│   │   │   ├── billing.module.ts
│   │   │   ├── billing.controller.ts
│   │   │   ├── billing.service.ts
│   │   │   ├── invoice.service.ts
│   │   │   ├── payment.service.ts
│   │   │   └── entities/
│   │   │       ├── invoice.entity.ts
│   │   │       └── payment.entity.ts
│   │   ├── audit/
│   │   │   ├── audit.module.ts
│   │   │   ├── audit.service.ts          # Logs d'audit
│   │   │   └── entities/
│   │   │       └── audit-log.entity.ts
│   │   └── api-keys/
│   │       ├── api-keys.module.ts
│   │       ├── api-keys.controller.ts
│   │       ├── api-keys.service.ts
│   │       └── entities/
│   │           └── api-key.entity.ts
│   ├── common/
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   ├── tenant.guard.ts
│   │   │   └── api-key.guard.ts
│   │   ├── interceptors/
│   │   │   ├── tenant.interceptor.ts
│   │   │   └── audit.interceptor.ts
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   ├── tenant.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   └── middleware/
│   │       ├── rate-limit.middleware.ts
│   │       └── cors.middleware.ts
│   └── shared/
│       ├── interfaces/
│       │   ├── user.interface.ts
│       │   └── tenant.interface.ts
│       └── constants/
│           ├── roles.enum.ts
│           └── permissions.enum.ts
├── prisma/
├── test/
├── docker/
├── docs/
│   └── openapi.yaml
├── package.json
└── README.md

### Rôles et permissions

SUPER_ADMIN :
  - Accès total à la plateforme
  - Gestion de tous les tenants
  - Configuration système globale
  - Monitoring et logs
  
ADMIN (par tenant) :
  - Gestion des utilisateurs du tenant
  - Configuration des modules activés
  - Analytics et rapports
  - Billing et abonnements

AGENT (par tenant) :
  - Opérations quotidiennes (appels, SMS, etc.)
  - Gestion des contacts
  - Accès aux modules autorisés

CUSTOMER (par tenant) :
  - Portail self-service
  - Historique des communications
  - Tickets de support

### API Endpoints principaux

# Auth
POST   /api/v1/auth/login           # Connexion
POST   /api/v1/auth/register        # Inscription
POST   /api/v1/auth/refresh         # Rafraîchir token
POST   /api/v1/auth/logout          # Déconnexion
POST   /api/v1/auth/forgot-password # Demande de reset
POST   /api/v1/auth/reset-password  # Reset mot de passe
POST   /api/v1/auth/2fa/enable      # Activer 2FA
POST   /api/v1/auth/2fa/verify      # Vérifier 2FA
POST   /api/v1/auth/2fa/disable     # Désactiver 2FA

# Users
GET    /api/v1/users                 # Lister utilisateurs
POST   /api/v1/users                 # Créer utilisateur
GET    /api/v1/users/:id             # Détail utilisateur
PUT    /api/v1/users/:id             # Modifier utilisateur
DELETE /api/v1/users/:id             # Supprimer utilisateur
GET    /api/v1/users/me              # Profil courant

# Tenants
POST   /api/v1/tenants               # Créer tenant
GET    /api/v1/tenants               # Lister tenants
GET    /api/v1/tenants/:id           # Détail tenant
PUT    /api/v1/tenants/:id           # Modifier tenant
PUT    /api/v1/tenants/:id/settings  # Modifier settings

# Rôles & Permissions
GET    /api/v1/roles                 # Lister rôles
POST   /api/v1/roles                 # Créer rôle
PUT    /api/v1/roles/:id             # Modifier rôle
GET    /api/v1/permissions           # Lister permissions

# Subscriptions & Billing
GET    /api/v1/subscriptions         # Abonnement actuel
PUT    /api/v1/subscriptions         # Modifier abonnement
GET    /api/v1/invoices              # Lister factures
GET    /api/v1/payments              # Historique paiements

# API Keys
POST   /api/v1/api-keys              # Créer clé API
GET    /api/v1/api-keys              # Lister clés
DELETE /api/v1/api-keys/:id          # Révoquer clé

# Audit
GET    /api/v1/audit-logs            # Logs d'audit

### Variables d'environnement

AUTH_PORT=3000
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
BCRYPT_ROUNDS=12
TWO_FACTOR_APP_NAME=ActorHub
SMTP_HOST=... (pour emails de reset)
SMTP_PORT=587
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60
CORS_ORIGINS=https://actorhub.com,https://app.actorhub.com
```

## Critères d'acceptation

- [ ] Le service démarre indépendamment sur le port 3000
- [ ] Login/Register/Logout fonctionnent
- [ ] Les JWT sont émis et validés correctement
- [ ] Le refresh token renouvelle l'accès
- [ ] Le 2FA (TOTP) fonctionne avec apps comme Google Authenticator
- [ ] L'isolation multi-tenant est stricte (pas de fuite de données)
- [ ] Les rôles et permissions restreignent l'accès correctement
- [ ] Le rate limiting protège contre le brute force
- [ ] Les logs d'audit tracent toutes les actions sensibles
- [ ] L'API est documentée en OpenAPI
