# Skill : Auth Service — ACTOR Hub

## Scénario d'utilisation
Utiliser ce skill pour implémenter ou modifier le microservice d'authentification (`services/auth-service/`), ainsi que les composants frontend d'auth dans le dashboard.

## Contexte Métier
L'auth service est le **gardien central** de la plateforme. Tout accès à n'importe quel autre microservice passe par une validation JWT émise par ce service. Il gère également l'isolation multi-tenant.

## Fonctionnalités Requises

### Authentification
- Login email/password avec hash bcrypt (cost factor 12)
- Login SSO Google (OAuth2)
- Login SSO Microsoft (OAuth2 Azure AD)
- 2FA TOTP (Google Authenticator compatible)
- 2FA par SMS (via sms-service)
- Magic link (connexion sans mot de passe)

### Gestion des Tokens
- JWT Access Token (expiration : 15 minutes)
- JWT Refresh Token (expiration : 30 jours, rotation automatique)
- Révocation de token (blacklist Redis)
- Détection d'activité suspecte (géolocalisation IP)

### RBAC (Rôles)
| Rôle | Description |
|------|-------------|
| `super_admin` | Accès total à la plateforme opérateur |
| `org_admin` | Administrateur d'une organisation cliente |
| `org_manager` | Manager (peut créer agents, voir rapports) |
| `org_agent` | Agent (accès call center, pas config) |
| `org_supervisor` | Superviseur (écoute, rapports équipe) |
| `org_viewer` | Lecture seule (rapports uniquement) |
| `api_key` | Accès programmatique via API Key |

### Multi-tenant
- Chaque organisation a un `org_id` unique (UUID v4)
- RLS PostgreSQL : `WHERE org_id = current_setting('app.org_id')`
- Isolation stricte : un utilisateur ne peut JAMAIS accéder aux données d'une autre org
- Plans d'abonnement liés à l'organisation (via billing-service)

### API Keys
- Génération de clés API (format : `ah_live_xxxx` / `ah_test_xxxx`)
- Scopes par clé (ex: `sms:send`, `email:send`, `contacts:read`)
- Rate limiting par clé
- Logs d'utilisation par clé

## Structure de Fichiers

```
services/auth-service/
├── src/
│   ├── app.ts                  # Entrée Fastify
│   ├── config/
│   │   ├── database.ts         # Connexion PostgreSQL (Drizzle ORM)
│   │   ├── redis.ts
│   │   └── env.ts              # Variables d'env validées (Zod)
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.router.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schema.ts  # Schémas Zod pour validation
│   │   ├── users/
│   │   │   ├── users.router.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.schema.ts
│   │   ├── organizations/
│   │   │   ├── org.router.ts
│   │   │   ├── org.controller.ts
│   │   │   └── org.service.ts
│   │   └── api-keys/
│   │       ├── apikeys.router.ts
│   │       └── apikeys.service.ts
│   ├── middlewares/
│   │   ├── jwt.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema (tables)
│   │   └── migrations/
│   ├── events/
│   │   └── publisher.ts        # Publication événements Kafka
│   └── utils/
│       ├── jwt.ts
│       ├── password.ts
│       └── totp.ts
├── openapi.yaml                # Spec OpenAPI 3.1
├── Dockerfile
├── docker-compose.yml          # Pour dev local autonome
├── .env.example
└── package.json
```

## Schéma Base de Données

```sql
-- Organisations (tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'starter',  -- starter, business, enterprise
  status VARCHAR(50) DEFAULT 'active', -- active, suspended, trial
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),           -- null si SSO uniquement
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) NOT NULL DEFAULT 'org_agent',
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  totp_secret VARCHAR(255),             -- chiffré AES-256
  last_login_at TIMESTAMPTZ,
  last_login_ip INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, email)
);

-- Clés API
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE, -- hash SHA-256 de la clé
  key_prefix VARCHAR(20) NOT NULL,       -- ah_live_xxxx (pour affichage)
  scopes TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions et Refresh Tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,  -- 'login', 'logout', 'password_change', etc.
  resource VARCHAR(100),
  details JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Endpoints API

```
POST   /auth/login           # Login email/password
POST   /auth/logout          # Révocation token
POST   /auth/refresh         # Renouvellement access token
POST   /auth/register        # Inscription nouvelle organisation
POST   /auth/forgot-password # Envoi lien reset
POST   /auth/reset-password  # Reset avec token
POST   /auth/verify-email    # Vérification email
POST   /auth/2fa/setup       # Setup TOTP
POST   /auth/2fa/verify      # Vérification TOTP
POST   /auth/magic-link      # Envoi magic link
GET    /auth/me              # Profil utilisateur courant
GET    /auth/sso/google      # Redirect OAuth Google
GET    /auth/sso/google/cb   # Callback Google
GET    /auth/sso/microsoft   # Redirect OAuth Microsoft
GET    /auth/sso/microsoft/cb # Callback Microsoft

GET    /users                # Liste utilisateurs de l'org
POST   /users                # Créer utilisateur
GET    /users/:id            # Détail utilisateur
PUT    /users/:id            # Modifier utilisateur
DELETE /users/:id            # Désactiver utilisateur

GET    /api-keys             # Liste clés API
POST   /api-keys             # Créer clé API
DELETE /api-keys/:id         # Révoquer clé API

GET    /organizations/me     # Info organisation courante
PUT    /organizations/me     # Modifier paramètres org
```

## Variables d'Environnement

```env
# DB
DATABASE_URL=postgresql://user:pass@localhost:5432/auth_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-256-bit-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# OAuth Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/sso/google/cb

# OAuth Microsoft
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=
MICROSOFT_CALLBACK_URL=http://localhost:3001/auth/sso/microsoft/cb

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=auth-service

# Service URLs (pour callbacks inter-services)
SMS_SERVICE_URL=http://sms-service:3002
EMAIL_SERVICE_URL=http://email-service:3003

# Chiffrement
ENCRYPTION_KEY=your-32-byte-encryption-key

# Rate Limiting
RATE_LIMIT_LOGIN=5/minute
RATE_LIMIT_API=1000/hour
```

## Événements Kafka Publiés

```typescript
// Topic: auth.events
type AuthEvent =
  | { type: 'user.registered'; payload: { userId: string; orgId: string; email: string } }
  | { type: 'user.login'; payload: { userId: string; orgId: string; ip: string } }
  | { type: 'user.password_changed'; payload: { userId: string; orgId: string } }
  | { type: 'org.created'; payload: { orgId: string; plan: string } }
  | { type: 'org.plan_changed'; payload: { orgId: string; oldPlan: string; newPlan: string } }
  | { type: 'api_key.created'; payload: { keyId: string; orgId: string } }
  | { type: 'api_key.revoked'; payload: { keyId: string; orgId: string } }
```

## Critères de Succès

- [ ] Login/logout fonctionnel (email + SSO Google + Microsoft)
- [ ] JWT valide et vérifié par tous les autres services
- [ ] RBAC fonctionnel (test avec chaque rôle)
- [ ] 2FA TOTP fonctionnel
- [ ] API Keys créées, utilisées et révoquées correctement
- [ ] Isolation multi-tenant vérifiée (test cross-tenant = 403)
- [ ] Rate limiting actif sur les endpoints de login
- [ ] Audit logs écrits pour chaque action sensible

## Pièges à Éviter

1. Ne jamais retourner le `password_hash` dans les réponses API
2. Le TOTP secret doit être chiffré en base (pas stocké en clair)
3. Les refresh tokens doivent être rotés à chaque utilisation (prévention vol)
4. Toujours vérifier `org_id` avant d'exposer une ressource
5. Les clés API ne sont jamais stockées en clair — seulement leur hash SHA-256
6. La clé complète n'est affichée qu'une seule fois à la création
