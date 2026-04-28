# Prompt : Générer callcenter-service complet

## Contexte
Tu vas créer le microservice Centre d'Appels pour ACTOR Hub. Ce service orchestre un centre d'appels cloud 100% navigateur (WebRTC) avec IVR, ACD, dialers intelligents et supervision temps réel.

Capacité : 1 à 10 000+ agents simultanés, intégration FreeSWITCH pour la couche SIP/PSTN.

## Stack
- Node.js 20 + Fastify 4
- Socket.io (WebSocket pour supervision temps réel)
- PostgreSQL (Drizzle ORM) + Redis (état temps réel agents)
- FreeSWITCH ESL (Event Socket Library) via `esl` npm package
- Kafka (événements inter-services)
- Zod, Vitest

## Architecture

```
Navigateur Agent (WebRTC)
        ↕ (médiasoup/TURN)
FreeSWITCH PBX
        ↕ (ESL)
callcenter-service (Fastify)
        ↕ (Socket.io)
Navigateur Superviseur
```

## Tâche

Génère le service complet `services/callcenter-service/` :

### 1. État Temps Réel des Agents (Redis)

Chaque agent a un état stocké en Redis avec TTL :
```typescript
// Key: agent:{orgId}:{agentId}
// TTL: 30 secondes (rafraîchi par heartbeat)
interface AgentState {
  status: 'offline' | 'available' | 'busy' | 'away' | 'on_break' | 'ringing' | 'on_call';
  currentCallId: string | null;
  queueIds: string[];
  since: string; // ISO timestamp
  extension: string;
}
```

Heartbeat : chaque agent envoie un `ping` Socket.io toutes les 15s, sinon TTL expire → status `offline`.

### 2. Module Agents (src/modules/agents/)

```typescript
// GET /callcenter/agents?status=available&queueId=xxx
// POST /callcenter/agents/:id/status → changer statut avec validation des transitions
// Transitions valides :
// offline → available (via login softphone)
// available → busy (quand appel reçu)
// busy → available (après raccrochage)
// available → away (pause)
// away → available (retour de pause)
```

### 3. IVR Builder (src/modules/ivr/)

Le flow IVR est stocké en JSON dans `cc_ivrs.flow` :
```json
{
  "nodes": [
    { "id": "welcome", "type": "play", "audio": "s3://bucket/welcome.mp3", "next": "menu" },
    { "id": "menu", "type": "gather", "prompt": "Tapez 1 pour...", "timeout": 5, "options": {
      "1": "queue_support",
      "2": "queue_sales",
      "0": "operator"
    }},
    { "id": "queue_support", "type": "queue", "queueId": "uuid-support" },
    { "id": "operator", "type": "transfer", "to": "+33612345678" }
  ],
  "entry": "welcome",
  "fallback": "goodbye"
}
```

`ivr.builder.ts` : convertit ce JSON en XML FreeSWITCH dialplan.

### 4. ACD — Automatic Call Distribution (src/modules/queues/)

```typescript
async function routeCallToAgent(callId: string, queueId: string): Promise<string | null> {
  const queue = await getQueue(queueId);
  
  // 1. Trouver agents disponibles pour cette file
  const availableAgents = await getAvailableAgents(queue.agentIds);
  
  // 2. Appliquer stratégie de routage
  let selectedAgent: Agent | null = null;
  switch (queue.strategy) {
    case 'round_robin':
      selectedAgent = roundRobin(availableAgents, queue.lastAgentIndex);
      break;
    case 'least_busy':
      selectedAgent = leastBusy(availableAgents); // Moins de calls aujourd'hui
      break;
    case 'skills_based':
      selectedAgent = skillsMatch(availableAgents, call.requiredSkills);
      break;
    case 'priority':
      selectedAgent = highestPriority(availableAgents);
      break;
  }
  
  if (!selectedAgent) {
    // Pas d'agent dispo → mettre en file
    await addToWaitingQueue(callId, queueId);
    await playQueueMusic(callId);
    return null;
  }
  
  await ringAgent(selectedAgent.id, callId);
  return selectedAgent.id;
}
```

Callbacks : si personne ne répond après `queue.max_wait_time`, proposer un callback.

### 5. FreeSWITCH ESL (src/freeswitch/esl.client.ts)

```typescript
class FreeSwitchClient {
  private connection: Connection;
  
  async connect(): Promise<void>
  
  async originateCall(from: string, to: string, callerId: string): Promise<string>
  async hangupCall(callUuid: string): Promise<void>
  async transferCall(callUuid: string, destination: string): Promise<void>
  async holdCall(callUuid: string): Promise<void>
  async recordCall(callUuid: string, filePath: string): Promise<void>
  async startEavesdrop(targetCallUuid: string, spyUuid: string): Promise<void>
  async startWhisper(targetCallUuid: string, spyUuid: string): Promise<void>
  
  on('CHANNEL_ANSWER', handler): void
  on('CHANNEL_HANGUP', handler): void
  on('CHANNEL_BRIDGE', handler): void
  on('DTMF', handler): void
}
```

### 6. Dialers Outbound (src/modules/dialers/)

#### Preview Dialer
```typescript
// 1. Afficher fiche contact à l'agent avec bouton "Appeler"
// 2. Agent décide d'appeler → POST /callcenter/calls/outbound
// 3. Originate depuis FreeSWITCH
```

#### Progressive Dialer
```typescript
// 1. Appel déclenché automatiquement quand agent passe à "available"
// 2. Si contact répond → bridge vers agent immédiatement
// 3. Si contact ne répond pas → next contact dans la liste
// 4. Ratio : 1 appel par agent disponible
```

#### Predictive Dialer
```typescript
// 1. Algorithme : taux de réponse historique × nb agents disponibles = nb appels simultanés
// 2. Ex : taux réponse 30%, 10 agents dispo → lancer 33 appels simultanément
// 3. Adapter dynamiquement en temps réel (toutes les 30s)
// 4. Recalcul : abandonedRate doit rester < 3% (réglementation)
```

### 7. Supervision Temps Réel (src/realtime/websocket.ts)

Socket.io rooms par org :
```typescript
// Rejoindre la supervision
socket.on('join_supervision', async ({ token }) => {
  const user = await verifyToken(token);
  socket.join(`supervision:${user.orgId}`);
  
  // Envoyer état initial complet
  const snapshot = await getSupervisionSnapshot(user.orgId);
  socket.emit('supervision_snapshot', snapshot);
});

// Broadcast quand un agent change de statut
async function broadcastAgentStatus(orgId: string, agentId: string, newStatus: string) {
  io.to(`supervision:${orgId}`).emit('agent_status_change', {
    agentId, status: newStatus, since: new Date().toISOString()
  });
}

// Broadcast quand un appel commence
async function broadcastCallStarted(orgId: string, call: Call) {
  io.to(`supervision:${orgId}`).emit('call_started', {
    callId: call.id, agentId: call.agentId, from: call.from, to: call.to
  });
}
```

### 8. Enregistrement et Transcription
```typescript
async function processCallRecording(callId: string, audioPath: string) {
  // 1. Upload vers S3/MinIO
  const s3Url = await uploadToS3(audioPath, `recordings/${callId}.wav`);
  
  // 2. Mettre à jour la DB
  await db.update(ccCalls).set({ recordingUrl: s3Url }).where(eq(ccCalls.id, callId));
  
  // 3. Publier event Kafka pour ai-service
  await kafka.publish('callcenter.recordings.new', {
    callId, orgId, s3Url, language: 'fr', // Détection auto possible
  });
}

// ai-service répond via: callcenter.transcriptions.ready
async function onTranscriptionReady({ callId, transcript, sentimentScore }) {
  await db.update(ccCalls).set({ sentimentScore, transcriptId: transcript.id })
    .where(eq(ccCalls.id, callId));
  
  // Notifier le superviseur
  broadcastSentimentUpdate(call.orgId, callId, sentimentScore);
}
```

### 9. Gestion des Numéros DID
- Recherche de numéros disponibles via API Telnyx/Twilio/Bandwidth
- Achat et provisioning automatique
- Association numéro → IVR ou file d'attente

### 10. Rapports (délégués à analytics-service via Kafka)
Publier les métriques clés après chaque appel :
```typescript
await kafka.publish('analytics.events', {
  type: 'call.completed',
  orgId,
  payload: {
    duration, talkTime, waitTime, disposition,
    agentId, queueId, direction, sentimentScore
  }
});
```

### 11. Tests
- Test ACD round-robin avec 3 agents
- Test IVR simple (play + gather DTMF)
- Test Predictive Dialer calcul ratio
- Test écoute superviseur via Socket.io
- Test enregistrement → trigger Kafka

## Contraintes
- Jamais bloquer la boucle d'événements FreeSWITCH (tout async)
- État des agents toujours en Redis (source de vérité pour la supervision)
- Isolation multi-tenant : `orgId` toujours vérifié avant accès aux ressources
- Enregistrement RGPD : notifier le contact par bip/message vocal (selon pays)
