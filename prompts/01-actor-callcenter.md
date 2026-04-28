# Prompt Microservice : Actor CallCenter - Centre d'Appels Cloud

## Rôle

Tu es un développeur senior spécialisé en VoIP/WebRTC et centres d'appels cloud. Tu construis le microservice **Actor CallCenter**, un centre d'appels cloud complet et autonome pour la plateforme Actor Hub.

## Description du Microservice

Actor CallCenter est une solution de centre d'appels cloud offrant :
- Un softphone WebRTC intégré au navigateur
- Un IVR (Serveur Vocal Interactif) configurable visuellement
- Un routage d'appels intelligent (ACD, skill-based)
- Des dialers automatisés (Power, Predictive, Preview)
- Une supervision en temps réel
- L'enregistrement et l'analyse IA des appels
- Une intégration CTI/CRM

## Architecture Technique

```
┌──────────────────────────────────────────────────────────┐
│                  ACTOR CALLCENTER                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (React)                                        │
│  ├── SoftphoneEnhanced      (WebRTC Softphone)          │
│  ├── CallCenterLiveDashboard (Dashboard temps réel)     │
│  ├── CallCenterSupervision   (Vue superviseur)          │
│  ├── IvrSystemEnhanced       (IVR Builder visuel)       │
│  ├── CallRoutingAdvanced     (Routage intelligent)      │
│  ├── QueueManagement         (Files d'attente)          │
│  ├── OutboundCampaigns       (Campagnes sortantes)      │
│  ├── PowerDialer / PredictiveDialer / PreviewDialer     │
│  ├── CallRecording           (Enregistrements)          │
│  ├── LiveMonitoring          (Écoute en direct)         │
│  ├── AgentManagement         (Gestion des agents)       │
│  ├── CallHistory             (Historique)               │
│  ├── AiFeaturesEnhanced      (IA & Coaching)            │
│  └── CtiIntegrationEnhanced  (CTI/CRM)                 │
│                                                          │
│  Backend (Edge Functions + Services)                     │
│  ├── WebRTC Signaling Server  (Socket.io/WebSocket)     │
│  ├── SIP Gateway Integration  (Twilio/Plivo/Nexmo)      │
│  ├── Call Routing Engine       (ACD + Skill-Based)       │
│  ├── IVR Flow Engine           (Exécution des flux)      │
│  ├── Recording Service         (Capture + Storage)       │
│  ├── Queue Manager             (Files d'attente)         │
│  ├── Campaign Engine           (Dialer automation)       │
│  ├── AI Analysis Service       (Transcription + NLP)     │
│  └── Real-time Analytics       (WebSocket + Aggregation) │
│                                                          │
│  Passerelle                                              │
│  └── SIP Gateway Config (/dashboard/sip-gateway-config) │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Tables Base de Données

```sql
-- Appels
calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  call_type TEXT NOT NULL CHECK (call_type IN ('inbound', 'outbound', 'internal')),
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  agent_id UUID REFERENCES users(id),
  queue_id UUID REFERENCES call_queues(id),
  campaign_id UUID REFERENCES outbound_campaigns(id),
  status TEXT NOT NULL DEFAULT 'ringing' CHECK (status IN ('ringing', 'answered', 'on_hold', 'transferred', 'ended', 'missed', 'voicemail')),
  duration INTEGER DEFAULT 0,
  wait_time INTEGER DEFAULT 0,
  recording_url TEXT,
  disposition_code TEXT,
  notes TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  answered_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enregistrements
call_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES calls(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  file_url TEXT NOT NULL,
  duration INTEGER NOT NULL,
  file_size INTEGER,
  transcription TEXT,
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents
agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  extension TEXT,
  skills TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('available', 'busy', 'on_call', 'after_call_work', 'break', 'offline')),
  max_concurrent_calls INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files d'attente
call_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  strategy TEXT NOT NULL DEFAULT 'round_robin' CHECK (strategy IN ('round_robin', 'least_recent', 'fewest_calls', 'ring_all', 'skill_based', 'priority')),
  max_wait_time INTEGER DEFAULT 300,
  max_queue_size INTEGER DEFAULT 50,
  music_on_hold_url TEXT,
  welcome_message TEXT,
  timeout_destination TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IVR
ivr_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT false,
  flow_config JSONB NOT NULL,
  phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campagnes sortantes
outbound_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  dialer_type TEXT NOT NULL CHECK (dialer_type IN ('power', 'predictive', 'preview', 'manual')),
  contact_list_id UUID REFERENCES contact_lists(id),
  script_id UUID REFERENCES call_scripts(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed', 'cancelled')),
  calls_per_agent INTEGER DEFAULT 1,
  max_abandon_rate DECIMAL DEFAULT 3.0,
  caller_id TEXT,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  total_contacts INTEGER DEFAULT 0,
  contacted INTEGER DEFAULT 0,
  answered INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scripts agent
call_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  content JSONB NOT NULL,
  disposition_codes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extensions VoIP
extensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  number TEXT NOT NULL,
  agent_id UUID REFERENCES agents(id),
  type TEXT DEFAULT 'webrtc' CHECK (type IN ('webrtc', 'sip', 'pstn')),
  sip_credentials JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuration SIP
sip_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  host TEXT NOT NULL,
  port INTEGER DEFAULT 5060,
  username TEXT,
  password_encrypted TEXT,
  transport TEXT DEFAULT 'udp' CHECK (transport IN ('udp', 'tcp', 'tls', 'wss')),
  codecs TEXT[] DEFAULT '{G.711, G.729}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

```
# Appels
POST   /api/call-center/calls              # Initier un appel
GET    /api/call-center/calls              # Lister les appels
GET    /api/call-center/calls/:id          # Détails d'un appel
POST   /api/call-center/calls/:id/transfer # Transférer un appel
POST   /api/call-center/calls/:id/hold     # Mettre en attente
POST   /api/call-center/calls/:id/hangup   # Raccrocher

# Agents
GET    /api/call-center/agents             # Lister les agents
PUT    /api/call-center/agents/:id/status  # Changer statut agent
GET    /api/call-center/agents/:id/stats   # Stats agent

# Files d'attente
GET    /api/call-center/queues             # Lister les files
POST   /api/call-center/queues             # Créer une file
GET    /api/call-center/queues/:id/live    # État en temps réel

# IVR
GET    /api/call-center/ivr               # Lister les IVR
POST   /api/call-center/ivr               # Créer un IVR
PUT    /api/call-center/ivr/:id           # Modifier un IVR
POST   /api/call-center/ivr/:id/activate  # Activer un IVR

# Campagnes
POST   /api/call-center/campaigns         # Créer une campagne
GET    /api/call-center/campaigns         # Lister les campagnes
PUT    /api/call-center/campaigns/:id     # Modifier
POST   /api/call-center/campaigns/:id/start  # Démarrer
POST   /api/call-center/campaigns/:id/pause  # Pause

# Enregistrements
GET    /api/call-center/recordings        # Lister
GET    /api/call-center/recordings/:id    # Télécharger
POST   /api/call-center/recordings/:id/transcribe  # Transcrire (IA)

# Dashboard temps réel (WebSocket)
WS     /ws/call-center/live               # Dashboard live
WS     /ws/call-center/agent/:id          # État agent
WS     /ws/call-center/softphone/:id      # Softphone signaling
```

## Événements Émis

```typescript
type CallCenterEvent =
  | { type: 'call.ringing'; data: { callId, from, to, queueId } }
  | { type: 'call.answered'; data: { callId, agentId } }
  | { type: 'call.ended'; data: { callId, duration, disposition } }
  | { type: 'call.transferred'; data: { callId, fromAgentId, toAgentId } }
  | { type: 'call.recording_ready'; data: { callId, recordingUrl } }
  | { type: 'agent.status_changed'; data: { agentId, oldStatus, newStatus } }
  | { type: 'queue.caller_added'; data: { queueId, callId, position } }
  | { type: 'queue.caller_removed'; data: { queueId, callId, reason } }
  | { type: 'campaign.started'; data: { campaignId, totalContacts } }
  | { type: 'campaign.completed'; data: { campaignId, stats } }
  | { type: 'ivr.input_received'; data: { callId, ivrId, input } }
```

## Métriques Clés à Afficher

- Appels en cours / en attente / abandonnés
- Temps moyen d'attente (AWT)
- Temps moyen de traitement (AHT)
- Taux de réponse / taux d'abandon
- Disponibilité des agents
- SLA (Service Level Agreement)
- Qualité d'appel (MOS Score)
- Campagnes : progression, taux de contact, conversions

## Instructions Spécifiques

1. Utilise WebRTC pour le softphone navigateur (pas de plugin)
2. Le SIP Gateway doit supporter Twilio, Plivo et Nexmo
3. L'IVR Builder doit être visuel (drag & drop avec React Flow ou similaire)
4. Le routage doit supporter : round-robin, least-recent, skill-based, priority
5. Les dialers doivent respecter les réglementations (max abandon rate 3%)
6. L'IA doit analyser le sentiment et les mots-clés des appels enregistrés
7. Le dashboard temps réel doit utiliser WebSocket pour les mises à jour
8. Supporte la supervision (écoute discrète, chuchotement, intrusion)
