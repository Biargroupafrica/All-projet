# Skill : Dashboard App — ACTOR Hub

## Scénario d'utilisation
Développer l'espace client unifié (`apps/dashboard/`) — l'application principale utilisée après connexion.

## Contexte Métier
Le dashboard est l'interface centrale où les clients gèrent tous leurs canaux de communication. Il doit être :
- **Unifié** : tous les canaux depuis un seul endroit
- **Temps réel** : métriques en direct via WebSocket
- **Multilingue** : 10 langues
- **Role-based** : chaque rôle voit uniquement ce qui le concerne

## Sections du Dashboard

### Vue d'ensemble (Home)
- KPIs du jour : messages envoyés, taux de livraison, coûts, économies
- Graphiques tendances (7/30/90 jours) par canal
- Alertes actives (quota bas, campagne en erreur, agent hors ligne)
- Activité récente (timeline)

### Module SMS
- Envoyer SMS (formulaire simple)
- Campagnes SMS (liste, création, stats)
- Historique messages
- SenderIDs

### Module Email
- Éditeur Drag & Drop (template builder)
- Campagnes Email
- Automation (séquences)
- Analytics (opens, clicks, bounces)
- Templates

### Module WhatsApp
- Inbox (conversations temps réel)
- Broadcast (campagnes template)
- Chatbot flows builder
- Comptes WhatsApp Business

### Module Call Center
- Softphone WebRTC (navigateur, pour agents)
- Supervision dashboard (pour superviseurs)
- Campagnes Outbound
- IVR Builder
- Rapports appels
- Gestion agents et files

### Contacts
- Répertoire contacts (import CSV/Excel)
- Segmentation (listes dynamiques et statiques)
- Champs personnalisés
- Opt-out management
- Import/Export

### Intégrations
- Connexion CRM (Salesforce, HubSpot, Zoho)
- Webhooks (liste, créer, tester)
- Clés API (créer, révoquer, voir logs)
- Zapier / Make.com

### Paramètres
- Profil organisation
- Utilisateurs & Rôles
- Facturation & Abonnement
- Sécurité (2FA, SSO)
- Domaines Email
- Numéros de téléphone

### Rapports
- Rapports cross-canal (SMS + Email + WhatsApp + Calls)
- Export CSV / PDF
- Tableaux de bord personnalisables
- Rapport ROI

## Structure de Fichiers

```
apps/dashboard/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/             # Groupe routes protégées
│   │   │   ├── layout.tsx      # Layout avec sidebar + header
│   │   │   ├── page.tsx        # Home/Overview
│   │   │   ├── sms/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── campaigns/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   └── send/page.tsx
│   │   │   ├── email/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── campaigns/
│   │   │   │   ├── templates/
│   │   │   │   ├── automation/
│   │   │   │   └── analytics/
│   │   │   ├── whatsapp/
│   │   │   │   ├── page.tsx    # Inbox
│   │   │   │   ├── broadcasts/
│   │   │   │   └── chatbot/
│   │   │   ├── call-center/
│   │   │   │   ├── softphone/page.tsx   # Pour agents
│   │   │   │   ├── supervision/page.tsx # Pour superviseurs
│   │   │   │   ├── campaigns/
│   │   │   │   ├── ivr/
│   │   │   │   └── reports/
│   │   │   ├── contacts/
│   │   │   ├── integrations/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   └── login/page.tsx      # Redirection vers landing/login
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── NotificationBell.tsx
│   │   └── UserMenu.tsx
│   ├── dashboard/
│   │   ├── KPICard.tsx
│   │   ├── ChannelChart.tsx
│   │   └── ActivityFeed.tsx
│   ├── sms/
│   │   ├── SmsSendForm.tsx
│   │   ├── CampaignList.tsx
│   │   ├── CampaignEditor.tsx
│   │   └── SmsStats.tsx
│   ├── email/
│   │   ├── DragDropEditor.tsx  # Éditeur Drag & Drop
│   │   ├── TemplateGallery.tsx
│   │   └── AutomationBuilder.tsx
│   ├── whatsapp/
│   │   ├── ConversationList.tsx
│   │   ├── ConversationView.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ChatbotBuilder.tsx
│   ├── call-center/
│   │   ├── Softphone.tsx       # WebRTC Softphone (médiasoup)
│   │   ├── SupervisionBoard.tsx
│   │   ├── IvrBuilder.tsx
│   │   └── CallHistory.tsx
│   ├── contacts/
│   │   ├── ContactsTable.tsx
│   │   ├── ImportModal.tsx
│   │   └── SegmentBuilder.tsx
│   └── shared/
│       ├── DataTable.tsx
│       ├── Charts.tsx          # Recharts wrappers
│       ├── EmptyState.tsx
│       └── Pagination.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useSms.ts
│   ├── useEmail.ts
│   ├── useWhatsapp.ts
│   ├── useCallCenter.ts
│   ├── useBilling.ts
│   └── useWebSocket.ts         # Connexion temps réel
├── lib/
│   ├── api.ts                  # Client HTTP (fetch + auth headers)
│   ├── websocket.ts            # Socket.io client
│   └── constants.ts
├── store/
│   ├── auth.store.ts           # Zustand
│   ├── notifications.store.ts
│   └── callcenter.store.ts     # État softphone
├── messages/                   # i18n (10 langues)
└── package.json
```

## Critères de Succès

- [ ] Login redirige vers le dashboard selon le rôle
- [ ] KPIs affichés en temps réel (WebSocket)
- [ ] Campagne SMS créée depuis le dashboard et lancée
- [ ] Éditeur email Drag & Drop : ajouter bloc texte + image + bouton
- [ ] Conversation WhatsApp : lire et répondre en temps réel
- [ ] Softphone WebRTC : passer un appel test
- [ ] Supervision : voir l'état de tous les agents
- [ ] Contacts : importer 1000 contacts CSV
- [ ] Factures téléchargeables depuis Paramètres > Facturation
