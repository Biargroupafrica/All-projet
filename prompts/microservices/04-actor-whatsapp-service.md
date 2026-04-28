# Prompt: Actor WhatsApp Service - Microservice WhatsApp Business

## Contexte
Tu es un développeur senior spécialisé en WhatsApp Business API et messagerie instantanée. Tu dois créer le microservice **Actor WhatsApp Marketing** pour la plateforme Actor Hub. Ce service gère les conversations WhatsApp Business, les broadcasts, les chatbots IA, et le marketing WhatsApp.

## Mission
Créer un microservice WhatsApp Business autonome intégrant la WhatsApp Cloud API de Meta, avec gestion multi-comptes, chatbot IA, broadcasts, et analytics.

## Spécifications techniques

### Stack
- **Runtime** : Node.js 20+ / NestJS
- **API WhatsApp** : WhatsApp Cloud API (Meta)
- **Base de données** : PostgreSQL (schéma `whatsapp`)
- **Cache/Queue** : Redis + Bull
- **IA** : OpenAI GPT pour chatbot
- **Stockage médias** : S3/Cloudflare R2
- **ORM** : Prisma

### Schéma de base de données
```sql
CREATE SCHEMA whatsapp;

CREATE TABLE whatsapp.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  phone_number_id VARCHAR(50) NOT NULL,
  waba_id VARCHAR(50) NOT NULL, -- WhatsApp Business Account ID
  display_phone VARCHAR(20) NOT NULL,
  display_name VARCHAR(255),
  quality_rating VARCHAR(20), -- GREEN, YELLOW, RED
  messaging_limit VARCHAR(20), -- TIER_1K, TIER_10K, TIER_100K, UNLIMITED
  access_token TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  wa_id VARCHAR(20) NOT NULL, -- Numéro WhatsApp
  name VARCHAR(255),
  profile_picture_url TEXT,
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  is_blocked BOOLEAN DEFAULT false,
  opt_in_status VARCHAR(20) DEFAULT 'opted_in',
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, wa_id)
);

CREATE TABLE whatsapp.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  account_id UUID REFERENCES whatsapp.accounts(id),
  contact_id UUID REFERENCES whatsapp.contacts(id),
  assigned_agent_id UUID,
  status VARCHAR(20) DEFAULT 'open', -- open, assigned, resolved, closed
  category VARCHAR(50), -- support, sales, marketing
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  last_message_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  conversation_id UUID REFERENCES whatsapp.conversations(id),
  wa_message_id VARCHAR(100), -- ID WhatsApp du message
  direction VARCHAR(10) NOT NULL, -- inbound, outbound
  from_number VARCHAR(20) NOT NULL,
  to_number VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL, -- text, image, video, audio, document, template, interactive, location, contacts, sticker
  content TEXT,
  media_url TEXT,
  media_mime_type VARCHAR(100),
  media_caption TEXT,
  template_name VARCHAR(255),
  template_params JSONB,
  interactive_data JSONB,
  status VARCHAR(20) DEFAULT 'sent', -- sent, delivered, read, failed
  error_code VARCHAR(10),
  error_message TEXT,
  is_from_bot BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  account_id UUID REFERENCES whatsapp.accounts(id),
  wa_template_id VARCHAR(100),
  name VARCHAR(255) NOT NULL,
  language VARCHAR(10) DEFAULT 'fr',
  category VARCHAR(50) NOT NULL, -- MARKETING, UTILITY, AUTHENTICATION
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  components JSONB NOT NULL, -- header, body, footer, buttons
  example_values JSONB,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp.broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  account_id UUID REFERENCES whatsapp.accounts(id),
  name VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES whatsapp.templates(id),
  contact_list_id UUID,
  status VARCHAR(20) DEFAULT 'draft', -- draft, scheduled, sending, completed, cancelled
  scheduled_at TIMESTAMPTZ,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE whatsapp.chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_keywords TEXT[] DEFAULT '{}',
  flow_data JSONB NOT NULL, -- Arbre de décision chatbot
  ai_enabled BOOLEAN DEFAULT false,
  ai_prompt TEXT,
  ai_model VARCHAR(50) DEFAULT 'gpt-4',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp.auto_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  trigger_type VARCHAR(20) NOT NULL, -- keyword, greeting, away, business_hours
  trigger_value TEXT,
  response_type VARCHAR(20) NOT NULL, -- text, template, interactive
  response_content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  contacts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Endpoints API
```
# Comptes WhatsApp
GET    /api/v1/accounts                     # Lister les comptes
POST   /api/v1/accounts                     # Connecter un compte
PUT    /api/v1/accounts/:id                 # Modifier
DELETE /api/v1/accounts/:id                 # Déconnecter
GET    /api/v1/accounts/:id/health          # Santé du compte

# Messages
POST   /api/v1/messages/send                # Envoyer un message
POST   /api/v1/messages/send-template       # Envoyer un template
POST   /api/v1/messages/send-media          # Envoyer un média
POST   /api/v1/messages/send-interactive    # Message interactif
GET    /api/v1/messages                     # Historique

# Conversations
GET    /api/v1/conversations                # Lister (inbox)
GET    /api/v1/conversations/:id            # Détail avec messages
PUT    /api/v1/conversations/:id/assign     # Assigner à un agent
PUT    /api/v1/conversations/:id/status     # Changer statut
GET    /api/v1/conversations/unread         # Non lues

# Templates
GET    /api/v1/templates                    # Lister
POST   /api/v1/templates                    # Créer/Soumettre à Meta
PUT    /api/v1/templates/:id                # Modifier
DELETE /api/v1/templates/:id                # Supprimer
GET    /api/v1/templates/:id/preview        # Prévisualiser

# Broadcasts
GET    /api/v1/broadcasts                   # Lister
POST   /api/v1/broadcasts                   # Créer
POST   /api/v1/broadcasts/:id/send          # Lancer
POST   /api/v1/broadcasts/:id/schedule      # Planifier
GET    /api/v1/broadcasts/:id/stats         # Statistiques

# Chatbot
GET    /api/v1/chatbot/flows                # Lister les flux
POST   /api/v1/chatbot/flows                # Créer
PUT    /api/v1/chatbot/flows/:id            # Modifier
POST   /api/v1/chatbot/flows/:id/test       # Tester

# Auto-réponses
GET    /api/v1/auto-responses               # Lister
POST   /api/v1/auto-responses               # Créer
PUT    /api/v1/auto-responses/:id           # Modifier
DELETE /api/v1/auto-responses/:id           # Supprimer

# Contacts
GET    /api/v1/contacts                     # Lister
POST   /api/v1/contacts/import              # Importer
GET    /api/v1/contacts/export              # Exporter

# Analytics
GET    /api/v1/analytics/dashboard          # Dashboard
GET    /api/v1/analytics/messages           # Stats messages
GET    /api/v1/analytics/campaigns          # Stats campagnes
GET    /api/v1/analytics/agents             # Performance agents

# Webhooks Meta
POST   /api/v1/webhooks/whatsapp            # Webhook Meta (messages entrants)
GET    /api/v1/webhooks/whatsapp            # Vérification webhook
```

### Événements Message Broker
```typescript
'whatsapp.message.received'      // { messageId, conversationId, from, type, content }
'whatsapp.message.sent'          // { messageId, to, status }
'whatsapp.message.delivered'     // { messageId, deliveredAt }
'whatsapp.message.read'          // { messageId, readAt }
'whatsapp.broadcast.started'     // { broadcastId, totalRecipients }
'whatsapp.broadcast.completed'   // { broadcastId, stats }
'whatsapp.conversation.created'  // { conversationId, contactId }
'whatsapp.conversation.assigned' // { conversationId, agentId }
'whatsapp.account.quality_changed' // { accountId, oldRating, newRating }
'whatsapp.chatbot.fallback'      // { conversationId, message }
```

## Critères d'acceptation
- [ ] Intégration WhatsApp Cloud API complète
- [ ] Inbox multi-agent avec assignation
- [ ] Envoi de templates approuvés par Meta
- [ ] Broadcasts avec planification
- [ ] Chatbot avec IA (OpenAI GPT)
- [ ] Auto-réponses configurables
- [ ] Gestion des médias (images, vidéos, documents)
- [ ] Messages interactifs (boutons, listes)
- [ ] Anti-block : gestion du rate limiting et qualité compte
- [ ] Analytics et reporting
- [ ] Webhook Meta sécurisé
