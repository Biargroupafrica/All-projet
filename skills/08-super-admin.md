# Skill 08 — Super Admin & Gestion Multi-Tenant

## Quand utiliser ce skill
Lorsque vous travaillez sur le dashboard Super Admin de Biar Group : gestion des tenants, facturation, configuration globale, support niveau 2.

## Composants clés
```
src/app/components/auth/super-admin-dashboard.tsx
src/app/components/user-management-enhanced.tsx
src/app/components/roles-permissions-enhanced.tsx
src/app/components/billing.tsx
src/app/components/billing-invoices.tsx
src/app/components/payment-methods.tsx
src/app/components/payment-history.tsx
src/app/components/system-logs.tsx
src/app/components/audit-logs.tsx
src/app/components/api-monitoring.tsx
src/app/components/platform-config-manager.tsx
src/app/components/api-status-dashboard.tsx
src/app/components/frontend-site-manager-enhanced.tsx
```

## Architecture Super Admin

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN LAYER                        │
├───────────────────┬─────────────────────┬───────────────────┤
│   TENANT MGMT     │   BILLING           │   PLATFORM OPS    │
│                   │                     │                   │
│ • Create Tenant   │ • Subscriptions    │ • System Health  │
│ • Configure Plan  │ • Invoices         │ • API Monitoring │
│ • Module Access   │ • Payment Process  │ • Audit Logs     │
│ • User Quotas     │ • Revenue Reports  │ • Config Global  │
│ • Suspend/Delete  │ • Refunds          │ • Site Vitrine   │
└───────────────────┴─────────────────────┴───────────────────┘
```

## Modèle de Données Super Admin

```sql
-- Plans d'abonnement
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- starter, pro, enterprise
  display_name TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  features JSONB DEFAULT '{}',
  limits JSONB DEFAULT '{}', -- max_agents, max_sms/month, etc.
  modules JSONB DEFAULT '{}', -- modules activés
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Abonnements
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  billing_cycle TEXT DEFAULT 'monthly', -- monthly, yearly
  status TEXT DEFAULT 'active', -- active, cancelled, suspended, expired
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_ends_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  payment_method_id TEXT, -- ID Stripe ou autre
  stripe_subscription_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Factures
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  subscription_id UUID REFERENCES subscriptions(id),
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded, voided
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  stripe_invoice_id TEXT,
  pdf_url TEXT,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Logs d'audit
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- user.created, tenant.suspended, plan.changed, etc.
  resource_type TEXT,
  resource_id TEXT,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Configuration globale de la plateforme
CREATE TABLE platform_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Prompts pour le Super Admin

### Prompt — Dashboard Super Admin Principal
```
Crée le dashboard principal Super Admin pour Actor Hub (Biar Group).
Ce dashboard doit donner une vue globale de toute la plateforme :

Métriques globales (cartes en haut) :
- Tenants actifs / total
- Revenus MRR (Monthly Recurring Revenue)
- SMS envoyés ce mois / total
- Appels traités ce mois
- Messages WhatsApp envoyés
- Taux de churn mensuel

Graphiques :
- Croissance des tenants (courbe 12 mois)
- Revenus par module (camembert)
- Volume de messages par canal (barres empilées)

Liste des derniers tenants inscrits (5 derniers)
Alertes système : tenants en retard de paiement, erreurs API
Statut des services (SMPP, SMTP, WABA, SIP)

Design dark professionnel avec accents rose Actor Hub.
```

### Prompt — Gestion des Tenants
```
Crée l'interface de gestion des tenants (clients) pour le Super Admin.
Fonctionnalités :
- Tableau des tenants : nom, plan, statut, agents actifs, SMS ce mois, depuis le, MRR
- Filtres : plan, statut, pays, date inscription
- Actions par tenant : Voir détails, Changer plan, Suspendre, Supprimer, Impersonate
- "Impersonate" : connexion en tant qu'admin du tenant (audit trail obligatoire)
- Création tenant : formulaire nom, sous-domaine, plan, admin email
- Détail tenant : usage détaillé, factures, logs, configuration modules

Page détail tenant :
Onglet 1 — Usage : SMS/mois, appels/mois, stockage, agents connectés
Onglet 2 — Facturation : abonnement, factures, méthode de paiement
Onglet 3 — Configuration : modules actifs, limites, features flags
Onglet 4 — Utilisateurs : liste des admins et agents
Onglet 5 — Logs : activité récente du tenant
```

### Prompt — Gestion des Plans et Tarifs
```
Crée l'interface de gestion des plans d'abonnement.
Fonctionnalités :
- Liste des plans existants (Starter, Pro, Enterprise)
- Éditeur de plan : nom, prix mensuel/annuel, devises, description, fonctionnalités incluses
- Configurateur de limites : max agents, SMS/mois, stockage, calls/mois
- Activation/désactivation modules par plan
- Tenants sur ce plan : nombre, revenus
- Modifier prix (avec alerte : X tenants affectés)
- Créer un plan personnalisé (Enterprise sur mesure)
- Coupon et codes promo : -X% pour Y mois
```

### Prompt — Facturation et Revenus
```
Crée un module de gestion financière pour Super Admin.
Sections :
1. Overview financier :
   - MRR actuel, croissance MoM, ARR projeté
   - Churn MRR vs New MRR vs Expansion MRR
   - Graphique revenus 12 mois

2. Factures :
   - Liste paginée : tenant, montant, statut (payé/en attente/échoué), date
   - Filtres : période, statut, plan
   - Actions : Voir PDF, Renvoyer par email, Marquer payé, Rembourser

3. Revenus par canal :
   - SMS, Voice, Email, WhatsApp (revenus consommation)
   - Tableau de bord revenus récurrents vs à l'usage

4. Exporter :
   - Rapport comptable mensuel (CSV)
   - Rapport par tenant (CSV/PDF)
```

### Prompt — Logs Audit & Sécurité
```
Crée un module de logs d'audit et sécurité pour Super Admin.
Fonctionnalités :
- Timeline des actions importantes : qui a fait quoi, quand, depuis où
- Filtres : utilisateur, tenant, type d'action, date, IP
- Alertes sécurité : connexions depuis nouveau pays, tentatives de force brute
- Impersonations : log de toutes les sessions Super Admin impersonating
- Exports : rapport hebdomadaire, rapport RGPD sur demande
- Rétention : 90 jours en ligne, 1 an en archive
- Niveaux de criticité : Info, Warning, Critical (couleurs)
Actions loguées minimum :
  user.login, user.logout, user.password_changed
  tenant.created, tenant.suspended, tenant.plan_changed
  invoice.paid, invoice.failed, subscription.cancelled
  api_key.created, api_key.revoked
  admin.impersonated_tenant
```

### Prompt — Gestionnaire de Site Vitrine (Frontend CMS)
```
Crée un CMS basique pour gérer le contenu du site vitrine Actor Hub.
Sections :
1. Pages : liste des pages vitrine, éditeur de contenu (blocs)
2. Sections & Widgets : modifier le contenu de chaque section (hero, features, pricing)
3. Media Manager : upload images, logos, vidéos
4. Menus & Navigation : éditer les liens du header et footer
5. SEO : meta title, description, Open Graph par page
6. Blog/Actualités : créer/éditer/publier des articles
7. Déploiement : "Publier" pour pousser les changements sur le site live
Interface simple drag-and-drop pour réordonner les sections.
Prévisualisation avant publication.
```

## Tests à réaliser
- [ ] Connexion Super Admin avec compte dédié
- [ ] Créer un tenant (nom, sous-domaine, plan Starter)
- [ ] Changer le plan d'un tenant (Starter → Pro)
- [ ] Suspendre et réactiver un tenant
- [ ] Impersonation d'un tenant (audit log créé)
- [ ] Facturation : générer une facture manuelle
- [ ] Marquer une facture comme payée
- [ ] Log d'audit : chaque action enregistrée
- [ ] Configuration plateforme : modifier une valeur globale
- [ ] Dashboard live : métriques MRR et tenants en temps réel
