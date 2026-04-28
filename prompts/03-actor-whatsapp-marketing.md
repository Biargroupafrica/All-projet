# Prompt Microservice : Actor WhatsApp Marketing

## Rôle

Tu es un développeur senior spécialisé en WhatsApp Business API et marketing conversationnel. Tu construis le microservice **Actor WhatsApp Marketing**, une solution complète de marketing WhatsApp Business autonome pour la plateforme Actor Hub.

## Description du Microservice

Actor WhatsApp Marketing est une plateforme de marketing conversationnel offrant :
- Envoi de messages en masse (broadcast) via WhatsApp Business API
- Chatbot IA configurable avec flow builder visuel
- Gestion multi-comptes et multi-agents
- Auto-répondeur intelligent
- Analytics et rapports détaillés
- Module Anti-Block (protection du numéro)
- Gestion de templates WhatsApp (approuvés par Meta)
- OTP via WhatsApp
- Campagnes publicitaires Click-to-WhatsApp

## Architecture Technique

```
┌──────────────────────────────────────────────────────────┐
│                ACTOR WHATSAPP MARKETING                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (React)                                        │
│  ├── WhatsappDashboardAnalytics  (Dashboard principal)   │
│  ├── WhatsappMarketingAnalytics  (Analytics marketing)   │
│  ├── WhatsappAntiBlock           (Protection numéro)     │
│  ├── WhatsappConversations       (Conversations)         │
│  ├── WhatsappAccountConnection   (Connexion comptes)     │
│  ├── WhatsappBulk                (Envoi en masse)        │
│  ├── WhatsappFlowBuilder         (Chatbot builder)       │
│  ├── WhatsappBusinessPlatform    (Plateforme WA)         │
│  ├── WhatsappAutoresponder       (Auto-répondeur)        │
│  ├── WhatsappBroadcastModule     (Diffusion)             │
│  ├── WhatsappChatModule          (Chat multi-agent)      │
│  ├── WhatsappContactsModule      (Gestion contacts)      │
│  ├── WhatsappIaAssistantModule   (Assistant IA)          │
│  ├── WhatsappAdsCampaigns        (Pub Click-to-WA)      │
│  ├── WhatsappAccountAnalyzer     (Analyseur compte)      │
│  ├── WhatsappScheduled           (Messages programmés)   │
│  ├── WhatsappTemplates           (Modèles messages)      │
│  ├── WhatsappGroups              (Groupes)               │
│  ├── WhatsappMedia               (Multimédia)            │
│  ├── WhatsappChatbot             (Chatbot)               │
│  ├── WhatsappQR                  (QR Code)               │
│  ├── WhatsappReports             (Rapports)              │
│  ├── WhatsappExport              (Export données)        │
│  ├── WhatsappAdvanced            (Avancé)                │
│  ├── WhatsappApi                 (API)                   │
│  └── WhatsappOtp                 (OTP)                   │
│                                                          │
│  Backend (Edge Functions + Workers)                      │
│  ├── WhatsApp Cloud API Client   (Meta API integration)  │
│  ├── Webhook Handler             (Réception messages)    │
│  ├── Chatbot Engine              (Flow execution + AI)   │
│  ├── Broadcast Service           (Envoi en masse)        │
│  ├── Session Manager             (Sessions conversations)│
│  ├── Media Processor             (Upload/Download)       │
│  ├── Template Manager            (CRUD + Meta approval)  │
│  ├── Anti-Block Service          (Throttling intelligent)│
│  ├── OTP Service                 (Envoi & vérification)  │
│  ├── AI Assistant Service        (OpenAI/Claude + RAG)   │
│  └── Analytics Aggregator        (Métriques temps réel)  │
│                                                          │
│  Passerelle                                              │
│  └── WhatsApp API Gateway                                │
│      (/dashboard/whatsapp-gateway-config)                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Tables Base de Données

```sql
-- Comptes WhatsApp Business
whatsapp_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  phone_number TEXT NOT NULL,
  phone_number_id TEXT NOT NULL,
  waba_id TEXT NOT NULL,
  business_name TEXT,
  access_token_encrypted TEXT NOT NULL,
  quality_rating TEXT DEFAULT 'GREEN' CHECK (quality_rating IN ('GREEN', 'YELLOW', 'RED')),
  messaging_limit TEXT DEFAULT 'TIER_1K',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'disconnected')),
  webhook_verify_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages WhatsApp
whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  wamid TEXT UNIQUE,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'image', 'video', 'audio', 'document', 'sticker', 'location', 'contact', 'template', 'interactive', 'reaction')),
  content TEXT,
  media_url TEXT,
  media_mime_type TEXT,
  template_name TEXT,
  template_params JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_code TEXT,
  error_message TEXT,
  conversation_id UUID REFERENCES whatsapp_conversations(id),
  agent_id UUID REFERENCES users(id),
  broadcast_id UUID REFERENCES whatsapp_broadcasts(id),
  is_automated BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  contact_phone TEXT NOT NULL,
  contact_name TEXT,
  contact_id UUID REFERENCES contacts(id),
  assigned_agent_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'pending', 'assigned', 'resolved', 'closed')),
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  unread_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  window_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Broadcasts (Diffusion en masse)
whatsapp_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  name TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_params JSONB,
  contact_list_id UUID REFERENCES contact_lists(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled', 'completed')),
  total_contacts INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  send_rate INTEGER DEFAULT 50,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates WhatsApp
whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID REFERENCES whatsapp_accounts(id),
  name TEXT NOT NULL,
  language TEXT DEFAULT 'fr',
  category TEXT NOT NULL CHECK (category IN ('MARKETING', 'UTILITY', 'AUTHENTICATION')),
  header_type TEXT CHECK (header_type IN ('TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT')),
  header_content TEXT,
  body TEXT NOT NULL,
  footer TEXT,
  buttons JSONB,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'PAUSED', 'DISABLED')),
  rejection_reason TEXT,
  meta_template_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chatbot Flows
whatsapp_chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID REFERENCES whatsapp_accounts(id),
  name TEXT NOT NULL,
  description TEXT,
  trigger_keywords TEXT[] DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  flow_config JSONB NOT NULL,
  ai_enabled BOOLEAN DEFAULT false,
  ai_model TEXT DEFAULT 'gpt-4',
  ai_system_prompt TEXT,
  ai_knowledge_base JSONB,
  stats JSONB DEFAULT '{"triggered": 0, "completed": 0, "dropped_off": 0}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-répondeur
whatsapp_autoresponders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID REFERENCES whatsapp_accounts(id),
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('keyword', 'first_message', 'outside_hours', 'all')),
  trigger_keywords TEXT[] DEFAULT '{}',
  response_type TEXT NOT NULL CHECK (response_type IN ('text', 'template', 'flow', 'ai')),
  response_content TEXT,
  template_name TEXT,
  flow_id UUID REFERENCES whatsapp_chatbot_flows(id),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  schedule JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTP
whatsapp_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  message_id UUID REFERENCES whatsapp_messages(id),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'verified', 'expired', 'failed')),
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anti-Block Configuration
whatsapp_anti_block_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  account_id UUID REFERENCES whatsapp_accounts(id),
  max_messages_per_hour INTEGER DEFAULT 100,
  max_messages_per_day INTEGER DEFAULT 1000,
  delay_between_messages INTEGER DEFAULT 2000,
  randomize_delay BOOLEAN DEFAULT true,
  pause_on_quality_drop BOOLEAN DEFAULT true,
  warmup_enabled BOOLEAN DEFAULT true,
  warmup_daily_increase INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

```
# Comptes
GET    /api/whatsapp/accounts                # Lister les comptes
POST   /api/whatsapp/accounts                # Connecter un compte
DELETE /api/whatsapp/accounts/:id            # Déconnecter
GET    /api/whatsapp/accounts/:id/health     # Santé du compte

# Messages
POST   /api/whatsapp/send                    # Envoyer un message
POST   /api/whatsapp/send-template           # Envoyer via template
GET    /api/whatsapp/messages                # Historique
GET    /api/whatsapp/messages/:id            # Détails

# Conversations
GET    /api/whatsapp/conversations           # Lister
GET    /api/whatsapp/conversations/:id       # Détails + messages
PUT    /api/whatsapp/conversations/:id/assign # Assigner un agent
PUT    /api/whatsapp/conversations/:id/close  # Fermer

# Broadcasts
POST   /api/whatsapp/broadcasts              # Créer
GET    /api/whatsapp/broadcasts              # Lister
POST   /api/whatsapp/broadcasts/:id/start    # Démarrer
POST   /api/whatsapp/broadcasts/:id/pause    # Pause
GET    /api/whatsapp/broadcasts/:id/report   # Rapport

# Templates
GET    /api/whatsapp/templates               # Lister (local + Meta)
POST   /api/whatsapp/templates               # Créer & soumettre à Meta
DELETE /api/whatsapp/templates/:id           # Supprimer

# Chatbot
GET    /api/whatsapp/chatbot/flows           # Lister les flows
POST   /api/whatsapp/chatbot/flows           # Créer un flow
PUT    /api/whatsapp/chatbot/flows/:id       # Modifier
POST   /api/whatsapp/chatbot/flows/:id/activate   # Activer
POST   /api/whatsapp/chatbot/test            # Tester un flow

# Auto-répondeur
GET    /api/whatsapp/autoresponders          # Lister
POST   /api/whatsapp/autoresponders          # Créer
PUT    /api/whatsapp/autoresponders/:id      # Modifier

# OTP
POST   /api/whatsapp/otp/send               # Envoyer OTP
POST   /api/whatsapp/otp/verify             # Vérifier OTP

# QR Code
POST   /api/whatsapp/qr/generate            # Générer QR
GET    /api/whatsapp/qr/:id                  # Obtenir QR

# Analytics
GET    /api/whatsapp/analytics/overview      # Vue d'ensemble
GET    /api/whatsapp/analytics/conversations # Stats conversations
GET    /api/whatsapp/analytics/broadcasts    # Stats broadcasts
GET    /api/whatsapp/analytics/agents        # Performance agents

# Webhook (Meta)
GET    /api/whatsapp/webhook                 # Verification (challenge)
POST   /api/whatsapp/webhook                 # Messages entrants

# Export
POST   /api/whatsapp/export/conversations    # Export conversations
POST   /api/whatsapp/export/contacts         # Export contacts
POST   /api/whatsapp/export/reports          # Export rapports
```

## Événements Émis

```typescript
type WhatsAppEvent =
  | { type: 'whatsapp.message_received'; data: { messageId, from, content, type } }
  | { type: 'whatsapp.message_sent'; data: { messageId, to, wamid } }
  | { type: 'whatsapp.message_delivered'; data: { wamid, deliveredAt } }
  | { type: 'whatsapp.message_read'; data: { wamid, readAt } }
  | { type: 'whatsapp.message_failed'; data: { messageId, errorCode, errorMessage } }
  | { type: 'whatsapp.conversation_opened'; data: { conversationId, contactPhone } }
  | { type: 'whatsapp.conversation_assigned'; data: { conversationId, agentId } }
  | { type: 'whatsapp.conversation_closed'; data: { conversationId } }
  | { type: 'whatsapp.broadcast_started'; data: { broadcastId, totalContacts } }
  | { type: 'whatsapp.broadcast_completed'; data: { broadcastId, stats } }
  | { type: 'whatsapp.template_approved'; data: { templateId, name } }
  | { type: 'whatsapp.template_rejected'; data: { templateId, reason } }
  | { type: 'whatsapp.quality_changed'; data: { accountId, oldRating, newRating } }
  | { type: 'whatsapp.chatbot_triggered'; data: { flowId, contactPhone, trigger } }
  | { type: 'whatsapp.otp_sent'; data: { otpId, phoneNumber } }
  | { type: 'whatsapp.otp_verified'; data: { otpId, phoneNumber } }
```

## Instructions Spécifiques

1. Utilise la WhatsApp Cloud API (pas l'ancienne On-Premise)
2. Respecte la fenêtre de 24h pour les messages non-template
3. Les templates doivent être soumis à Meta pour approbation
4. L'anti-block doit respecter les limites de messaging de Meta
5. Le chatbot IA peut utiliser OpenAI/Claude avec RAG (base de connaissances)
6. Le Flow Builder doit être visuel (React Flow ou similaire)
7. Les conversations doivent supporter l'assignation multi-agents
8. L'OTP doit expirer après 5 minutes
9. Les médias doivent être uploadés via l'API Media de Meta
10. Implémente le warmup progressif pour les nouveaux numéros
