# Prompt — Microservice Actor Bulk SMS

## Contexte

Tu développes le **microservice Actor Bulk SMS** de la plateforme Actor Hub.
Ce module est **autonome** : envoi de SMS en masse, campagnes, OTP, A2P, deux sens (MO/MT).

**Protocoles** : SMPP 3.4 (opérateurs), HTTP REST (clients), webhooks DLR

---

## Architecture du microservice

```
services/bulk-sms/
├── smpp-gateway/           # Connexion SMPP vers opérateurs
│   ├── smpp-client.ts      # Client SMPP (smpp npm package)
│   ├── connection-pool.ts  # Pool de connexions SMPP
│   └── dlr-handler.ts      # Gestion des accusés de réception
├── scheduler/              # Planification des campagnes
│   ├── campaign-worker.ts  # Worker de traitement
│   └── queue-manager.ts    # Queue Bull/BullMQ
├── api/
│   ├── controllers/
│   │   ├── sms.controller.ts
│   │   ├── campaigns.controller.ts
│   │   ├── contacts.controller.ts
│   │   ├── templates.controller.ts
│   │   └── reports.controller.ts
│   └── routes/
├── analytics/
└── Dockerfile
```

---

## Fonctionnalités à développer (Frontend)

### 1. SMS Simple (`/dashboard/sms-single`)
**Composant existant** : `sms-single.tsx`

- Champ destinataire (numéro international ou sélection contact)
- Éditeur de message avec compteur de caractères
- Sélection de l'expéditeur (Sender ID)
- Aperçu du SMS (composant `sms-preview.tsx`)
- Bouton Envoyer → confirmation → feedback

### 2. SMS en masse (`/dashboard/sms-bulk`)
**Composant existant** : `sms-bulk.tsx`

- Upload de fichier CSV/Excel (contacts + variables)
- Sélection de listes de contacts
- Éditeur de message avec variables de personnalisation (`{{prenom}}`, `{{société}}`)
- Planification (immédiat / date/heure)
- Estimation du coût avant envoi
- Résumé de campagne

### 3. Campagnes SMS (`/dashboard/sms-campaign-reports`)
**Composant existant** : `sms-campaign-reports.tsx`

- Liste des campagnes avec statut (Planifiée / En cours / Terminée / Échouée)
- Rapport détaillé par campagne :
  - Envoyés / Délivrés / Échec / En cours
  - Taux de délivrabilité
  - Graphique temporel
  - Détail par numéro (DLR)
- Export CSV/Excel/PDF

### 4. Contacts SMS (`/dashboard/sms-contacts-manager`)
**Composant existant** : `sms-contacts-manager-enhanced.tsx`

- CRUD contacts
- Import CSV/Excel avec mapping de colonnes
- Dédoublonnage automatique
- Gestion des opt-out (STOP)
- Segmentation par tags

### 5. Listes de contacts (`/dashboard/sms-lists-manager`)
**Composant existant** : `sms-lists-manager.tsx`

- Création / modification de listes
- Ajout de contacts individuels ou en masse
- Combinaison de listes
- Exportation

### 6. Templates SMS (`/dashboard/sms-templates`)
**Composant existant** : `sms-templates.tsx`

- Bibliothèque de templates par catégorie (Marketing, OTP, Transactionnel, Alerte)
- Éditeur avec variables
- Aperçu mobile
- Partage entre utilisateurs du tenant

### 7. SMS Planifiés (`/dashboard/sms-scheduled`)
**Composant existant** : `sms-scheduled.tsx`

- Liste des SMS/campagnes planifiés
- Modification avant envoi
- Annulation

### 8. Analytics SMS (`/dashboard/sms-analytics-enhanced`)
**Composant existant** : `sms-analytics-enhanced.tsx`

- Tableaux de bord avec graphiques :
  - Volume d'envois dans le temps
  - Taux de délivrabilité par opérateur
  - Distribution géographique
  - Heatmap des créneaux de meilleure délivrabilité
- Filtres : période, campagne, sender ID, opérateur

### 9. Rapport DLR (`/dashboard/dlr-report`)
**Composant existant** : `dlr-report.tsx`

- Vue détaillée des accusés de réception
- Statuts : DELIVRD, UNDELIV, EXPIRED, REJECTD, ENROUTE
- Drill-down par opérateur / pays

### 10. Rapport de transactions (`/dashboard/transaction-report`)
**Composant existant** : `transaction-report.tsx`

- Historique des transactions (crédit consommé)
- Filtres par date, campagne, type d'envoi

### 11. HLR Lookup (`/dashboard/hlr-lookup`)
**Composant existant** : `hlr-lookup.tsx`

- Vérification d'un numéro (actif, opérateur, pays)
- Import en masse pour nettoyage de base
- Résultat : actif / inactif / roamant

### 12. Gestion des Sender IDs (`/dashboard/sms-sender-ids`)
**Composant existant** : `sender-id.tsx`

- Liste des Sender IDs approuvés
- Demande de nouveau Sender ID (workflow de validation)
- Statut : En attente / Approuvé / Rejeté

### 13. Passerelle SMPP (`/dashboard/smpp-gateway`)
**Composant existant** : `smpp-gateway.tsx`

Interface Super Admin :
- Connexions SMPP vers opérateurs
- Statut des connexions (actif / inactif / erreur)
- Throughput (messages/seconde)
- Configuration des routages par préfixe pays

### 14. API SMS (`/dashboard/sms-api-docs`)
**Composant existant** : `sms-api-unified.tsx`

Documentation interactive pour les développeurs :
- Endpoints avec exemples de code (curl, PHP, Python, JS, Java)
- Playground de test (envoyer un SMS depuis l'UI)
- Authentification par API Key
- Limites de débit (rate limits)

### 15. SMS RCS (`/dashboard/rcs-messages`)
**Composant existant** : `rcs-messages-enhanced.tsx`

RCS (Rich Communication Services) :
- Messages avec images, boutons, cartes
- Fallback SMS automatique si RCS non supporté
- Templates RCS

### 16. SMS OTP
**Composant existant** : `sms-otp.tsx`

- Génération et envoi d'OTP
- Validation du code (API REST)
- Durée de vie configurable
- Nombre de tentatives max

### 17. SMS A2P (`/dashboard/sms-a2p`)
**Composant existant** : `sms-a2p.tsx`

Application-to-Person :
- Configuration du routage A2P
- Conformité par pays (opt-in requis, DLT en Inde, etc.)

---

## API REST du microservice SMS

### Messages
```
POST   /api/sms/send              # Envoyer un SMS unitaire
POST   /api/sms/send-bulk         # Envoyer en masse (CSV ou liste de numéros)
GET    /api/sms/:id               # Statut d'un message
GET    /api/sms/history           # Historique
```

### Campagnes
```
GET    /api/campaigns             # Lister les campagnes
POST   /api/campaigns             # Créer une campagne
PUT    /api/campaigns/:id         # Modifier
DELETE /api/campaigns/:id         # Supprimer
POST   /api/campaigns/:id/start   # Démarrer
POST   /api/campaigns/:id/pause   # Mettre en pause
POST   /api/campaigns/:id/cancel  # Annuler
GET    /api/campaigns/:id/report  # Rapport détaillé
```

### Contacts
```
GET    /api/contacts              # Lister
POST   /api/contacts              # Créer
POST   /api/contacts/import       # Import CSV
DELETE /api/contacts/:id          # Supprimer
PUT    /api/contacts/:id/optout   # Opt-out
```

### DLR Webhook (entrant depuis opérateur)
```
POST   /api/webhooks/dlr          # Reception DLR opérateur
POST   /api/webhooks/mo           # SMS entrant (MO - Mobile Originated)
```

---

## Payload SMS (API publique)

```json
{
  "from": "ACTOR",
  "to": "+22670000000",
  "message": "Votre code OTP est : {{otp}}. Valable 5 minutes.",
  "type": "transactional",
  "schedule": null,
  "callback_url": "https://yourapp.com/webhooks/dlr",
  "reference": "order-12345"
}
```

---

## Variables d'environnement

```env
# SMPP Gateway
SMPP_HOST=smpp.operator.com
SMPP_PORT=2775
SMPP_SYSTEM_ID=actorsmpp
SMPP_PASSWORD=secret
SMPP_SYSTEM_TYPE=TRANSCEIVER
SMPP_TPS=100                  # Messages par seconde

# Queue
REDIS_URL=redis://localhost:6379
BULL_QUEUE_NAME=sms-outbound

# HLR
HLR_PROVIDER_URL=https://api.hlr-lookups.com
HLR_API_KEY=your-key

# Database
DATABASE_URL=postgresql://...

PORT=3003
```

---

## Règles de conformité SMS

1. **Opt-out obligatoire** : Tout SMS marketing doit inclure "STOP pour se désabonner"
2. **Listes noires** : Vérification automatique avant envoi (DNC list)
3. **Heures autorisées** : Envois entre 8h et 20h (configurable par pays)
4. **RGPD** : Consentement requis pour les données personnelles
5. **Sender ID** : Validation préalable dans chaque pays (en Afrique : souvent DLT ou approval opérateur)
