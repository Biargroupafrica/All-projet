# Prompt: Actor CallCenter Service - Microservice Centre d'Appels Cloud

## Contexte
Tu es un développeur senior spécialisé en téléphonie VoIP et communications temps réel. Tu dois créer le microservice **Actor CallCenter** pour la plateforme Actor Hub. C'est le module phare de la plateforme CPaaS, offrant un centre d'appels cloud complet.

## Mission
Créer un microservice de centre d'appels cloud autonome intégrant VoIP, WebRTC, SIP, IVR, ACD, et enregistrement d'appels avec supervision en temps réel.

## Spécifications techniques

### Stack
- **Runtime** : Node.js 20+ / NestJS
- **Temps réel** : WebSocket (Socket.IO), WebRTC
- **Protocole VoIP** : SIP via Twilio/Plivo SDK
- **Base de données** : PostgreSQL (schéma `callcenter`)
- **Cache/Queue** : Redis (files d'attente, état agents)
- **Stockage** : S3/Cloudflare R2 (enregistrements)
- **ORM** : Prisma

### Schéma de base de données
```sql
CREATE SCHEMA callcenter;

CREATE TABLE callcenter.extensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  extension_number VARCHAR(10) NOT NULL,
  sip_username VARCHAR(100),
  sip_password VARCHAR(100),
  did_number VARCHAR(20),
  status VARCHAR(20) DEFAULT 'offline', -- online, offline, busy, away, dnd
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, extension_number)
);

CREATE TABLE callcenter.queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  strategy VARCHAR(50) DEFAULT 'round_robin', -- round_robin, least_recent, random, skill_based
  max_wait_time INTEGER DEFAULT 300,
  max_callers INTEGER DEFAULT 50,
  music_on_hold_url TEXT,
  wrap_up_time INTEGER DEFAULT 30,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE callcenter.queue_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id UUID REFERENCES callcenter.queues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  priority INTEGER DEFAULT 1,
  skills JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE callcenter.ivr_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  flow_data JSONB NOT NULL, -- Arbre de décision IVR
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE callcenter.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  external_id VARCHAR(255), -- ID du provider (Twilio SID)
  direction VARCHAR(10) NOT NULL, -- inbound, outbound
  from_number VARCHAR(20) NOT NULL,
  to_number VARCHAR(20) NOT NULL,
  agent_id UUID,
  queue_id UUID REFERENCES callcenter.queues(id),
  status VARCHAR(30) DEFAULT 'initiated', -- initiated, ringing, in_progress, on_hold, completed, failed, no_answer, busy
  duration INTEGER DEFAULT 0,
  wait_time INTEGER DEFAULT 0,
  talk_time INTEGER DEFAULT 0,
  hold_time INTEGER DEFAULT 0,
  disposition VARCHAR(100),
  notes TEXT,
  tags TEXT[],
  recording_url TEXT,
  recording_duration INTEGER,
  transcription TEXT,
  ai_sentiment VARCHAR(20), -- positive, neutral, negative
  ai_summary TEXT,
  started_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE callcenter.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL, -- predictive, progressive, preview, power
  status VARCHAR(20) DEFAULT 'draft', -- draft, active, paused, completed
  contacts_list_id UUID,
  script_id UUID,
  caller_id VARCHAR(20),
  max_concurrent_calls INTEGER DEFAULT 3,
  ratio DECIMAL(3,1) DEFAULT 1.0,
  start_time TIME,
  end_time TIME,
  timezone VARCHAR(50) DEFAULT 'Africa/Brazzaville',
  total_contacts INTEGER DEFAULT 0,
  contacted INTEGER DEFAULT 0,
  answered INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE callcenter.call_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  content JSONB NOT NULL, -- Script structuré avec branches
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE callcenter.disposition_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  code VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  is_final BOOLEAN DEFAULT false,
  schedule_callback BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE callcenter.agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  agent_id UUID NOT NULL,
  date DATE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  answered_calls INTEGER DEFAULT 0,
  missed_calls INTEGER DEFAULT 0,
  total_talk_time INTEGER DEFAULT 0,
  total_hold_time INTEGER DEFAULT 0,
  total_wrap_up_time INTEGER DEFAULT 0,
  avg_handle_time DECIMAL(10,2),
  avg_wait_time DECIMAL(10,2),
  first_call_resolution_rate DECIMAL(5,2),
  customer_satisfaction_score DECIMAL(3,2),
  UNIQUE(tenant_id, agent_id, date)
);
```

### Endpoints API
```
# Appels
POST   /api/v1/calls/outbound           # Passer un appel sortant
POST   /api/v1/calls/:id/answer         # Répondre à un appel
POST   /api/v1/calls/:id/hold           # Mettre en attente
POST   /api/v1/calls/:id/transfer       # Transférer
POST   /api/v1/calls/:id/conference     # Conférence
POST   /api/v1/calls/:id/hangup         # Raccrocher
GET    /api/v1/calls                     # Historique des appels
GET    /api/v1/calls/:id                 # Détail d'un appel
GET    /api/v1/calls/:id/recording      # Télécharger enregistrement
GET    /api/v1/calls/live                # Appels en cours (temps réel)

# Files d'attente
GET    /api/v1/queues                    # Lister les files
POST   /api/v1/queues                    # Créer une file
PUT    /api/v1/queues/:id                # Modifier
DELETE /api/v1/queues/:id                # Supprimer
GET    /api/v1/queues/:id/stats          # Statistiques
POST   /api/v1/queues/:id/agents        # Ajouter un agent

# IVR
GET    /api/v1/ivr                       # Lister les IVR
POST   /api/v1/ivr                       # Créer un IVR
PUT    /api/v1/ivr/:id                   # Modifier
DELETE /api/v1/ivr/:id                   # Supprimer
POST   /api/v1/ivr/:id/test             # Tester un flux IVR

# Agents
GET    /api/v1/agents                    # Lister les agents
GET    /api/v1/agents/:id/status         # Statut agent
PUT    /api/v1/agents/:id/status         # Changer statut
GET    /api/v1/agents/:id/metrics        # Métriques agent
GET    /api/v1/agents/dashboard          # Dashboard superviseur

# Extensions
GET    /api/v1/extensions                # Lister
POST   /api/v1/extensions                # Créer
PUT    /api/v1/extensions/:id            # Modifier
DELETE /api/v1/extensions/:id            # Supprimer

# Campagnes sortantes
GET    /api/v1/campaigns                 # Lister
POST   /api/v1/campaigns                 # Créer
PUT    /api/v1/campaigns/:id             # Modifier
POST   /api/v1/campaigns/:id/start       # Démarrer
POST   /api/v1/campaigns/:id/pause       # Pause
POST   /api/v1/campaigns/:id/stop        # Arrêter

# Scripts d'appel
GET    /api/v1/scripts                   # Lister
POST   /api/v1/scripts                   # Créer
PUT    /api/v1/scripts/:id               # Modifier

# Supervision
GET    /api/v1/supervision/wallboard     # Wallboard temps réel
GET    /api/v1/supervision/metrics       # Métriques globales
POST   /api/v1/supervision/whisper/:callId  # Chuchoter
POST   /api/v1/supervision/barge/:callId    # Intervenir
POST   /api/v1/supervision/listen/:callId   # Écouter

# Webhooks Twilio/SIP
POST   /api/v1/webhooks/voice/incoming   # Appel entrant
POST   /api/v1/webhooks/voice/status     # Statut appel
POST   /api/v1/webhooks/recording/complete # Enregistrement terminé
```

### WebSocket Events (temps réel)
```typescript
// Événements émis vers le frontend
'agent:status_changed'        // Changement statut agent
'call:incoming'               // Appel entrant
'call:status_changed'         // Changement statut appel
'call:ended'                  // Appel terminé
'queue:updated'               // Mise à jour file d'attente
'queue:caller_waiting'        // Nouvel appelant en attente
'wallboard:metrics_updated'   // Métriques wallboard
'campaign:progress_updated'   // Progression campagne
'notification:agent'          // Notification agent
```

### Événements Message Broker
```typescript
'callcenter.call.initiated'        // { callId, tenantId, direction, from, to }
'callcenter.call.answered'         // { callId, agentId, waitTime }
'callcenter.call.ended'            // { callId, duration, disposition }
'callcenter.call.recorded'         // { callId, recordingUrl, duration }
'callcenter.agent.status_changed'  // { agentId, oldStatus, newStatus }
'callcenter.queue.threshold'       // { queueId, waitingCallers, avgWait }
'callcenter.campaign.completed'    // { campaignId, stats }
```

## Critères d'acceptation
- [ ] Softphone WebRTC fonctionnel (appels entrants/sortants)
- [ ] Intégration SIP Gateway (Twilio/Plivo)
- [ ] Files d'attente avec stratégies de routage (round robin, skill-based)
- [ ] IVR Builder avec flux visuels
- [ ] Enregistrement automatique des appels
- [ ] Wallboard supervision temps réel
- [ ] Dialers : predictive, progressive, preview, power
- [ ] Scripts d'appel dynamiques
- [ ] Métriques et KPIs en temps réel
- [ ] Whisper/Barge/Listen pour superviseurs
- [ ] Tests unitaires et d'intégration (couverture > 80%)
- [ ] Documentation OpenAPI/Swagger
