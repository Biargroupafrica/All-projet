# Prompt : Générer auth-service complet

## Contexte
Tu vas créer le microservice d'authentification pour ACTOR Hub, une plateforme SaaS/CPaaS de communication unifiée (SMS, Email, WhatsApp, Call Center) développée par BIAR GROUP AFRICA SARLU.

Ce service est le gardien central : tous les autres microservices valident les JWT émis par ce service avant d'autoriser toute requête.

## Stack
- **Runtime :** Node.js 20 LTS
- **Framework :** Fastify 4 (avec `@fastify/jwt`, `@fastify/oauth2`, `@fastify/rate-limit`)
- **ORM :** Drizzle ORM + PostgreSQL 16
- **Cache :** Redis 7 (sessions, blacklist tokens, rate limit)
- **Messaging :** Kafka (kafkajs)
- **Validation :** Zod
- **Tests :** Vitest + Supertest
- **Conteneurisation :** Docker + Docker Compose pour dev local autonome

## Tâche

Génère la structure complète du service `services/auth-service/` avec :

### 1. Initialisation Fastify (src/app.ts)
- Configuration CORS (origines configurables via env)
- Rate limiting global (100 req/min par IP)
- Plugin JWT (HS256, secret en env)
- Plugin Swagger/OpenAPI auto-généré
- Hook `onRequest` pour vérification JWT sur routes protégées
- Health check `/health` et `/ready`
- Graceful shutdown (SIGTERM → drain → stop)

### 2. Schéma de base de données (src/db/schema.ts avec Drizzle)
Tables : `organizations`, `users`, `refresh_tokens`, `api_keys`, `audit_logs`
Voir le skill `skills/02-auth-service.md` pour le schéma SQL complet.
Implémenter Row-Level Security : chaque requête doit setter `SET LOCAL app.org_id = $1`

### 3. Module Auth (src/modules/auth/)
Endpoints :
- `POST /auth/login` : email + password, retourne { accessToken, refreshToken, user }
- `POST /auth/logout` : révoque le refresh token (blacklist Redis)
- `POST /auth/refresh` : rotate refresh token, retourne nouveau access token
- `POST /auth/register` : crée une organization + premier admin, envoie email de vérification
- `POST /auth/forgot-password` : génère et envoie un reset token (6h de validité)
- `POST /auth/reset-password` : valide le reset token, hash le nouveau mot de passe
- `POST /auth/verify-email` : valide le token d'email
- `GET /auth/me` : retourne le profil complet de l'utilisateur connecté
- `GET /auth/sso/google` + `GET /auth/sso/google/cb` : OAuth2 Google
- `GET /auth/sso/microsoft` + `GET /auth/sso/microsoft/cb` : OAuth2 Microsoft Azure AD
- `POST /auth/2fa/setup` : génère un secret TOTP, retourne QR code en base64
- `POST /auth/2fa/verify` : vérifie le code TOTP et active le 2FA
- `POST /auth/magic-link` : envoie magic link

### 4. Module Users (src/modules/users/)
CRUD complet avec RBAC :
- Seul `org_admin` peut créer/modifier/supprimer des utilisateurs
- `GET /users` → filtre automatique par `org_id` du JWT
- Pagination, filtres (rôle, statut, recherche)

### 5. Module API Keys (src/modules/api-keys/)
- Génération : `crypto.randomBytes(32).toString('hex')` → clé complète visible une seule fois
- Stockage : `SHA-256(clé)` uniquement
- Format affiché : `ah_live_<8-premiers-chars>...`
- Vérification : middleware qui hash la clé reçue et compare en DB

### 6. Middleware RBAC (src/middlewares/rbac.middleware.ts)
```typescript
export function requireRole(...roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user; // Injecté par plugin JWT
    if (!roles.includes(user.role)) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }
  };
}
```

### 7. Événements Kafka (src/events/publisher.ts)
Publier sur le topic `auth.events` les events : `user.registered`, `user.login`, `org.created`, etc.
(Voir skill pour la liste complète)

### 8. Variables d'environnement
Créer `.env.example` avec TOUTES les variables nécessaires et leurs descriptions.
Valider à l'démarrage avec Zod (schema dans `src/config/env.ts`).

### 9. Docker
- `Dockerfile` multi-stage (builder + production, image finale < 200MB)
- `docker-compose.yml` avec postgres + redis + kafka pour dev local autonome
- Le service doit démarrer avec juste `docker compose up` sans aucun prérequis

### 10. Tests (src/**/*.test.ts)
- Test login réussi
- Test login avec mot de passe incorrect → 401
- Test refresh token
- Test RBAC : agent essaie d'accéder à `/users` → 403
- Test multi-tenant : utilisateur d'org A ne peut pas voir les users d'org B

### 11. OpenAPI Spec (openapi.yaml)
Spec complète OpenAPI 3.1 avec :
- Schémas de toutes les requêtes/réponses
- Exemples pour chaque endpoint
- Sécurité : BearerAuth (JWT) + ApiKeyAuth

## Contraintes
- TypeScript strict (pas de `any`)
- Passwords hashés avec bcrypt, cost factor 12
- TOTP secret chiffré AES-256-GCM en base
- Jamais de secret exposé dans les logs
- Tous les endpoints retournent des réponses JSON typées
- Rate limit spécifique sur `/auth/login` : 5 tentatives/minute/IP

## Format de Sortie Attendu
Génère l'arborescence complète des fichiers avec leur contenu. Commence par `package.json`, puis `src/app.ts`, puis chaque module dans l'ordre.
