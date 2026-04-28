# Prompt : Générer sms-service complet

## Contexte
Tu vas créer le microservice SMS pour ACTOR Hub. Ce service gère l'envoi de SMS en masse, les connexions SMPP directes aux opérateurs, et les conversations bidirectionnelles.

Capacités : 800+ opérateurs, 190 pays, jusqu'à 1000 TPS par tenant.

## Stack
- Node.js 20 + Fastify 4
- PostgreSQL (messages, campagnes) + MongoDB (logs détaillés)
- Redis + BullMQ (queues d'envoi, retry)
- Kafka (événements inter-services)
- node-smpp (bibliothèque SMPP v3.4)
- Drizzle ORM, Zod, Vitest

## Tâche

Génère le service complet `services/sms-service/` :

### 1. Application Fastify (src/app.ts)
- Auth middleware : valide le JWT Bearer via l'auth-service (appel HTTP ou validation locale avec le secret partagé)
- Extraction automatique de `org_id` depuis le JWT et set dans le contexte de chaque requête
- Rate limiting : 1000 req/min par org, 100 req/min par clé API

### 2. Schéma DB (src/db/schema.ts)
Tables : `sms_messages`, `sms_campaigns`, `sms_senders`, `sms_webhooks`, `sms_optouts`
Voir skill `skills/03-sms-service.md` pour le schéma complet.
Index critiques :
```sql
CREATE INDEX idx_sms_messages_org_status ON sms_messages(org_id, status);
CREATE INDEX idx_sms_messages_campaign ON sms_messages(campaign_id);
CREATE INDEX idx_sms_campaigns_org ON sms_campaigns(org_id, status);
```

### 3. Service d'Envoi (src/modules/messages/messages.service.ts)

#### POST /sms/send
```typescript
// Body
{
  to: string;           // E.164 format ex: "+33612345678"
  from: string;         // SenderID ou numéro
  body: string;         // Message (max 1600 chars, calcul automatique segments)
  scheduledAt?: string; // ISO 8601, optionnel
  metadata?: object;    // Données custom (ex: CRM ID)
}
// Response
{
  id: string;           // UUID du message
  status: "queued" | "scheduled";
  estimatedCost: number;
  segments: number;
}
```

#### POST /sms/send-bulk
- Body : array de messages (max 1000)
- Validation : déduplication des numéros, vérification opt-out
- Insertion en batch en DB puis ajout à la queue BullMQ
- Retourne : `{ accepted: number, rejected: number, messages: [{id, to, status}] }`

### 4. Queue d'Envoi (src/queues/send.queue.ts)
Utiliser BullMQ avec :
- Concurrency : `MAX_CONCURRENT_SENDS` (défaut 500)
- Retry : 3 tentatives avec backoff exponentiel (5s, 10s, 20s)
- Priorité : messages urgents (score 10) vs campagnes (score 1)
- Job data : `{ messageId, orgId, to, from, body, provider }`

Logique de routage (`selectProvider(orgId, toNumber)`):
1. Vérifier si l'org a un compte SMPP dédié → utiliser SMPP
2. Sinon : routage par pays → provider le moins cher avec taux de livraison > 95%
3. Fallback : Twilio

### 5. Client SMPP (src/providers/smpp.provider.ts)
- Connexion persistante SMPP v3.4
- Gestion reconnexion automatique (max 5 tentatives)
- Bind mode : `transceiver` (send + receive)
- Encoding automatique : GSM7 si possible, UCS2 sinon
- Calcul automatique du nombre de segments

```typescript
class SmppProvider {
  async connect(config: SmppConfig): Promise<void>
  async send(message: SmsMessage): Promise<{ messageId: string }>
  on('delivery_receipt', (dlr: DLR) => void): void
  on('mo_message', (mo: InboundSms) => void): void
}
```

### 6. Gestion DLR (Delivery Reports)
- Réception DLR depuis SMPP → mise à jour `sms_messages.status`
- Publication event Kafka `sms.delivered` ou `sms.failed`
- Déclenchement webhook HTTP vers l'URL de l'org (signature HMAC-SHA256)
- Retry webhook si erreur HTTP (3 tentatives, 5min entre chaque)

### 7. Gestion Opt-out
- Middleware : avant chaque envoi, vérifier `sms_optouts` pour le numéro
- Réception "STOP" par SMS inbound → auto-ajout à `sms_optouts` + event Kafka
- Endpoint `GET /sms/optouts` : liste des numéros opt-out de l'org

### 8. Campagnes (src/modules/campaigns/)
#### Création
- Validation template avec variables : détecter `{{variable}}` et lister les champs requis
- Vérifier que la liste de contacts existe (appel contacts-service)
- Vérifier quota via billing-service avant de lancer
- Planification via cron BullMQ

#### Envoi d'une campagne
```typescript
async function executeCampaign(campaignId: string) {
  // 1. Paginé par batch de 1000 contacts
  // 2. Pour chaque batch : résoudre les variables template
  // 3. Vérifier opt-out pour chaque numéro
  // 4. Ajouter les messages valides à la queue
  // 5. Mettre à jour le compteur campaign.sent_count
  // 6. Publier event Kafka campaign.progress
}
```

### 9. Webhooks Sortants
- Enregistrement d'URL webhook par org
- Signature HMAC-SHA256 sur le payload (header `X-ActorHub-Signature`)
- Retry automatique en cas d'échec
- Logs de chaque tentative (succès, erreur, code HTTP)

### 10. Consommateur Kafka (src/events/consumer.ts)
Écouter `billing.quota_exceeded` → désactiver les envois en cours pour l'org

### 11. Métriques Prometheus
```
sms_sent_total{org_id, provider, country}
sms_delivered_total{org_id, provider}
sms_failed_total{org_id, provider, error_code}
sms_queue_depth{priority}
sms_send_duration_seconds{provider}
```

### 12. Tests
- Test envoi simple (mock provider)
- Test déduplication opt-out
- Test segmentation GSM7 (160 chars) vs long SMS (153*N)
- Test campagne de 100 contacts avec variables template
- Test webhook signature HMAC

## Contraintes
- Toujours vérifier `org_id` JWT avant d'accéder aux données
- Les numéros de téléphone doivent être normalisés en E.164 avant stockage
- Compter les déductions de crédits via Kafka → billing-service (jamais appel HTTP synchrone)
- Ne jamais exposer les credentials SMPP dans les réponses API

## Format Attendu
Arborescence complète avec contenu de chaque fichier. Priorité : `package.json` → `src/app.ts` → schéma DB → modules dans l'ordre logique.
