# Prompt : Supervision Temps Réel – Actor Hub

## Contexte
Tu génères la page de **supervision temps réel** du call center.  
Stack : **Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Socket.IO client, Recharts**.

## Tâche
Génère la page de supervision avec :
- Vue d'ensemble des KPIs (appels en cours, agents disponibles, temps d'attente)
- Grille des agents avec leur statut en temps réel
- File d'attente en direct
- Graphique des appels entrants / répondus (live)
- Actions superviseur (écoute discrète, chuchotement, conférence à 3)

## Layout de la page

```
┌─────────────────────────────────────────────────────────┐
│  KPI Cards : Appels actifs | En attente | Agents dispo  │
├──────────────────────────┬──────────────────────────────┤
│  Grille Agents (statuts) │  Files d'attente live        │
│                          │  ┌──────────────────────────┐│
│  [Vert] Agent A - Appel  │  │ Queue: Support           ││
│  [Rouge] Agent B - Pause │  │ 3 appels en attente      ││
│  [Gris]  Agent C - Hors  │  │ Attente max: 2min 30s    ││
│                          │  └──────────────────────────┘│
├──────────────────────────┴──────────────────────────────┤
│  Graphique Recharts : Appels/heure (30 dernières min)   │
└─────────────────────────────────────────────────────────┘
```

## Connexion WebSocket

```typescript
// hooks/use-supervision.ts
'use client'
import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import type { SupervisionEvent, QueueKPI, AgentStatus } from '@actor-hub/types'

export function useSupervision(tenantId: string) {
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [queues, setQueues] = useState<QueueKPI[]>([])
  const [activeCalls, setActiveCalls] = useState(0)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket>()

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_CALL_CENTER_WS_URL}/supervision`, {
      auth: { token: getAccessToken() },
      query: { tenantId },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('agent_status_changed', (event: SupervisionEvent) => {
      setAgents(prev => prev.map(a =>
        a.id === event.payload.agentId
          ? { ...a, status: event.payload.status }
          : a
      ))
    })

    socket.on('queue_updated', (event: SupervisionEvent) => {
      setQueues(prev => prev.map(q =>
        q.queueId === event.payload.queueId
          ? { ...q, ...event.payload }
          : q
      ))
    })

    socket.on('kpi_updated', (event: SupervisionEvent) => {
      setActiveCalls(event.payload.activeCalls)
    })

    socketRef.current = socket
    return () => { socket.disconnect() }
  }, [tenantId])

  const whisperToAgent = (agentId: string, callId: string) => {
    socketRef.current?.emit('supervisor_action', {
      action: 'whisper',
      agentId,
      callId,
    })
  }

  const listenToCall = (callId: string) => {
    socketRef.current?.emit('supervisor_action', {
      action: 'listen',
      callId,
    })
  }

  return { agents, queues, activeCalls, connected, whisperToAgent, listenToCall }
}
```

## Contraintes

1. **Mise à jour < 500ms** : les changements de statut agent doivent s'afficher quasi instantanément.
2. **Reconnexion automatique** : si WebSocket déconnecté, retry avec backoff exponentiel.
3. **Indicateur de connexion** : badge vert/rouge dans le coin (connexion WS).
4. **Actions superviseur** : requièrent le rôle `supervisor` ou `admin` (vérifier RBAC).
5. **Audio** : notification sonore discrète à chaque appel en attente > seuil configurable.
6. **Responsive** : adapté aux grands écrans (1920px+) pour affichage mural.
7. **Pause/reprise** : bouton pour geler les mises à jour (inspection d'un agent).
