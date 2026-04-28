# Prompt — API CPaaS (Communications Platform as a Service)

## Contexte

Actor Hub expose une **API CPaaS publique** permettant aux développeurs d'intégrer les fonctionnalités de communication directement dans leurs applications.

Cette API est la couche "développeurs" de la plateforme — équivalent à Twilio, Vonage, ou Infobip.

---

## Philosophie de l'API CPaaS

- **REST** : Endpoints clairs et prévisibles
- **Versionning** : `/v1/`, `/v2/` pour ne jamais casser les intégrations existantes
- **Authentification** : API Keys (pas de JWT pour les apps client)
- **Idempotence** : Chaque requête peut porter un `idempotency-key`
- **Webhooks** : Pour les événements asynchrones (DLR, statuts, messages entrants)
- **SDKs** : Bibliothèques officielles (JavaScript/Node, Python, PHP, Java)

---

## Authentification API

### API Keys
```http
Authorization: Bearer ak_live_xxxxxxxxxxxxxxxxxxxx
```

Types de clés :
- `ak_live_xxx` : Clé de production
- `ak_test_xxx` : Clé de test (pas de vraie facturation)

### Headers obligatoires
```http
Content-Type: application/json
Authorization: Bearer {api_key}
X-Idempotency-Key: {uuid}   # Optionnel, pour l'idempotence
```

---

## API SMS CPaaS

### Envoyer un SMS

```http
POST /v1/sms/send
```

**Corps de la requête :**
```json
{
  "from": "ACTOR",
  "to": "+22670123456",
  "message": "Bonjour {{prenom}}, votre commande est prête.",
  "variables": { "prenom": "Amadou" },
  "callback_url": "https://yourapp.com/webhooks/sms",
  "reference": "order-789",
  "schedule_at": null,
  "type": "marketing"
}
```

**Réponse :**
```json
{
  "success": true,
  "message_id": "sms_01HXXXXXX",
  "status": "queued",
  "credits_used": 1,
  "remaining_credits": 4999
}
```

### Statut d'un SMS

```http
GET /v1/sms/{message_id}
```

```json
{
  "message_id": "sms_01HXXXXXX",
  "status": "delivered",
  "delivered_at": "2026-04-28T10:30:00Z",
  "operator": "Orange Burkina",
  "country": "BF"
}
```

### Envoi en masse

```http
POST /v1/sms/bulk
```

```json
{
  "from": "ACTOR",
  "messages": [
    { "to": "+22670111111", "message": "Bonjour Amadou" },
    { "to": "+22670222222", "message": "Bonjour Fatima" }
  ],
  "callback_url": "https://yourapp.com/webhooks/sms/bulk",
  "campaign_name": "Promo Ramadan 2026"
}
```

---

## API Voix CPaaS (Call Center)

### Passer un appel sortant

```http
POST /v1/voice/calls
```

```json
{
  "from": "+33170000000",
  "to": "+22670123456",
  "webhook_url": "https://yourapp.com/webhooks/call",
  "record": true,
  "timeout": 30
}
```

**Réponse :**
```json
{
  "call_id": "call_01HXXXXXX",
  "status": "ringing",
  "from": "+33170000000",
  "to": "+22670123456"
}
```

### IVR — Contrôle du flux vocal (TwiML-like)

```http
POST /v1/voice/instructions    # Endpoint retourné par votre webhook
```

```json
{
  "instructions": [
    {
      "type": "say",
      "text": "Bienvenue chez Actor Hub. Tapez 1 pour le support, 2 pour les ventes.",
      "voice": "fr-FR-Standard-A",
      "language": "fr-FR"
    },
    {
      "type": "gather",
      "timeout": 5,
      "num_digits": 1,
      "action": "/v1/voice/gather-result"
    }
  ]
}
```

### Terminer un appel

```http
DELETE /v1/voice/calls/{call_id}
```

---

## API WhatsApp CPaaS

### Envoyer un message texte

```http
POST /v1/whatsapp/messages
```

```json
{
  "from": "+33170000000",
  "to": "+22670123456",
  "type": "text",
  "text": {
    "body": "Bonjour ! Comment puis-je vous aider ?"
  }
}
```

### Envoyer un template

```http
POST /v1/whatsapp/messages
```

```json
{
  "from": "+33170000000",
  "to": "+22670123456",
  "type": "template",
  "template": {
    "name": "order_confirmation",
    "language": "fr",
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Amadou" },
          { "type": "text", "text": "CMD-12345" },
          { "type": "text", "text": "45 000 FCFA" }
        ]
      }
    ]
  }
}
```

### Envoyer un message interactif (boutons)

```json
{
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": { "text": "Votre livraison est en route. Quelle option choisissez-vous ?" },
    "action": {
      "buttons": [
        { "type": "reply", "reply": { "id": "track", "title": "Suivre ma livraison" } },
        { "type": "reply", "reply": { "id": "contact", "title": "Contacter le livreur" } }
      ]
    }
  }
}
```

---

## API Email CPaaS

### Envoyer un email transactionnel

```http
POST /v1/email/send
```

```json
{
  "from": { "email": "noreply@votremarque.com", "name": "Votre Marque" },
  "to": [{ "email": "client@example.com", "name": "Jean Dupont" }],
  "subject": "Confirmation de commande #CMD-12345",
  "template_id": "order_confirmation",
  "variables": {
    "client_name": "Jean Dupont",
    "order_id": "CMD-12345",
    "total": "45 000 FCFA",
    "delivery_date": "30 Avril 2026"
  },
  "attachments": [
    {
      "filename": "facture.pdf",
      "content": "base64_encoded_content",
      "type": "application/pdf"
    }
  ],
  "track_opens": true,
  "track_clicks": true
}
```

---

## Webhooks CPaaS

### Configuration d'un webhook

```http
POST /v1/webhooks
```

```json
{
  "url": "https://yourapp.com/webhooks/actor",
  "events": ["sms.delivered", "sms.failed", "whatsapp.message.received", "call.ended"],
  "secret": "your-webhook-secret"
}
```

### Format de signature des webhooks

Chaque webhook est signé avec HMAC-SHA256 :
```http
X-Actor-Signature: sha256=abc123...
X-Actor-Timestamp: 1714298400
```

### Validation côté récepteur (Node.js)

```javascript
const crypto = require('crypto');

function validateWebhook(payload, signature, secret) {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return `sha256=${expectedSig}` === signature;
}
```

### Événements disponibles

```
sms.queued              # SMS mis en file d'attente
sms.sent               # SMS envoyé à l'opérateur
sms.delivered          # SMS délivré (DLR reçu)
sms.failed             # SMS en échec
sms.mo.received        # SMS entrant (MO)

call.initiated         # Appel initié
call.ringing           # Appel sonne
call.answered          # Appel décroché
call.ended             # Appel terminé
call.recording.ready   # Enregistrement disponible

whatsapp.message.received    # Message reçu
whatsapp.status.delivered    # Message délivré
whatsapp.status.read         # Message lu

email.delivered        # Email délivré
email.opened           # Email ouvert
email.clicked          # Lien cliqué
email.bounced          # Email rejeté (bounce)
email.complained       # Signalé comme spam
email.unsubscribed     # Désabonnement
```

---

## SDKs officiels

### JavaScript / Node.js

```javascript
const { ActorHub } = require('@actorhub/sdk');

const client = new ActorHub({ apiKey: 'ak_live_xxx' });

// SMS
const result = await client.sms.send({
  from: 'ACTOR',
  to: '+22670123456',
  message: 'Votre code est : 123456'
});

// WhatsApp
await client.whatsapp.send({
  from: '+33170000000',
  to: '+22670123456',
  type: 'text',
  text: { body: 'Bonjour !' }
});

// Voice
const call = await client.voice.calls.create({
  from: '+33170000000',
  to: '+22670123456'
});
```

### Python

```python
from actorhub import ActorHub

client = ActorHub(api_key='ak_live_xxx')

# SMS
result = client.sms.send(
    from_='ACTOR',
    to='+22670123456',
    message='Votre code est : 123456'
)
print(result.message_id)
```

### PHP

```php
use ActorHub\Client;

$client = new Client('ak_live_xxx');

// SMS
$message = $client->sms()->send([
    'from' => 'ACTOR',
    'to' => '+22670123456',
    'message' => 'Votre code est : 123456'
]);
```

---

## Tarification API CPaaS (CPaaS as a Service)

Structure de tarification :
- **Pay-as-you-go** : Facturation à l'usage
- **Bundles** : Packs de messages à tarif réduit
- **Enterprise** : Tarifs négociés sur volume

Facturation basée sur :
- SMS : par message (dépend du pays et opérateur)
- Voix : par minute (entrant / sortant)
- WhatsApp : par conversation 24h (selon catégorie Meta)
- Email : par email envoyé

---

## Documentation interactive (Swagger UI)

**URL** : `https://api.actorhub.com/docs`

- Interface Swagger/Redoc
- Playground intégré (test des endpoints avec la clé API)
- Exemples de code pour chaque endpoint
- Changelog des versions API
