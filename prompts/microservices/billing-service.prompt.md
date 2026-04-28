# Prompt : Générer billing-service complet

## Contexte
Tu vas créer le microservice de facturation pour ACTOR Hub. Il gère abonnements (Stripe), crédits prépayés, quotas, et consomme les événements de tous les autres services pour déduire les crédits.

## Stack
- Node.js 20 + Fastify 4
- PostgreSQL (Drizzle ORM)
- Redis (compteurs atomiques de quota)
- Kafka (consommateur events de tous les services)
- Stripe SDK + Flutterwave SDK + CinetPay SDK
- PDFKit (génération factures PDF)

## Tâche

### 1. Consommateurs Kafka (src/consumers/)

Le billing-service consomme les events de TOUS les autres services pour déduire les crédits :

```typescript
// src/consumers/sms.consumer.ts
kafka.subscribe('sms.events', async (event) => {
  if (event.type === 'sms.sent') {
    await deductSmsCredit(event.payload.orgId, event.payload.country, event.payload.segments);
  }
});

// src/consumers/email.consumer.ts
// src/consumers/whatsapp.consumer.ts  
// src/consumers/callcenter.consumer.ts (par minute d'appel)
```

### 2. Déduction Atomique de Crédits

```typescript
async function deductSmsCredit(orgId: string, country: string, segments: number) {
  const period = getCurrentPeriod(); // 'YYYY-MM'
  const planLimit = await getPlanSmsLimit(orgId);
  
  // Incrémenter compteur Redis atomiquement
  const currentUsage = await redis.incrby(`usage:${orgId}:${period}:sms`, segments);
  
  if (currentUsage <= planLimit) {
    // Dans le quota plan → rien à déduire des crédits
    await updateUsageCounter(orgId, period, { sms: segments });
    return;
  }
  
  // Dépassement → facturer l'excédent
  const excessSegments = Math.min(segments, currentUsage - planLimit);
  const costPerSms = SMS_PRICING[country] ?? SMS_PRICING['default'];
  const cost = excessSegments * costPerSms;
  
  const newBalance = await atomicCreditDeduction(orgId, cost);
  
  if (newBalance < 0) {
    // Solde négatif → publier alerte
    await kafka.publish('billing.alerts', {
      type: 'insufficient_credits',
      orgId,
      balance: newBalance + cost,
    });
  }
  
  if (newBalance < LOW_BALANCE_THRESHOLD) {
    await sendLowBalanceAlert(orgId, newBalance);
  }
}

// Déduction atomique via Redis WATCH/MULTI
async function atomicCreditDeduction(orgId: string, amount: number): Promise<number> {
  const key = `credits:${orgId}`;
  // Utiliser Lua script pour atomicité
  const script = `
    local balance = tonumber(redis.call('GET', KEYS[1])) or 0
    local newBalance = balance - tonumber(ARGV[1])
    redis.call('SET', KEYS[1], newBalance)
    return newBalance
  `;
  return await redis.eval(script, [key], [amount.toString()]);
}
```

### 3. Webhooks Stripe

Gérer ces événements Stripe critiques :
```typescript
switch (event.type) {
  case 'customer.subscription.created':
    await activateSubscription(event.data.object);
    break;
  case 'customer.subscription.updated':
    await updateSubscriptionLimits(event.data.object);
    break;
  case 'customer.subscription.deleted':
    await cancelSubscription(event.data.object.metadata.orgId);
    break;
  case 'invoice.payment_succeeded':
    await handleSuccessfulPayment(event.data.object);
    await generateInvoicePdf(event.data.object);
    break;
  case 'invoice.payment_failed':
    await handleFailedPayment(event.data.object);
    await sendPaymentFailureEmail(event.data.object);
    break;
  case 'checkout.session.completed':
    await handleCheckoutSuccess(event.data.object);
    break;
}
```

### 4. Génération PDF Factures

```typescript
async function generateInvoicePdf(invoiceId: string): Promise<string> {
  const invoice = await getInvoiceWithDetails(invoiceId);
  
  const doc = new PDFDocument();
  // En-tête BIAR GROUP AFRICA SARLU avec logo
  // Numéro de facture séquentiel : AH-2026-000001
  // Adresse facturation client
  // Tableau des lignes (subscription, add-ons, usage)
  // Total HT, TVA, TTC
  // Conditions de paiement
  // Pied de page légal (RCCM, numéro TVA, RIB)
  
  const pdfBuffer = await streamToBuffer(doc);
  const s3Url = await uploadToS3(pdfBuffer, `invoices/${invoiceId}.pdf`);
  
  await db.update(invoices).set({ pdfUrl: s3Url, status: 'paid' })
    .where(eq(invoices.id, invoiceId));
  
  return s3Url;
}
```

### 5. Plans et Limites

```typescript
export const PLAN_LIMITS = {
  starter: {
    sms: 10_000,
    emails: 5_000,
    whatsapp: 1_000,
    users: 1,
    agents: 0,
    callMinutes: 0,
  },
  business: {
    sms: 100_000,
    emails: 50_000,
    whatsapp: 10_000,
    users: 5,
    agents: 5,
    callMinutes: 1_000,
  },
  enterprise: {
    sms: Infinity,
    emails: Infinity,
    whatsapp: Infinity,
    users: Infinity,
    agents: Infinity,
    callMinutes: Infinity,
  },
} as const;

export const ADDON_PRICING: Record<string, Record<string, number>> = {
  sms: {
    CM: 0.03, SN: 0.04, CI: 0.04, MA: 0.05,
    FR: 0.06, DE: 0.07, US: 0.05, default: 0.08,
  },
  email: { default: 0.001 },
  whatsapp: { default: 0.03 },
  callMinute: { default: 0.02 },
};
```

### 6. Endpoint Checkout Stripe

```typescript
// POST /billing/payments/checkout
async function createCheckoutSession(orgId: string, type: 'subscription' | 'credits', payload: any) {
  if (type === 'subscription') {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: org.stripeCustomerId,
      line_items: [{ price: STRIPE_PRICE_IDS[payload.plan][payload.cycle], quantity: 1 }],
      success_url: `${DASHBOARD_URL}/settings/billing?success=true`,
      cancel_url: `${DASHBOARD_URL}/settings/billing?canceled=true`,
      metadata: { orgId, plan: payload.plan },
    });
    return { url: session.url };
  }
  
  if (type === 'credits') {
    // Recharge de crédits prépayés
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price_data: { currency: 'eur', unit_amount: payload.amount * 100, product_data: { name: `Recharge ACTOR Hub - ${payload.amount}€` } }, quantity: 1 }],
      success_url: `${DASHBOARD_URL}/settings/billing?credits=success`,
      metadata: { orgId, type: 'credit_topup', amount: payload.amount },
    });
    return { url: session.url };
  }
}
```

### 7. Support Mobile Money (Afrique)

```typescript
// Flutterwave pour : Nigeria, Ghana, Kenya, Ouganda, Tanzanie
// CinetPay pour : Cameroun, Côte d'Ivoire, Sénégal, Mali
async function initiateMobileMoneyPayment(orgId: string, amount: number, provider: 'flutterwave' | 'cinetpay', phone: string) {
  if (provider === 'cinetpay') {
    const response = await cinetpay.initialize({
      amount, currency: 'XAF',
      trans_id: generateTransactionId(),
      description: `Recharge ACTOR Hub`,
      customer_phone_number: phone,
      notify_url: `${API_URL}/billing/webhooks/cinetpay`,
    });
    return { paymentUrl: response.data.payment_url };
  }
  // ...flutterwave
}
```

### 8. Tests
- Test déduction quota SMS (dans limite plan → pas de déduction crédit)
- Test dépassement quota → déduction crédit
- Test solde insuffisant → event alerte publié
- Test webhook Stripe `invoice.payment_succeeded` → PDF généré
- Test numéro de facture séquentiel (pas de gaps)
- Test recharge crédit Mobile Money CinetPay

## Contraintes
- Les compteurs Redis doivent être atomiques (Lua scripts ou Redis transactions)
- Toujours vérifier la signature Stripe webhook (`stripe-signature` header)
- Jamais facturer deux fois le même événement (déduplication par `event.id`)
- Les factures une fois générées sont immuables
- Numéros de facture : séquence PostgreSQL garantie, format `AH-YYYY-NNNNNN`
