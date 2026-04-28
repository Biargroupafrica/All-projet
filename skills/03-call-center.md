# Skill 03 — Module Call Center

## Quand utiliser ce skill
Lorsque vous travaillez sur le centre d'appels : softphone WebRTC, IVR, ACD, gestion des agents, campagnes sortantes, supervision en temps réel.

## Routes concernées (sous /dashboard/)
```
call-center                    — Hub principal
call-center-live               — Dashboard live
call-center-supervision        — Supervision superviseur
acd-automatic-call-distribution — Distribution automatique
call-routing-advanced          — Routage avancé
skill-based-routing-advanced   — Routage par compétences
ivr-system-enhanced            — IVR système
ivr-builder-advanced           — Constructeur IVR visuel
ivr-advanced-configurator      — Config IVR avancée
queue-management               — Gestion des files
queue-management-advanced      — Files avancées
inbound-calls                  — Appels entrants
inbound-calls-advanced         — Appels entrants avancés
outbound-campaigns             — Campagnes sortantes
power-dialer                   — Power dialer
predictive-dialer              — Dialer prédictif
preview-dialer                 — Dialer preview
agents                         — Gestion des agents
call-recording                 — Enregistrements
live-monitoring                — Monitoring temps réel
softphone-enhanced             — Softphone WebRTC
extension-manager              — Gestion des extensions
phone-numbers                  — Numéros de téléphone
call-history                   — Historique appels
ai-features-enhanced           — Fonctionnalités IA
airo-agent-enhanced            — Agent IA (AIRO)
teleprospecting                — Téléprospection
bank-prospecting               — Prospection bancaire
call-script-agent              — Scripts d'appel
green-line-management          — Ligne verte
wallboard-call-center          — Wallboard temps réel
supervisor-dashboard           — Dashboard superviseur
```

## Architecture du Module Call Center

```
┌─────────────────────────────────────────────────────────────┐
│                    CALL CENTER MODULE                       │
├───────────────────┬─────────────────────┬───────────────────┤
│   INBOUND         │   ROUTING ENGINE    │   OUTBOUND        │
│                   │                     │                   │
│ • IVR Flow        │ • ACD              │ • Power Dialer    │
│ • Queue Mgmt      │ • Skill-Based      │ • Predictive      │
│ • Agent Distrib.  │ • Time-Based       │ • Preview Dialer  │
│ • Callback Sched. │ • Priority Rules   │ • Campaign Mgmt   │
└───────────────────┴─────────────────────┴───────────────────┘
          │                   │                    │
          └───────────────────┼────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │        SOFTPHONE (WebRTC)      │
              │  • SIP Trunks                 │
              │  • Extension Manager          │
              │  • Call Recording             │
              │  • Screen Pop (CTI)           │
              └───────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │        AI LAYER (AIRO)         │
              │  • Real-time Transcription    │
              │  • Sentiment Analysis         │
              │  • Agent Coaching             │
              │  • Auto-Summarization         │
              └───────────────────────────────┘
```

## Modèle de Données Call Center

```sql
-- Agents
CREATE TABLE cc_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  profile_id UUID REFERENCES profiles(id),
  extension TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'offline', -- online, busy, away, offline
  max_concurrent_calls INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Files d'attente
CREATE TABLE cc_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  strategy TEXT DEFAULT 'round-robin', -- round-robin, least-busy, skills-based
  max_wait_seconds INTEGER DEFAULT 300,
  music_on_hold_url TEXT,
  overflow_action TEXT DEFAULT 'voicemail',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Appels
CREATE TABLE cc_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  call_id TEXT UNIQUE NOT NULL, -- ID du provider SIP
  direction TEXT NOT NULL, -- inbound, outbound
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  agent_id UUID REFERENCES cc_agents(id),
  queue_id UUID REFERENCES cc_queues(id),
  status TEXT DEFAULT 'ringing', -- ringing, answered, completed, abandoned, failed
  duration_seconds INTEGER,
  wait_time_seconds INTEGER,
  recording_url TEXT,
  disposition TEXT, -- résumé post-appel
  ai_summary TEXT,
  ai_sentiment TEXT, -- positive, neutral, negative
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Flux IVR
CREATE TABLE cc_ivr_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  nodes JSONB NOT NULL DEFAULT '[]',
  connections JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enregistrements
CREATE TABLE cc_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  call_id UUID REFERENCES cc_calls(id),
  file_url TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size_bytes INTEGER,
  transcription TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Composants Clés à Implémenter

### Softphone WebRTC
```typescript
// Connexion SIP via WebRTC
import { WebPhoneSession } from 'sip.js'

interface SoftphoneConfig {
  sipServer: string      // ex: sip.actorhub.io
  extension: string      // ex: 1001
  password: string
  stunServers: string[]  // STUN/TURN servers
}

// États du softphone
type PhoneStatus = 'unregistered' | 'registered' | 'calling' | 'on-call' | 'on-hold'

// Actions
const phoneActions = {
  dial: (number: string) => void,
  hangup: () => void,
  hold: () => void,
  mute: () => void,
  transfer: (target: string) => void,
  conference: (targets: string[]) => void,
}
```

### IVR Builder (Drag & Drop)
```typescript
// Nœuds IVR disponibles
type IVRNodeType =
  | 'greeting'      // Message d'accueil
  | 'menu'          // Menu DTMF (1 pour..., 2 pour...)
  | 'condition'     // Condition (heure, langue, etc.)
  | 'transfer'      // Transfert vers agent/file
  | 'voicemail'     // Messagerie vocale
  | 'schedule'      // Horaires d'ouverture
  | 'callback'      // Rappel automatique
  | 'ai-intent'     // Détection d'intention IA
  | 'announcement'  // Annonce

interface IVRNode {
  id: string
  type: IVRNodeType
  position: { x: number; y: number }
  config: Record<string, unknown>
  connections: string[] // IDs des nœuds suivants
}
```

## Prompts pour le Call Center

### Prompt — Dashboard Live Call Center
```
Crée un dashboard temps réel pour un call center avec :
- Compteurs animés : appels en cours, agents disponibles, temps d'attente moyen, SLA%
- Liste live des appels actifs avec : numéro, agent, durée, statut
- Graphique en temps réel : volume d'appels dernières 60 minutes (sparkline)
- Files d'attente : nombre d'appelants en attente, temps estimé
- Statut agents : grille avec avatar, nom, statut (vert/orange/rouge)
- Alertes : SLA en danger, file longue, agent déconnecté
Actualisation toutes les 5 secondes via Supabase Realtime.
Design dark avec accents roses, style wallboard professionnel.
```

### Prompt — IVR Builder Visuel
```
Crée un constructeur de flux IVR drag-and-drop pour Actor Hub.
Fonctionnalités :
- Canvas infini (react-flow ou similaire)
- Palette de nœuds : Accueil, Menu, Condition, Transfert, Messagerie, Horaires
- Connexions entre nœuds avec flèches directionnelles
- Configuration de chaque nœud (panneau latéral) : texte TTS, audio upload, DTMF
- Simulation du flux (bouton "Tester le flux")
- Sauvegarde et publication en 1 clic
- Versioning des flux (historique)
Utiliser react-flow pour le canvas. Style professionnel, fond gris foncé.
```

### Prompt — Softphone WebRTC
```
Crée un composant softphone WebRTC intégré pour agents de call center.
Interface flottante (draggable) avec :
- Affichage numéro appelant/appelé avec identité CRM si disponible
- Pavé numérique (dialpad) avec touches 0-9, *, #
- Boutons : Raccrocher (rouge), Mettre en attente, Couper le micro, Conférence, Transfert
- Timer de durée d'appel
- Indicateur qualité audio (MOS score)
- Historique des 5 derniers appels
- Bouton de recherche contacts rapide
Intégrer avec sip.js pour la signalisation SIP/WebRTC.
Afficher notifications toast pour appels entrants.
```

### Prompt — Dialer Prédictif
```
Crée un module de dialer prédictif pour campagnes sortantes.
Fonctionnalités :
- Upload liste de contacts (CSV/Excel) avec mapping de colonnes
- Configuration du ratio d'appels (ex: 3:1 - 3 appels par agent disponible)
- Détection répondeur automatique (AMD)
- Pause/Resume de campagne
- Abandon rate en temps réel (objectif < 3%)
- Script d'appel intégré pour l'agent
- Disposition codes après appel (Vente, Rappel, Pas intéressé, etc.)
- Respect des horaires légaux d'appel par pays
```

### Prompt — Agent IA (AIRO)
```
Crée le composant AIRO (AI Real-time Operations) pour assister les agents en temps réel.
Fonctionnalités IA :
- Transcription en temps réel de l'appel (speech-to-text)
- Analyse de sentiment (positif/négatif/neutre) avec barre de progression
- Suggestions de réponse contextuelle en temps réel
- Détection de mots-clés importants (réclamation, résiliation, concurrent)
- Coaching agent : "Parlez moins vite", "Reformulez l'objection"
- Résumé automatique post-appel + codes de disposition suggérés
- Knowledge base search : recherche automatique dans la FAQ
Interface panneau latéral pendant l'appel, non-intrusive.
```

## Tests à réaliser
- [ ] Enregistrement SIP et appel entrant sur le softphone
- [ ] Test du flux IVR (menu, transfert, messagerie)
- [ ] Distribution ACD (round-robin entre agents)
- [ ] Enregistrement d'appel et lecture
- [ ] Dashboard live (données temps réel Supabase)
- [ ] Dialer prédictif (upload CSV, lancement campagne)
- [ ] AIRO : transcription et suggestions en temps réel
- [ ] Supervision : écoute discrète, soufflage, interception
