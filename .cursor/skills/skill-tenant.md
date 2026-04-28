# Skill : Tenant Service – Actor Hub

## Quand utiliser ce skill
Utiliser pour tout travail sur `services/tenant-service/` :
- Création et gestion des organisations (tenants)
- Onboarding (wizard multi-étapes)
- Gestion des membres / équipes (invitations, rôles)
- RBAC (définition des rôles et permissions)
- Configuration du tenant (numéros, intégrations, branding)
- Gestion des workspaces et sous-comptes

---

## Architecture du service

```
services/tenant-service/
├── src/
│   ├── server.ts
│   ├── routes/
│   │   ├── tenants.routes.ts        # CRUD tenants
│   │   ├── members.routes.ts        # Gestion membres
│   │   ├── invitations.routes.ts    # Invitations par email
│   │   ├── roles.routes.ts          # Rôles personnalisés
│   │   ├── settings.routes.ts       # Configuration tenant
│   │   └── onboarding.routes.ts     # Wizard onboarding
│   ├── services/
│   │   ├── tenant.service.ts
│   │   ├── invitation.service.ts    # Envoi emails invitation
│   │   ├── rbac.service.ts          # Gestion des permissions
│   │   └── onboarding.service.ts   # Steps wizard
│   ├── db/
│   │   └── schema.ts
│   └── config/
│       └── env.ts
├── Dockerfile
└── openapi.yaml
```

---

## Schéma de données

```typescript
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),         // URL-friendly identifier
  industry: text('industry'),
  country: text('country').default('FR'),
  timezone: text('timezone').default('Europe/Paris'),
  locale: text('locale').default('fr'),
  logo: text('logo'),
  primaryColor: text('primary_color'),
  planId: text('plan_id').default('starter'),
  status: text('status').default('active'),      // onboarding | active | suspended | deleted
  onboardingStep: integer('onboarding_step').default(0),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow(),
})

export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  userId: uuid('user_id').notNull(),
  role: text('role').notNull(),                  // owner | admin | supervisor | agent | viewer
  permissions: jsonb('permissions').default([]),
  joinedAt: timestamp('joined_at').defaultNow(),
})

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  email: text('email').notNull(),
  role: text('role').default('agent'),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  invitedBy: uuid('invited_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
```

---

## RBAC – Matrice des permissions

```typescript
const ROLE_PERMISSIONS = {
  owner: ['*'],                                   // Toutes les permissions
  admin: [
    'tenant:read', 'tenant:update',
    'members:read', 'members:create', 'members:update', 'members:delete',
    'billing:read', 'billing:manage',
    'calls:read', 'calls:manage',
    'sms:read', 'sms:manage',
    'reports:read', 'reports:export',
  ],
  supervisor: [
    'calls:read', 'calls:supervise',
    'agents:read', 'agents:manage',
    'queues:read', 'queues:manage',
    'reports:read',
  ],
  agent: [
    'calls:handle',
    'contacts:read', 'contacts:create', 'contacts:update',
    'tickets:read', 'tickets:create', 'tickets:update',
    'messages:send',
  ],
  viewer: [
    'calls:read',
    'reports:read',
    'contacts:read',
  ],
}
```

---

## Onboarding Wizard (5 étapes)

```typescript
const ONBOARDING_STEPS = [
  {
    step: 1,
    id: 'company_info',
    title: 'Informations de l\'entreprise',
    fields: ['name', 'industry', 'country', 'website', 'employeesCount'],
  },
  {
    step: 2,
    id: 'contact_info',
    title: 'Contact principal',
    fields: ['firstName', 'lastName', 'phone', 'jobTitle'],
  },
  {
    step: 3,
    id: 'use_cases',
    title: 'Vos besoins',
    fields: ['channels', 'monthlyCallVolume', 'monthlySMSVolume'],
  },
  {
    step: 4,
    id: 'team_invite',
    title: 'Inviter votre équipe',
    fields: ['teamEmails'],    // Optionnel, passer
  },
  {
    step: 5,
    id: 'plan_selection',
    title: 'Choisir votre plan',
    fields: ['planId'],
  },
]
```

---

## Variables d'environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/tenant_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
AUTH_SERVICE_URL=http://auth-service:3001
BILLING_SERVICE_URL=http://billing-service:3002
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@actorhub.io
APP_BASE_URL=https://app.actorhub.io
PORT=3009
```

---

## Checklist avant PR

- [ ] Invitation : token unique, expiration 7 jours
- [ ] Un seul owner par tenant (non révocable sauf transfer)
- [ ] Suspension tenant : tous les services coupés immédiatement
- [ ] Onboarding : reprise depuis la dernière étape complétée
- [ ] RBAC : permissions vérifiées à chaque requête (middleware)
