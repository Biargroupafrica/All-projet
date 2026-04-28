# Prompt: ms-billing - Facturation & Paiements

## Rôle
Tu es un développeur backend senior spécialisé en systèmes de facturation et paiements. Tu dois créer le microservice `ms-billing` pour la plateforme Actor Hub.

## Mission
Créer un service de facturation complet avec abonnements Stripe, crédits prépayés, suivi de la consommation, factures automatiques et méthodes de paiement (carte, mobile money pour l'Afrique).

## Spécifications techniques

### Stack
- **Framework:** NestJS
- **Port:** 8008
- **Base de données:** PostgreSQL - schema `billing`
- **Paiement:** Stripe (international) + Mobile Money APIs (Afrique)

### Fonctionnalités requises

1. **Abonnements**
   - Plans: Starter (49€), Business (199€), Enterprise (sur devis)
   - Cycle mensuel ou annuel (-20% annuel)
   - Upgrade/downgrade de plan
   - Période d'essai (14 jours)
   - Annulation avec prorata

2. **Crédits Prépayés (Pay-as-you-go)**
   - Achat de crédits SMS (à partir de 0.02€/SMS)
   - Achat de crédits Email (0.001€/email)
   - Achat de crédits WhatsApp (0.04€/message)
   - Achat de minutes d'appel (0.10€/min)
   - Auto-recharge quand le solde est bas

3. **Suivi de Consommation**
   - Décompte en temps réel par canal
   - Alertes de consommation (80%, 90%, 100%)
   - Historique de consommation détaillé

4. **Factures**
   - Génération automatique mensuelle
   - PDF téléchargeable
   - Envoi par email
   - Avoir / Notes de crédit

5. **Méthodes de Paiement**
   - Carte bancaire (Stripe)
   - Mobile Money: M-Pesa, Orange Money, Airtel Money
   - Virement bancaire
   - PayPal (optionnel)

### Schéma Base de Données
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  plan_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  billing_cycle VARCHAR(10) DEFAULT 'monthly',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  trial_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE credit_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE,
  sms_credits DECIMAL(12,4) DEFAULT 0,
  email_credits DECIMAL(12,4) DEFAULT 0,
  whatsapp_credits DECIMAL(12,4) DEFAULT 0,
  call_minutes DECIMAL(12,2) DEFAULT 0,
  auto_recharge BOOLEAN DEFAULT false,
  auto_recharge_amount DECIMAL(10,2),
  auto_recharge_threshold DECIMAL(10,2),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL, -- subscription, credit_purchase, usage
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  stripe_payment_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending',
  items JSONB NOT NULL,
  pdf_url TEXT,
  due_date DATE,
  paid_at TIMESTAMP,
  stripe_invoice_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  last_four VARCHAR(4),
  brand VARCHAR(20),
  is_default BOOLEAN DEFAULT false,
  stripe_payment_method_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  resource_type VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10,4),
  total_cost DECIMAL(10,4),
  reference_id UUID,
  recorded_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
```
GET    /api/v1/billing/subscription     # Abonnement actuel
POST   /api/v1/billing/subscribe        # Souscrire à un plan
PUT    /api/v1/billing/subscription/plan # Changer de plan
POST   /api/v1/billing/subscription/cancel

GET    /api/v1/billing/credits          # Solde crédits
POST   /api/v1/billing/credits/purchase # Acheter des crédits
POST   /api/v1/billing/credits/deduct   # Déduire crédits (interne)

GET    /api/v1/billing/invoices         # Factures
GET    /api/v1/billing/invoices/:id/pdf # Télécharger PDF

CRUD   /api/v1/billing/payment-methods  # Méthodes de paiement
GET    /api/v1/billing/transactions     # Historique transactions
GET    /api/v1/billing/usage            # Consommation

POST   /api/v1/billing/webhook/stripe   # Webhook Stripe
```

### Events publiés
```
payment.succeeded    → { tenantId, amount, type }
payment.failed       → { tenantId, amount, reason }
subscription.created → { tenantId, planId }
subscription.changed → { tenantId, oldPlan, newPlan }
subscription.cancelled → { tenantId }
credits.purchased    → { tenantId, type, amount }
credits.low          → { tenantId, type, remaining }
credits.depleted     → { tenantId, type }
invoice.generated    → { tenantId, invoiceId }
```
