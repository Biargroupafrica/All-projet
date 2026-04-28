# Skill : CRM Service – Actor Hub

## Quand utiliser ce skill
Utiliser pour tout travail sur `services/crm-service/` :
- Gestion des contacts (clients, prospects)
- Tickets / support (création, assignation, résolution)
- Historique des interactions (appels, SMS, emails liés à un contact)
- Pipelines commerciaux (opportunités, étapes)
- Intégrations externes (Salesforce, HubSpot, Zoho)
- Segmentation et listes de contacts

---

## Architecture du service

```
services/crm-service/
├── src/
│   ├── server.ts
│   ├── routes/
│   │   ├── contacts.routes.ts       # CRUD contacts
│   │   ├── tickets.routes.ts        # Tickets support
│   │   ├── interactions.routes.ts   # Historique interactions
│   │   ├── pipelines.routes.ts      # Pipelines et opportunités
│   │   ├── lists.routes.ts          # Listes de contacts / segments
│   │   └── integrations.routes.ts   # Webhooks entrants CRM externes
│   ├── services/
│   │   ├── contact.service.ts
│   │   ├── ticket.service.ts
│   │   ├── deduplication.service.ts  # Fusion doublons
│   │   ├── enrichment.service.ts     # Enrichissement données
│   │   └── sync.service.ts           # Sync Salesforce / HubSpot
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
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email'),
  phone: text('phone'),                          // Format E.164
  company: text('company'),
  jobTitle: text('job_title'),
  tags: jsonb('tags').default([]),
  customFields: jsonb('custom_fields').default({}),
  source: text('source'),                        // web | import | call | whatsapp
  externalIds: jsonb('external_ids').default({}), // { salesforce_id: '...', hubspot_id: '...' }
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  contactId: uuid('contact_id').references(() => contacts.id),
  subject: text('subject').notNull(),
  description: text('description'),
  status: text('status').default('open'),         // open | in_progress | waiting | resolved | closed
  priority: text('priority').default('normal'),   // low | normal | high | urgent
  channel: text('channel'),                      // voice | sms | whatsapp | email
  assignedAgentId: uuid('assigned_agent_id'),
  resolvedAt: timestamp('resolved_at'),
  slaDeadline: timestamp('sla_deadline'),
  csat: integer('csat'),                         // 1-5
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
})

export const interactions = pgTable('interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  contactId: uuid('contact_id').references(() => contacts.id),
  type: text('type').notNull(),                  // call | sms | whatsapp | email | note
  direction: text('direction'),                  // inbound | outbound
  summary: text('summary'),
  externalRef: text('external_ref'),             // ID appel, SMS, message
  agentId: uuid('agent_id'),
  occurredAt: timestamp('occurred_at').defaultNow(),
})
```

---

## Variables d'environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/crm_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
HUBSPOT_API_KEY=
AUTH_SERVICE_URL=http://auth-service:3001
PORT=3006
```

---

## Endpoints API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/contacts` | Liste / recherche contacts |
| POST | `/contacts` | Créer un contact |
| GET | `/contacts/:id` | Détail contact + interactions |
| PUT | `/contacts/:id` | Modifier un contact |
| DELETE | `/contacts/:id` | Supprimer (soft delete RGPD) |
| POST | `/contacts/import` | Import CSV/Excel |
| GET | `/contacts/:id/interactions` | Historique du contact |
| GET | `/tickets` | Liste des tickets |
| POST | `/tickets` | Créer un ticket |
| PUT | `/tickets/:id` | Modifier un ticket |
| PUT | `/tickets/:id/assign` | Assigner à un agent |
| PUT | `/tickets/:id/resolve` | Résoudre le ticket |
| GET | `/pipelines` | Pipelines commerciaux |
| POST | `/pipelines/:id/opportunities` | Créer une opportunité |

---

## Checklist avant PR

- [ ] Déduplication : fusion de contacts si même email ou téléphone
- [ ] Recherche full-text sur nom, email, téléphone, entreprise
- [ ] Import CSV : validation des numéros et emails, rapport d'erreurs
- [ ] RGPD : suppression des données sur demande (droit à l'oubli)
- [ ] Sync CRM externes : logs des syncs, gestion des conflits
- [ ] SLA tickets : alertes automatiques avant dépassement
