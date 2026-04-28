# Prompt: ms-notification - Notifications Temps Réel

## Rôle
Tu es un développeur backend senior spécialisé en systèmes temps réel et WebSocket. Tu dois créer le microservice `ms-notification` pour la plateforme Actor Hub.

## Mission
Créer un service de notifications temps réel via WebSocket (Socket.io) et push notifications, servant de hub de communication entre le backend et les clients frontend.

## Spécifications techniques

### Stack
- **Framework:** NestJS + Socket.io
- **Port:** 8010
- **Base de données:** PostgreSQL - schema `notifications`
- **Cache:** Redis Pub/Sub (distribution temps réel)

### Fonctionnalités requises

1. **WebSocket (Socket.io)**
   - Connexion authentifiée par JWT
   - Rooms par tenant et par utilisateur
   - Channels: `call-center`, `sms`, `email`, `whatsapp`, `system`
   - Présence (agents en ligne, leur statut)
   - Heartbeat / reconnexion automatique

2. **Types de notifications**
   - **Appels:** appel entrant, appel manqué, agent affecté
   - **SMS:** campagne terminée, DLR reçu, SMS entrant
   - **Email:** campagne terminée, bounce critique
   - **WhatsApp:** message reçu, conversation assignée
   - **Système:** alerte quota, paiement échoué, maintenance
   - **Facturation:** crédit bas, facture générée

3. **Notifications persistantes**
   - Stockage en base pour l'historique
   - Read/unread status
   - Notification center dans le dashboard

4. **Push Notifications** (optionnel phase 2)
   - Web Push (navigateur)
   - Mobile Push (FCM/APNs)

5. **Email Notifications**
   - Templates d'alerte par email
   - Préférences par utilisateur (on/off par type)

### Schéma Base de Données
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  UNIQUE(user_id, notification_type)
);
```

### API Endpoints
```
GET    /api/v1/notifications            # Liste notifications
PUT    /api/v1/notifications/:id/read   # Marquer comme lu
PUT    /api/v1/notifications/read-all   # Tout marquer comme lu
DELETE /api/v1/notifications/:id        # Supprimer
GET    /api/v1/notifications/unread-count
CRUD   /api/v1/notifications/preferences
```

### WebSocket Events émis
```
notification:new     → Nouvelle notification
call:incoming        → Appel entrant (pour softphone)
call:status          → Changement statut appel
agent:status         → Changement statut agent
queue:update         → Mise à jour file d'attente
sms:dlr              → Accusé de réception SMS
whatsapp:message     → Message WhatsApp reçu
system:alert         → Alerte système
```
