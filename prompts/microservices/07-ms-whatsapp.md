# Prompt: ms-whatsapp - WhatsApp Business API

## Rôle
Tu es un développeur backend senior spécialisé en intégration WhatsApp Business API (Meta Cloud API). Tu dois créer le microservice `ms-whatsapp` pour la plateforme Actor Hub.

## Mission
Créer un service WhatsApp Business complet avec envoi bulk, chatbot IA (OpenAI), flow builder visuel, gestion multi-agent, templates Meta-approuvés, broadcast et analytics.

## Spécifications techniques

### Stack
- **Framework:** NestJS
- **Port:** 8006
- **Base de données:** PostgreSQL - schema `whatsapp`
- **API:** Meta WhatsApp Business Cloud API v18+
- **IA Chatbot:** OpenAI GPT-4
- **Queue:** Bull (envois massifs, anti-ban)

### Fonctionnalités requises

1. **Envoi de Messages**
   - Message texte simple
   - Message avec média (image, vidéo, document, audio)
   - Message avec boutons (quick reply, CTA)
   - Message avec listes (list message)
   - Message de localisation
   - Message de contact (vCard)

2. **Templates (HSM - Highly Structured Messages)**
   - CRUD templates selon les catégories Meta
   - Catégories: Marketing, Utility, Authentication
   - Soumission pour approbation Meta
   - Variables dynamiques

3. **Broadcast / Diffusion**
   - Envoi en masse avec anti-ban (throttling)
   - Segmentation des contacts
   - Planification des envois
   - Respect de la fenêtre de 24h Meta

4. **Conversations Multi-Agent**
   - Interface de chat temps réel
   - Assignation automatique ou manuelle aux agents
   - Transfert de conversation entre agents
   - Tags et notes sur les conversations
   - Historique complet par contact

5. **Chatbot IA**
   - Flow builder visuel (nœuds: message, condition, API, IA)
   - Intégration OpenAI GPT-4 pour réponses intelligentes
   - Fallback vers agent humain
   - Base de connaissances personnalisable
   - Auto-répondeur (hors horaires, premier message)

6. **Anti-Block**
   - Throttling intelligent (délai entre messages)
   - Rotation de numéros
   - Warm-up progressif
   - Monitoring du Quality Rating

7. **Analytics**
   - Messages envoyés, livrés, lus
   - Taux de réponse
   - Temps de réponse moyen
   - Performance par template
   - Coût par conversation

8. **Webhooks**
   - Réception des messages entrants
   - Statuts de livraison (sent, delivered, read, failed)
   - Changements de statut de template

### Schéma Base de Données
```sql
CREATE TABLE whatsapp_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  phone_number_id VARCHAR(50) NOT NULL,
  display_phone VARCHAR(20),
  waba_id VARCHAR(50),
  access_token TEXT,
  quality_rating VARCHAR(20) DEFAULT 'GREEN',
  messaging_limit INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  account_id UUID REFERENCES whatsapp_accounts(id),
  contact_phone VARCHAR(20) NOT NULL,
  contact_name VARCHAR(255),
  assigned_agent_id UUID,
  status VARCHAR(20) DEFAULT 'open',
  tags VARCHAR[] DEFAULT '{}',
  notes TEXT,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  conversation_id UUID REFERENCES whatsapp_conversations(id),
  wa_message_id VARCHAR(255),
  direction VARCHAR(10) NOT NULL,
  from_number VARCHAR(20),
  to_number VARCHAR(20),
  type VARCHAR(20) DEFAULT 'text',
  content TEXT,
  media_url TEXT,
  media_type VARCHAR(50),
  template_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  failed_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  language VARCHAR(10) DEFAULT 'fr',
  header JSONB,
  body TEXT NOT NULL,
  footer TEXT,
  buttons JSONB,
  meta_status VARCHAR(20) DEFAULT 'PENDING',
  meta_template_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE whatsapp_chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  flow_data JSONB NOT NULL,
  ai_enabled BOOLEAN DEFAULT false,
  ai_system_prompt TEXT,
  ai_knowledge_base TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE whatsapp_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  template_id UUID REFERENCES whatsapp_templates(id),
  contact_list_id UUID,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  scheduled_at TIMESTAMP,
  throttle_rate INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
```
POST   /api/v1/whatsapp/send            # Envoi message
POST   /api/v1/whatsapp/send-template    # Envoi template
POST   /api/v1/whatsapp/webhook          # Webhook Meta (entrant)

CRUD   /api/v1/whatsapp/templates        # Templates
CRUD   /api/v1/whatsapp/broadcasts       # Broadcasts
POST   /api/v1/whatsapp/broadcasts/:id/send

GET    /api/v1/whatsapp/conversations    # Conversations
GET    /api/v1/whatsapp/conversations/:id/messages
POST   /api/v1/whatsapp/conversations/:id/assign
POST   /api/v1/whatsapp/conversations/:id/close

CRUD   /api/v1/whatsapp/chatbot          # Chatbot flows
CRUD   /api/v1/whatsapp/accounts         # Comptes WhatsApp

GET    /api/v1/whatsapp/analytics        # Analytics
```

### Events publiés
```
whatsapp.sent       → { messageId, to, type }
whatsapp.delivered  → { messageId }
whatsapp.read       → { messageId, readAt }
whatsapp.received   → { messageId, from, content }
whatsapp.failed     → { messageId, reason }
conversation.opened → { conversationId, contactPhone }
conversation.assigned → { conversationId, agentId }
broadcast.completed → { broadcastId, stats }
```
