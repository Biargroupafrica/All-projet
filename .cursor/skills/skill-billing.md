# Skill : Billing Service – Actor Hub SaaS

## Quand utiliser ce skill
Utiliser pour tout travail sur `services/billing-service/` :
- Plans d'abonnement (Starter, Pro, Enterprise)
- Facturation à l'usage (pay-as-you-go) pour les ressources CPaaS
- Intégration Stripe (checkout, invoices, webhooks)
- Gestion des coupons et périodes d'essai
- Portail facturation client (historique factures, changement de plan)
- Alertes de consommation et plafonds

---

## Architecture du service

```
services/billing-service/
├── src/
│   ├── server.ts
│   ├── routes/
│   │   ├── plans.routes.ts          # Catalogue des plans
│   │   ├── subscriptions.routes.ts  # Abonnements clients
│   │   ├── invoices.routes.ts       # Factures
│   │   ├── usage.routes.ts          # Consommation CPaaS
│   │   ├── payment.routes.ts        # Moyens de paiement
│   │   └── webhooks.routes.ts       # Stripe webhooks
│   ├── services/
│   │   ├── stripe.service.ts        # Stripe SDK
│   │   ├── usage.service.ts         # Agrégation consommation
│   │   ├── invoice.service.ts       # Génération PDF factures
│   │   └── alert.service.ts         # Alertes seuils
│   ├── db/
│   │   └── schema.ts
│   └── config/
│       └── env.ts
├── Dockerfile
└── openapi.yaml
```

---

## Plans tarifaires

```typescript
const PLANS = {
  starter: {
    name: 'Starter',
    price: 49,              // EUR/mois
    currency: 'eur',
    stripePriceId: 'price_starter_monthly',
    features: {
      agents: 3,
      callMinutesIncluded: 500,
      smsIncluded: 1000,
      channels: ['voice', 'sms'],
      support: 'email',
      analytics: 'basic',
      sla: '99.5%',
    }
  },
  pro: {
    name: 'Pro',
    price: 149,
    currency: 'eur',
    stripePriceId: 'price_pro_monthly',
    features: {
      agents: 15,
      callMinutesIncluded: 2000,
      smsIncluded: 5000,
      whatsappConversationsIncluded: 500,
      channels: ['voice', 'sms', 'whatsapp', 'email'],
      support: 'chat',
      analytics: 'advanced',
      callRecording: true,
      sla: '99.9%',
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: null,             // Sur devis
    features: {
      agents: 'unlimited',
      callMinutes: 'unlimited',
      sms: 'unlimited',
      channels: 'all',
      support: 'dedicated',
      analytics: 'custom',
      sla: '99.99%',
      customIntegrations: true,
      onPremise: true,
    }
  }
}

// Tarifs CPaaS à l'usage (hors forfait inclus)
const USAGE_RATES = {
  voice_minute_fr: 0.012,         // €/min appel France
  voice_minute_international: 0.045,
  sms_fr: 0.065,                  // €/SMS France
  sms_international: 0.095,
  whatsapp_conversation: 0.058,   // €/conversation 24h
  email: 0.00012,                 // €/email
}
```

---

## Schéma de données

```typescript
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().unique(),
  planId: text('plan_id').notNull(),
  status: text('status').default('active'),         // trialing | active | past_due | cancelled
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  trialEndsAt: timestamp('trial_ends_at'),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const usageRecords = pgTable('usage_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  resource: text('resource').notNull(),            // voice_minute | sms | whatsapp_conversation | email
  quantity: numeric('quantity').notNull(),
  unitCost: numeric('unit_cost', { precision: 10, scale: 6 }),
  totalCost: numeric('total_cost', { precision: 10, scale: 4 }),
  billingPeriod: text('billing_period').notNull(),  // YYYY-MM
  recordedAt: timestamp('recorded_at').defaultNow(),
})
```

---

## Stripe Webhooks gérés

```typescript
const HANDLED_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.upcoming',
  'customer.subscription.trial_will_end',
]
```

---

## Variables d'environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/billing_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
PDF_SERVICE_URL=http://pdf-service:3099
AUTH_SERVICE_URL=http://auth-service:3001
PORT=3002
```

---

## Endpoints API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/plans` | Catalogue des plans (public) |
| GET | `/subscription` | Abonnement courant du tenant |
| POST | `/subscription/checkout` | Créer session Stripe Checkout |
| POST | `/subscription/upgrade` | Changer de plan |
| DELETE | `/subscription` | Résilier (fin de période) |
| GET | `/invoices` | Historique des factures |
| GET | `/invoices/:id/pdf` | Télécharger facture PDF |
| GET | `/usage` | Consommation du mois courant |
| GET | `/payment-methods` | Moyens de paiement enregistrés |
| POST | `/payment-methods` | Ajouter un moyen de paiement |
| POST | `/webhooks/stripe` | Webhook Stripe (signature vérifiée) |

---

## Checklist avant PR

- [ ] Webhooks Stripe : vérification signature `stripe.webhooks.constructEvent`
- [ ] Idempotence : events Stripe traités une seule fois (Redis lock)
- [ ] Alertes 80% / 100% de consommation envoyées par email
- [ ] Factures PDF conformes (mentions légales, numérotation séquentielle)
- [ ] Trial 14 jours fonctionnel avec rappel 3 jours avant expiration
- [ ] Changement de plan : prorata calculé et facturé
- [ ] Tests : mode Stripe test (clés sk_test_)
