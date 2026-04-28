# Prompt : Services Transversaux (Shared Services)

## Rôle

Tu es un architecte backend senior. Tu construis les **services transversaux** partagés par tous les microservices de la plateforme Actor Hub.

## Description

Les services transversaux sont les briques communes utilisées par les 4 microservices (CallCenter, SMS, WhatsApp, Email). Ils assurent la cohérence des données, la sécurité, la facturation et l'expérience utilisateur unifiée.

---

## 1. Auth Service (Authentification & Autorisation)

### Fonctionnalités
- Login multi-profil (Super Admin, Admin, Agent, Customer)
- Inscription (signup) avec validation email
- Mot de passe oublié / Reset password
- JWT tokens (access + refresh)
- 2FA (Two-Factor Authentication) optionnel
- OAuth2 (Google, Microsoft) optionnel
- Row-Level Security (RLS) Supabase
- RBAC (Role-Based Access Control)

### Tables
```sql
-- Utilisateurs (Supabase Auth + profil étendu)
user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'agent', 'customer')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'fr',
  timezone TEXT DEFAULT 'Africa/Kinshasa',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenants (entreprises)
tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  logo_url TEXT,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise', 'custom')),
  plan_expires_at TIMESTAMPTZ,
  modules_enabled TEXT[] DEFAULT '{call_center, sms, whatsapp, email}',
  max_users INTEGER DEFAULT 5,
  max_agents INTEGER DEFAULT 2,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Permissions par Rôle
```typescript
const PERMISSIONS = {
  super_admin: ['*'],
  admin: [
    'dashboard.view', 'analytics.view',
    'call_center.*', 'sms.*', 'whatsapp.*', 'email.*',
    'contacts.*', 'billing.view', 'billing.manage',
    'users.manage', 'settings.manage',
    'support.*', 'frontend.*'
  ],
  agent: [
    'dashboard.view',
    'call_center.calls', 'call_center.contacts',
    'sms.send', 'sms.contacts',
    'whatsapp.chat', 'whatsapp.contacts',
    'email.send',
    'contacts.view', 'contacts.edit'
  ],
  customer: [
    'dashboard.view',
    'contacts.view',
    'support.tickets', 'support.chat',
    'billing.view'
  ]
};
```

---

## 2. Billing Service (Facturation & Abonnements)

### Fonctionnalités
- Gestion des abonnements (plans)
- Facturation récurrente
- Crédits (SMS, Appels)
- Méthodes de paiement
- Historique des paiements
- Factures PDF

### Tables
```sql
subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'expired', 'trial')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_provider TEXT,
  payment_provider_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  subscription_id UUID REFERENCES subscriptions(id),
  invoice_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'paid', 'failed', 'refunded', 'cancelled')),
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  pdf_url TEXT,
  line_items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  type TEXT NOT NULL CHECK (type IN ('card', 'bank_transfer', 'mobile_money', 'paypal')),
  provider TEXT,
  last_four TEXT,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  provider_payment_method_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  invoice_id UUID REFERENCES invoices(id),
  payment_method_id UUID REFERENCES payment_methods(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  provider_transaction_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Contact Service (CRM Partagé)

### Fonctionnalités
- CRUD contacts
- Listes et segments
- Import/Export (CSV, Excel)
- Tags et champs personnalisés
- Pipeline (Kanban)
- Géolocalisation
- Historique des communications cross-canal

### Tables
```sql
contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  phone TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  title TEXT,
  country TEXT,
  city TEXT,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  source TEXT DEFAULT 'manual',
  pipeline_stage TEXT DEFAULT 'new',
  score INTEGER DEFAULT 0,
  opt_in_sms BOOLEAN DEFAULT true,
  opt_in_email BOOLEAN DEFAULT true,
  opt_in_whatsapp BOOLEAN DEFAULT true,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

contact_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  contacts_count INTEGER DEFAULT 0,
  is_dynamic BOOLEAN DEFAULT false,
  filter_conditions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

contact_list_members (
  contact_id UUID NOT NULL REFERENCES contacts(id),
  list_id UUID NOT NULL REFERENCES contact_lists(id),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (contact_id, list_id)
);

contact_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

contact_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  activity_type TEXT NOT NULL,
  channel TEXT CHECK (channel IN ('call', 'sms', 'whatsapp', 'email', 'manual')),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Analytics Service

### Fonctionnalités
- Dashboard global (KPIs cross-canal)
- Métriques temps réel (WebSocket)
- Rapports personnalisés
- Export de rapports (PDF, CSV)
- Agrégation des données des 4 modules

### Endpoints
```
GET  /api/analytics/overview          # KPIs globaux
GET  /api/analytics/calls             # Métriques appels
GET  /api/analytics/sms               # Métriques SMS
GET  /api/analytics/whatsapp          # Métriques WhatsApp
GET  /api/analytics/email             # Métriques Email
GET  /api/analytics/contacts          # Métriques contacts
GET  /api/analytics/revenue           # Revenus
POST /api/analytics/reports/generate  # Générer un rapport
GET  /api/analytics/reports/:id/download # Télécharger
```

---

## 5. Notification Service

### Canaux
- In-app (bell icon dans le header)
- Email (notifications système)
- SMS (alertes critiques)
- WebSocket (temps réel)

### Événements Notifiés
```
- Crédits bas / épuisés
- Campagne terminée
- Nouveau ticket support
- Paiement réussi / échoué
- Alerte qualité WhatsApp
- Bounce rate email élevé
- Agent offline pendant les heures de travail
```

---

## 6. Support Service

### Fonctionnalités
- Tickets de support (CRUD + workflow)
- Base de connaissances (articles)
- FAQ
- Chat en direct (WebSocket)
- Rapports de bugs
- Documentation technique

### Tables
```sql
support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id),
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Instructions Spécifiques

1. Tous les services partagés doivent être dans le dossier `packages/`
2. Utilise Supabase Auth pour l'authentification (pas de custom auth)
3. Le RLS doit être activé sur TOUTES les tables (filtrage par tenant_id)
4. Les crédits doivent utiliser des transactions atomiques
5. Le service de notifications doit être event-driven
6. Les analytics doivent supporter l'agrégation en temps réel et historique
7. Le CRM contacts est partagé entre tous les modules
8. Les imports doivent supporter CSV et Excel (xlsx)
9. Implémente la pagination partout (cursor-based pour les listes longues)
10. Les logs doivent inclure tenant_id, user_id, action, timestamp
