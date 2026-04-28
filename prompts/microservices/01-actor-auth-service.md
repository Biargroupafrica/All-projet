# Prompt: Actor Auth Service - Microservice d'Authentification

## Contexte
Tu es un développeur senior spécialisé en sécurité et authentification. Tu dois créer le microservice **Actor Auth** pour la plateforme Actor Hub de BIAR GROUP AFRICA SARLU. Ce service est le pilier de sécurité de toute la plateforme SaaS/CPaaS multi-tenant.

## Mission
Créer un microservice d'authentification et de gestion des identités entièrement autonome qui gère :
- L'authentification multi-tenant (JWT + refresh tokens)
- La gestion des utilisateurs (CRUD)
- Les rôles et permissions (RBAC)
- Le multi-tenant avec isolation stricte
- L'authentification à deux facteurs (2FA)
- L'intégration SSO (SAML, OAuth2)

## Spécifications techniques

### Stack
- **Runtime** : Node.js 20+ / NestJS
- **Base de données** : PostgreSQL (schéma dédié `auth`)
- **Cache** : Redis (sessions, tokens blacklist)
- **ORM** : Prisma
- **Tests** : Jest + Supertest

### Schéma de base de données
```sql
CREATE SCHEMA auth;

CREATE TABLE auth.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  domain VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'starter', -- starter, pro, enterprise
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  max_users INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES auth.tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'agent', -- super_admin, admin, agent, customer
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret VARCHAR(255),
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

CREATE TABLE auth.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES auth.tenants(id),
  refresh_token VARCHAR(500) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auth.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES auth.tenants(id),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL, -- login, logout, password_change, role_change, etc.
  resource VARCHAR(100),
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auth.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES auth.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  key_prefix VARCHAR(10) NOT NULL, -- ah_live_, ah_test_
  permissions TEXT[] DEFAULT '{}',
  rate_limit INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Endpoints API
```
POST   /api/v1/auth/register          # Inscription tenant + admin
POST   /api/v1/auth/login             # Connexion (email/password)
POST   /api/v1/auth/logout            # Déconnexion
POST   /api/v1/auth/refresh           # Rafraîchir le token
POST   /api/v1/auth/forgot-password   # Demande de reset
POST   /api/v1/auth/reset-password    # Reset du mot de passe
POST   /api/v1/auth/verify-email      # Vérification email
POST   /api/v1/auth/2fa/enable        # Activer 2FA
POST   /api/v1/auth/2fa/verify        # Vérifier code 2FA
POST   /api/v1/auth/2fa/disable       # Désactiver 2FA

GET    /api/v1/users                  # Lister les utilisateurs (tenant)
POST   /api/v1/users                  # Créer un utilisateur
GET    /api/v1/users/:id              # Détail utilisateur
PUT    /api/v1/users/:id              # Modifier utilisateur
DELETE /api/v1/users/:id              # Supprimer utilisateur
PUT    /api/v1/users/:id/role         # Changer le rôle
PUT    /api/v1/users/:id/permissions  # Gérer les permissions

GET    /api/v1/tenants                # Lister les tenants (super admin)
POST   /api/v1/tenants                # Créer un tenant
GET    /api/v1/tenants/:id            # Détail tenant
PUT    /api/v1/tenants/:id            # Modifier tenant
PUT    /api/v1/tenants/:id/plan       # Changer le plan

GET    /api/v1/api-keys               # Lister les clés API
POST   /api/v1/api-keys               # Générer une clé API
DELETE /api/v1/api-keys/:id           # Révoquer une clé API

GET    /api/v1/audit-logs             # Logs d'audit (admin)

GET    /health                        # Health check
GET    /ready                         # Readiness check
```

### Rôles et permissions
```typescript
enum Role {
  SUPER_ADMIN = 'super_admin',  // Accès total, gestion multi-tenant
  ADMIN = 'admin',              // Gestion du tenant
  AGENT = 'agent',              // Opérations quotidiennes
  CUSTOMER = 'customer',        // Portail client
}

const PERMISSIONS = {
  // Call Center
  'callcenter:read', 'callcenter:write', 'callcenter:admin',
  // SMS
  'sms:read', 'sms:write', 'sms:campaign', 'sms:admin',
  // WhatsApp
  'whatsapp:read', 'whatsapp:write', 'whatsapp:campaign', 'whatsapp:admin',
  // Email
  'email:read', 'email:write', 'email:campaign', 'email:admin',
  // Contacts
  'contacts:read', 'contacts:write', 'contacts:import', 'contacts:export',
  // Billing
  'billing:read', 'billing:write',
  // Settings
  'settings:read', 'settings:write',
  // Users
  'users:read', 'users:write', 'users:admin',
  // Analytics
  'analytics:read', 'analytics:export',
  // Support
  'support:read', 'support:write', 'support:admin',
};
```

### Événements émis
```typescript
// Vers le Message Broker
'auth.user.registered'     // { userId, tenantId, email, role }
'auth.user.login'          // { userId, tenantId, ip, userAgent }
'auth.user.logout'         // { userId, tenantId }
'auth.user.updated'        // { userId, tenantId, changes }
'auth.user.deleted'        // { userId, tenantId }
'auth.tenant.created'      // { tenantId, name, plan }
'auth.tenant.plan_changed' // { tenantId, oldPlan, newPlan }
'auth.api_key.created'     // { tenantId, keyPrefix }
'auth.api_key.revoked'     // { tenantId, keyId }
```

## Critères d'acceptation
- [ ] Inscription multi-tenant fonctionnelle
- [ ] Login avec JWT (access + refresh tokens)
- [ ] RBAC avec 4 rôles et permissions granulaires
- [ ] 2FA avec TOTP (Google Authenticator)
- [ ] Isolation stricte par tenant_id
- [ ] Rate limiting sur les endpoints d'authentification
- [ ] Audit logging de toutes les actions
- [ ] Tests unitaires et d'intégration (couverture > 80%)
- [ ] Documentation OpenAPI/Swagger
- [ ] Dockerfile et docker-compose.yml
- [ ] Health checks fonctionnels
