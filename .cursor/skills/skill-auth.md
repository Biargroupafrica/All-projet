# Skill : Auth Service – Actor Hub

## Quand utiliser ce skill
Utiliser pour tout travail sur `services/auth-service/` :
- Authentification (login, register, logout, refresh token)
- MFA (TOTP, SMS OTP, email OTP)
- SSO (OAuth2/OIDC : Google, Microsoft, SAML enterprise)
- RBAC (rôles, permissions, scopes)
- Gestion des sessions multi-tenant

---

## Architecture du service

```
services/auth-service/
├── src/
│   ├── server.ts                # Fastify server entry point
│   ├── routes/
│   │   ├── auth.routes.ts       # /auth/login, /auth/register, /auth/logout
│   │   ├── oauth.routes.ts      # /auth/oauth/google, /auth/oauth/microsoft
│   │   ├── mfa.routes.ts        # /auth/mfa/setup, /auth/mfa/verify
│   │   └── token.routes.ts      # /auth/token/refresh, /auth/token/revoke
│   ├── services/
│   │   ├── jwt.service.ts       # Génération/validation JWT
│   │   ├── password.service.ts  # bcrypt, règles complexité
│   │   ├── mfa.service.ts       # TOTP (speakeasy), SMS OTP
│   │   └── oauth.service.ts     # Passport.js strategies
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── session.model.ts
│   │   └── token.model.ts
│   ├── middleware/
│   │   ├── authenticate.ts      # Vérification JWT
│   │   └── authorize.ts         # Vérification RBAC
│   ├── db/
│   │   ├── migrations/
│   │   └── schema.ts            # Drizzle ORM schema
│   └── config/
│       └── env.ts               # Variables d'env validées (Zod)
├── tests/
├── Dockerfile
├── package.json
└── openapi.yaml                 # Spec OpenAPI 3.1
```

---

## Base de données (PostgreSQL via Drizzle)

```typescript
// db/schema.ts
import { pgTable, uuid, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  role: text('role').notNull().default('user'),          // admin | agent | supervisor | user
  permissions: jsonb('permissions').default([]),
  mfaEnabled: boolean('mfa_enabled').default(false),
  mfaSecret: text('mfa_secret'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  tenantId: uuid('tenant_id').notNull(),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

---

## JWT Structure

```typescript
// Payload Access Token (15 min)
interface AccessTokenPayload {
  sub: string        // user_id
  tid: string        // tenant_id
  role: string       // admin | agent | supervisor | user
  permissions: string[]
  iat: number
  exp: number
}

// Payload Refresh Token (30 jours)
interface RefreshTokenPayload {
  sub: string
  tid: string
  jti: string        // session_id (révocable)
  iat: number
  exp: number
}
```

---

## Variables d'environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/auth_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=<256-bit-random-secret>
JWT_REFRESH_SECRET=<256-bit-random-secret>
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
TWILIO_ACCOUNT_SID=           # Pour SMS OTP
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
PORT=3001
```

---

## Endpoints API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Inscription + email de vérification |
| POST | `/auth/login` | Login email/password → access + refresh tokens |
| POST | `/auth/logout` | Révocation du refresh token |
| POST | `/auth/token/refresh` | Renouveler l'access token |
| GET | `/auth/me` | Profil utilisateur courant |
| POST | `/auth/mfa/setup` | Générer secret TOTP + QR code |
| POST | `/auth/mfa/verify` | Valider TOTP ou OTP SMS |
| GET | `/auth/oauth/google` | Redirect OAuth Google |
| GET | `/auth/oauth/google/callback` | Callback OAuth Google |
| GET | `/auth/oauth/microsoft` | Redirect OAuth Microsoft |
| GET | `/auth/oauth/microsoft/callback` | Callback OAuth Microsoft |
| POST | `/auth/forgot-password` | Envoi email reset |
| POST | `/auth/reset-password` | Nouveau mot de passe |

---

## Middleware d'authentification (réutilisable par les autres services)

```typescript
// packages/api-client/middleware/authenticate.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return reply.status(401).send({ error: 'Token manquant' })
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AccessTokenPayload
    req.user = payload
  } catch {
    return reply.status(401).send({ error: 'Token invalide ou expiré' })
  }
}

export function authorize(...roles: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (!roles.includes(req.user.role)) {
      return reply.status(403).send({ error: 'Accès refusé' })
    }
  }
}
```

---

## Tests

```bash
pnpm --filter @actor-hub/auth-service test          # Unit
pnpm --filter @actor-hub/auth-service test:int      # Integration (DB réelle)
pnpm --filter @actor-hub/auth-service lint
```

---

## Checklist avant PR

- [ ] MFA fonctionnel (TOTP + SMS)
- [ ] Rate limiting sur /login (5 tentatives / 15 min)
- [ ] Audit log de chaque connexion/déconnexion
- [ ] Tokens révocables (blacklist Redis)
- [ ] Multi-tenant isolation vérifiée
- [ ] RGPD : chiffrement des données sensibles
