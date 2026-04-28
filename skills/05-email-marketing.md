# Skill 05 — Module Email Marketing

## Quand utiliser ce skill
Lorsque vous travaillez sur le module Email : campagnes email, éditeur WYSIWYG, automation flows, templates, analytics, deliverability.

## Routes concernées (sous /dashboard/)
```
email-marketing          — Hub email marketing
email-editor             — Éditeur email WYSIWYG
email-templates          — Bibliothèque de modèles
email-flow-builder       — Constructeur de flux automation
email-flow-editor        — Éditeur de flux
email-analytics          — Analytics email
email-segmentation       — Segmentation contacts
email-dns-authentication — Config SPF/DKIM/DMARC
email-deliverability     — Score de délivrabilité
smtp-configuration       — Configuration SMTP
email-marketing-hub      — Dashboard principal
smtp-gateway-config      — Config gateway SMTP
```

## Architecture Email

```
┌─────────────────────────────────────────────────────────────┐
│                    EMAIL MODULE                             │
├───────────────────┬─────────────────────┬───────────────────┤
│   CAMPAIGN MGMT   │   DELIVERY ENGINE   │   ANALYTICS       │
│                   │                     │                   │
│ • WYSIWYG Editor  │ • SMTP Multi-relay  │ • Open Tracking  │
│ • Template Lib    │ • Bounce Handler    │ • Click Tracking  │
│ • Segmentation    │ • Unsubscribe Mgmt  │ • Heatmaps        │
│ • A/B Testing     │ • SPF/DKIM Sign     │ • Revenue Track   │
│ • Automation Flow │ • Retry Logic       │ • A/B Analysis    │
└───────────────────┴─────────────────────┴───────────────────┘
          │                   │                    │
          └───────────────────┼────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │        SMTP GATEWAY            │
              │  • SendGrid / AWS SES          │
              │  • Mailgun / Postfix           │
              │  • Custom SMTP                 │
              └───────────────────────────────┘
```

## Modèle de Données Email

```sql
-- Campagnes Email
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  from_name TEXT NOT NULL,
  from_email TEXT NOT NULL,
  reply_to TEXT,
  html_content TEXT,
  text_content TEXT,
  template_id UUID REFERENCES email_templates(id),
  list_id UUID REFERENCES email_lists(id),
  segment_filters JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft', -- draft, scheduled, sending, completed, paused
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipients_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  spam_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Événements email
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  campaign_id UUID REFERENCES email_campaigns(id),
  email TEXT NOT NULL,
  event_type TEXT NOT NULL, -- sent, delivered, opened, clicked, bounced, unsubscribed, spam
  metadata JSONB DEFAULT '{}', -- url cliquée, user-agent, IP
  occurred_at TIMESTAMPTZ DEFAULT now()
);

-- Templates Email
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id), -- NULL = template global
  name TEXT NOT NULL,
  category TEXT, -- welcome, newsletter, promotional, transactional
  thumbnail_url TEXT,
  html_content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}', -- ex: [prénom, entreprise]
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Listes contacts email
CREATE TABLE email_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  subscribers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contacts email
CREATE TABLE email_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  is_subscribed BOOLEAN DEFAULT true,
  unsubscribe_reason TEXT,
  bounce_type TEXT, -- hard, soft
  is_blacklisted BOOLEAN DEFAULT false,
  open_rate DECIMAL(5,2) DEFAULT 0,
  click_rate DECIMAL(5,2) DEFAULT 0,
  last_opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, email)
);

-- Flux d'automation
CREATE TABLE email_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL, -- signup, purchase, birthday, tag_added, etc.
  trigger_config JSONB DEFAULT '{}',
  nodes JSONB DEFAULT '[]',
  connections JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT false,
  enrollments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Prompts pour le Module Email

### Prompt — Éditeur Email WYSIWYG
```
Crée un éditeur email drag-and-drop professionnel pour Actor Hub.
Fonctionnalités :
- Canvas central : aperçu email responsive (desktop/mobile toggle)
- Sidebar gauche : blocs disponibles à glisser (Titre, Texte, Image, Bouton, Divider, Colonnes, Footer)
- Sidebar droite : propriétés du bloc sélectionné (couleur, police, padding, lien, etc.)
- Barre d'outils : Annuler/Refaire, Zoom, Desktop/Mobile preview, Test email, Sauvegarder
- Personnalisation : variables dynamiques {prénom}, {entreprise}
- Import HTML : coller du HTML brut
- Template picker : bibliothèque de modèles
- Envoi test : email de prévisualisation
Utiliser Unlayer ou TipTap comme base. Style professionnel noir et blanc.
```

### Prompt — Flow Builder Email (Automation)
```
Crée un constructeur de flows d'automation email pour Actor Hub.
Types de nœuds disponibles :
- Déclencheurs : Inscription, Achat, Anniversaire, Tag ajouté, Formulaire soumis
- Actions : Envoyer email, Ajouter tag, Retirer tag, Mettre à jour champ
- Conditions : A ouvert l'email, A cliqué, Champ = valeur, Segment membre
- Délais : Attendre X heures/jours/semaines
- Branchement : Oui/Non selon condition

Fonctionnalités :
- Canvas drag-and-drop avec react-flow
- Configuration de chaque nœud en panneau latéral
- Simulation du parcours (mode test)
- Statistiques par nœud : entrées, sorties, taux conversion
- Activer/Désactiver en 1 clic
- Alertes erreurs de configuration
```

### Prompt — Analytics Email
```
Crée un dashboard d'analytics email complet avec :
- Métriques globales : Taux d'ouverture, Taux de clic, Taux de rebond, Désabonnements
- Graphique : évolution sur 30 jours (ouvertures, clics, désabonnements)
- Top campagnes : par taux d'ouverture et de clic
- Heatmap de clic : carte visuelle de l'email avec zones les plus cliquées
- Analyse horaire : quand les emails sont ouverts (heatmap jour × heure)
- Analyse appareil : Desktop vs Mobile vs Tablet (donut chart)
- Analyse géographique : carte mondiale des ouvertures
- Score de délivrabilité : indicateur global avec recommandations
- Comparaison A/B : si campagne A/B test
```

### Prompt — Configuration DNS & Délivrabilité
```
Crée une page de configuration DNS pour améliorer la délivrabilité email.
Sections :
1. SPF Record : générateur SPF automatique, copier/coller dans DNS
2. DKIM : génération clé privée/publique, record DNS à ajouter
3. DMARC : wizard de configuration (policy, reporting email)
4. Vérification : checker qui teste les 3 records en temps réel avec ✓/✗
5. Score de réputation : IP reputation, domain reputation (MxToolbox)
6. Warmup plan : calendrier de montée en charge pour nouvelles IPs
7. Blacklist check : vérifier si l'IP est blacklistée
Interface simple et guidée, chaque étape expliquée en français.
```

## Tests à réaliser
- [ ] Envoi email unitaire (SMTP test)
- [ ] Campagne bulk (100 contacts test)
- [ ] Tracking ouvertures (pixel transparent)
- [ ] Tracking clics (redirections)
- [ ] Bounce handling (hard bounce → blacklist)
- [ ] Unsubscribe link fonctionnel
- [ ] Flow automation : trigger inscription → email J+0, J+3, J+7
- [ ] A/B test : 2 sujets, vainqueur automatique après 4h
- [ ] Vérification SPF/DKIM dans le header email reçu
- [ ] Score spam (SpamAssassin) < 5
