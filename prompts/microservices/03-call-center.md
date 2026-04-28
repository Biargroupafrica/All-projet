# Prompt — Microservice Actor CallCenter

## Contexte

Tu développes le **microservice Call Center** de la plateforme Actor Hub.
Ce module est **autonome** : il peut être vendu et déployé indépendamment des autres modules.

**Figma Make référence** : Composants dans `src/app/components/` (call-center*, ivr-*, acd-*, skill-based-routing*, softphone*, etc.)

---

## Architecture du microservice

```
services/call-center/
├── sip-gateway/              # Passerelle SIP (Kamailio ou FreeSWITCH)
├── acd-engine/               # Moteur de distribution automatique des appels
├── ivr-engine/               # Moteur IVR (serveur vocal interactif)
├── webrtc-bridge/            # Bridge WebRTC pour le softphone
├── recording-service/        # Service d'enregistrement des appels
├── api/                      # REST API + WebSocket
│   ├── controllers/
│   │   ├── calls.controller.ts
│   │   ├── queues.controller.ts
│   │   ├── agents.controller.ts
│   │   ├── campaigns.controller.ts
│   │   └── ivr.controller.ts
│   └── routes/
└── analytics/                # Analytics temps réel
```

---

## Fonctionnalités principales à développer

### 1. Dashboard Call Center (`/dashboard/call-center`)
**Composant existant** : `call-center.tsx`

- Résumé des statistiques en temps réel
- Appels en cours / en attente / terminés
- Agents connectés / disponibles / en pause
- Graphiques de performance

### 2. Live Dashboard (`/dashboard/call-center-live`)
**Composant existant** : `call-center-live-dashboard.tsx`

- Vue temps réel avec WebSocket
- Rafraîchissement toutes les 5 secondes
- Alertes si SLA dépassé (ex: temps d'attente > 2 min)
- KPIs : ASA, AHT, FCR, CSAT

### 3. ACD — Distribution Automatique (`/dashboard/acd-automatic-call-distribution`)
**Composant existant** : `acd-automatic-call-distribution.tsx`

Configuration du routage :
- Routage par compétences (Skill-Based Routing)
- Routage par priorité (VIP clients)
- Routage par horaires (schedules)
- Overflow automatique vers file d'attente
- Configuration de l'interface `acd-config-modal.tsx`

### 4. IVR Builder (`/dashboard/ivr-builder-advanced`)
**Composant existant** : `ivr-builder-advanced.tsx`

Éditeur visuel drag-and-drop :
- Nœuds disponibles : Accueil, Menu, Saisie DTMF, Condition, Transfert, Enregistrement, TTS
- Connexions entre nœuds (flux logique)
- Test du flux IVR en un clic
- Import/export JSON du flux
- Versions et historique

### 5. Softphone WebRTC (`/dashboard/softphone-enhanced`)
**Composant existant** : `softphone-enhanced.tsx`

Interface agent complète :
- Numéroteur (clavier numérique)
- Appel entrant (popup notification)
- Transfert (aveugle / assisté)
- Mise en attente / Reprise
- Conférence à 3 (ou plus)
- Affichage des infos contact (intégration CRM)
- Notes post-appel
- Codes de disposition (wrap-up codes)

### 6. Gestion des files d'attente (`/dashboard/queue-management`)
**Composant existant** : `queue-management.tsx`

- Création / modification des files
- Musique d'attente configurable
- Message d'annonce position
- Timeout et callback automatique
- Priorités par file

### 7. Supervision (`/dashboard/call-center-supervision`)
**Composant existant** : `call-center-supervision.tsx`

Outils superviseur :
- Écoute discrète (monitoring)
- Chuchotement (whisper) — parle à l'agent sans que le client entende
- Double écoute / Intervention
- Envoi de messages à l'agent
- Force-disponible / Force-pause

### 8. Campagnes Outbound (`/dashboard/outbound-campaigns`)
**Composants existants** : `outbound-campaigns.tsx`, `power-dialer.tsx`, `predictive-dialer.tsx`, `preview-dialer.tsx`

Types de dialers :
- **Power Dialer** : ratio d'appels par agent configurable
- **Predictive Dialer** : algorithme ML pour prédire la disponibilité agent
- **Preview Dialer** : agent voit la fiche avant que l'appel parte

### 9. Enregistrement des appels (`/dashboard/call-recording`)
**Composant existant** : `call-recording.tsx`

- Enregistrement automatique ou à la demande
- Lecture inline avec player audio
- Transcription automatique (IA)
- Analyse sentiment (score 0-10)
- Téléchargement / Export
- Rétention configurable (ex: 6 mois, 1 an, 7 ans)

### 10. Géolocalisation des appels (`/dashboard/call-geolocation`)
**Composant existant** : `call-geolocation.tsx`

- Carte interactive des appels par région
- Heat map des zones à fort volume
- Filtrage par période

---

## API REST du microservice Call Center

### Appels (Calls)
```
GET    /api/calls                    # Historique des appels
GET    /api/calls/active             # Appels actifs (WebSocket aussi)
POST   /api/calls/outbound           # Initier un appel sortant
PUT    /api/calls/:id/transfer       # Transfert d'appel
PUT    /api/calls/:id/hold           # Mise en attente
PUT    /api/calls/:id/unhold         # Reprise
DELETE /api/calls/:id                # Terminer un appel
GET    /api/calls/:id/recording      # Accès à l'enregistrement
```

### Files d'attente (Queues)
```
GET    /api/queues                   # Lister les files
POST   /api/queues                   # Créer une file
PUT    /api/queues/:id               # Modifier
DELETE /api/queues/:id               # Supprimer
GET    /api/queues/:id/stats         # Stats temps réel
GET    /api/queues/:id/callers       # Appelants en attente
```

### Agents
```
GET    /api/agents                   # Lister les agents
POST   /api/agents/:id/status        # Changer statut (available/busy/break/offline)
GET    /api/agents/:id/stats         # Stats de l'agent
POST   /api/agents/:id/monitor       # Démarrer l'écoute (superviseur)
```

### IVR
```
GET    /api/ivr                      # Lister les flux IVR
POST   /api/ivr                      # Créer un flux
PUT    /api/ivr/:id                  # Modifier
DELETE /api/ivr/:id                  # Supprimer
POST   /api/ivr/:id/activate         # Activer le flux
POST   /api/ivr/:id/test             # Tester le flux
```

### WebSocket Events (temps réel)
```
SUBSCRIBE call:created               # Nouvel appel entrant
SUBSCRIBE call:answered              # Appel décroché
SUBSCRIBE call:ended                 # Appel terminé
SUBSCRIBE agent:status_changed       # Changement de statut agent
SUBSCRIBE queue:stats_updated        # Mise à jour des stats de file
```

---

## Intégrations CTI (Computer Telephony Integration)

**Composant existant** : `cti-integration-enhanced.tsx`

Intégrations natives à prévoir :
- **Salesforce** : Popup fiche contact, log d'appel automatique
- **HubSpot** : Sync contacts, activités
- **Zoho CRM** : Sync bidirectionnelle
- **API webhook** : Pour CRM custom (payload configurable)

---

## Variables d'environnement

```env
# SIP Configuration
SIP_SERVER_HOST=sip.actorhub.com
SIP_SERVER_PORT=5060
SIP_TRANSPORT=TLS
SRTP_ENABLED=true

# WebRTC
WEBRTC_STUN_SERVER=stun:stun.actorhub.com:3478
WEBRTC_TURN_SERVER=turn:turn.actorhub.com:3478
WEBRTC_TURN_USERNAME=actor
WEBRTC_TURN_PASSWORD=secret

# Recording
RECORDING_STORAGE=s3
S3_BUCKET=actor-recordings
S3_REGION=eu-west-1
RECORDING_ENCRYPTION=AES256

# AI (transcription & sentiment)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
TRANSCRIPTION_MODEL=whisper-1

# Service
PORT=3002
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

---

## KPIs & Métriques à afficher

| Métrique | Description |
|---|---|
| ASA | Average Speed of Answer (temps moyen avant décroché) |
| AHT | Average Handle Time (durée moyenne de traitement) |
| FCR | First Call Resolution (résolution au premier appel) |
| CSAT | Customer Satisfaction Score |
| Abandon Rate | Taux d'abandon (clients raccrochent avant décroché) |
| Occupancy Rate | Taux d'occupation des agents |
| SLA | % d'appels décrochés en moins de X secondes |
