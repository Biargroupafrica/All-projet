# Skill : Voice Service – Actor Hub CPaaS

## Quand utiliser ce skill
Utiliser pour tout travail sur `services/voice-service/` :
- Click-to-call (appel depuis le web vers PSTN)
- Appels SIP (softphone, trunk SIP)
- WebRTC (appels navigateur)
- Text-to-Speech (TTS) dans les flux d'appels
- Speech-to-Text (STR / ASR) pour transcription
- Conférence téléphonique (multi-parties)
- Numéros virtuels (DID) gérés par tenant

---

## Architecture du service

```
services/voice-service/
├── src/
│   ├── server.ts
│   ├── routes/
│   │   ├── calls.routes.ts         # Click-to-call, statut
│   │   ├── conference.routes.ts    # Salles de conférence
│   │   ├── numbers.routes.ts       # DID / numéros virtuels
│   │   ├── tts.routes.ts           # Text-to-Speech
│   │   └── transcription.routes.ts # STT / transcription
│   ├── services/
│   │   ├── freeswitch.service.ts   # ESL (Event Socket Layer)
│   │   ├── webrtc.service.ts       # mediasoup / Janus gateway
│   │   ├── tts.service.ts          # Google TTS / ElevenLabs
│   │   ├── stt.service.ts          # Whisper / Google STT
│   │   └── did.service.ts          # Gestion numéros DID
│   ├── db/
│   │   └── schema.ts
│   └── config/
│       └── env.ts
├── Dockerfile
└── openapi.yaml
```

---

## Schéma de données

```typescript
export const voiceCalls = pgTable('voice_calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  type: text('type').notNull(),                    // click-to-call | webrtc | sip
  from: text('from').notNull(),
  to: text('to').notNull(),
  status: text('status').default('initiated'),
  duration: integer('duration'),
  cost: numeric('cost', { precision: 10, scale: 6 }),
  recordingUrl: text('recording_url'),
  transcriptionUrl: text('transcription_url'),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const virtualNumbers = pgTable('virtual_numbers', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  number: text('number').notNull().unique(),       // Format E.164
  country: text('country').notNull(),
  type: text('type').default('local'),             // local | mobile | tollfree
  monthlyFee: numeric('monthly_fee', { precision: 8, scale: 2 }),
  forwardTo: text('forward_to'),
  ivrId: uuid('ivr_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const conferences = pgTable('conferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull(),
  name: text('name').notNull(),
  pin: text('pin'),
  maxParticipants: integer('max_participants').default(50),
  recordEnabled: boolean('record_enabled').default(false),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

---

## Click-to-Call – Flow

```
Client Web  →  POST /voice/calls/click-to-call  →  Voice Service
Voice Service →  FreeSWITCH (originate)
FreeSWITCH  →  Compose l'agent (extension SIP/WebRTC)
              →  Compose le client externe (PSTN)
              →  Bridge les deux canaux
Voice Service ←  Events ESL (answer, hangup, dtmf…)
Voice Service →  RabbitMQ (call.started, call.ended)
```

---

## Variables d'environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/voice_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
FREESWITCH_HOST=localhost
FREESWITCH_ESL_PORT=8021
FREESWITCH_ESL_PASSWORD=ClueCon
MEDIASOUP_ANNOUNCED_IP=0.0.0.0
WEBRTC_TURN_URL=turn:turn.yourdomain.com
WEBRTC_TURN_USERNAME=
WEBRTC_TURN_PASSWORD=
GOOGLE_TTS_API_KEY=
GOOGLE_STT_API_KEY=
PORT=3005
```

---

## Endpoints API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/calls/click-to-call` | Initier un appel click-to-call |
| GET | `/calls/:id` | Statut d'un appel |
| DELETE | `/calls/:id` | Raccrocher un appel |
| GET | `/numbers` | Liste des numéros DID du tenant |
| POST | `/numbers/provision` | Provisionner un numéro |
| DELETE | `/numbers/:id` | Libérer un numéro |
| POST | `/conferences` | Créer une salle de conférence |
| GET | `/conferences/:id/participants` | Liste des participants |
| POST | `/tts/synthesize` | TTS à la demande |
| POST | `/transcription/start` | Démarrer la transcription d'un appel |

---

## Checklist avant PR

- [ ] Click-to-call : délai < 2s pour l'initiation
- [ ] WebRTC : STUN/TURN configurés pour NAT traversal
- [ ] TTS : cache des fichiers audio générés (S3 + CDN)
- [ ] Transcription : stockage sécurisé, accès RBAC
- [ ] Numéros DID : non partagés entre tenants
- [ ] Coûts à la minute calculés et stockés
