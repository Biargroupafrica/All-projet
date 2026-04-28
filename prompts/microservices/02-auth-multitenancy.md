# Prompt — Microservice Auth & Multi-tenancy

## Contexte

Tu développes le **système d'authentification et de gestion multi-tenant** de la plateforme Actor Hub.
Ce microservice est **partagé** par tous les autres modules (Call Center, SMS, WhatsApp, Email).

**Principe d'autonomie** : Ce service doit pouvoir fonctionner indépendamment des autres microservices. Il expose une API REST que les autres services consomment.

---

## Architecture du microservice Auth

```
services/auth/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts       # Login, logout, refresh
│   │   ├── tenant.controller.ts     # Gestion des tenants
│   │   └── user.controller.ts       # Gestion des utilisateurs
│   ├── middlewares/
│   │   ├── jwt.middleware.ts        # Vérification JWT
│   │   ├── rbac.middleware.ts       # Contrôle d'accès RBAC
│   │   └── tenant.middleware.ts     # Résolution du tenant
│   ├── models/
│   │   ├── tenant.model.ts          # Tenant (organisation)
│   │   ├── user.model.ts            # Utilisateur
│   │   └── role.model.ts            # Rôle et permissions
│   ├── services/
│   │   ├── auth.service.ts          # Logique d'auth
│   │   ├── token.service.ts         # Génération/validation JWT
│   │   └── tenant.service.ts        # Logique tenant
│   └── routes/
│       └── index.ts                 # Routes API
├── .env.example
├── Dockerfile
├── openapi.yaml                     # Documentation API
└── package.json
```

---

## Modèles de données

### Tenant (Organisation)
```typescript
interface Tenant {
  id: string;                    // UUID
  name: string;                  // Nom de l'organisation
  slug: string;                  // Identifiant URL unique
  plan: 'starter' | 'business' | 'enterprise';
  modules: ModuleAccess[];       // Modules activés
  credits: {
    sms: number;
    voice: number;
    whatsapp: number;
    email: number;
  };
  settings: TenantSettings;
  status: 'active' | 'suspended' | 'trial';
  createdAt: Date;
  expiresAt?: Date;
}
```

### User
```typescript
interface User {
  id: string;
  tenantId: string;              // Multi-tenant : toujours présent
  email: string;
  password: string;              // Hashé bcrypt
  role: UserRole;
  permissions: Permission[];
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
    language: 'fr' | 'en' | 'ar';
  };
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  status: 'active' | 'inactive' | 'blocked';
}

type UserRole = 'super_admin' | 'admin' | 'manager' | 'agent' | 'customer';
```

### Permission (RBAC granulaire)
```typescript
interface Permission {
  module: 'call_center' | 'sms' | 'whatsapp' | 'email' | 'billing' | 'settings';
  actions: ('read' | 'create' | 'update' | 'delete' | 'export')[];
}
```

---

## Endpoints API REST

### Authentication
```
POST /auth/login              # Connexion (email + password + tenant_slug)
POST /auth/logout             # Déconnexion (invalidation du refresh token)
POST /auth/refresh            # Renouvellement du access token
POST /auth/forgot-password    # Demande de reset password
POST /auth/reset-password     # Reset avec token email
POST /auth/verify-2fa         # Vérification OTP 2FA
POST /auth/enable-2fa         # Activation du 2FA
```

### Tenants (Super Admin uniquement)
```
GET    /tenants               # Lister tous les tenants
POST   /tenants               # Créer un tenant
GET    /tenants/:id           # Détail d'un tenant
PUT    /tenants/:id           # Modifier un tenant
DELETE /tenants/:id           # Supprimer un tenant
POST   /tenants/:id/suspend   # Suspendre
POST   /tenants/:id/activate  # Réactiver
```

### Users
```
GET    /users                 # Lister les utilisateurs du tenant courant
POST   /users                 # Créer un utilisateur
GET    /users/:id             # Détail
PUT    /users/:id             # Modifier
DELETE /users/:id             # Supprimer
PUT    /users/:id/role        # Changer le rôle
```

---

## JWT Claims

```json
{
  "sub": "user-uuid",
  "tenantId": "tenant-uuid",
  "role": "admin",
  "permissions": [...],
  "iat": 1700000000,
  "exp": 1700003600
}
```

- **Access token** : durée de vie 1 heure
- **Refresh token** : durée de vie 30 jours, stocké en base, révocable

---

## Pages frontend Auth

### Login Selection (`/login`)
**Fichier** : `src/app/components/auth/login-selection.tsx`
- 4 cartes de sélection du type de compte
- Animation hover
- Fond gradient violet → rose

### Login Admin (`/login/admin`)
**Fichier** : `src/app/components/auth/login-admin.tsx`
- Champ "Domaine de l'organisation" (slug du tenant)
- Email + Mot de passe
- Option "Se souvenir de moi"
- Lien "Mot de passe oublié"
- Support 2FA (étape suivante si activé)

### Login Agent (`/login/agent`)
**Fichier** : `src/app/components/auth/login-agent.tsx`
- Identifiant agent + PIN ou mot de passe
- Sélection du poste de travail (optionnel)

### Login Super Admin (`/login/super-admin`)
**Fichier** : `src/app/components/auth/login-super-admin.tsx`
- Email + Mot de passe + 2FA obligatoire
- Interface distincte (fond sombre, logo centré)

### Login Customer (`/login/customer`)
**Fichier** : `src/app/components/auth/login-customer.tsx`
- Email + Mot de passe
- Accès à l'espace client (facturation, usage)

---

## Composant ProtectedRoute

**Fichier** : `src/app/components/protected-route.tsx`

```typescript
interface ProtectedRouteProps {
  requiredRole?: UserRole | UserRole[];
  requiredModule?: Module;
  requiredPermission?: Permission;
  redirectTo?: string;
}
```

- Vérifie l'authentification (JWT valide)
- Vérifie le rôle et les permissions
- Redirige vers `/login` si non authentifié
- Affiche une page 403 si permissions insuffisantes

---

## Variables d'environnement

```env
# Auth Service
JWT_SECRET=your-secret-key-min-256-bits
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=3600
JWT_REFRESH_EXPIRES_IN=2592000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/actorauth

# Redis (sessions, rate limiting)
REDIS_URL=redis://localhost:6379

# Email (reset password)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@actorhub.com
SMTP_PASS=your-smtp-password

# Service port
PORT=3001
```

---

## Sécurité à implémenter

1. **Rate limiting** : max 5 tentatives de login par IP/10 minutes → lockout temporaire
2. **Password hashing** : bcrypt avec salt rounds = 12
3. **HTTPS only** : forcer HSTS en production
4. **CSRF protection** : tokens CSRF pour les formulaires
5. **Input validation** : Zod ou Joi pour tous les inputs
6. **Audit logs** : logger chaque action sensible (login, changement de rôle, création tenant)
7. **2FA** : TOTP via authenticator app (Google Authenticator, Authy)
