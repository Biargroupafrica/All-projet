# Prompt — Microservice Actor Emailing Marketing

## Contexte

Tu développes le **microservice Actor Emailing Marketing** de la plateforme Actor Hub.
Ce module est **autonome** : il gère les campagnes email, les templates, l'automatisation, la délivrabilité.

**Protocoles** : SMTP (envoi), IMAP (lecture), API REST (interface clients)

---

## Architecture du microservice

```
services/emailing/
├── smtp-gateway/              # Connexion SMTP sortante
│   ├── smtp-pool.ts           # Pool de connexions SMTP
│   ├── bounce-handler.ts      # Gestion des bounces
│   └── unsubscribe-handler.ts # Gestion des désabonnements
├── template-engine/           # Moteur de templates
│   ├── renderer.ts            # Rendu HTML (Handlebars / MJML)
│   └── asset-manager.ts       # Gestion des images inline
├── automation/                # Sequences automatisées
│   ├── flow-engine.ts         # Exécution des flux
│   └── trigger-manager.ts     # Déclencheurs
├── analytics/
│   ├── open-tracker.ts        # Pixel de suivi d'ouverture
│   └── click-tracker.ts       # Suivi des clics
├── api/
│   ├── controllers/
│   │   ├── campaigns.controller.ts
│   │   ├── templates.controller.ts
│   │   ├── contacts.controller.ts
│   │   ├── automations.controller.ts
│   │   └── analytics.controller.ts
│   └── routes/
└── Dockerfile
```

---

## Fonctionnalités à développer (Frontend)

### 1. Hub Email Marketing (`/dashboard/email-marketing-hub`)
**Composant existant** : `email-marketing-hub.tsx`

Page principale avec accès rapide à :
- Créer une campagne
- Voir les rapports
- Gérer les contacts
- Templates récents

### 2. Éditeur d'email (`/dashboard/email-editor`)
**Composant existant** : `email-editor.tsx`

Éditeur drag-and-drop (type Mailchimp) :
- Blocs : Texte, Image, Bouton, Diviseur, Colonnes, Video, HTML
- Personnalisation : Font, couleur, espacement, responsive
- Prévisualisation desktop / mobile
- Test d'envoi sur email
- Export HTML

### 3. Templates email (`/dashboard/email-templates`)
**Composant existant** : `email-templates.tsx`

- Bibliothèque de templates categorisés (Newsletter, Promo, Transactionnel, Onboarding)
- Templates responsive (MJML ou Table-based HTML)
- Aperçu miniature
- Duplication / modification

### 4. Flow Builder Email (`/dashboard/email-flow-builder`)
**Composants existants** : `email-flow-builder.tsx`, `email-flow-editor.tsx`

Automations email type "drip campaign" :
- Déclencheurs : Inscription, Achat, Abandon panier, Anniversaire, Tag ajouté, Date
- Nœuds : Email, Délai, Condition (A/B), Action (tag, score, webhook), Fin
- Branches If/Else
- Test du flux

### 5. Analytics Email (`/dashboard/email-analytics`)
**Composant existant** : `email-analytics.tsx`

Métriques :
- Taux d'ouverture (Open Rate)
- Taux de clic (CTR)
- Taux de désabonnement (Unsubscribe Rate)
- Taux de bounce (Bounce Rate)
- Carte de chaleur des clics
- Heatmap des horaires de meilleure ouverture
- Comparaison campagnes

### 6. Segmentation (`/dashboard/email-segmentation`)
**Composant existant** : `email-segmentation.tsx`

Création de segments dynamiques :
- Filtres combinés (AND/OR)
- Critères : tags, comportement (a ouvert / n'a pas ouvert), date d'inscription, champs customs
- Prévisualisation du nombre de contacts dans le segment
- Mise à jour automatique des segments

### 7. Authentification DNS (`/dashboard/email-dns-authentication`)
**Composant existant** : `email-dns-authentication.tsx`

Configuration de la délivrabilité :
- **SPF** : Génération de l'enregistrement DNS, validation
- **DKIM** : Génération de la clé, instructions d'ajout chez le registrar
- **DMARC** : Configuration de la politique
- Tableau de bord de vérification avec statut (Valide / Invalide / Manquant)
- Score de réputation estimé

### 8. Délivrabilité (`/dashboard/email-deliverability`)
**Composant existant** : `email-deliverability.tsx`

- Score de délivrabilité global
- Analyse des bounces (hard vs soft)
- Nettoyage des listes (suppression des invalides)
- Alertes si taux de spam > seuil

### 9. Configuration SMTP (`/dashboard/smtp-configuration`)
**Composants existants** : `smtp-configuration.tsx`, `smtp-gateway-config.tsx`

Pour les utilisateurs :
- Ajouter leur propre serveur SMTP (BYOS - Bring Your Own SMTP)
- Tester la connexion
- Quota et limitations

Pour les Super Admins :
- Gestion des pools SMTP de la plateforme
- Répartition de charge (multiple serveurs)
- Monitoring des queues

---

## API REST du microservice Email

### Campagnes
```
GET    /api/email/campaigns               # Lister les campagnes
POST   /api/email/campaigns               # Créer
PUT    /api/email/campaigns/:id           # Modifier
DELETE /api/email/campaigns/:id           # Supprimer
POST   /api/email/campaigns/:id/send      # Envoyer immédiatement
POST   /api/email/campaigns/:id/schedule  # Planifier
POST   /api/email/campaigns/:id/test      # Envoyer un test
GET    /api/email/campaigns/:id/report    # Rapport détaillé
```

### Envoi simple
```
POST   /api/email/send                    # Envoi transactionnel simple
```

Payload :
```json
{
  "from": { "email": "noreply@actorhub.com", "name": "Actor Hub" },
  "to": [{ "email": "client@example.com", "name": "Jean Dupont" }],
  "subject": "Votre commande #12345 est confirmée",
  "html": "<h1>Merci pour votre commande</h1>...",
  "template_id": "order-confirmation",
  "variables": {
    "prenom": "Jean",
    "numero_commande": "12345",
    "total": "45,90 €"
  },
  "tags": ["transactional", "order"],
  "track_opens": true,
  "track_clicks": true
}
```

### Templates
```
GET    /api/email/templates               # Lister
POST   /api/email/templates               # Créer
PUT    /api/email/templates/:id           # Modifier
DELETE /api/email/templates/:id           # Supprimer
POST   /api/email/templates/:id/preview   # Prévisualiser avec variables
```

### Contacts
```
GET    /api/email/contacts                # Lister
POST   /api/email/contacts                # Créer / Mettre à jour
POST   /api/email/contacts/import         # Import CSV
DELETE /api/email/contacts/:id            # Supprimer
PUT    /api/email/contacts/:id/unsubscribe # Désabonner
```

### Webhook entrant (bounces, ouvertures, clics)
```
POST   /api/email/webhooks/events         # Événements SMTP (bounce, open, click, complaint)
```

---

## Format des événements SMTP (webhook retour)

```json
{
  "event": "delivered",       // delivered, opened, clicked, bounced, complained, unsubscribed
  "email": "user@example.com",
  "campaign_id": "camp-123",
  "message_id": "msg-456",
  "timestamp": 1700000000,
  "data": {
    "url": "https://...",     // Pour event: clicked
    "user_agent": "...",
    "ip": "1.2.3.4"
  }
}
```

---

## Variables d'environnement

```env
# SMTP Principale
SMTP_HOST=smtp.actorhub.com
SMTP_PORT=587
SMTP_USER=actor_smtp_user
SMTP_PASS=smtp_password
SMTP_FROM=noreply@actorhub.com
SMTP_POOL_SIZE=10

# Bounce Management
IMAP_HOST=imap.actorhub.com
IMAP_PORT=993
IMAP_USER=bounces@actorhub.com
IMAP_PASS=imap_password

# Tracking (domaine de redirection)
TRACKING_DOMAIN=track.actorhub.com

# Unsubscribe
UNSUBSCRIBE_BASE_URL=https://app.actorhub.com/unsubscribe

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

PORT=3005
```

---

## Règles de conformité Email

1. **Désabonnement en 1 clic** : Lien "Se désabonner" obligatoire dans chaque email marketing
2. **Header List-Unsubscribe** : Inclure le header RFC 2369 pour les clients email modernes
3. **RGPD** : Consentement explicit requis, registre de consentement
4. **CAN-SPAM** (USA) : Adresse physique dans le footer
5. **Gestion des bounces** : Supprimer automatiquement les hard bounces
6. **Gestion des plaintes spam** : Traiter les feedback loops (FBL) des FAI
7. **Warm-up** : Pour un nouveau domaine/IP, augmenter progressivement le volume d'envoi

---

## Métriques clés

| Métrique | Bon | Acceptable | Problématique |
|---|---|---|---|
| Open Rate | > 25% | 15-25% | < 15% |
| Click Rate | > 3% | 1-3% | < 1% |
| Bounce Rate | < 2% | 2-5% | > 5% |
| Unsubscribe Rate | < 0.2% | 0.2-0.5% | > 0.5% |
| Spam Complaint Rate | < 0.08% | 0.08-0.1% | > 0.1% |
