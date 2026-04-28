# Prompt — Microservice Actor WhatsApp Marketing

## Contexte

Tu développes le **microservice WhatsApp Business** de la plateforme Actor Hub.
Ce module est **autonome** : il gère les campagnes WhatsApp, le chatbot, les conversations, les templates.

**API utilisée** : Meta WhatsApp Business API (Cloud API ou On-Premise)

---

## Architecture du microservice

```
services/whatsapp/
├── meta-api/               # Intégration Meta WhatsApp Business API
│   ├── webhook-handler.ts  # Réception des messages entrants
│   ├── message-sender.ts   # Envoi de messages
│   └── media-handler.ts    # Gestion des médias (images, docs, vidéos)
├── chatbot-engine/         # Moteur de chatbot / autorépondeur
│   ├── flow-engine.ts      # Exécution des flux de conversation
│   └── nlu-handler.ts      # NLU basique (intent detection)
├── broadcast/              # Moteur de diffusion en masse
│   └── campaign-worker.ts
├── api/
│   ├── controllers/
│   │   ├── messages.controller.ts
│   │   ├── campaigns.controller.ts
│   │   ├── templates.controller.ts
│   │   ├── contacts.controller.ts
│   │   └── accounts.controller.ts
│   └── routes/
└── Dockerfile
```

---

## Fonctionnalités à développer (Frontend)

### 1. Dashboard Analytics WhatsApp (`/dashboard/whatsapp-dashboard-analytics`)
**Composant existant** : `whatsapp-dashboard-analytics.tsx`

- Messages envoyés / délivrés / lus / répondus
- Graphique temporel des conversations
- Taux d'engagement par template
- Coût des messages (selon tarification Meta)

### 2. Chat en direct (`/dashboard/whatsapp-chat-module`)
**Composant existant** : `whatsapp-chat-module.tsx`

Interface de messagerie type WhatsApp Web :
- Liste des conversations (tri par non-lu, récent, etc.)
- Fenêtre de conversation avec historique
- Envoi de texte, image, vidéo, document, localisation
- Indicateurs de statut (envoyé ✓, délivré ✓✓, lu ✓✓ bleu)
- Assignation à un agent
- Notes internes (non visibles par le client)
- Tags de conversation
- Fermeture de la conversation (avec code de résolution)

### 3. Diffusions en masse (`/dashboard/whatsapp-broadcast-module`)
**Composants existants** : `whatsapp-broadcast-module.tsx`, `whatsapp-broadcast-create.tsx`

- Sélection du template approuvé
- Sélection de la liste de contacts
- Variables de personnalisation
- Planification
- Rapport de diffusion (délivré / lu / cliqué si boutons)

### 4. Templates WhatsApp (`/dashboard/whatsapp-templates`)
**Composant existant** : `whatsapp-templates.tsx`

Conformité Meta obligatoire :
- Catégories : MARKETING, UTILITY, AUTHENTICATION
- Composants : Header (texte/image/vidéo/doc), Body (avec variables), Footer, Boutons
- Soumission pour approbation Meta
- Statut : PENDING / APPROVED / REJECTED
- Gestion des langues (multi-langue par template)

### 5. Chatbot / Autorépondeur (`/dashboard/whatsapp-chatbot`)
**Composant existant** : `whatsapp-chatbot.tsx`

Builder de bot conversationnel :
- Arbre de décision (messages → conditions → réponses)
- Intégration NLP (détection d'intention simple)
- Transfert vers agent humain si nécessaire (handover protocol)
- Réponses rapides (boutons interactifs)
- Collecte de données (formulaire conversationnel)

### 6. Flow Builder (`/dashboard/whatsapp-flow-builder`)
**Composant existant** : `whatsapp-flow-builder.tsx`

Éditeur visuel de flux de conversation :
- Drag-and-drop de nœuds (Message, Condition, Action, Attente, Fin)
- Connexions entre nœuds
- Test du flux
- Déploiement du flux sur un numéro WhatsApp

### 7. Contacts WhatsApp (`/dashboard/whatsapp-contacts-module`)
**Composant existant** : `whatsapp-contacts-module.tsx`

- CRUD contacts avec numéro WhatsApp
- Vérification du compte WhatsApp (HLR WhatsApp)
- Segmentation / Tags
- Opt-in / Opt-out

### 8. Groupes WhatsApp (`/dashboard/whatsapp-groups`)
**Composant existant** : `whatsapp-groups.tsx`

- Création et gestion de groupes
- Ajout / suppression de membres
- Envoi de messages au groupe
- **Note** : Limité par la politique Meta Business API (groupes limités)

### 9. Médias (`/dashboard/whatsapp-media`)
**Composant existant** : `whatsapp-media.tsx`

- Bibliothèque de médias (images, vidéos, documents)
- Upload et réutilisation dans les templates/campagnes
- Taille et formats supportés (selon limites Meta)

### 10. Codes QR WhatsApp (`/dashboard/whatsapp-qr`)
**Composant existant** : `whatsapp-qr.tsx`

- Génération de QR codes pour démarrer une conversation WhatsApp
- Personnalisation du message pré-rempli
- Statistiques de scan

### 11. Rapports WhatsApp (`/dashboard/whatsapp-reports`)
**Composant existant** : `whatsapp-reports.tsx`

- Rapport par campagne / template / période
- Export CSV/Excel
- Métriques : Sent, Delivered, Read, Failed, Replied

### 12. Connexion de compte (`/dashboard/whatsapp-account-connection`)
**Composant existant** : `whatsapp-account-connection.tsx`

Workflow d'intégration :
1. Connexion via Facebook Business Manager
2. Vérification du numéro de téléphone
3. Sélection du numéro WhatsApp Business
4. Configuration du webhook (URL de callback)
5. Test de la connexion

### 13. WhatsApp OTP (`/dashboard/whatsapp-otp`)
**Composant existant** : `whatsapp-otp.tsx`

- Envoi d'OTP via WhatsApp (template AUTHENTICATION)
- Validation du code côté serveur
- Fallback SMS si WhatsApp échoue

### 14. Campagnes Ads Click-to-WhatsApp (`/dashboard/whatsapp-ads-campaigns`)
**Composant existant** : `whatsapp-ads-campaigns.tsx`

- Intégration avec Facebook Ads
- Tracking des conversions depuis les annonces
- Rapports ROAS

### 15. Passerelle WhatsApp (`/dashboard/whatsapp-gateway-config`)
**Composant existant** : `whatsapp-gateway-config.tsx`

Interface Super Admin :
- Configuration des Business Phone Numbers
- Webhooks Meta (vérification, token)
- Monitoring des quotas Meta

### 16. Assistant IA WhatsApp (`/dashboard/whatsapp-ia-assistant-module`)
**Composant existant** : `whatsapp-ia-assistant-module.tsx`

- Réponses automatiques générées par IA (GPT ou modèle custom)
- Résumé automatique des conversations
- Suggestions de réponse pour l'agent

---

## API REST du microservice WhatsApp

### Messages
```
POST   /api/whatsapp/messages/send        # Envoyer un message
POST   /api/whatsapp/messages/template    # Envoyer via template
GET    /api/whatsapp/messages/:id/status  # Statut du message
```

### Conversations
```
GET    /api/whatsapp/conversations        # Lister les conversations
GET    /api/whatsapp/conversations/:id    # Détail + messages
PUT    /api/whatsapp/conversations/:id    # Modifier (assignation, tag, fermeture)
```

### Campagnes (Broadcasts)
```
GET    /api/whatsapp/campaigns
POST   /api/whatsapp/campaigns
POST   /api/whatsapp/campaigns/:id/send
GET    /api/whatsapp/campaigns/:id/report
```

### Templates
```
GET    /api/whatsapp/templates            # Lister les templates (avec statut Meta)
POST   /api/whatsapp/templates            # Créer et soumettre à Meta
DELETE /api/whatsapp/templates/:id        # Supprimer
```

### Webhook Meta (entrant)
```
GET    /api/whatsapp/webhook              # Vérification (challenge Meta)
POST   /api/whatsapp/webhook              # Réception des événements Meta
```

---

## Événements Webhook Meta reçus

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": { "phone_number_id": "...", "display_phone_number": "..." },
        "messages": [{
          "id": "wamid.xxx",
          "from": "22670000000",
          "type": "text",
          "text": { "body": "Bonjour" },
          "timestamp": "1700000000"
        }],
        "statuses": [{
          "id": "wamid.xxx",
          "status": "read",
          "timestamp": "1700000001",
          "recipient_id": "22670000000"
        }]
      }
    }]
  }]
}
```

---

## Variables d'environnement

```env
# Meta WhatsApp Business API
META_APP_ID=your-app-id
META_APP_SECRET=your-app-secret
META_VERIFY_TOKEN=your-verify-token
META_ACCESS_TOKEN=your-long-lived-token
META_WABA_ID=your-whatsapp-business-account-id
META_PHONE_NUMBER_ID=your-phone-number-id

# Webhook
WEBHOOK_BASE_URL=https://api.actorhub.com

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

PORT=3004
```

---

## Limites et contraintes Meta à respecter

1. **Fenêtre de 24h** : Hors template, on ne peut répondre que dans les 24h qui suivent le dernier message du client
2. **Templates Marketing** : Quota quotidien par numéro (commence à 1000/jour)
3. **Qualité du numéro** : Score de qualité basé sur les rapports clients (GREEN / YELLOW / RED)
4. **Opt-in obligatoire** : Le client doit avoir consenti à recevoir des messages
5. **Limites de taux** : API Meta limitée selon le tier du Business Account
