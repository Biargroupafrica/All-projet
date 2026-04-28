# Skill : Call Center Service – Actor Hub CPaaS

## Quand utiliser ce skill
Utiliser pour tout travail sur `services/call-center-service/` :
- SVI / IVR (arbre d'appels, menus DTMF, TTS/ASR)
- ACD (Automatic Call Distribution) : files d'attente, routage, priorités
- Enregistrement d'appels (conformité RGPD)
- Supervision temps réel (dashboard live, écoute discrète, chuchotement)
- Rapports et statistiques (FCR, AHT, CSAT, occupancy)
- WebRTC (appels navigateur-à-navigateur ou navigateur-à-PSTN)
- Intégrations CRM (contacts, tickets automatiques)

---

## Architecture du service

```
services/call-center-service/
├── src/
│   ├── server.ts
│   ├── routes/
│   │   ├── calls.routes.ts          # CRUD appels, historique
│   │   ├── queues.routes.ts         # Gestion files d'attente
│   │   ├── agents.routes.ts         # Statuts agents (disponible/occupé/pause)
│   │   ├── ivr.routes.ts            # Éditeur IVR (arbre d'appel JSON)
│   │   ├── recordings.routes.ts     # Accès aux enregistrements
│   │   ├── supervision.routes.ts    # Temps réel (WebSocket)
│   │   └── reports.routes.ts        # KPIs, exports CSV/PDF
│   ├── services/
│   │   ├── asterisk.service.ts      # AMI (Asterisk Manager Interface)
│   │   ├── webrtc.service.ts        # Signaling WebRTC (mediasoup / daily.co)
│   │   ├── ivr.service.ts           # Moteur IVR
│   │   ├── acd.service.ts           # Logique de routage ACD
│   │   ├── recording.service.ts     # Gestion des enregistrements
│   │   └── analytics.service.ts     # Calcul KPIs temps réel
│   ├── events/
│   │   ├── call.events.ts           # Events publiés sur RabbitMQ
│   │   └── agent.events.ts
│   ├── db/
│   │   └── schema.ts
│   └── config/
│       └── env.ts
├── tests/
├── Dockerfile
└── openapi.yaml
```

---

## Schéma de données

```typescript
// db/schema.ts
export const calls = pgTable('calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  callId: text('call_id').notNull(),              // ID Asterisk
  direction: text('direction').notNull(),          // inbound | outbound
  status: text('status').notNull(),               // queued | ringing | active | completed | missed
  callerNumber: text('caller_number').notNull(),
  calledNumber: text('called_number').notNull(),
  agentId: uuid('agent_id').references(() => agents.id),
  queueId: uuid('queue_id'),
  ivNodeId: text('iv_node_id'),                   // Nœud IVR actuel
  startedAt: timestamp('started_at'),
  answeredAt: timestamp('answered_at'),
  endedAt: timestamp('ended_at'),
  duration: integer('duration'),                   // secondes
  recordingUrl: text('recording_url'),
  disposition: text('disposition'),               // answered | no-answer | busy | failed
  crmTicketId: text('crm_ticket_id'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
})

export const queues = pgTable('queues', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  name: text('name').notNull(),
  strategy: text('strategy').default('ringall'),  // ringall | leastrecent | fewestcalls | rrmemory
  maxWaitTime: integer('max_wait_time').default(300),
  musicOnHold: text('music_on_hold'),
  ivrId: uuid('ivr_id'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  userId: uuid('user_id').notNull(),
  extension: text('extension').notNull(),
  status: text('status').default('offline'),       // available | busy | paused | offline
  skills: jsonb('skills').default([]),             // pour routage basé compétences
  maxConcurrentCalls: integer('max_concurrent_calls').default(1),
  createdAt: timestamp('created_at').defaultNow(),
})
```

---

## IVR – Structure JSON

```json
{
  "id": "ivr_main",
  "name": "Menu principal",
  "tenantId": "tenant-uuid",
  "nodes": [
    {
      "id": "node_welcome",
      "type": "play",
      "audio": "welcome.wav",
      "next": "node_menu"
    },
    {
      "id": "node_menu",
      "type": "gather",
      "prompt": "Tapez 1 pour le service commercial, 2 pour le support technique.",
      "timeout": 10,
      "numDigits": 1,
      "options": {
        "1": "node_sales",
        "2": "node_support",
        "timeout": "node_menu",
        "invalid": "node_menu"
      }
    },
    {
      "id": "node_sales",
      "type": "queue",
      "queueId": "queue-sales-uuid",
      "waitMessage": "Tous nos conseillers sont occupés, veuillez patienter.",
      "fallback": "node_voicemail"
    }
  ]
}
```

---

## WebSocket – Supervision temps réel

```typescript
// Events émis vers le dashboard de supervision
interface SupervisionEvent {
  type: 
    | 'agent_status_changed'
    | 'call_started'
    | 'call_answered'
    | 'call_ended'
    | 'queue_updated'
    | 'kpi_updated'
  tenantId: string
  payload: Record<string, unknown>
  timestamp: string
}

// Métriques KPI temps réel
interface QueueKPI {
  queueId: string
  queueName: string
  callsWaiting: number
  agentsAvailable: number
  agentsBusy: number
  longestWaitTime: number      // secondes
  averageHandleTime: number    // secondes
  serviceLevelPercent: number  // % appels répondus en < 20s
}
```

---

## Variables d'environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/callcenter_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
ASTERISK_HOST=localhost
ASTERISK_AMI_PORT=5038
ASTERISK_AMI_USER=admin
ASTERISK_AMI_SECRET=secret
WEBRTC_ICE_SERVERS=[{"urls":"stun:stun.l.google.com:19302"}]
RECORDING_STORAGE_URL=s3://bucket/recordings
RECORDING_STORAGE_KEY=
RECORDING_STORAGE_SECRET=
CRM_SERVICE_URL=http://crm-service:3006
AUTH_SERVICE_URL=http://auth-service:3001
PORT=3003
```

---

## Endpoints API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/calls` | Historique des appels (filtré par date, agent, status) |
| GET | `/calls/:id` | Détail d'un appel |
| POST | `/calls/outbound` | Initier un appel sortant (click-to-call) |
| GET | `/calls/:id/recording` | URL signée d'enregistrement |
| GET | `/queues` | Liste des files d'attente |
| POST | `/queues` | Créer une file d'attente |
| PUT | `/queues/:id` | Modifier une file d'attente |
| GET | `/agents` | Liste des agents et leurs statuts |
| PUT | `/agents/:id/status` | Changer le statut d'un agent |
| GET | `/ivr` | Liste des IVR du tenant |
| POST | `/ivr` | Créer un IVR |
| PUT | `/ivr/:id` | Modifier un IVR |
| GET | `/reports/daily` | Rapport journalier KPIs |
| GET | `/reports/agent/:id` | Performance d'un agent |
| WS | `/supervision` | Stream temps réel WebSocket |

---

## Tests

```bash
pnpm --filter @actor-hub/call-center-service test
pnpm --filter @actor-hub/call-center-service test:int
```

---

## Checklist avant PR

- [ ] IVR : arbre d'appel fonctionnel (DTMF + TTS)
- [ ] ACD : stratégie de routage configurée et testée
- [ ] Enregistrements : chiffrés au repos, accès RBAC
- [ ] WebSocket supervision : événements émis correctement
- [ ] Multi-tenant isolation : un tenant ne voit pas les données d'un autre
- [ ] RGPD : durée de rétention des enregistrements configurable par tenant
- [ ] Tests de charge : 100 appels concurrents minimum
