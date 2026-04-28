# Skill 04 — Module SMS Bulk & Marketing

## Quand utiliser ce skill
Lorsque vous travaillez sur le module SMS : campagnes bulk, SMS unitaire, A2P, SMPP gateway, DLR, HLR, analytics SMS.

## Routes concernées (sous /dashboard/)
```
sms-single               — SMS unitaire
sms-bulk                 — SMS en masse
sms-campaign-reports     — Rapports campagnes
sms-templates            — Modèles SMS
sms-contacts             — Contacts SMS
sms-contacts-manager     — Gestionnaire contacts avancé
sms-lists-manager        — Listes de diffusion
sms-scheduled            — SMS programmés
sms-analytics            — Analytics SMS
sms-analytics-enhanced   — Analytics enrichi
sms-reports              — Rapports détaillés
sms-history              — Historique envois
transaction-report       — Rapport transactions
dlr-report               — Rapport DLR
customer-traffic-report  — Trafic clients
pricing-coverage         — Couverture & tarifs
hlr-lookup               — Vérification HLR
account-credits          — Crédits compte
sms-sender-ids           — Sender IDs
rcs-configuration        — RCS (Rich SMS)
rcs-messages             — Messages RCS
sms-a2p                  — SMS A2P Enterprise
url-shortener            — Raccourcisseur URL
sms-api-docs             — Documentation API SMS
smpp-gateway             — Config gateway SMPP
```

## Architecture du Module SMS

```
┌─────────────────────────────────────────────────────────────┐
│                      SMS MODULE                             │
├───────────────────┬─────────────────────┬───────────────────┤
│   CAMPAIGN MGMT   │   MESSAGE ROUTING   │   ANALYTICS       │
│                   │                     │                   │
│ • Builder         │ • SMPP Client      │ • DLR Reports     │
│ • Scheduler       │ • Route Selection  │ • Open Rates      │
│ • Contact Lists   │ • Failover         │ • Click Tracking  │
│ • Segmentation    │ • Rate Limiting    │ • HLR Lookup      │
│ • A/B Testing     │ • Blacklist Check  │ • Revenue Track   │
└───────────────────┴─────────────────────┴───────────────────┘
          │                   │                    │
          └───────────────────┼────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │         SMPP GATEWAY           │
              │  • Multiple Providers          │
              │  • Load Balancing              │
              │  • DLR Processing              │
              └───────────────────────────────┘
```

## Modèle de Données SMS

```sql
-- Campagnes SMS
CREATE TABLE sms_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'bulk', -- bulk, otp, transactional, a2p
  sender_id TEXT NOT NULL,
  message_template TEXT NOT NULL,
  contacts_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft', -- draft, scheduled, running, completed, paused
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cost_per_sms DECIMAL(10,4) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages individuels
CREATE TABLE sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  campaign_id UUID REFERENCES sms_campaigns(id),
  to_number TEXT NOT NULL,
  message TEXT NOT NULL,
  parts_count INTEGER DEFAULT 1,
  sender_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, queued, sent, delivered, failed, rejected
  dlr_status TEXT,
  dlr_received_at TIMESTAMPTZ,
  provider TEXT, -- route utilisée
  provider_message_id TEXT,
  error_code TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contacts SMS
CREATE TABLE sms_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  phone TEXT NOT NULL,
  name TEXT,
  email TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  is_blacklisted BOOLEAN DEFAULT false,
  blacklisted_at TIMESTAMPTZ,
  hlr_status TEXT, -- valid, invalid, roaming, unknown
  country_code TEXT,
  opt_in BOOLEAN DEFAULT true,
  opt_in_date TIMESTAMPTZ,
  opt_out_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, phone)
);

-- Listes de diffusion
CREATE TABLE sms_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  contacts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sender IDs
CREATE TABLE sms_sender_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  sender_id TEXT NOT NULL,
  type TEXT DEFAULT 'alphanumeric', -- alphanumeric, numeric, shortcode
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  countries TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Crédits
CREATE TABLE sms_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  balance DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions crédits
CREATE TABLE sms_credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL, -- purchase, consumption, refund
  description TEXT,
  balance_after DECIMAL(12,2),
  campaign_id UUID REFERENCES sms_campaigns(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Intégration SMPP

```typescript
// Configuration SMPP Gateway
interface SMPPConfig {
  host: string        // ex: smpp.provider.com
  port: number        // ex: 2775
  systemId: string    // login
  password: string
  systemType: string  // ex: CMT
  connectionType: 'TRANSCEIVER' | 'TRANSMITTER' | 'RECEIVER'
  enquireLinkInterval: number // heartbeat en secondes
  throttleRate: number        // messages/seconde
}

// Envoi d'un message
async function sendSMS(params: {
  from: string
  to: string
  message: string
  encoding?: 'GSM7' | 'UCS2'
  campaignId?: string
}) {
  // 1. Vérifier blacklist
  // 2. Vérifier crédits suffisants
  // 3. Choisir route optimale
  // 4. Découper en parts si > 160 chars
  // 5. Envoyer via SMPP
  // 6. Enregistrer en DB avec provider_message_id
  // 7. Déduire crédits
}

// Traitement DLR (Delivery Receipt)
async function processDLR(dlr: {
  messageId: string
  status: string    // DELIVRD, FAILED, EXPIRED, etc.
  errorCode?: string
  timestamp: Date
}) {
  // 1. Trouver message par provider_message_id
  // 2. Mettre à jour statut
  // 3. Mettre à jour compteurs campagne
  // 4. Notifier via webhook si configuré
}
```

## Prompts pour le Module SMS

### Prompt — Campaign Builder SMS
```
Crée un constructeur de campagne SMS pour Actor Hub.
Étapes du wizard (4 steps) :
1. Informations : Nom campagne, Sender ID, Type (bulk/OTP/A2P)
2. Contacts : Sélection liste ou upload CSV, segmentation
3. Message : Éditeur SMS avec compteur caractères, personnalisation {prénom}, {société},
   aperçu SMS mobile, sélection encodage (GSM7 ou Unicode), planification
4. Révision : Résumé (nb contacts, coût estimé, heure envoi), bouton Envoyer/Programmer
Afficher en temps réel : nombre de parts SMS, coût total estimé, taux opt-out.
Interface en steps/wizard avec indicateur de progression.
```

### Prompt — Analytics Dashboard SMS
```
Crée un dashboard d'analytics SMS avec :
- KPIs principaux : Taux de livraison %, Taux d'erreur %, Coût total, Msgs envoyés
- Graphique courbe : volume envois sur 30 jours (envoyés/livrés/échoués)
- Carte géographique : heatmap des envois par pays
- Top 5 campagnes : par taux de livraison
- Tableau DLR en temps réel : derniers 100 messages avec statut
- Filtres : période (7j/30j/90j), sender ID, campagne
- Export CSV/Excel des données
Design avec charts (recharts ou Chart.js), dark mode par défaut.
```

### Prompt — HLR Lookup Interface
```
Crée une interface de vérification HLR (Home Location Register) pour valider des numéros.
Fonctionnalités :
- Input unique : saisie d'un numéro → résultat instantané
- Import en masse : upload CSV → vérification par lot → téléchargement résultats
- Résultat affiché : opérateur, pays, type (mobile/fixe/VOIP), roaming, validité
- Statistiques : % valides, % invalides, par pays, par opérateur
- Historique des lookups
- Facturation : X centimes par lookup (déduire des crédits)
Utiliser une API HLR tierce (ex: numverify, hlr-lookups.com).
```

### Prompt — Gestionnaire Sender IDs
```
Crée un module de gestion des Sender IDs SMS pour Actor Hub.
Fonctionnalités :
- Liste des sender IDs : nom, type (alphanumérique/numérique/shortcode), statut, pays
- Formulaire création : nom (max 11 chars alphanumériques), sélection pays, justificatif
- Workflow d'approbation : en attente → approuvé → actif
- Indicateur visibilité par pays : grille des pays avec ✓/✗/en attente
- Alertes expiration ou refus
- Sender ID par défaut par pays
```

### Prompt — API SMS Documentation
```
Crée une page de documentation API SMS interactive pour développeurs.
Structure :
- Authentification : API Key, Bearer Token, exemples
- Endpoints documentés :
  POST /api/sms/send — Envoi unitaire
  POST /api/sms/bulk — Envoi en masse
  GET /api/sms/status/{id} — Statut message
  GET /api/sms/reports — Rapports
  POST /api/sms/webhook — Config callback DLR
- Code samples : cURL, Python, PHP, Node.js, Java
- Playground interactif : tester les endpoints directement
- Rate limits et codes d'erreur
Style documentation Stripe/Twilio.
```

## Tests à réaliser
- [ ] Envoi SMS unitaire (numéro test)
- [ ] Campagne bulk (100 numéros test)
- [ ] Vérification DLR reçu et mis à jour en DB
- [ ] Import CSV contacts (1000 lignes)
- [ ] Segmentation par tag, pays, opt-in
- [ ] Planification : campagne programmée à J+1
- [ ] HLR lookup (numéros valides et invalides)
- [ ] Gestion crédits : déduction après envoi
- [ ] Blacklist : numéro blacklisté non envoyé
- [ ] API endpoint /api/sms/send avec authentification
