# Skill 06 — Module WhatsApp Business Platform

## Quand utiliser ce skill
Lorsque vous travaillez sur le module WhatsApp Business : broadcasts, chatbot, conversations multi-agents, templates, analytics.

## Routes concernées (sous /dashboard/)
```
whatsapp-business-platform      — Hub principal WABA
whatsapp-dashboard-analytics    — Analytics WhatsApp
whatsapp-marketing-analytics    — Analytics marketing
whatsapp-bulk                   — Envois en masse
whatsapp-broadcast-module        — Broadcasts
whatsapp-broadcast-create        — Créer broadcast
whatsapp-chat-module             — Interface de chat
whatsapp-conversations           — Toutes les conversations
whatsapp-contacts-module         — Contacts WhatsApp
whatsapp-templates               — Templates de messages
whatsapp-chatbot                 — Constructeur chatbot
whatsapp-flow-builder            — Flows WhatsApp
whatsapp-autoresponder           — Réponses automatiques
whatsapp-ia-assistant-module     — Assistant IA
whatsapp-groups                  — Groupes WhatsApp
whatsapp-media                   — Gestion médias
whatsapp-scheduled               — Messages programmés
whatsapp-reports                 — Rapports
whatsapp-export                  — Export données
whatsapp-advanced                — Fonctions avancées
whatsapp-api                     — Documentation API
whatsapp-otp                     — OTP via WhatsApp
whatsapp-qr                      — QR Code connexion
whatsapp-account-connection      — Connexion compte WABA
whatsapp-account-analyzer        — Analyseur de compte
whatsapp-anti-block              — Protection anti-blocage
whatsapp-ads-campaigns           — Campagnes Click-to-WhatsApp
whatsapp-gateway-config          — Config gateway
```

## Architecture WhatsApp

```
┌─────────────────────────────────────────────────────────────┐
│                  WHATSAPP MODULE                            │
├───────────────────┬─────────────────────┬───────────────────┤
│   MESSAGING       │   CHATBOT ENGINE    │   ANALYTICS       │
│                   │                     │                   │
│ • Broadcasts      │ • Flow Builder     │ • Conv. Metrics   │
│ • Chat Live       │ • NLP/Intent       │ • CSAT Score      │
│ • Multi-agent     │ • AI Responses     │ • Response Time   │
│ • Templates       │ • Human Handoff    │ • Click-to-WA     │
│ • Media (Image    │ • FAQ Auto-Answer  │ • Opt-in/out      │
│   Video, Doc)     │                    │                   │
└───────────────────┴─────────────────────┴───────────────────┘
          │                   │                    │
          └───────────────────┼────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │     WhatsApp Business API      │
              │  (Official Meta / 3rd party)   │
              └───────────────────────────────┘
```

## Modèle de Données WhatsApp

```sql
-- Comptes WhatsApp Business
CREATE TABLE wa_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  waba_id TEXT,           -- WhatsApp Business Account ID
  phone_number_id TEXT,   -- Phone Number ID Meta
  access_token TEXT,      -- Token API (chiffré)
  webhook_verify_token TEXT,
  status TEXT DEFAULT 'pending', -- pending, verified, active, suspended
  quality_rating TEXT, -- green, yellow, red
  messaging_limit TEXT, -- 1K, 10K, 100K, unlimited
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Templates de messages
CREATE TABLE wa_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID REFERENCES wa_accounts(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- AUTHENTICATION, MARKETING, UTILITY
  language TEXT DEFAULT 'fr',
  header_type TEXT, -- TEXT, IMAGE, VIDEO, DOCUMENT
  header_content TEXT,
  body TEXT NOT NULL,
  footer TEXT,
  buttons JSONB DEFAULT '[]',
  meta_template_id TEXT, -- ID chez Meta
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, paused
  variables TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversations
CREATE TABLE wa_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID NOT NULL REFERENCES wa_accounts(id),
  contact_wa_id TEXT NOT NULL, -- numéro WhatsApp du contact
  contact_name TEXT,
  contact_phone TEXT,
  assigned_agent_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'open', -- open, pending, resolved, archived
  channel_type TEXT DEFAULT 'whatsapp',
  first_message_at TIMESTAMPTZ DEFAULT now(),
  last_message_at TIMESTAMPTZ DEFAULT now(),
  resolution_at TIMESTAMPTZ,
  csat_score INTEGER, -- 1-5
  tags TEXT[] DEFAULT '{}',
  is_bot_active BOOLEAN DEFAULT true
);

-- Messages
CREATE TABLE wa_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  conversation_id UUID REFERENCES wa_conversations(id),
  wa_message_id TEXT UNIQUE, -- ID WhatsApp
  direction TEXT NOT NULL, -- inbound, outbound
  sender_wa_id TEXT NOT NULL,
  message_type TEXT NOT NULL, -- text, image, video, audio, document, template, interactive, reaction
  content JSONB NOT NULL, -- contenu variable selon type
  status TEXT DEFAULT 'sent', -- sent, delivered, read, failed
  is_bot_response BOOLEAN DEFAULT false,
  agent_id UUID REFERENCES profiles(id),
  template_id UUID REFERENCES wa_templates(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Broadcasts
CREATE TABLE wa_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID NOT NULL REFERENCES wa_accounts(id),
  name TEXT NOT NULL,
  template_id UUID REFERENCES wa_templates(id),
  template_variables JSONB DEFAULT '{}',
  recipients_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Flux Chatbot
CREATE TABLE wa_chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID REFERENCES wa_accounts(id),
  name TEXT NOT NULL,
  trigger_keywords TEXT[] DEFAULT '{}',
  nodes JSONB DEFAULT '[]',
  connections JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT false,
  sessions_count INTEGER DEFAULT 0,
  resolution_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Intégration WhatsApp Business API

```typescript
// Configuration Meta WhatsApp Business API
interface WABAConfig {
  phoneNumberId: string
  accessToken: string
  webhookVerifyToken: string
  businessAccountId: string
}

// Envoyer un message template
async function sendTemplateMessage(params: {
  to: string
  templateName: string
  languageCode: string
  variables: string[]
  accountId: string
}) {
  const response = await fetch(
    `https://graph.facebook.com/v17.0/${params.accountId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: params.to,
        type: 'template',
        template: {
          name: params.templateName,
          language: { code: params.languageCode },
          components: params.variables.map((value, index) => ({
            type: 'body',
            parameters: [{ type: 'text', text: value }]
          }))
        }
      })
    }
  )
  return response.json()
}

// Gérer les webhooks entrants
async function handleWebhook(payload: WAWebhookPayload) {
  const { entry } = payload
  for (const event of entry) {
    for (const change of event.changes) {
      if (change.field === 'messages') {
        const { messages, statuses } = change.value
        
        // Traiter les messages reçus
        for (const message of messages || []) {
          await processInboundMessage(message)
        }
        
        // Traiter les statuts (delivered, read)
        for (const status of statuses || []) {
          await updateMessageStatus(status)
        }
      }
    }
  }
}
```

## Prompts pour le Module WhatsApp

### Prompt — Interface Chat Multi-agents
```
Crée une interface de chat WhatsApp multi-agents pour Actor Hub.
Layout en 3 colonnes :
1. Sidebar gauche : liste des conversations (filtrées par agent, statut, tag)
   - Badge de non-lus, photo contact, dernier message, heure
   - Barre de recherche, filtres (Ouverts/En attente/Résolus)
2. Zone centrale : conversation active avec messages
   - Bulles de message (style WhatsApp) : reçus (gris), envoyés (vert/rose)
   - Statut : envoyé ✓, livré ✓✓, lu ✓✓ bleu
   - Types de messages : texte, image, vidéo, audio, document, sticker
   - Zone de saisie : emoji, pièce jointe, audio, templates, envoi
3. Sidebar droite : infos contact + actions
   - Nom, numéro, tags, historique achats
   - Assigner à un agent, changer statut, ajouter note
   - Bouton "Reprendre/Céder au bot"
Notifications en temps réel via Supabase Realtime.
```

### Prompt — Constructeur Chatbot WhatsApp
```
Crée un constructeur de chatbot WhatsApp visuel (flow builder) avec :
Types de nœuds :
- Déclencheur : Mot-clé, Premier message, Bouton cliqué, QR Code scanné
- Réponse texte : Message texte avec variables dynamiques
- Réponse avec boutons : Boutons interactifs (max 3) ou liste déroulante
- Réponse media : Image, Vidéo, Document
- Condition : Si/Sinon (selon réponse, tag, heure, langue)
- Action : Assigner agent, Ajouter tag, Envoyer en attente, Webhook
- Délai : Attendre X secondes/minutes avant répondre
- IA : Réponse GPT avec contexte (knowledge base)
Fonctionnalités :
- Preview temps réel sur écran mobile (simulateur)
- Test mode (simuler conversation)
- Version et déploiement
- Statistiques : sessions, taux de résolution, abandons
```

### Prompt — Dashboard Analytics WhatsApp
```
Crée un dashboard analytics WhatsApp Business avec :
Métriques principales :
- Messages envoyés/reçus aujourd'hui
- Taux de livraison et de lecture
- Temps de réponse moyen (agent + bot)
- CSAT score (satisfaction client)
- Conversations ouvertes/résolues/en attente

Graphiques :
- Volume messages par heure (aujourd'hui vs hier)
- Répartition par type : bot vs agent humain
- Performances par template (taux lecture)
- Évolution CSAT sur 30 jours

Agents :
- Tableau agents : conversations gérées, temps réponse, CSAT
- Classement des agents

Filtres : période, compte WABA, agent, tag
Export rapport PDF/Excel
```

### Prompt — Gestionnaire de Templates WABA
```
Crée un module de gestion des templates WhatsApp Business.
Fonctionnalités :
- Liste des templates : nom, catégorie, langue, statut Meta (approuvé/refusé/en attente)
- Créateur de template :
  Header : Texte / Image / Vidéo / Document
  Body : texte jusqu'à 1024 chars avec variables {{1}}, {{2}}...
  Footer : texte court optionnel
  Boutons : Répondre rapide / URL / Téléphone (max 3)
- Soumission à Meta pour approbation
- Preview du template rendu sur écran mobile
- Statistiques d'utilisation par template
- Traduction automatique (multi-langue)
Suivre exactement les règles Meta pour la soumission des templates.
```

## Tests à réaliser
- [ ] Connexion compte WABA (QR Code ou API token)
- [ ] Envoi message template (numéro test)
- [ ] Réception message entrant (webhook)
- [ ] Chat multi-agent : assignation et réponse
- [ ] Broadcast : envoi à 10 contacts test
- [ ] Chatbot : flow basique (accueil → menu → réponse)
- [ ] Statuts message : delivered, read
- [ ] Media : envoi image, document
- [ ] OTP WhatsApp : réception code
- [ ] Anti-block : limites de débit respectées
