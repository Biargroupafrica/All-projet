# Prompt : Éditeur IVR Visuel – Actor Hub

## Contexte
Tu génères l'**éditeur IVR visuel** (drag & drop) pour la configuration des arbres d'appels.  
Stack : **React Flow, Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Zustand**.

## Tâche
Génère l'éditeur IVR complet avec :
- Canvas drag & drop pour créer l'arbre d'appels
- Nœuds typés (Play, Gather, Queue, Transfer, Hangup, Condition, Schedule)
- Panneau de propriétés (édition du nœud sélectionné)
- Sauvegarde vers le call-center-service
- Simulation / test de l'IVR

## Types de nœuds IVR

```typescript
type IVRNodeType =
  | 'start'           // Point d'entrée (unique)
  | 'play'            // Lecture d'un audio ou TTS
  | 'gather'          // Menu DTMF ou reconnaissance vocale
  | 'queue'           // Mettre en file d'attente
  | 'transfer'        // Transfert vers un numéro
  | 'hangup'          // Raccrocher
  | 'condition'       // Condition (heure, jour, statut CRM)
  | 'schedule'        // Vérification horaires d'ouverture
  | 'voicemail'       // Messagerie vocale
  | 'callback'        // Demande de rappel automatique
```

## Structure de fichiers

```
apps/dashboard/app/(authenticated)/call-center/ivr/
├── page.tsx                         # Liste des IVR du tenant
├── [ivrId]/
│   ├── page.tsx                     # Éditeur pour un IVR
│   └── _components/
│       ├── ivr-editor.tsx           # Canvas React Flow principal
│       ├── node-toolbar.tsx         # Palette des nœuds (drag source)
│       ├── property-panel.tsx       # Propriétés du nœud sélectionné
│       ├── nodes/
│       │   ├── play-node.tsx
│       │   ├── gather-node.tsx
│       │   ├── queue-node.tsx
│       │   ├── transfer-node.tsx
│       │   ├── hangup-node.tsx
│       │   ├── condition-node.tsx
│       │   └── schedule-node.tsx
│       └── hooks/
│           ├── use-ivr-store.ts     # Zustand store (nodes, edges)
│           └── use-ivr-api.ts       # Save / load depuis API
```

## IVR Store (Zustand)

```typescript
// hooks/use-ivr-store.ts
import { create } from 'zustand'
import { Node, Edge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'

interface IVRStore {
  ivrId: string
  nodes: Node[]
  edges: Edge[]
  selectedNodeId: string | null
  isDirty: boolean

  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  selectNode: (nodeId: string | null) => void
  updateNodeData: (nodeId: string, data: Partial<IVRNodeData>) => void
  addNode: (type: IVRNodeType, position: { x: number; y: number }) => void
  deleteNode: (nodeId: string) => void
  markClean: () => void
}
```

## Contraintes

1. **React Flow** : utiliser `@xyflow/react` (v12+).
2. **Sauvegarde auto** : debounce 2s après chaque modification (+ indicateur "Enregistrement...").
3. **Validation** : avant sauvegarde, vérifier que chaque nœud `gather` a des options pour chaque touche définie.
4. **Undo/Redo** : historique des modifications (Ctrl+Z / Ctrl+Y).
5. **Minimap** : afficher la minimap React Flow pour les grands arbres.
6. **Export** : bouton "Exporter JSON" pour télécharger la config IVR.
7. **Mode simulation** : simuler un appel entrant en cliquant sur des nœuds manuellement.
