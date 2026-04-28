# Skill 07 — Couche CPaaS API (REST & Webhooks)

## Quand utiliser ce skill
Lorsque vous travaillez sur les APIs REST exposées aux développeurs, la documentation API, les webhooks, les intégrations tierces, ou le portail développeur.

## Concept CPaaS (Communication Platform as a Service)

Actor Hub expose ses fonctionnalités de communication via des APIs REST standard, permettant à n'importe quel développeur d'intégrer :
- Envoi de SMS (unitaire et bulk)
- Appels vocaux (initier, gérer)
- Messages WhatsApp (templates, conversations)
- Emails transactionnels
- OTP (One-Time Password) multicanal
- Lookup (HLR, numéro, géolocalisation)

## Structure des APIs

### Base URL
```
https://api.actorhub.io/v1/
```

### Authentification
```http
Authorization: Bearer {API_KEY}
X-Tenant-ID: {TENANT_ID}
Content-Type: application/json
```

### Endpoints Principaux

#### SMS
```
POST   /v1/sms/send              — Envoyer un SMS
POST   /v1/sms/bulk              — Envoi en masse
GET    /v1/sms/messages/{id}     — Statut message
GET    /v1/sms/messages          — Historique
POST   /v1/sms/otp/send          — Envoyer OTP SMS
POST   /v1/sms/otp/verify        — Vérifier OTP
GET    /v1/sms/hlr/{number}      — Vérification HLR
GET    /v1/sms/balance           — Solde crédits
POST   /v1/webhooks/sms/dlr      — Webhook DLR entrant
```

#### Voice
```
POST   /v1/voice/call            — Initier un appel
POST   /v1/voice/call/{id}/hold  — Mettre en attente
POST   /v1/voice/call/{id}/transfer — Transférer
DELETE /v1/voice/call/{id}       — Raccrocher
GET    /v1/voice/calls           — Historique appels
GET    /v1/voice/call/{id}/recording — Enregistrement
POST   /v1/voice/tts             — Text-to-Speech
```

#### WhatsApp
```
POST   /v1/whatsapp/send         — Envoyer message
POST   /v1/whatsapp/template     — Envoyer template
POST   /v1/whatsapp/broadcast    — Diffusion
GET    /v1/whatsapp/messages     — Historique
GET    /v1/whatsapp/templates    — Lister templates
POST   /v1/whatsapp/otp          — OTP WhatsApp
POST   /v1/webhooks/whatsapp     — Webhook entrant
```

#### Email
```
POST   /v1/email/send            — Envoyer email
POST   /v1/email/batch           — Envoi en masse
GET    /v1/email/messages/{id}   — Statut
POST   /v1/email/template        — Envoyer par template
GET    /v1/email/analytics       — Analytics
```

#### Contacts & Lookup
```
GET    /v1/lookup/number/{phone} — Infos numéro
GET    /v1/lookup/hlr/{phone}    — HLR lookup
POST   /v1/contacts              — Créer contact
GET    /v1/contacts              — Lister contacts
PUT    /v1/contacts/{id}         — Mettre à jour
DELETE /v1/contacts/{id}         — Supprimer
```

## Modèle de Données API

```sql
-- Clés API
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE, -- hash SHA256 de la clé
  key_prefix TEXT NOT NULL,      -- ex: "ah_live_abc123" (affichage)
  permissions TEXT[] DEFAULT '{}', -- sms:send, voice:call, etc.
  rate_limit_per_minute INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Logs API
CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  api_key_id UUID REFERENCES api_keys(id),
  method TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  request_body JSONB,
  response_body JSONB,
  duration_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Configuration Webhooks
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT '{}', -- sms.delivered, call.ended, etc.
  secret TEXT NOT NULL, -- pour vérifier signature
  is_active BOOLEAN DEFAULT true,
  retry_count INTEGER DEFAULT 3,
  last_triggered_at TIMESTAMPTZ,
  success_rate DECIMAL(5,2) DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Logs Webhooks
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  webhook_id UUID REFERENCES webhooks(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  attempt_number INTEGER DEFAULT 1,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Implémentation API Gateway

```typescript
// Middleware d'authentification API
async function apiAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: 'API key required' })
  }
  
  // Hash la clé et chercher en DB
  const keyHash = await sha256(token)
  const apiKey = await db.query(
    'SELECT * FROM api_keys WHERE key_hash = $1 AND is_active = true',
    [keyHash]
  )
  
  if (!apiKey || (apiKey.expires_at && apiKey.expires_at < new Date())) {
    return res.status(401).json({ error: 'Invalid or expired API key' })
  }
  
  // Rate limiting
  const usage = await redis.incr(`rate:${apiKey.id}:${Math.floor(Date.now() / 60000)}`)
  if (usage > apiKey.rate_limit_per_minute) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded',
      retry_after: 60 - (Date.now() % 60000) / 1000
    })
  }
  
  req.tenant = { id: apiKey.tenant_id }
  req.apiKey = apiKey
  next()
}

// Endpoint SMS Send
app.post('/v1/sms/send', apiAuthMiddleware, async (req, res) => {
  const { to, message, from, callback_url } = req.body
  
  // Validation
  if (!to || !message) {
    return res.status(400).json({ error: 'Missing required fields: to, message' })
  }
  
  // Vérifier permissions
  if (!req.apiKey.permissions.includes('sms:send')) {
    return res.status(403).json({ error: 'Permission denied: sms:send' })
  }
  
  // Envoyer SMS
  const result = await smsService.send({
    tenantId: req.tenant.id,
    to,
    message,
    from,
    callbackUrl: callback_url,
  })
  
  // Logger la requête
  await logApiRequest(req, 200, result)
  
  return res.status(200).json({
    message_id: result.id,
    status: 'queued',
    to: result.to,
    parts: result.partsCount,
    cost: result.cost,
  })
})
```

## Prompts pour le Module CPaaS API

### Prompt — Portail Développeur / Documentation API
```
Crée une page de documentation API interactive pour Actor Hub CPaaS.
Style : Inspiré de Twilio, Stripe, SendGrid.
Structure :
- Sidebar gauche : navigation par section (SMS, Voice, WhatsApp, Email, Lookup)
- Zone centrale : documentation avec exemples
- Zone droite : code samples (multi-langage)

Pour chaque endpoint :
- Description de l'action
- Paramètres requis/optionnels avec types
- Exemple de requête (cURL, Python, Node.js, PHP)
- Exemple de réponse JSON succès
- Exemple de réponse JSON erreur
- Codes d'erreur possibles

Section "Quickstart" : Guide 5 minutes pour envoyer son premier SMS.
Section "Webhooks" : Comment configurer et vérifier les callbacks.
Section "SDKs" : liens vers SDK npm, pip, composer.
```

### Prompt — Gestionnaire de Clés API
```
Crée l'interface de gestion des clés API dans le dashboard.
Fonctionnalités :
- Liste des clés actives : nom, préfixe (ah_live_xxx), permissions, créée le, dernière utilisation
- Créer une clé : nom, sélection permissions (cases à cocher par canal), expiration optionnelle
- Afficher clé une seule fois à la création (copier + alerte)
- Révoquer une clé (confirmation requise)
- Statistiques d'utilisation par clé (appels/jour, taux erreur)
- Test rapide intégré : tester l'envoi SMS avec la clé
Alerte si clé non utilisée depuis 30 jours.
```

### Prompt — Gestion des Webhooks
```
Crée l'interface de configuration des webhooks pour Actor Hub.
Fonctionnalités :
- Liste des webhooks : URL, événements écoutés, statut, taux succès
- Créer webhook : URL cible, liste des événements (checkbox : sms.delivered, call.ended, etc.)
- Test webhook : envoyer un payload test et voir la réponse
- Logs webhook : historique des derniers envois (succès/échec), payload, réponse HTTP
- Retry automatique : configuration des tentatives (0 à 5)
- Signature HMAC : afficher le secret, guide pour vérifier la signature
Exemples de payload JSON pour chaque type d'événement.
```

### Prompt — API Logs & Monitoring
```
Crée un dashboard de monitoring des APIs pour Actor Hub.
Sections :
- Métriques globales : requêtes/heure, taux de succès %, latence P50/P95, erreurs
- Graphique temps réel : volume API par endpoint (15 dernières minutes)
- Top endpoints : par volume, par latence, par erreurs
- Log explorer : tableau filtrable (endpoint, status, clé API, date, durée)
  - Cliquer sur une ligne : détails requête/réponse complète
- Alertes : erreur > 5% → notification email/Slack
- Statut page publique : uptime des APIs (style statuspage.io)
```

### Prompt — SDK Node.js / Python (Génération)
```
Génère un SDK Node.js pour l'API Actor Hub CPaaS.
Le SDK doit inclure :

import ActorHub from '@actorhub/sdk'
const client = new ActorHub({ apiKey: 'ah_live_xxx', tenantId: 'xxx' })

// SMS
await client.sms.send({ to: '+212600000000', message: 'Hello!' })
await client.sms.bulk([{ to: '+212600000000', message: 'Bonjour {name}' }])
await client.sms.otp.send({ to: '+212600000000', length: 6 })

// Voice
const call = await client.voice.call({ to: '+212600000000', from: '+33700000000' })
await call.hold()
await call.hangup()

// WhatsApp
await client.whatsapp.send({ to: '+212600000000', message: 'Bonjour!' })
await client.whatsapp.template({ to: '...', template: 'welcome', variables: ['Ahmed'] })

Gestion auto des erreurs, retry, rate limiting, TypeScript types complets.
```

## Tests à réaliser
- [ ] Génération et révocation de clé API
- [ ] SMS send via API (avec et sans clé invalide)
- [ ] Rate limiting (dépasser la limite → 429)
- [ ] Webhook configuré et déclenché à l'envoi SMS
- [ ] Vérification signature HMAC du webhook
- [ ] Logs API : chaque requête enregistrée
- [ ] API Lookup HLR : numéro valide et invalide
- [ ] Monitoring : graphique temps réel mis à jour
- [ ] Documentation : playground fonctionnel
