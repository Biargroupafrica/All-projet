# Prompt: ms-tenant - Multi-Tenancy & Abonnements

## Rôle
Tu es un développeur backend senior spécialisé en architecture SaaS multi-tenant. Tu dois créer le microservice `ms-tenant` pour la plateforme Actor Hub.

## Mission
Gérer l'isolation multi-tenant, les plans d'abonnement, les quotas, les sous-domaines et la configuration par entreprise.

## Spécifications techniques

### Stack
- **Framework:** NestJS
- **Port:** 8002
- **Base de données:** PostgreSQL - schema `tenant`

### Fonctionnalités requises

1. **Gestion des Tenants**
   - CRUD tenants (entreprises clientes)
   - Sous-domaine personnalisé (`{tenant}.actorhub.com`)
   - Logo et branding personnalisés
   - Configuration par tenant (timezone, langue, devise)

2. **Plans d'Abonnement**
   - **Starter** (49€/mois): 5000 SMS, 1000 emails, 500 WhatsApp, 1000 min appel, 3 agents
   - **Business** (199€/mois): 50000 SMS, 10000 emails, 5000 WhatsApp, 10000 min, 15 agents
   - **Enterprise** (sur devis): Illimité, white label, SLA 99.99%
   - Pay-as-you-go en supplément

3. **Quotas & Limites**
   - Suivi de la consommation en temps réel par canal
   - Alertes automatiques (80%, 90%, 100% du quota)
   - Blocage ou facturation supplémentaire à 100%

4. **Provisioning**
   - Création automatique des schémas DB par tenant
   - Initialisation des données par défaut (templates, configs)

### Schéma Base de Données
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#5906AE',
  timezone VARCHAR(50) DEFAULT 'Africa/Kinshasa',
  default_language VARCHAR(5) DEFAULT 'fr',
  currency VARCHAR(3) DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  sms_quota INTEGER,
  email_quota INTEGER,
  whatsapp_quota INTEGER,
  call_minutes_quota INTEGER,
  max_agents INTEGER,
  features JSONB,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(20) DEFAULT 'active',
  billing_cycle VARCHAR(10) DEFAULT 'monthly',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  resource_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
```
POST   /api/v1/tenants                 # Créer un tenant
GET    /api/v1/tenants/:id             # Détails tenant
PUT    /api/v1/tenants/:id             # Modifier tenant
DELETE /api/v1/tenants/:id             # Supprimer tenant
GET    /api/v1/tenants/:id/usage       # Consommation
GET    /api/v1/tenants/:id/limits      # Limites du plan
POST   /api/v1/tenants/:id/subscribe   # Souscrire à un plan
PUT    /api/v1/tenants/:id/plan        # Changer de plan
GET    /api/v1/plans                   # Liste des plans
```

### Events publiés
```
tenant.created       → { tenantId, name, plan }
tenant.updated       → { tenantId, changes }
tenant.suspended     → { tenantId, reason }
subscription.changed → { tenantId, oldPlan, newPlan }
quota.warning        → { tenantId, resource, usage, limit }
quota.exceeded       → { tenantId, resource }
```
