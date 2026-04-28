# Skill : Messaging Service – Actor Hub CPaaS

## Quand utiliser ce skill
Utiliser pour tout travail sur `services/messaging-service/` :
- WhatsApp Business API (messages texte, médias, templates HSM)
- RCS (Rich Communication Services)
- Email transactionnel et marketing
- Messagerie unifiée (omnicanal) : boîte de réception partagée agents
- Chatbots / auto-réponse (intégration NLP)
- Gestion des conversations (threads, tags, assignation agents)

---

## Architecture du service

```
services/messaging-service/
├── src/
│   ├── server.ts
│   ├── routes/
│   │   ├── whatsapp.routes.ts       # WhatsApp in/out
│   │   ├── rcs.routes.ts            # RCS
│   │   ├── email.routes.ts          # Email transactionnel
│   │   ├── conversations.routes.ts  # Boîte de réception unifiée
│   │   ├── templates.routes.ts      # Templates HSM / email
│   │   └── chatbot.routes.ts        # Gestion des bots
│   ├── services/
│   │   ├── whatsapp.service.ts      # Meta Cloud API
│   │   ├── rcs.service.ts           # Google RBM / Vonage RCS
│   │   ├── email.service.ts         # Resend / SendGrid / SMTP
│   │   ├── conversation.service.ts  # Unification des threads
│   │   └── nlp.service.ts           # Dialogflow / GPT routing
│   ├── webhooks/
│   │   ├── whatsapp.webhook.ts      # Réception messages entrants
│   │   └── email.webhook.ts         # Bounce / delivery hooks
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
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  channel: text('channel').notNull(),              // whatsapp | rcs | email | sms
  externalId: text('external_id'),                 // ID WhatsApp / RCS thread
  contactId: uuid('contact_id'),                   // Référence CRM
  status: text('status').default('open'),           // open | pending | resolved | spam
  assignedAgentId: uuid('assigned_agent_id'),
  tags: jsonb('tags').default([]),
  lastMessageAt: timestamp('last_message_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  tenantId: uuid('tenant_id').notNull(),
  direction: text('direction').notNull(),           // inbound | outbound
  type: text('type').notNull(),                    // text | image | document | audio | video | location | template
  content: jsonb('content').notNull(),             // { text?: string, mediaUrl?: string, templateName?: string }
  status: text('status').default('sent'),           // sent | delivered | read | failed
  externalId: text('external_id'),                 // ID côté WhatsApp / provider
  authorId: uuid('author_id'),                     // Agent ou bot (null si client)
  createdAt: timestamp('created_at').defaultNow(),
})
```

---

## WhatsApp – Template HSM

```typescript
// Envoi d'un message template WhatsApp
interface WhatsAppTemplatePayload {
  to: string                // Numéro E.164
  templateName: string      // Nom approuvé par Meta
  languageCode: string      // fr, en, ar…
  components: Array<{
    type: 'header' | 'body' | 'button'
    parameters: Array<{
      type: 'text' | 'image' | 'document'
      text?: string
      image?: { link: string }
    }>
  }>
}

// Exemple : template de confirmation de RDV
const rdvTemplate: WhatsAppTemplatePayload = {
  to: '+33612345678',
  templateName: 'rdv_confirmation',
  languageCode: 'fr',
  components: [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: 'Jean Dupont' },
        { type: 'text', text: '15/05/2026 à 14h00' },
      ]
    }
  ]
}
```

---

## Variables d'environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/messaging_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# WhatsApp Business API (Meta Cloud)
WHATSAPP_API_URL=https://graph.facebook.com/v19.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=

# Email
RESEND_API_KEY=
SENDGRID_API_KEY=
EMAIL_FROM=noreply@actorhub.io

# NLP / Chatbot
OPENAI_API_KEY=
DIALOGFLOW_PROJECT_ID=

PORT=3007
```

---

## Endpoints API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/conversations` | Liste des conversations |
| GET | `/conversations/:id/messages` | Messages d'une conversation |
| POST | `/conversations/:id/messages` | Envoyer un message (agent) |
| PUT | `/conversations/:id/assign` | Assigner à un agent |
| PUT | `/conversations/:id/status` | Changer le statut |
| POST | `/whatsapp/send` | Envoyer un message WhatsApp |
| POST | `/whatsapp/template` | Envoyer un template HSM |
| POST | `/email/send` | Envoyer un email transactionnel |
| GET | `/templates` | Templates disponibles |
| POST | `/webhooks/whatsapp` | Webhook réception WhatsApp |

---

## Checklist avant PR

- [ ] Webhook WhatsApp : vérification signature (X-Hub-Signature-256)
- [ ] Webhook email : gestion bounces et unsubscribes
- [ ] Templates HSM : validés par Meta avant utilisation
- [ ] Rate limit : respect des limites Meta (1000 conversations/24h par numéro)
- [ ] Boîte unifiée : chaque message reçu crée ou met à jour une conversation
- [ ] Chatbot : fallback vers agent humain si confiance NLP < 0.7
