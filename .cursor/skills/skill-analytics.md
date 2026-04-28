# Skill : Analytics Service – Actor Hub

## Quand utiliser ce skill
Utiliser pour tout travail sur `services/analytics-service/` :
- Tableaux de bord KPIs (call center, SMS, voix, messaging)
- Rapports périodiques (journalier, hebdomadaire, mensuel)
- Exports de données (CSV, Excel, PDF)
- Métriques temps réel (push WebSocket)
- Entonnoirs de conversion et tendances
- Alertes sur seuils de performance

---

## Architecture du service

```
services/analytics-service/
├── src/
│   ├── server.ts
│   ├── routes/
│   │   ├── dashboards.routes.ts     # Config dashboards personnalisés
│   │   ├── reports.routes.ts        # Rapports à la demande
│   │   ├── kpis.routes.ts           # Agrégats KPI
│   │   ├── exports.routes.ts        # Export CSV/Excel/PDF
│   │   └── realtime.routes.ts       # WebSocket métriques live
│   ├── services/
│   │   ├── aggregator.service.ts    # Agrégation des events entrants
│   │   ├── kpi.service.ts           # Calcul FCR, AHT, CSAT, etc.
│   │   ├── export.service.ts        # Génération fichiers export
│   │   └── alert.service.ts         # Moteur d'alertes
│   ├── consumers/
│   │   ├── call.consumer.ts         # Consomme events call-center
│   │   ├── sms.consumer.ts          # Consomme events sms
│   │   └── messaging.consumer.ts
│   ├── db/
│   │   └── schema.ts               # Time-series + agrégats
│   └── config/
│       └── env.ts
├── Dockerfile
└── openapi.yaml
```

---

## KPIs clés

```typescript
// KPIs Call Center
interface CallCenterKPIs {
  // Volume
  totalCalls: number
  inboundCalls: number
  outboundCalls: number
  missedCalls: number
  missedRate: number              // %

  // Qualité
  fcr: number                     // First Call Resolution %
  aht: number                     // Average Handle Time (secondes)
  asa: number                     // Average Speed to Answer (secondes)
  abandonRate: number             // % appels abandonnés
  serviceLevel: number            // % appels répondus en < 20s

  // Agents
  agentUtilization: number        // % temps agents en appel
  agentBreakTime: number          // minutes de pause
  averageCallsPerAgent: number

  // Satisfaction
  csat: number                    // Customer Satisfaction Score (1-5)
  nps: number                     // Net Promoter Score (-100 à +100)
}

// KPIs SMS
interface SMSKPIs {
  totalSent: number
  deliveryRate: number            // %
  clickRate: number               // % (si URL dans SMS)
  optOutRate: number              // %
  totalCost: number               // EUR
  costPerDeliveredSMS: number
}
```

---

## Variables d'environnement

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/analytics_db
CLICKHOUSE_URL=http://clickhouse:8123     # Pour time-series à volume
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://guest:guest@localhost:5672
S3_BUCKET_EXPORTS=actor-hub-exports
PORT=3008
```

---

## Endpoints API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/kpis/callcenter` | KPIs call center (avec filtres date/agent/queue) |
| GET | `/kpis/sms` | KPIs SMS |
| GET | `/kpis/messaging` | KPIs messaging (WhatsApp, email) |
| GET | `/kpis/voice` | KPIs voix |
| GET | `/reports` | Liste des rapports disponibles |
| POST | `/reports/generate` | Générer un rapport |
| GET | `/reports/:id/download` | Télécharger un rapport |
| GET | `/exports/csv` | Export CSV à la demande |
| WS | `/realtime` | Stream métriques temps réel |
| GET | `/dashboards` | Dashboards configurés |
| POST | `/dashboards` | Créer un dashboard personnalisé |

---

## Checklist avant PR

- [ ] Agrégats pré-calculés (horaire, journalier) pour performance
- [ ] Filtres : période, tenant, agent, queue, canal
- [ ] Exports : fichiers générés async (BullMQ) + notification quand prêt
- [ ] Données anonymisées si export partagé
- [ ] Alertes : notifications par email/webhook en < 1 min
