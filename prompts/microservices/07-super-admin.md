# Prompt — Interface Super Admin & Gestion de la Plateforme

## Contexte

Tu développes l'interface **Super Admin** de la plateforme Actor Hub.
Le Super Admin gère l'ensemble de la plateforme multi-tenant : clients, facturation, passerelles, monitoring.

**Composants existants de référence** :
- `auth/super-admin-dashboard.tsx`
- `user-management-enhanced.tsx`
- `billing-invoices.tsx`, `billing.tsx`
- `system-logs.tsx`, `audit-logs.tsx`
- `api-monitoring.tsx`, `api-status-dashboard.tsx`

---

## Fonctionnalités du Super Admin

### 1. Dashboard Super Admin
**Composant** : `auth/super-admin-dashboard.tsx`

Vue globale de la plateforme :
- Nombre total de tenants (actifs / suspendus / en essai)
- Revenus du mois (MRR / ARR)
- Volume de messages envoyés (SMS / WhatsApp / Email / Appels)
- État des passerelles (SIP, SMPP, SMTP, WA)
- Alertes système
- Graphiques de croissance

### 2. Gestion des Tenants (Clients)

CRUD complet :
- Liste des organisations (nom, plan, statut, date création, modules actifs)
- Création d'un nouveau client avec affectation de plan
- Suspension / Réactivation
- Modification du plan (upgrade/downgrade)
- Accès en tant que client (impersonation avec log d'audit)
- Configuration des quotas par tenant (SMS/mois, minutes d'appel, etc.)
- Attribution de crédits

### 3. Gestion des Utilisateurs (`/dashboard/user-management`)
**Composant existant** : `user-management-enhanced.tsx`

- Vue cross-tenants (Super Admin voit tous les utilisateurs)
- Filtres par tenant, rôle, statut
- Création d'admin pour un tenant
- Reset de mot de passe
- Désactivation d'un compte
- Journal des connexions

### 4. Gestion des Rôles & Permissions (`/dashboard/roles-permissions`)
**Composant existant** : `roles-permissions-enhanced.tsx`

Matrice de permissions :
- Définition des rôles système (Super Admin, Admin, Manager, Agent, Customer)
- Permissions granulaires par module et action
- Rôles personnalisés par tenant (Admin peut créer des rôles custom)
- Vue tableau croisé rôle × permission

### 5. Facturation & Abonnements (`/dashboard/billing-invoices`)
**Composants existants** : `billing-invoices.tsx`, `billing.tsx`, `payment-history.tsx`

- Liste des abonnements actifs
- Historique des factures (PDF téléchargeable)
- Gestion des paiements (CB, virement, Mobile Money)
- Crédits prépayés (top-up)
- Alertes de faible solde
- Configuration des tarifs par pays / opérateur (pour SMS)

### 6. Logs Système & Audit (`/dashboard/system-logs`)
**Composants existants** : `system-logs.tsx`, `audit-logs.tsx`

- Logs techniques des services (erreurs, warnings, infos)
- Logs d'audit (qui a fait quoi et quand)
- Filtres : niveau, service, tenant, date
- Exportation des logs

### 7. Monitoring API (`/dashboard/api-status`)
**Composant existant** : `api-status-dashboard.tsx`

- Statut de chaque microservice (UP / DOWN / DEGRADED)
- Temps de réponse moyen
- Taux d'erreur (5xx)
- Uptime 30 jours
- Alertes configurables (email, SMS)

### 8. Monitoring API Logs (`/dashboard/api-logs`)
**Composant existant** : `api-logs.tsx`

- Toutes les requêtes API (entrantes + sortantes)
- Filtres : endpoint, statut HTTP, tenant, date
- Détail d'une requête (headers, body, réponse, temps)

### 9. Gestion des Passerelles

#### Passerelle SIP (`/dashboard/sip-gateway-config`)
**Composant existant** : `sip-gateway-enhanced.tsx`
- Configuration des trunks SIP (opérateurs voix)
- Statut des connexions
- Routes d'appel par préfixe
- Codec et qualité

#### Passerelle SMPP (`/dashboard/smpp-gateway`)
**Composant existant** : `smpp-gateway.tsx`
- Connexions SMPP vers opérateurs
- Throughput en temps réel
- Routage par préfixe pays/opérateur
- Priorités et failover

#### Passerelle SMTP (`/dashboard/smtp-gateway-config`)
**Composant existant** : `smtp-gateway-config.tsx`
- Pools SMTP de la plateforme
- Répartition de charge
- Monitoring des bounces

#### Passerelle WhatsApp (`/dashboard/whatsapp-gateway-config`)
**Composant existant** : `whatsapp-gateway-config.tsx`
- Numéros WhatsApp Business enregistrés
- Configuration des webhooks Meta
- Monitoring des quotas

### 10. Gestion du Frontend / CMS (`/dashboard/frontend-site-manager`)
**Composants existants** : `frontend-site-manager-enhanced.tsx`, `frontend-pages-manager-enhanced.tsx`, etc.

- Gestion du contenu du site vitrine (pages, sections, médias, menus)
- SEO metadata par page
- Articles de blog (actualités)
- Médias (images, vidéos)

### 11. Intégrations & Webhooks (`/dashboard/integrations`)
**Composants existants** : `integrations.tsx`, `manage-webhook.tsx`

- Marketplace d'intégrations (Salesforce, HubSpot, Zoho, Zapier, etc.)
- Configuration des webhooks sortants
- Logs des webhooks (envoyés, reçus, erreurs, retentatives)
- Test d'un webhook

### 12. Paramètres de la Plateforme (`/dashboard/settings`)
**Composant existant** : `settings.tsx`

- Paramètres généraux (nom plateforme, logo, couleurs pour le white-label)
- Configuration email (templates système : bienvenue, reset password, facture)
- Notifications système
- Maintenance (mode maintenance avec message personnalisé)
- Sauvegardes et restauration

---

## API REST — Administration

### Tenants
```
GET    /admin/tenants
POST   /admin/tenants
GET    /admin/tenants/:id
PUT    /admin/tenants/:id
DELETE /admin/tenants/:id
POST   /admin/tenants/:id/impersonate   # Connexion en tant que tenant
POST   /admin/tenants/:id/credits       # Ajouter des crédits
```

### Platform Config
```
GET    /admin/config                    # Config globale
PUT    /admin/config                    # Modifier
GET    /admin/stats                     # Stats globales temps réel
GET    /admin/health                    # Santé des services
```

### Billing
```
GET    /admin/billing/subscriptions     # Tous les abonnements
GET    /admin/billing/invoices          # Toutes les factures
POST   /admin/billing/invoices/:id/pay  # Marquer comme payé
```

---

## Variables d'environnement (Service Admin)

```env
# Super admin credentials (bootstrap)
SUPER_ADMIN_EMAIL=admin@actorhub.com
SUPER_ADMIN_PASSWORD=ChangeMeNow!

# JWT pour impersonation
IMPERSONATION_JWT_SECRET=separate-impersonation-secret

# Alertes
ALERT_EMAIL=ops@actorhub.com
ALERT_SMS_NUMBER=+33600000000

PORT=3000
```

---

## Points d'attention architecture multi-tenant

1. **Isolation des données** : Chaque tenant ne voit que ses propres données
   - Utiliser `tenant_id` dans toutes les tables
   - Appliquer Row-Level Security (RLS) sur PostgreSQL
   
2. **Impersonation** : Quand le Super Admin se connecte en tant que tenant :
   - Logguer l'action dans l'audit log
   - Afficher une bannière "Vous êtes connecté en tant que [nom_tenant]"
   - Token spécial avec flag `impersonated: true`

3. **White-label** : La plateforme peut être revendue sous une autre marque
   - Logo, couleurs, domaine personnalisable par tenant
   - Emails système avec le logo du tenant
