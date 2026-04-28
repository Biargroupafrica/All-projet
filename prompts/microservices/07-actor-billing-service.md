# Prompt: Actor Billing Service - Microservice Facturation & Abonnements

## Contexte
Tu es un développeur senior spécialisé en systèmes de facturation et paiements. Tu dois créer le microservice **Actor Billing** pour la plateforme Actor Hub. Ce service gère les abonnements, la facturation, les crédits de communication, et les paiements.

## Mission
Créer un microservice de facturation autonome avec gestion des plans d'abonnement (Starter/Pro/Enterprise), crédits SMS/appels, facturation automatique, et intégration de passerelles de paiement.

## Spécifications techniques

### Stack
- **Runtime** : Node.js 20+ / NestJS
- **Paiements** : Stripe API
- **Base de données** : PostgreSQL (schéma `billing`)
- **Queue** : Redis + Bull (facturation périodique)
- **ORM** : Prisma

### Schéma de base de données
```sql
CREATE SCHEMA billing;

CREATE TABLE billing.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- Starter, Pro, Enterprise
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  features JSONB NOT NULL,
  limits JSONB NOT NULL, -- max_users, max_sms, max_calls, etc.
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE billing.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  plan_id UUID REFERENCES billing.plans(id),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active', -- active, past_due, cancelled, expired, trial
  billing_cycle VARCHAR(10) DEFAULT 'monthly', -- monthly, yearly
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE billing.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL, -- sms, call, whatsapp, email
  balance DECIMAL(10,2) DEFAULT 0,
  total_purchased DECIMAL(10,2) DEFAULT 0,
  total_used DECIMAL(10,2) DEFAULT 0,
  low_balance_threshold DECIMAL(10,2) DEFAULT 100,
  auto_recharge BOOLEAN DEFAULT false,
  auto_recharge_amount DECIMAL(10,2),
  auto_recharge_threshold DECIMAL(10,2),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, type)
);

CREATE TABLE billing.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  credit_type VARCHAR(20) NOT NULL,
  amount DECIMAL(10,4) NOT NULL, -- positif = ajout, négatif = consommation
  balance_after DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference_type VARCHAR(50), -- sms_campaign, call, whatsapp_broadcast, email_campaign, purchase, refund
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE billing.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  stripe_invoice_id VARCHAR(255),
  number VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  pdf_url TEXT,
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE billing.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  stripe_payment_method_id VARCHAR(255),
  type VARCHAR(20) NOT NULL, -- card, bank_transfer, mobile_money
  brand VARCHAR(50), -- visa, mastercard, etc.
  last_four VARCHAR(4),
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE billing.usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  sms_sent INTEGER DEFAULT 0,
  sms_cost DECIMAL(10,2) DEFAULT 0,
  calls_made INTEGER DEFAULT 0,
  call_minutes INTEGER DEFAULT 0,
  calls_cost DECIMAL(10,2) DEFAULT 0,
  whatsapp_messages INTEGER DEFAULT 0,
  whatsapp_cost DECIMAL(10,2) DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  emails_cost DECIMAL(10,2) DEFAULT 0,
  storage_used_mb INTEGER DEFAULT 0,
  UNIQUE(tenant_id, period_start)
);
```

### Plans et tarifs (basés sur le design Figma)
```typescript
const PLANS = {
  starter: {
    name: 'Starter',
    priceMonthly: 29,
    priceYearly: 290,
    features: {
      maxUsers: 5,
      callCenter: true,
      sms: true,
      whatsapp: false,
      email: true,
      maxConcurrentCalls: 5,
      recording: false,
      ivr: 'basic',
      analytics: 'basic',
      support: 'email',
      api: true,
      sla: '99%',
    }
  },
  pro: {
    name: 'Pro',
    priceMonthly: 79,
    priceYearly: 790,
    features: {
      maxUsers: 25,
      callCenter: true,
      sms: true,
      whatsapp: true,
      email: true,
      maxConcurrentCalls: 25,
      recording: true,
      ivr: 'advanced',
      analytics: 'advanced',
      support: 'priority',
      api: true,
      sla: '99.5%',
    }
  },
  enterprise: {
    name: 'Enterprise',
    priceMonthly: null, // Sur devis
    priceYearly: null,
    features: {
      maxUsers: -1, // illimité
      callCenter: true,
      sms: true,
      whatsapp: true,
      email: true,
      maxConcurrentCalls: 100,
      recording: true,
      ivr: 'advanced',
      analytics: 'advanced',
      support: 'dedicated',
      api: true,
      sla: '99.9%',
      customIntegrations: true,
      whiteLabel: true,
    }
  },
};
```

### Endpoints API
```
# Plans
GET    /api/v1/plans                       # Lister les plans
GET    /api/v1/plans/:id                   # Détail d'un plan

# Abonnements
GET    /api/v1/subscriptions               # Abonnement courant
POST   /api/v1/subscriptions               # Souscrire
PUT    /api/v1/subscriptions/upgrade        # Upgrade plan
PUT    /api/v1/subscriptions/downgrade      # Downgrade plan
POST   /api/v1/subscriptions/cancel         # Annuler
POST   /api/v1/subscriptions/reactivate     # Réactiver

# Crédits
GET    /api/v1/credits                     # Solde des crédits
POST   /api/v1/credits/purchase             # Acheter des crédits
GET    /api/v1/credits/transactions          # Historique
PUT    /api/v1/credits/auto-recharge         # Config auto-recharge

# Factures
GET    /api/v1/invoices                    # Lister
GET    /api/v1/invoices/:id                # Détail
GET    /api/v1/invoices/:id/pdf            # Télécharger PDF
POST   /api/v1/invoices/:id/pay             # Payer

# Moyens de paiement
GET    /api/v1/payment-methods             # Lister
POST   /api/v1/payment-methods             # Ajouter
DELETE /api/v1/payment-methods/:id         # Supprimer
PUT    /api/v1/payment-methods/:id/default  # Définir par défaut

# Usage
GET    /api/v1/usage                       # Usage courant
GET    /api/v1/usage/history               # Historique usage

# Webhooks Stripe
POST   /api/v1/webhooks/stripe             # Événements Stripe
```

### Événements Message Broker
```typescript
'billing.subscription.created'   // { tenantId, planId }
'billing.subscription.upgraded'  // { tenantId, oldPlan, newPlan }
'billing.subscription.cancelled' // { tenantId, cancelAt }
'billing.credits.purchased'      // { tenantId, type, amount }
'billing.credits.low'            // { tenantId, type, balance, threshold }
'billing.credits.depleted'       // { tenantId, type }
'billing.invoice.created'        // { tenantId, invoiceId, total }
'billing.invoice.paid'           // { tenantId, invoiceId }
'billing.invoice.overdue'        // { tenantId, invoiceId }
'billing.payment.failed'         // { tenantId, reason }
```

## Critères d'acceptation
- [ ] 3 plans d'abonnement (Starter, Pro, Enterprise)
- [ ] Intégration Stripe pour les paiements
- [ ] Gestion des crédits par type (SMS, appels, WhatsApp, email)
- [ ] Auto-recharge des crédits
- [ ] Facturation automatique mensuelle/annuelle
- [ ] Génération de factures PDF
- [ ] Historique de consommation détaillé
- [ ] Webhook Stripe sécurisé
- [ ] Notifications de solde bas
