# Prompt: ms-analytics - Analytics & Rapports

## Rôle
Tu es un développeur backend senior spécialisé en data analytics et reporting. Tu dois créer le microservice `ms-analytics` pour la plateforme Actor Hub.

## Mission
Créer un service d'analytics centralisé qui agrège les données de tous les modules (Call Center, SMS, Email, WhatsApp) pour fournir des dashboards temps réel, rapports planifiés et insights IA.

## Spécifications techniques

### Stack
- **Framework:** NestJS
- **Port:** 8009
- **Base de données:** PostgreSQL - schema `analytics` (tables d'agrégation)
- **Cache:** Redis (métriques temps réel)
- **Exports:** PDFKit (PDF), ExcelJS (Excel), CSV

### Fonctionnalités requises

1. **Dashboard Global Multi-Canal**
   - KPIs: messages envoyés, appels traités, taux de livraison, coût total
   - Graphiques de tendance (jour, semaine, mois)
   - Distribution par canal
   - Top performers (agents)

2. **Analytics par module**
   - **Call Center:** appels traités, durée moyenne, taux d'abandon, SLA, CSAT
   - **SMS:** envoyés, livrés, échoués, coût, ROI
   - **Email:** envoyés, ouverts, cliqués, bouncés, désabonnés
   - **WhatsApp:** envoyés, livrés, lus, temps de réponse

3. **Rapports planifiés**
   - Quotidiens, hebdomadaires, mensuels
   - Envoi automatique par email (PDF)
   - Rapports personnalisés (date range, filtres)

4. **Exports**
   - PDF (rapports formatés)
   - Excel (données brutes)
   - CSV (import dans d'autres outils)

5. **Temps réel**
   - Métriques en temps réel via WebSocket (ms-notification)
   - Wallboard pour call center (grands écrans)
   - Heatmap d'engagement

### API Endpoints
```
GET  /api/v1/analytics/overview         # Dashboard global
GET  /api/v1/analytics/call-center      # Analytics call center
GET  /api/v1/analytics/sms              # Analytics SMS
GET  /api/v1/analytics/email            # Analytics email
GET  /api/v1/analytics/whatsapp         # Analytics WhatsApp
GET  /api/v1/analytics/agents           # Performance agents
GET  /api/v1/analytics/trends           # Tendances

POST /api/v1/analytics/reports/generate  # Générer rapport
GET  /api/v1/analytics/reports           # Liste rapports
GET  /api/v1/analytics/reports/:id/download

POST /api/v1/analytics/export/pdf       # Export PDF
POST /api/v1/analytics/export/excel     # Export Excel
POST /api/v1/analytics/export/csv       # Export CSV
```

### Events consommés (depuis les autres microservices)
```
call.*       → Agrégation métriques call center
sms.*        → Agrégation métriques SMS
email.*      → Agrégation métriques email
whatsapp.*   → Agrégation métriques WhatsApp
```
