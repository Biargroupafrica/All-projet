# Skill : WhatsApp Service — ACTOR Hub

## Scénario d'utilisation
Développer le microservice WhatsApp Business (`services/whatsapp-service/`).

## Contexte Métier
Intégration officielle WhatsApp Business API (Meta Cloud API) permettant :
- Campagnes Broadcast via templates approuvés Meta
- Conversations Two-Way (service client, support)
- Chatbot IA (intégration avec ai-service)
- Multi-comptes WhatsApp Business (plusieurs WABA par org)
- Multi-agents (inbox partagée pour l'équipe)

## Fonctionnalités

### Messaging
- Messages texte, image, vidéo, document, audio, localisation
- Templates approuvés Meta (HSM — Highly Structured Messages)
- Boutons interactifs (Quick Reply, Call-to-Action)
- Listes interactives (menus)
- Réponses à des messages spécifiques (quoted reply)

### Chatbot (via ai-service)
- Reconnaissance d'intentions (NLP)
- Arbre de décision configurable
- Escalade vers agent humain
- Handoff intelligent (bot → humain → bot)

### Inbox Multi-Agents
- Attribution de conversations (auto ou manuelle)
- Statuts : ouvert, en attente, résolu, spam
- Notes internes (visibles agents seulement)
- Étiquettes/tags sur conversations
- Recherche plein texte dans historique

### Analytics
- Taux de livraison, lecture, réponse
- Temps de réponse moyen
- Satisfaction client (CSAT via boutons)
- Rapports par agent, par période

## Structure de Fichiers

```
services/whatsapp-service/
├── src/
│   ├── app.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── modules/
│   │   ├── messages/
│   │   │   ├── messages.router.ts
│   │   │   ├── messages.controller.ts
│   │   │   └── messages.service.ts
│   │   ├── conversations/
│   │   │   ├── conversations.router.ts
│   │   │   ├── conversations.controller.ts
│   │   │   └── conversations.service.ts
│   │   ├── templates/
│   │   │   ├── templates.router.ts    # Templates Meta HSM
│   │   │   └── templates.service.ts
│   │   ├── accounts/
│   │   │   ├── accounts.router.ts     # WABA accounts
│   │   │   └── accounts.service.ts
│   │   ├── chatbot/
│   │   │   ├── chatbot.router.ts
│   │   │   └── chatbot.service.ts     # Appelle ai-service
│   │   └── webhook/
│   │       ├── webhook.router.ts      # POST /webhook/meta
│   │       └── webhook.handler.ts
│   ├── realtime/
│   │   └── websocket.ts               # Socket.io pour inbox temps réel
│   └── db/
│       ├── schema.ts
│       └── migrations/
├── openapi.yaml
├── Dockerfile
└── package.json
```

## Schéma Base de Données

```sql
-- Comptes WhatsApp Business (WABA)
CREATE TABLE whatsapp_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  waba_id VARCHAR(255) NOT NULL,        -- WhatsApp Business Account ID (Meta)
  phone_number_id VARCHAR(255) NOT NULL, -- Phone Number ID (Meta)
  phone_number VARCHAR(50) NOT NULL,
  display_name VARCHAR(255),
  access_token_encrypted TEXT NOT NULL,
  webhook_verify_token VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',  -- active, banned, pending
  is_default BOOLEAN DEFAULT FALSE,
  quality_rating VARCHAR(20),           -- GREEN, YELLOW, RED
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations (threads)
CREATE TABLE whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  contact_phone VARCHAR(50) NOT NULL,
  contact_name VARCHAR(255),
  contact_profile_url TEXT,
  assigned_agent_id UUID,               -- agent assigné
  status VARCHAR(50) DEFAULT 'open',    -- open, pending, resolved, spam
  tags TEXT[] DEFAULT '{}',
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  unread_count INTEGER DEFAULT 0,
  is_bot_active BOOLEAN DEFAULT TRUE,   -- chatbot actif ou handoff humain
  meta_conversation_id VARCHAR(255),    -- ID conversation Meta (pour fenêtre 24h)
  window_expires_at TIMESTAMPTZ,        -- Expiration fenêtre 24h
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages WhatsApp
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  conversation_id UUID NOT NULL REFERENCES whatsapp_conversations(id),
  account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  meta_message_id VARCHAR(255) UNIQUE,  -- ID Meta
  direction VARCHAR(10) NOT NULL,       -- 'inbound', 'outbound'
  type VARCHAR(50) NOT NULL,            -- 'text', 'image', 'video', 'audio', 'document', 'location', 'template', 'interactive'
  content JSONB NOT NULL,               -- Contenu selon le type
  status VARCHAR(50) DEFAULT 'sent',    -- sent, delivered, read, failed
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error_code VARCHAR(50),
  agent_id UUID,                        -- null si chatbot
  is_internal_note BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates HSM (pré-approuvés Meta)
CREATE TABLE whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  meta_template_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,       -- 'MARKETING', 'UTILITY', 'AUTHENTICATION'
  language VARCHAR(10) NOT NULL,        -- 'fr', 'en', etc.
  components JSONB NOT NULL,            -- Structure Meta template
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chatbot flows
CREATE TABLE whatsapp_chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  account_id UUID NOT NULL REFERENCES whatsapp_accounts(id),
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  flow_definition JSONB NOT NULL,       -- Arbre de décision JSON
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Endpoints API

```
# Comptes WhatsApp
GET    /whatsapp/accounts
POST   /whatsapp/accounts
DELETE /whatsapp/accounts/:id

# Messages
POST   /whatsapp/messages/send         # Envoyer message (text/media/template)
POST   /whatsapp/messages/broadcast    # Broadcast avec template (max 1000 contacts)

# Conversations (Inbox)
GET    /whatsapp/conversations         # Liste avec filtres (status, agent, tag)
GET    /whatsapp/conversations/:id
PUT    /whatsapp/conversations/:id     # Modifier statut/assignation/tags
GET    /whatsapp/conversations/:id/messages
POST   /whatsapp/conversations/:id/messages   # Répondre
POST   /whatsapp/conversations/:id/assign     # Assigner à agent
POST   /whatsapp/conversations/:id/resolve    # Marquer résolu
POST   /whatsapp/conversations/:id/handoff    # Bot → Humain

# Templates
GET    /whatsapp/templates
POST   /whatsapp/templates             # Soumettre template pour approbation Meta
GET    /whatsapp/templates/:id

# Chatbot
GET    /whatsapp/chatbot/flows
POST   /whatsapp/chatbot/flows
PUT    /whatsapp/chatbot/flows/:id
POST   /whatsapp/chatbot/flows/:id/activate

# Webhook Meta (URL publique)
GET    /webhook/meta                   # Vérification webhook Meta
POST   /webhook/meta                   # Réception messages entrants
```

## Variables d'Environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/whatsapp_db
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092
AUTH_SERVICE_URL=http://auth-service:3001
AI_SERVICE_URL=http://ai-service:3005

META_APP_ID=
META_APP_SECRET=
META_WEBHOOK_VERIFY_TOKEN=random-secure-token

# Chiffrement tokens d'accès Meta
ENCRYPTION_KEY=your-32-byte-key
```

## Critères de Succès

- [ ] Webhook Meta reçoit et valide les messages entrants
- [ ] Envoi message texte via API à un numéro WhatsApp
- [ ] Broadcast template approuvé à 100 contacts
- [ ] Chatbot répond automatiquement aux mots-clés configurés
- [ ] Handoff Bot → Agent déclenché correctement
- [ ] Inbox multi-agents : 2 agents voient les conversations en temps réel
- [ ] Statut lu (double coche bleue) mis à jour en temps réel
