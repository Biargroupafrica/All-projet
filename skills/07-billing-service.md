# Skill : Billing Service — ACTOR Hub

## Scénario d'utilisation
Développer le microservice de facturation et gestion des crédits (`services/billing-service/`).

## Contexte Métier
Gère la monétisation complète de la plateforme :
- Abonnements récurrents (Starter 49€, Business 199€, Enterprise)
- Crédits prépayés (SMS, Email, WhatsApp à l'usage)
- Facturation à l'usage avec métriques consolidées depuis tous les services
- Multi-devises : EUR, USD, XAF, XOF, NGN, KES, MAD, etc.

## Plans Tarifaires

### Starter — 49€/mois (ou 41€/mois annuel)
- 10 000 SMS/mois
- 5 000 Emails/mois
- 1 000 messages WhatsApp/mois
- 1 utilisateur
- Support Email
- API REST basique
- Rapports simples

### Business — 199€/mois (ou 165€/mois annuel) ⭐
- 100 000 SMS/mois
- 50 000 Emails/mois
- 10 000 messages WhatsApp/mois
- 5 utilisateurs
- WhatsApp Business API
- Call Center (5 agents)
- Support prioritaire (email + chat)
- API REST & Webhooks + IVR basique + Automation Email + Rapports avancés

### Enterprise — Sur devis
- Volumes illimités
- Agents illimités
- SMPP Direct + SMTP dédié
- Call Center complet avec Dialers intelligents
- Support 24/7 téléphone + SLA 99.9%
- Intégrations custom + Manager dédié

### Add-ons (pay-as-you-go)
| Add-on | Prix |
|--------|------|
| SMS supplémentaires | 0.03€ - 0.08€/SMS selon pays |
| Emails supplémentaires | 0.001€/email |
| WhatsApp supplémentaires | 0.01€ - 0.05€/conversation |
| Agent Call Center | 25€/agent/mois |
| Numéro de téléphone | 5€ - 50€/numéro/mois |
| Stockage supplémentaire | 10€/100 GB/mois |

## Structure de Fichiers

```
services/billing-service/
├── src/
│   ├── app.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── modules/
│   │   ├── subscriptions/
│   │   │   ├── subscriptions.router.ts
│   │   │   ├── subscriptions.controller.ts
│   │   │   └── subscriptions.service.ts
│   │   ├── credits/
│   │   │   ├── credits.router.ts
│   │   │   ├── credits.controller.ts
│   │   │   └── credits.service.ts   # Atomic credit deduction (Redis + DB)
│   │   ├── invoices/
│   │   │   ├── invoices.router.ts
│   │   │   └── invoices.service.ts  # Génération PDF factures
│   │   ├── usage/
│   │   │   ├── usage.router.ts
│   │   │   └── usage.service.ts     # Agrégation usage depuis services
│   │   ├── payments/
│   │   │   ├── payments.router.ts
│   │   │   ├── stripe.provider.ts
│   │   │   ├── flutterwave.provider.ts
│   │   │   └── cinetpay.provider.ts
│   │   └── webhooks/
│   │       └── stripe.webhook.ts    # Événements Stripe
│   ├── consumers/
│   │   ├── sms.consumer.ts          # Écoute events sms.events → déduit crédits
│   │   ├── email.consumer.ts
│   │   ├── whatsapp.consumer.ts
│   │   └── callcenter.consumer.ts
│   └── db/
│       ├── schema.ts
│       └── migrations/
├── openapi.yaml
├── Dockerfile
└── package.json
```

## Schéma Base de Données

```sql
-- Abonnements
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL UNIQUE,
  plan VARCHAR(50) NOT NULL DEFAULT 'starter',
  billing_cycle VARCHAR(20) DEFAULT 'monthly',  -- 'monthly', 'yearly'
  status VARCHAR(50) DEFAULT 'active',          -- active, trial, past_due, canceled, suspended
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  limits JSONB NOT NULL DEFAULT '{
    "sms": 10000,
    "emails": 5000,
    "whatsapp": 1000,
    "users": 1,
    "agents": 0
  }',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crédits prépayés (balance)
CREATE TABLE credit_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL UNIQUE,
  balance_eur DECIMAL(12, 4) DEFAULT 0,         -- Balance en EUR (convertible)
  low_balance_threshold DECIMAL(10, 2) DEFAULT 10,
  auto_reload_enabled BOOLEAN DEFAULT FALSE,
  auto_reload_amount DECIMAL(10, 2) DEFAULT 50,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions de crédit (audit trail)
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,           -- 'purchase', 'deduction', 'refund', 'bonus'
  amount DECIMAL(12, 4) NOT NULL,      -- positif = ajout, négatif = déduction
  balance_after DECIMAL(12, 4) NOT NULL,
  description TEXT,
  reference_id UUID,                   -- ID du message/appel associé
  reference_type VARCHAR(50),          -- 'sms', 'email', 'call', 'whatsapp'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consommation mensuelle (quota plan)
CREATE TABLE usage_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  period VARCHAR(7) NOT NULL,          -- 'YYYY-MM'
  sms_count INTEGER DEFAULT 0,
  email_count INTEGER DEFAULT 0,
  whatsapp_count INTEGER DEFAULT 0,
  call_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, period)
);

-- Factures
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,  -- 'AH-2026-000001'
  type VARCHAR(50) DEFAULT 'subscription',     -- 'subscription', 'addon', 'credit'
  status VARCHAR(50) DEFAULT 'draft',          -- draft, open, paid, void
  amount_ht DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 20.0,         -- % TVA
  amount_ttc DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  stripe_invoice_id VARCHAR(255),
  pdf_url TEXT,
  period_start DATE,
  period_end DATE,
  paid_at TIMESTAMPTZ,
  due_date DATE,
  line_items JSONB DEFAULT '[]',
  billing_address JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paiements
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  provider VARCHAR(50) NOT NULL,       -- 'stripe', 'flutterwave', 'cinetpay'
  provider_payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed, refunded
  payment_method VARCHAR(50),          -- 'card', 'mobile_money', 'bank_transfer'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Endpoints API

```
# Abonnements
GET    /billing/subscription           # Abonnement courant de l'org
POST   /billing/subscription           # Créer abonnement
PUT    /billing/subscription           # Upgrader/Downgrader
DELETE /billing/subscription           # Annuler (fin de période)

# Crédits
GET    /billing/credits/balance        # Solde actuel
POST   /billing/credits/topup          # Recharger crédits (déclenche paiement)
GET    /billing/credits/transactions   # Historique transactions

# Usage
GET    /billing/usage/current          # Consommation période en cours
GET    /billing/usage/history          # Historique consommation (12 mois)

# Factures
GET    /billing/invoices               # Liste factures
GET    /billing/invoices/:id           # Détail facture
GET    /billing/invoices/:id/pdf       # Télécharger PDF

# Paiements
POST   /billing/payments/checkout      # Créer session Stripe Checkout
GET    /billing/payments/methods       # Méthodes de paiement enregistrées
DELETE /billing/payments/methods/:id   # Supprimer méthode

# Webhooks Stripe/Flutterwave (URL publique)
POST   /billing/webhooks/stripe
POST   /billing/webhooks/flutterwave
POST   /billing/webhooks/cinetpay
```

## Logique Déduction de Crédits (Critique)

```typescript
// Opération atomique Redis + PostgreSQL
async function deductCredits(orgId: string, amount: number, ref: CreditRef) {
  // 1. Vérifier quota plan (Redis SET org:{orgId}:sms_count INCR)
  const withinPlan = await checkPlanQuota(orgId, ref.type);
  if (withinPlan) {
    // Déduire du quota mensuel (inclus dans plan)
    await incrementUsageCounter(orgId, ref.type);
    return { deducted: false, reason: 'within_plan' };
  }
  // 2. Si quota dépassé : déduire des crédits prépayés
  const unitCost = PRICING[ref.type][ref.country];
  const success = await atomicCreditDeduction(orgId, unitCost);
  if (!success) {
    // 3. Quota dépassé + crédits insuffisants → bloquer ou alerter
    await emitLowBalanceAlert(orgId);
    return { deducted: false, reason: 'insufficient_credits' };
  }
  return { deducted: true, cost: unitCost };
}
```

## Critères de Succès

- [ ] Abonnement Starter créé et actif après paiement Stripe test
- [ ] Quota SMS décrémenté correctement après chaque envoi
- [ ] Alerte email envoyée quand solde < seuil configuré
- [ ] Facture PDF générée avec numéro séquentiel
- [ ] Upgrade Starter → Business : limites mises à jour immédiatement
- [ ] Webhook Stripe `invoice.payment_succeeded` traité correctement
- [ ] Paiement Mobile Money (Flutterwave) fonctionnel pour l'Afrique
