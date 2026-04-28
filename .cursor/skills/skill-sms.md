# Skill : SMS Service – Actor Hub CPaaS

## Quand utiliser ce skill
Utiliser pour tout travail sur `services/sms-service/` :
- SMS A2P (Application to Person) : notifications, alertes
- OTP (One-Time Password) par SMS
- Campagnes SMS marketing (bulk, segmentation, planification)
- Templates de messages (variables dynamiques)
- Rapports de délivrabilité (DLR)
- Gestion des STOP / désinscriptions (conformité CNIL)

---

## Architecture du service

```
services/sms-service/
├── src/
│   ├── server.ts
│   ├── routes/
│   │   ├── messages.routes.ts       # Envoi SMS unitaire
│   │   ├── campaigns.routes.ts      # Campagnes bulk
│   │   ├── templates.routes.ts      # Gestion des templates
│   │   ├── optout.routes.ts         # Gestion STOP / DND
│   │   └── reports.routes.ts        # Délivrabilité, statistiques
│   ├── services/
│   │   ├── smpp.service.ts          # Connexion SMPP directe opérateur
│   │   ├── twilio.service.ts        # Fallback Twilio
│   │   ├── vonage.service.ts        # Fallback Vonage
│   │   ├── template.service.ts      # Moteur de template (Handlebars)
│   │   ├── scheduler.service.ts     # Planification (BullMQ)
│   │   └── dlr.service.ts           # Delivery Receipt handler
│   ├── queues/
│   │   ├── sms.queue.ts             # Queue BullMQ pour envoi async
│   │   └── dlr.queue.ts
│   ├── events/
│   │   └── sms.events.ts            # Events RabbitMQ
│   ├── db/
│   │   └── schema.ts
│   └── config/
│       └── env.ts
├── tests/
├── Dockerfile
└── openapi.yaml
```

---

## Schéma de données

```typescript
export const smsMessages = pgTable('sms_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  campaignId: uuid('campaign_id'),
  from: text('from').notNull(),                    // Expéditeur (alphanumérique ou numéro)
  to: text('to').notNull(),                        // Numéro destinataire E.164
  body: text('body').notNull(),
  status: text('status').default('pending'),        // pending | sent | delivered | failed | rejected
  provider: text('provider'),                       // smpp | twilio | vonage
  providerId: text('provider_id'),                  // ID chez le provider
  dlrCode: integer('dlr_code'),                    // Code DLR
  dlrDescription: text('dlr_description'),
  sentAt: timestamp('sent_at'),
  deliveredAt: timestamp('delivered_at'),
  cost: numeric('cost', { precision: 10, scale: 6 }), // Coût unitaire
  currency: text('currency').default('EUR'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
})

export const smsCampaigns = pgTable('sms_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  name: text('name').notNull(),
  templateId: uuid('template_id'),
  senderId: text('sender_id').notNull(),
  status: text('status').default('draft'),          // draft | scheduled | sending | completed | cancelled
  recipients: jsonb('recipients').notNull(),         // Array de numéros ou segment_id
  scheduledAt: timestamp('scheduled_at'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  totalCount: integer('total_count').default(0),
  sentCount: integer('sent_count').default(0),
  deliveredCount: integer('delivered_count').default(0),
  failedCount: integer('failed_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export const smsOptOuts = pgTable('sms_opt_outs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  phoneNumber: text('phone_number').notNull(),
  optedOutAt: timestamp('opted_out_at').defaultNow(),
  reason: text('reason'),
})
```

---

## Envoi SMS – Logique de priorité providers

```typescript
// services/smpp.service.ts
async function sendWithFallback(message: SMSMessage): Promise<SendResult> {
  // 1. Essai SMPP direct (moins cher)
  try {
    return await smppService.send(message)
  } catch (err) {
    logger.warn('SMPP failed, falling back to Twilio', err)
  }
  
  // 2. Fallback Twilio
  try {
    return await twilioService.send(message)
  } catch (err) {
    logger.warn('Twilio failed, falling back to Vonage', err)
  }
  
  // 3. Fallback Vonage
  return await vonageService.send(message)
}
```

---

## Variables d'environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/sms_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# SMPP
SMPP_HOST=smpp.operateur.com
SMPP_PORT=2775
SMPP_SYSTEM_ID=actor_hub
SMPP_PASSWORD=secret
SMPP_SYSTEM_TYPE=

# Twilio (fallback)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=+33xxxxxxxxx

# Vonage / Nexmo (fallback)
VONAGE_API_KEY=
VONAGE_API_SECRET=

PORT=3004
```

---

## Endpoints API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/messages/send` | Envoyer un SMS unitaire |
| GET | `/messages` | Historique des SMS |
| GET | `/messages/:id` | Détail d'un SMS |
| POST | `/campaigns` | Créer une campagne |
| GET | `/campaigns` | Lister les campagnes |
| PUT | `/campaigns/:id/schedule` | Planifier une campagne |
| POST | `/campaigns/:id/send` | Envoyer immédiatement |
| DELETE | `/campaigns/:id` | Annuler une campagne |
| GET | `/templates` | Lister les templates |
| POST | `/templates` | Créer un template |
| GET | `/optouts` | Lister les STOP |
| POST | `/optouts` | Ajouter un numéro en STOP |
| DELETE | `/optouts/:number` | Retirer un STOP |
| POST | `/dlr/callback` | Webhook DLR provider |

---

## Checklist avant PR

- [ ] Vérification STOP avant chaque envoi
- [ ] Numéros validés au format E.164
- [ ] Rate limiting : respecte les limites opérateur (TPS)
- [ ] Désinscriptions traitées en < 24h (CNIL)
- [ ] Coût calculé et stocké par message
- [ ] DLR correctement parsé et stocké
- [ ] Multi-tenant isolation vérifiée
