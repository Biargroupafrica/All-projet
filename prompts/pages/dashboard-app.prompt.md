# Prompt : Générer le Dashboard ACTOR Hub (Espace Client)

## Contexte
Tu vas créer l'application dashboard (`apps/dashboard/`) — l'espace client post-connexion de la plateforme ACTOR Hub.

**Stack :** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui + Zustand + TanStack Query + Socket.io-client + Recharts

## Architecture des Routes

```
/[locale]/
├── (auth)/                     # Groupe protégé (middleware vérifie JWT)
│   ├── layout.tsx               # Sidebar + Header + Notification bell
│   ├── page.tsx                 # Vue d'ensemble (KPIs globaux)
│   ├── sms/
│   │   ├── page.tsx             # Hub SMS
│   │   ├── send/page.tsx        # Envoi rapide
│   │   ├── campaigns/
│   │   │   ├── page.tsx         # Liste campagnes
│   │   │   └── [id]/page.tsx    # Détail + stats campagne
│   │   └── history/page.tsx     # Historique messages
│   ├── email/
│   │   ├── page.tsx
│   │   ├── campaigns/
│   │   ├── templates/
│   │   │   └── [id]/editor/page.tsx  # Éditeur Drag & Drop
│   │   └── automation/
│   ├── whatsapp/
│   │   ├── page.tsx             # Inbox conversations
│   │   ├── broadcasts/page.tsx
│   │   └── chatbot/page.tsx
│   ├── call-center/
│   │   ├── page.tsx             # Hub call center
│   │   ├── softphone/page.tsx   # Pour agents
│   │   ├── supervision/page.tsx # Pour superviseurs
│   │   ├── campaigns/page.tsx
│   │   └── ivr/page.tsx
│   ├── contacts/page.tsx
│   ├── integrations/page.tsx
│   ├── reports/page.tsx
│   └── settings/
│       ├── page.tsx
│       ├── billing/page.tsx
│       ├── users/page.tsx
│       └── security/page.tsx
└── login/page.tsx               # Redirection vers landing/login
```

## Tâche

### 1. Layout Principal (app/[locale]/(auth)/layout.tsx)

Sidebar fixe à gauche (280px), contenu à droite.

**Sidebar contenu :**
```
[Logo ACTOR Hub]
[Recherche globale Cmd+K]

Navigation :
📊 Vue d'ensemble
📱 SMS
📧 Email  
💬 WhatsApp
📞 Call Center
👥 Contacts
🔗 Intégrations
📈 Rapports

─────────────
⚙️ Paramètres
❓ Aide & Support
```

Indicateur de canal actif : point coloré (SMS=blue, Email=purple, WhatsApp=green, Call=orange).

**Header :**
- Breadcrumb navigation
- Sélecteur d'organisation (si multi-org)
- Barre de statut de l'agent Call Center (pour agents) : green=Disponible, red=Occupé, yellow=Pause
- 🔔 Cloche notifications (badge avec count non lu)
- Avatar utilisateur + menu dropdown (profil, logout)

### 2. Vue d'Ensemble (app/[locale]/(auth)/page.tsx)

KPI cards en haut (4 colonnes) :
```
Messages envoyés aujourd'hui | Taux de livraison | Coût du jour | Agents actifs
     12,456                  |      97.8%        |    €142.30   |      8/12
```

Graphique principal : courbe multi-canaux sur 30 jours (Recharts LineChart)
- Axe X : dates
- Lignes : SMS (bleu), Email (violet), WhatsApp (vert), Appels (orange)
- Tooltip custom avec détails par canal

Activité récente : feed chronologique des derniers événements
Alertes actives : zone rouge/orange pour quotas bas, erreurs, etc.

### 3. Module SMS

**Hub SMS (/sms/page.tsx) :**
- 4 stat cards (envoyés, livrés, échoués, taux livraison)
- Bouton "Nouvelle campagne" + "Envoi rapide"
- Tableau des campagnes récentes avec status colored badge

**Formulaire Envoi Rapide (/sms/send/page.tsx) :**
```tsx
<SmsSendForm>
  <Input label="Destinataire" placeholder="+33612345678" type="tel" />
  <Select label="Expéditeur (SenderID)" options={senders} />
  <Textarea label="Message" maxLength={160} counter />
  <CharacterCounter segments={1} encoding="GSM7" />
  <Button>Envoyer le SMS</Button>
</SmsSendForm>
```

Compteur de caractères intelligent : affiche segments et encodage (GSM7 vs UCS2).

**Éditeur de Campagne (/sms/campaigns/[id]/page.tsx) :**
- Formulaire : nom, expéditeur, template message avec variables
- Sélecteur de liste de contacts (avec preview du nombre)
- Détection automatique variables `{{variable}}` → champs mapping
- Planification : immédiat ou date/heure + timezone
- Aperçu SMS sur maquette de téléphone
- Estimation coût avant validation
- Bouton "Lancer la campagne" avec confirmation

### 4. Module WhatsApp — Inbox (app/[locale]/(auth)/whatsapp/page.tsx)

Layout style messagerie (3 panneaux sur desktop) :

```
[Liste conversations] | [Messages] | [Infos contact]
     (300px)         |  (flex-1)  |    (280px)
```

Liste conversations :
- Filtre par statut (Ouvert, En attente, Résolu)
- Recherche par nom/numéro
- Tri : dernière activité / non lus
- Chaque item : avatar, nom, preview message, heure, badge non lu

Zone messages :
- Bulles style WhatsApp (droite=envoyé, gauche=reçu)
- Types : text, image, vidéo, document, localisation
- Double coche bleue = lu, simple = livré
- Input bas : texte + emojis + pièce jointe + envoi
- "Agent est en train d'écrire..." indicator
- Bouton "Escalade Bot → Humain" / "Résoudre"

Temps réel via Socket.io : nouveaux messages arrivent instantanément.

### 5. Module Call Center — Softphone (app/[locale]/(auth)/call-center/softphone/page.tsx)

Interface Softphone WebRTC pour agents :

```
┌─────────────────────────────────┐
│  ACTOR Hub Softphone            │
│                                 │
│  ● DISPONIBLE ▼                │ ← Sélecteur statut
│                                 │
│  ┌─────────────────────────┐   │
│  │  +33 6 12 34 56 78      │   │ ← Pavé numérique ou appel entrant
│  │  [1][2][3]              │   │
│  │  [4][5][6]              │   │
│  │  [7][8][9]              │   │
│  │  [*][0][#]              │   │
│  └─────────────────────────┘   │
│                                 │
│  [🎤 Muet] [📞 Appeler] [🔈]  │
└─────────────────────────────────┘
```

En appel :
- Minuterie de l'appel
- Boutons : Muet / Attente / Transfert / Raccrocher
- Fiche contact CRM (si intégration)
- Script de vente affiché (si campagne outbound)
- Saisie de la qualification (disposition) avant raccrochage

### 6. Module Call Center — Supervision (/call-center/supervision/page.tsx)

Dashboard temps réel (mise à jour via Socket.io toutes les secondes) :

```
KPIs haut :
│ Agents en ligne: 8 │ Appels en cours: 3 │ En attente: 5 │ AHT: 4:23 │

Tableau agents :
│ Nom  │ Statut  │ Appel actuel │ Durée │ Moy aujourd'hui │ Actions │
│ Ali  │ 🟢 Actif │ +33612...   │ 3:24  │ 12 appels       │ Écouter │
│ Léa  │ 🟡 Pause │ -           │ -     │ 8 appels        │         │
│ John │ 🔴 Hors  │ -           │ -     │ 0 appels        │         │

Files d'attente :
│ Support │ 🔵 2 en attente │ Attente moy: 1:24 │ 3 agents │
│ Ventes  │ 🔵 0 en attente │ -                 │ 5 agents │
```

Superviseur peut cliquer "Écouter" → `POST /callcenter/supervision/listen/:callId`

### 7. Gestion Contacts (/contacts/page.tsx)

DataTable avec :
- Colonnes : Nom, Téléphone, Email, Tags, Liste, Date ajout
- Filtres : par liste, tag, pays, canal opt-in
- Pagination serveur (50 par page)
- Export CSV
- Bouton "Importer" → modal avec drag & drop CSV/Excel

Modal import :
1. Upload fichier
2. Mapping colonnes (détection automatique de "téléphone", "email", "prenom"...)
3. Aperçu des 5 premières lignes
4. Validation (erreurs en rouge)
5. Lancer l'import avec progress bar

### 8. Paramètres — Facturation (/settings/billing/page.tsx)

- Plan actuel avec métriques d'usage (barres de progression pour chaque quota)
- Boutons upgrade/downgrade
- Historique factures (tableau avec lien PDF)
- Méthodes de paiement
- Section recharge crédits (Mobile Money pour l'Afrique)

### 9. Hooks et State Management

```typescript
// hooks/useWebSocket.ts
export function useWebSocket() {
  const socket = useRef<Socket>(null);
  
  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_WS_URL, {
      auth: { token: getAccessToken() }
    });
    return () => socket.current?.disconnect();
  }, []);
  
  return socket.current;
}

// store/callcenter.store.ts (Zustand)
interface CallCenterStore {
  agentStatus: AgentStatus;
  currentCall: Call | null;
  setAgentStatus: (status: AgentStatus) => void;
  setCurrentCall: (call: Call | null) => void;
}
```

### 10. Client API Centralisé (lib/api.ts)

```typescript
class ApiClient {
  private baseUrl: string;
  
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = await getAccessToken(); // auto-refresh si expiré
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
    });
    
    if (response.status === 401) {
      // Token expiré → redirect login
      redirect('/login');
    }
    
    if (!response.ok) {
      throw new ApiError(response.status, await response.json());
    }
    
    return response.json();
  }
  
  sms = { send: (data) => this.request('/sms/send', { method: 'POST', body: JSON.stringify(data) }), ... }
  email = { ... }
  whatsapp = { ... }
  callcenter = { ... }
}

export const api = new ApiClient(process.env.NEXT_PUBLIC_API_URL);
```

## Critères de Succès

- [ ] Sidebar : navigation entre tous les modules fonctionnelle
- [ ] KPIs sur la vue d'ensemble : données réelles depuis l'API
- [ ] SMS : envoi rapide déclenche réellement un SMS
- [ ] WhatsApp Inbox : messages en temps réel via Socket.io
- [ ] Softphone : connexion WebRTC établie
- [ ] Supervision : état agents mis à jour toutes les secondes
- [ ] Import contacts 1000 lignes CSV : pas de timeout
- [ ] Factures : téléchargement PDF fonctionnel
- [ ] Responsive : utilisable sur tablette (iPad, pas forcément mobile)
