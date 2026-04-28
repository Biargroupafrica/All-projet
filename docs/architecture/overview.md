# Actor Hub – Architecture Technique

## Vue d'ensemble

```
                          ┌─────────────────────────────────┐
                          │       CDN / Edge (Vercel)        │
                          └──────────────┬──────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
             ┌──────▼──────┐    ┌───────▼──────┐    ┌───────▼──────┐
             │   Landing   │    │  Dashboard   │    │  Admin BO    │
             │ (Next.js)   │    │  (Next.js)   │    │  (Next.js)   │
             └─────────────┘    └──────────────┘    └──────────────┘
                                         │
                          ┌──────────────▼──────────────┐
                          │       API Gateway (:3000)    │
                          │  Auth │ Rate Limit │ Proxy   │
                          └──────────────┬──────────────┘
                                         │
          ┌──────────┬──────────┬────────┼──────────┬──────────┬──────────┐
          │          │          │        │          │          │          │
   ┌──────▼──┐ ┌─────▼──┐ ┌────▼────┐ ┌─▼──────┐ ┌▼──────┐ ┌▼──────┐ ┌▼──────┐
   │  Auth   │ │Billing │ │  Call   │ │  SMS  │ │Voice │ │  CRM  │ │ Msg   │
   │ :3001   │ │ :3002  │ │ Center  │ │ :3004 │ │:3005 │ │ :3006 │ │ :3007 │
   │         │ │        │ │  :3003  │ │       │ │      │ │       │ │       │
   └────┬────┘ └────┬───┘ └────┬────┘ └───┬───┘ └──┬───┘ └───┬───┘ └───┬───┘
        │           │          │           │        │          │         │
   ┌────▼────────────▼──────────▼───────────▼────────▼──────────▼─────────▼───┐
   │                          RabbitMQ (Events bus)                            │
   └───────────────────────────────┬───────────────────────────────────────────┘
                                   │
                          ┌────────▼────────┐
                          │   Analytics     │
                          │    :3008        │
                          └─────────────────┘

   Bases de données : PostgreSQL par service, Redis (cache/sessions/queues)
   Stockage fichiers : Azure Blob Storage (enregistrements, exports)
   Télép. : FreeSWITCH / Asterisk → PSTN / WebRTC
```

## Ports des services

| Service | Port | DB |
|---------|------|----|
| API Gateway | 3000 | - |
| Auth Service | 3001 | auth_db |
| Billing Service | 3002 | billing_db |
| Call Center Service | 3003 | callcenter_db |
| SMS Service | 3004 | sms_db |
| Voice Service | 3005 | voice_db |
| CRM Service | 3006 | crm_db |
| Messaging Service | 3007 | messaging_db |
| Analytics Service | 3008 | analytics_db |
| Tenant Service | 3009 | tenant_db |

## Communication inter-services

### Synchrone (HTTP/gRPC)
- Auth token validation (gateway → auth)
- Billing check avant envoi (SMS, Voice → billing)
- CRM lookup lors d'un appel entrant (call-center → crm)

### Asynchrone (RabbitMQ Events)
```
call-center.call.started     → analytics, crm
call-center.call.ended       → analytics, crm, billing
sms.message.sent             → analytics, billing
sms.message.delivered        → analytics
billing.subscription.changed → tenant, auth
tenant.user.invited          → auth, notification
messaging.conversation.opened → analytics
```

## Sécurité

- **Réseau** : services K8s communiquent via ClusterIP (pas exposés directement)
- **Auth** : JWT validé au gateway (sans appel auth-service en prod)
- **Données** : chiffrement au repos (PostgreSQL + Azure Transparent Data Encryption)
- **Secrets** : Azure Key Vault injecté via CSI driver K8s
- **RGPD** : PII chiffrées, logs anonymisés, rétention configurable

## Haute disponibilité

- **Chaque service** : minimum 2 replicas K8s
- **Auto-scaling** : HPA sur CPU > 70%
- **Base de données** : PostgreSQL avec réplicas de lecture
- **Redis** : cluster mode (3 nœuds)
- **RabbitMQ** : cluster de 3 nœuds avec HA queues
- **CDN** : assets statiques via Azure CDN
