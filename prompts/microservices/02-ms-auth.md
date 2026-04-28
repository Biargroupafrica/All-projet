# Prompt: ms-auth - Authentification & Autorisation

## Rôle
Tu es un développeur backend senior spécialisé en sécurité et authentification. Tu dois créer le microservice `ms-auth` pour la plateforme Actor Hub.

## Mission
Créer le service d'authentification multi-tenant avec support multi-rôles (Super Admin, Admin, Agent, Superviseur, Customer), JWT, 2FA, OAuth2 et RBAC.

## Spécifications techniques

### Stack
- **Framework:** NestJS
- **Port:** 8001
- **Base de données:** PostgreSQL (Supabase) - schema `auth`
- **Cache:** Redis (sessions, tokens blacklist)

### Fonctionnalités requises

1. **Authentification**
   - Login par email/mot de passe
   - Login par type d'utilisateur (4 portails: Admin, Agent, Customer, Super Admin)
   - JWT Access Token (15min) + Refresh Token (7 jours)
   - Mot de passe oublié (email OTP)
   - Inscription avec validation email

2. **Autorisation (RBAC)**
   - 5 rôles: `super_admin`, `admin`, `agent`, `supervisor`, `customer`
   - Permissions granulaires par module (call-center, sms, email, whatsapp)
   - Guard middleware pour chaque endpoint
   - Permissions: `read`, `write`, `delete`, `admin` par ressource

3. **Multi-Tenant**
   - Isolation des données par `tenant_id`
   - Chaque utilisateur appartient à un tenant
   - Super Admin peut accéder à tous les tenants

4. **2FA (Two-Factor Authentication)**
   - TOTP (Google Authenticator, Authy)
   - SMS OTP via ms-sms
   - Email OTP

5. **OAuth2** (optionnel phase 2)
   - Google Login
   - Microsoft Login

6. **Sessions Management**
   - Liste des sessions actives par utilisateur
   - Déconnexion d'une session spécifique
   - Déconnexion de toutes les sessions

7. **Audit Log**
   - Log de chaque action d'authentification
   - Tentatives de login échouées
   - Changements de mot de passe

### Schéma Base de Données
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'agent',
  phone VARCHAR(20),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret VARCHAR(255),
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  refresh_token VARCHAR(500) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(50) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  UNIQUE(role, resource, action)
);

CREATE TABLE auth_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tenant_id UUID,
  action VARCHAR(50) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
```
POST   /api/v1/auth/login              # Login
POST   /api/v1/auth/signup             # Inscription
POST   /api/v1/auth/refresh            # Refresh token
POST   /api/v1/auth/logout             # Logout
POST   /api/v1/auth/forgot-password    # Mot de passe oublié
POST   /api/v1/auth/reset-password     # Reset mot de passe
POST   /api/v1/auth/verify-email       # Vérifier email
POST   /api/v1/auth/2fa/setup          # Configurer 2FA
POST   /api/v1/auth/2fa/verify         # Vérifier code 2FA
GET    /api/v1/auth/me                 # Profil utilisateur connecté
GET    /api/v1/auth/sessions           # Sessions actives
DELETE /api/v1/auth/sessions/:id       # Supprimer une session
```

### Events publiés
```
user.created    → { userId, tenantId, email, role }
user.updated    → { userId, changes }
user.deleted    → { userId, tenantId }
user.login      → { userId, ip, userAgent }
user.logout     → { userId, sessionId }
```

## Contraintes
- Mots de passe hashés avec bcrypt (12 rounds)
- Rate limiting: 5 tentatives de login / 15 min par IP
- Refresh tokens stockés en base (révocables)
- HTTPS obligatoire en production
- Conformité RGPD (droit à l'oubli, export données)
