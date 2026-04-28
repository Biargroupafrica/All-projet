# Prompt: ms-call-center - Centre d'Appels Cloud

## Rôle
Tu es un développeur backend senior spécialisé en télécommunications VoIP et WebRTC. Tu dois créer le microservice `ms-call-center` pour la plateforme Actor Hub.

## Mission
Créer un centre d'appels cloud complet avec softphone WebRTC intégré, IVR visuel, ACD, routage intelligent, enregistrement, supervision temps réel et IA.

## Spécifications techniques

### Stack
- **Framework:** NestJS + Socket.io (temps réel)
- **Port:** 8003
- **Base de données:** PostgreSQL - schema `callcenter`
- **Protocoles:** SIP, RTP, WebRTC
- **Provider VoIP:** Twilio / Plivo (configurable)

### Modules du Call Center

1. **Softphone WebRTC**
   - Appels entrants/sortants depuis le navigateur
   - Mise en attente, transfert, conférence
   - Mute, DTMF
   - Statut agent: Available, Busy, Away, Offline

2. **IVR (Interactive Voice Response)**
   - Constructeur visuel drag & drop (côté frontend)
   - Moteur d'exécution IVR côté backend
   - Blocs: Menu, Annonce, Routage, Horaires, Condition, API Call
   - Text-to-Speech multi-langue
   - Reconnaissance vocale (optionnel)

3. **ACD (Automatic Call Distribution)**
   - Routage round-robin, least-occupied, skill-based
   - Files d'attente avec musique d'attente
   - Priorité par numéro appelant
   - Overflow rules (débordement vers autre file)

4. **Campagnes sortantes**
   - Preview Dialer: prévisualisation fiche avant appel
   - Power Dialer: appel automatique séquentiel
   - Predictive Dialer: appels simultanés avec prédiction d'abandon

5. **Enregistrement & Monitoring**
   - Enregistrement automatique de tous les appels
   - Écoute en direct (whisper, barge-in, listen)
   - Transcription automatique (Whisper API)
   - Analyse de sentiment IA

6. **Scripts d'appel**
   - Scripts guidés par étapes
   - Variables dynamiques (nom client, historique)
   - Codes de disposition (résultat de l'appel)

### Schéma Base de Données
```sql
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  agent_id UUID,
  from_number VARCHAR(20) NOT NULL,
  to_number VARCHAR(20) NOT NULL,
  direction VARCHAR(10) NOT NULL, -- inbound, outbound
  status VARCHAR(20) NOT NULL DEFAULT 'initiated',
  duration INTEGER DEFAULT 0,
  wait_time INTEGER DEFAULT 0,
  recording_url TEXT,
  transcription TEXT,
  sentiment_score DECIMAL(3,2),
  disposition_code VARCHAR(50),
  ivr_path JSONB,
  provider_call_sid VARCHAR(255),
  queue_id UUID,
  campaign_id UUID,
  metadata JSONB,
  started_at TIMESTAMP,
  answered_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  extension VARCHAR(10),
  status VARCHAR(20) DEFAULT 'offline',
  skills JSONB DEFAULT '[]',
  max_concurrent_calls INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  strategy VARCHAR(50) DEFAULT 'round_robin',
  max_wait_time INTEGER DEFAULT 300,
  music_on_hold_url TEXT,
  overflow_queue_id UUID,
  agents UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE ivr_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  flow_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL, -- preview, power, predictive
  contact_list_id UUID,
  script_id UUID,
  status VARCHAR(20) DEFAULT 'draft',
  total_contacts INTEGER DEFAULT 0,
  dialed_count INTEGER DEFAULT 0,
  answered_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE call_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  steps JSONB NOT NULL,
  disposition_codes JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
```
POST   /api/v1/calls/initiate          # Initier un appel
POST   /api/v1/calls/:id/answer        # Répondre à un appel
POST   /api/v1/calls/:id/hold          # Mise en attente
POST   /api/v1/calls/:id/transfer      # Transférer
POST   /api/v1/calls/:id/end           # Raccrocher
GET    /api/v1/calls/history            # Historique
GET    /api/v1/calls/:id/recording      # Enregistrement

POST   /api/v1/agents/:id/status       # Changer statut agent
GET    /api/v1/agents/online            # Agents en ligne

CRUD   /api/v1/queues                   # Files d'attente
CRUD   /api/v1/ivr                      # Flux IVR
CRUD   /api/v1/campaigns               # Campagnes sortantes
CRUD   /api/v1/scripts                  # Scripts d'appel

GET    /api/v1/calls/live               # Dashboard temps réel (WebSocket)
GET    /api/v1/calls/analytics          # Analytics
```

### Events publiés
```
call.initiated  → { callId, from, to, direction }
call.ringing    → { callId, agentId }
call.answered   → { callId, agentId, waitTime }
call.ended      → { callId, duration, disposition }
call.recorded   → { callId, recordingUrl }
agent.status    → { agentId, oldStatus, newStatus }
queue.updated   → { queueId, waitingCalls, avgWaitTime }
```

## Contraintes
- Latence audio < 150ms
- Support 500 appels simultanés par tenant Enterprise
- Enregistrements stockés 90 jours minimum
- Conformité PCI DSS pour les enregistrements de paiement par téléphone
