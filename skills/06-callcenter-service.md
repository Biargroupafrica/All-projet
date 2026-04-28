# Skill : Call Center Service — ACTOR Hub

## Scénario d'utilisation
Développer le microservice Centre d'Appels WebRTC (`services/callcenter-service/`).

## Contexte Métier
Centre d'appels cloud complet, 100% navigateur (sans plugin). Supporte :
- De 1 à 10 000+ agents simultanés
- Appels entrants (Inbound) et sortants (Outbound)
- Supervision temps réel (écoute, chuchotement)
- Enregistrement + Transcription IA
- Analyse de sentiment en temps réel

## Composants Techniques

### Couche SIP/Téléphonie
- **FreeSWITCH** ou **Asterisk** : PBX cloud (SIP, SDP, RTP)
- **mediasoup** : SFU WebRTC pour Softphone navigateur
- **PSTN Gateway** : pour appels vers téléphones classiques

### Couche Applicative (ce service)
- Gestion des agents, files d'attente, campagnes
- IVR Builder (workflow JSON → arbre DTMF/TTS)
- Dialers (Power, Predictive, Progressive, Preview)
- Supervision et rapports

## Types de Dialers

| Dialer | Description | Usage |
|--------|-------------|-------|
| Preview | Agent voit fiche avant de décider d'appeler | Ventes complexes |
| Progressive | Appel déclenché automatiquement quand agent libre | Équilibre qualité/volume |
| Power | Ratio N appels par agent libre | Volume moyen |
| Predictive | Algorithme ML prévoit disponibilité agent | Volume massif |

## Structure de Fichiers

```
services/callcenter-service/
├── src/
│   ├── app.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts            # État agents temps réel
│   │   └── env.ts
│   ├── modules/
│   │   ├── agents/
│   │   │   ├── agents.router.ts
│   │   │   ├── agents.controller.ts
│   │   │   └── agents.service.ts
│   │   ├── calls/
│   │   │   ├── calls.router.ts
│   │   │   ├── calls.controller.ts
│   │   │   └── calls.service.ts
│   │   ├── queues/
│   │   │   ├── queues.router.ts  # Files d'attente ACD
│   │   │   └── queues.service.ts
│   │   ├── ivr/
│   │   │   ├── ivr.router.ts
│   │   │   ├── ivr.service.ts
│   │   │   └── ivr.builder.ts    # JSON → FreeSWITCH XML
│   │   ├── campaigns/
│   │   │   ├── campaigns.router.ts
│   │   │   ├── campaigns.controller.ts
│   │   │   └── campaigns.service.ts
│   │   ├── dialers/
│   │   │   ├── power.dialer.ts
│   │   │   ├── predictive.dialer.ts
│   │   │   ├── progressive.dialer.ts
│   │   │   └── preview.dialer.ts
│   │   ├── supervision/
│   │   │   ├── supervision.router.ts  # Écoute, chuchotement, barge
│   │   │   └── supervision.service.ts
│   │   ├── recordings/
│   │   │   └── recordings.service.ts  # Upload S3, triggers transcription
│   │   └── numbers/
│   │       ├── numbers.router.ts      # Numéros DID achetés/loués
│   │       └── numbers.service.ts
│   ├── realtime/
│   │   ├── websocket.ts               # Socket.io : dashboard supervision
│   │   └── events.ts                  # Événements temps réel agents
│   ├── freeswitch/
│   │   ├── esl.client.ts              # Event Socket Library
│   │   └── xml.builder.ts             # Génération XML dialplan
│   └── db/
│       ├── schema.ts
│       └── migrations/
├── openapi.yaml
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Schéma Base de Données

```sql
-- Agents
CREATE TABLE cc_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  user_id UUID NOT NULL,              -- Lié à auth-service
  extension VARCHAR(20),              -- Extension SIP interne
  sip_username VARCHAR(255),
  sip_password_encrypted TEXT,
  skills TEXT[] DEFAULT '{}',         -- Compétences pour routage
  max_concurrent_calls INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'offline', -- offline, available, busy, away, on_break
  status_since TIMESTAMPTZ,
  queue_ids UUID[] DEFAULT '{}',      -- Files assignées
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Files d'Attente (ACD)
CREATE TABLE cc_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  strategy VARCHAR(50) DEFAULT 'round_robin', -- round_robin, least_busy, skills_based, priority
  max_wait_time INTEGER DEFAULT 300,   -- secondes
  max_queue_size INTEGER DEFAULT 50,
  ivr_id UUID REFERENCES cc_ivrs(id), -- IVR avant mise en file
  music_on_hold_url TEXT,
  announcement_interval INTEGER DEFAULT 60, -- secondes entre annonces
  callback_enabled BOOLEAN DEFAULT FALSE,
  agent_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appels
CREATE TABLE cc_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  call_uuid VARCHAR(255) UNIQUE,      -- UUID FreeSWITCH
  direction VARCHAR(10) NOT NULL,     -- 'inbound', 'outbound'
  from_number VARCHAR(50) NOT NULL,
  to_number VARCHAR(50) NOT NULL,
  agent_id UUID REFERENCES cc_agents(id),
  queue_id UUID REFERENCES cc_queues(id),
  campaign_id UUID REFERENCES cc_campaigns(id),
  status VARCHAR(50) DEFAULT 'ringing', -- ringing, in_progress, answered, completed, failed, abandoned
  duration INTEGER,                   -- secondes totales
  talk_time INTEGER,                  -- secondes en communication
  wait_time INTEGER,                  -- secondes en file d'attente
  hold_time INTEGER,                  -- secondes en mise en attente
  disposition VARCHAR(100),           -- Qualification : 'vente', 'rappel', 'refus', etc.
  recording_url TEXT,                 -- S3 URL
  transcript_id UUID,                 -- Lien vers ai-service
  sentiment_score DECIMAL(3,2),       -- -1.0 à 1.0
  started_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  cost DECIMAL(10,6),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IVR (Répondeurs Interactifs)
CREATE TABLE cc_ivrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  flow JSONB NOT NULL,                -- Arbre de décision JSON
  entry_number VARCHAR(50),           -- Numéro DID attaché
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campagnes Outbound
CREATE TABLE cc_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  dialer_type VARCHAR(20) DEFAULT 'preview', -- preview, progressive, power, predictive
  caller_id VARCHAR(50) NOT NULL,
  contact_list_id UUID,
  script TEXT,                        -- Script affiché à l'agent
  max_attempts INTEGER DEFAULT 3,
  retry_delay INTEGER DEFAULT 3600,   -- secondes entre tentatives
  schedule JSONB DEFAULT '{}',        -- Plages horaires autorisées
  call_ratio DECIMAL(3,1) DEFAULT 1.2, -- Pour predictive (appels/agent)
  status VARCHAR(50) DEFAULT 'draft',
  total_contacts INTEGER DEFAULT 0,
  contacted_count INTEGER DEFAULT 0,
  answered_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Numéros DID (Direct Inward Dialing)
CREATE TABLE cc_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  number VARCHAR(50) NOT NULL UNIQUE,
  country_code VARCHAR(5) NOT NULL,
  number_type VARCHAR(20) DEFAULT 'local', -- local, toll_free, mobile
  provider VARCHAR(50),               -- 'twilio', 'bandwidth', 'telnyx'
  monthly_cost DECIMAL(10,2),
  assigned_to VARCHAR(50),            -- 'ivr', 'queue', 'agent'
  assigned_id UUID,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Endpoints API

```
# Agents
GET    /callcenter/agents
POST   /callcenter/agents
GET    /callcenter/agents/:id
PUT    /callcenter/agents/:id
POST   /callcenter/agents/:id/status  # Changer statut (available, away, break)

# Files d'attente
GET    /callcenter/queues
POST   /callcenter/queues
PUT    /callcenter/queues/:id
GET    /callcenter/queues/:id/stats   # Stats temps réel (appelants en attente, agents dispo)

# Appels
GET    /callcenter/calls              # Historique
POST   /callcenter/calls/outbound     # Initier appel sortant
GET    /callcenter/calls/:id
PUT    /callcenter/calls/:id          # Qualifier, noter
POST   /callcenter/calls/:id/hold     # Mettre en attente
POST   /callcenter/calls/:id/transfer # Transfert
POST   /callcenter/calls/:id/end

# IVR
GET    /callcenter/ivr
POST   /callcenter/ivr
PUT    /callcenter/ivr/:id
GET    /callcenter/ivr/:id/test       # Tester IVR en simulation

# Campagnes
GET    /callcenter/campaigns
POST   /callcenter/campaigns
PUT    /callcenter/campaigns/:id
POST   /callcenter/campaigns/:id/start
POST   /callcenter/campaigns/:id/pause
GET    /callcenter/campaigns/:id/stats

# Supervision (WebSocket pour temps réel)
GET    /callcenter/supervision/dashboard  # État global temps réel
POST   /callcenter/supervision/listen/:callId     # Écouter appel
POST   /callcenter/supervision/whisper/:callId    # Chuchoter à l'agent
POST   /callcenter/supervision/barge/:callId      # Rejoindre la conversation

# Numéros
GET    /callcenter/numbers
POST   /callcenter/numbers/search     # Rechercher numéros disponibles
POST   /callcenter/numbers/buy        # Acheter numéro
DELETE /callcenter/numbers/:id        # Libérer numéro

# Enregistrements
GET    /callcenter/recordings
GET    /callcenter/recordings/:id/download
GET    /callcenter/recordings/:id/transcript
```

## WebSocket Events (Supervision Temps Réel)

```typescript
// Client → Serveur
type ClientEvent =
  | { event: 'join_supervision'; payload: { orgId: string; token: string } }
  | { event: 'listen_call'; payload: { callId: string } }
  | { event: 'whisper'; payload: { callId: string; message: string } }

// Serveur → Client
type ServerEvent =
  | { event: 'agent_status_change'; payload: { agentId: string; status: string; since: string } }
  | { event: 'call_started'; payload: { callId: string; agentId: string; from: string; to: string } }
  | { event: 'call_ended'; payload: { callId: string; duration: number; disposition: string } }
  | { event: 'queue_update'; payload: { queueId: string; waitingCount: number; avgWait: number } }
  | { event: 'sentiment_update'; payload: { callId: string; sentiment: number; keywords: string[] } }
```

## Critères de Succès

- [ ] Agent peut se connecter via Softphone WebRTC depuis un navigateur
- [ ] Appel entrant routé vers la bonne file, agent averti
- [ ] IVR simple (3 options DTMF) fonctionnel
- [ ] Campagne Progressive Dialer lancée sur 100 contacts
- [ ] Superviseur écoute un appel en cours sans être entendu
- [ ] Enregistrement déclenché automatiquement et accessible en replay
- [ ] Transcription disponible 60s après fin d'appel (via ai-service)
- [ ] Dashboard supervision montre l'état temps réel de tous les agents
