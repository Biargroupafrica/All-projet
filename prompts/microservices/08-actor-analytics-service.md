# Prompt: Actor Analytics Service - Microservice Reporting & Analytics

## Contexte
Tu es un développeur senior spécialisé en data analytics et visualisation. Tu dois créer le microservice **Actor Analytics** pour la plateforme Actor Hub. Ce service agrège les données de tous les modules pour fournir des tableaux de bord, rapports, et KPIs en temps réel.

## Mission
Créer un microservice analytics autonome qui collecte, agrège et expose les métriques de performance de l'ensemble de la plateforme (Call Center, SMS, WhatsApp, Email) avec des dashboards temps réel et des rapports exportables.

## Spécifications techniques

### Stack
- **Runtime** : Node.js 20+ / NestJS
- **Base de données** : PostgreSQL (schéma `analytics`) + TimescaleDB (séries temporelles)
- **Cache** : Redis (métriques temps réel)
- **Queue** : Redis + Bull (agrégation asynchrone)
- **ORM** : Prisma

### Endpoints API
```
# Dashboard global
GET  /api/v1/analytics/dashboard            # KPIs globaux
GET  /api/v1/analytics/dashboard/realtime    # Métriques temps réel (WebSocket)

# Call Center Analytics
GET  /api/v1/analytics/callcenter/overview   # Vue d'ensemble
GET  /api/v1/analytics/callcenter/agents     # Performance agents
GET  /api/v1/analytics/callcenter/queues     # Stats files d'attente
GET  /api/v1/analytics/callcenter/campaigns  # Stats campagnes
GET  /api/v1/analytics/callcenter/quality    # Qualité d'appel

# SMS Analytics
GET  /api/v1/analytics/sms/overview          # Vue d'ensemble SMS
GET  /api/v1/analytics/sms/campaigns         # Stats campagnes
GET  /api/v1/analytics/sms/dlr              # Taux de livraison
GET  /api/v1/analytics/sms/operators         # Par opérateur
GET  /api/v1/analytics/sms/geo              # Géographique

# WhatsApp Analytics
GET  /api/v1/analytics/whatsapp/overview     # Vue d'ensemble
GET  /api/v1/analytics/whatsapp/messages     # Stats messages
GET  /api/v1/analytics/whatsapp/broadcasts   # Stats broadcasts
GET  /api/v1/analytics/whatsapp/chatbot      # Performance chatbot

# Email Analytics
GET  /api/v1/analytics/email/overview        # Vue d'ensemble
GET  /api/v1/analytics/email/deliverability  # Délivrabilité
GET  /api/v1/analytics/email/engagement      # Engagement
GET  /api/v1/analytics/email/campaigns       # Stats campagnes

# Rapports
GET  /api/v1/reports                         # Lister les rapports
POST /api/v1/reports/generate                # Générer un rapport
GET  /api/v1/reports/:id/download            # Télécharger (PDF/Excel)
POST /api/v1/reports/schedule                # Planifier un rapport

# Filtres communs pour tous les endpoints
# ?from=2026-01-01&to=2026-03-31    (période)
# ?granularity=hour|day|week|month   (granularité)
# ?agent_id=xxx                      (par agent)
# ?queue_id=xxx                      (par file)
```

### KPIs par module
```typescript
// Call Center KPIs
interface CallCenterKPIs {
  totalCalls: number;
  answeredCalls: number;
  missedCalls: number;
  answerRate: number;
  averageHandleTime: number; // en secondes
  averageWaitTime: number;
  serviceLevel: number; // % d'appels répondus en < 20s
  abandonRate: number;
  firstCallResolution: number;
  agentsOnline: number;
  agentsBusy: number;
  callsInQueue: number;
  longestWaitTime: number;
  customerSatisfaction: number; // CSAT
}

// SMS KPIs
interface SMSKPIs {
  totalSent: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  averageDeliveryTime: number;
  costTotal: number;
  costPerSMS: number;
  campaignsActive: number;
  topOperators: Array<{ name: string; count: number }>;
}

// WhatsApp KPIs
interface WhatsAppKPIs {
  totalMessages: number;
  messagesSent: number;
  messagesReceived: number;
  deliveryRate: number;
  readRate: number;
  responseTime: number;
  activeConversations: number;
  broadcastsSent: number;
  chatbotInteractions: number;
  accountQuality: string;
}

// Email KPIs
interface EmailKPIs {
  totalSent: number;
  delivered: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  complaintRate: number;
  avgDeliveryTime: number;
}
```

### Événements consommés (depuis les autres services)
```typescript
// Tous les événements des services sont consommés pour agrégation
'callcenter.call.*'
'sms.message.*'
'sms.campaign.*'
'whatsapp.message.*'
'whatsapp.broadcast.*'
'email.email.*'
'email.campaign.*'
'billing.credits.*'
'auth.user.*'
```

## Critères d'acceptation
- [ ] Dashboard global avec KPIs de tous les modules
- [ ] Métriques temps réel via WebSocket
- [ ] Filtrage par période, agent, file, campagne
- [ ] Granularité configurable (heure, jour, semaine, mois)
- [ ] Export rapports en PDF et Excel
- [ ] Rapports planifiés (envoi par email)
- [ ] Séries temporelles avec TimescaleDB
- [ ] Cache Redis pour les requêtes fréquentes
