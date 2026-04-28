# Prompt : Microservice Actor Email Marketing (SaaS)

## Objectif

Créer le microservice autonome d'email marketing avec éditeur WYSIWYG, automatisation via flow builder, configuration SMTP, et analytics avancés.

## Contexte Figma

- **FileKey** : `XDPnl4zhusx3vecuWQTYFx`
- **Route principale** : `/fonctionnalites/email-marketing`
- **Dashboard** : `/dashboard/email-*`

## Prompt de création

```
Tu es un architecte logiciel senior spécialisé en email marketing et délivrabilité.

Crée le microservice "Actor Email Marketing" — une plateforme SaaS d'email marketing complète et autonome.

### Architecture du microservice

Nom : actor-email-service
Port : 3004
Base de données : PostgreSQL (schéma dédié "email")

### Structure du projet

actor-email-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── smtp.config.ts               # Config SMTP
│   │   └── environment.ts
│   ├── modules/
│   │   ├── campaigns/
│   │   │   ├── campaigns.module.ts
│   │   │   ├── campaigns.controller.ts
│   │   │   ├── campaigns.service.ts
│   │   │   ├── scheduler.service.ts      # Planification
│   │   │   ├── ab-testing.service.ts     # A/B Testing
│   │   │   ├── dto/
│   │   │   │   ├── create-campaign.dto.ts
│   │   │   │   └── campaign-filter.dto.ts
│   │   │   └── entities/
│   │   │       ├── campaign.entity.ts
│   │   │       └── campaign-variant.entity.ts
│   │   ├── emails/
│   │   │   ├── emails.module.ts
│   │   │   ├── emails.controller.ts
│   │   │   ├── emails.service.ts
│   │   │   ├── sender.service.ts         # Envoi SMTP
│   │   │   ├── renderer.service.ts       # Rendu HTML
│   │   │   └── entities/
│   │   │       └── email.entity.ts
│   │   ├── templates/
│   │   │   ├── templates.module.ts
│   │   │   ├── templates.controller.ts
│   │   │   ├── templates.service.ts
│   │   │   ├── template-builder.service.ts # Éditeur WYSIWYG
│   │   │   └── entities/
│   │   │       └── template.entity.ts
│   │   ├── automation/
│   │   │   ├── automation.module.ts
│   │   │   ├── automation.controller.ts
│   │   │   ├── automation.service.ts
│   │   │   ├── flow-engine.service.ts    # Moteur d'automatisation
│   │   │   ├── trigger.service.ts        # Déclencheurs
│   │   │   ├── action.service.ts         # Actions automatiques
│   │   │   └── entities/
│   │   │       ├── automation-flow.entity.ts
│   │   │       ├── automation-node.entity.ts
│   │   │       └── automation-log.entity.ts
│   │   ├── contacts/
│   │   │   ├── contacts.module.ts
│   │   │   ├── contacts.controller.ts
│   │   │   ├── contacts.service.ts
│   │   │   ├── segments.service.ts       # Segmentation
│   │   │   ├── import.service.ts
│   │   │   └── entities/
│   │   │       ├── contact.entity.ts
│   │   │       ├── segment.entity.ts
│   │   │       └── contact-list.entity.ts
│   │   ├── smtp/
│   │   │   ├── smtp.module.ts
│   │   │   ├── smtp.service.ts           # Client SMTP
│   │   │   ├── smtp-pool.service.ts      # Pool de connexions
│   │   │   └── entities/
│   │   │       └── smtp-config.entity.ts
│   │   ├── deliverability/
│   │   │   ├── deliverability.module.ts
│   │   │   ├── deliverability.service.ts
│   │   │   ├── dns-auth.service.ts       # SPF, DKIM, DMARC
│   │   │   ├── bounce-handler.service.ts # Gestion bounces
│   │   │   ├── warmup.service.ts         # IP warmup
│   │   │   └── entities/
│   │   │       ├── bounce.entity.ts
│   │   │       └── domain-auth.entity.ts
│   │   ├── tracking/
│   │   │   ├── tracking.module.ts
│   │   │   ├── tracking.controller.ts    # Pixel tracking
│   │   │   ├── tracking.service.ts
│   │   │   ├── link-tracker.service.ts   # Suivi des clics
│   │   │   └── entities/
│   │   │       ├── open-event.entity.ts
│   │   │       └── click-event.entity.ts
│   │   ├── analytics/
│   │   │   ├── analytics.module.ts
│   │   │   ├── analytics.service.ts
│   │   │   └── reports.service.ts
│   │   └── unsubscribe/
│   │       ├── unsubscribe.module.ts
│   │       ├── unsubscribe.controller.ts # Page désabonnement
│   │       ├── unsubscribe.service.ts
│   │       └── entities/
│   │           └── unsubscribe.entity.ts
│   ├── queue/
│   │   ├── queue.module.ts
│   │   ├── email-producer.service.ts
│   │   └── email-consumer.service.ts
│   ├── common/
│   └── shared/
├── prisma/
├── test/
├── docker/
├── docs/
│   └── openapi.yaml
├── package.json
└── README.md

### Tables de base de données

- campaigns : Campagnes email
- campaign_variants : Variantes A/B
- emails : Emails envoyés
- templates : Templates email (HTML/JSON)
- contacts : Contacts email
- contact_lists : Listes de contacts
- segments : Segments dynamiques
- segment_rules : Règles de segmentation
- automation_flows : Workflows automatisés
- automation_nodes : Nœuds de workflow
- automation_logs : Logs d'exécution
- smtp_configs : Configurations SMTP
- domain_auths : Authentification domaine (SPF/DKIM/DMARC)
- bounces : Emails rebondis
- open_events : Événements d'ouverture
- click_events : Événements de clic
- unsubscribes : Désabonnements

### API Endpoints principaux

# Campagnes
POST   /api/v1/campaigns              # Créer campagne
GET    /api/v1/campaigns              # Lister campagnes
GET    /api/v1/campaigns/:id          # Détail campagne
PUT    /api/v1/campaigns/:id          # Modifier campagne
POST   /api/v1/campaigns/:id/send     # Envoyer campagne
POST   /api/v1/campaigns/:id/schedule # Planifier envoi
POST   /api/v1/campaigns/:id/test     # Envoyer test
GET    /api/v1/campaigns/:id/stats    # Statistiques

# Templates
POST   /api/v1/templates              # Créer template
GET    /api/v1/templates              # Lister templates
GET    /api/v1/templates/:id          # Détail template
PUT    /api/v1/templates/:id          # Modifier template
POST   /api/v1/templates/:id/clone    # Dupliquer template
POST   /api/v1/templates/:id/preview  # Prévisualiser

# Automation / Flow Builder
POST   /api/v1/automations            # Créer automation
GET    /api/v1/automations            # Lister automations
PUT    /api/v1/automations/:id        # Modifier automation
POST   /api/v1/automations/:id/activate   # Activer
POST   /api/v1/automations/:id/deactivate # Désactiver
GET    /api/v1/automations/:id/logs   # Logs d'exécution

# Contacts & Segmentation
POST   /api/v1/contacts               # Ajouter contact
GET    /api/v1/contacts               # Lister contacts
POST   /api/v1/contacts/import        # Import CSV
POST   /api/v1/segments               # Créer segment
GET    /api/v1/segments               # Lister segments
GET    /api/v1/segments/:id/count     # Comptage contacts

# SMTP Configuration
POST   /api/v1/smtp/configure         # Configurer SMTP
GET    /api/v1/smtp/configs           # Lister configs
POST   /api/v1/smtp/test              # Tester connexion

# Délivrabilité
GET    /api/v1/deliverability/score   # Score délivrabilité
POST   /api/v1/deliverability/dns/verify # Vérifier DNS
GET    /api/v1/deliverability/bounces # Lister bounces

# Tracking
GET    /api/v1/tracking/pixel/:id     # Pixel d'ouverture
GET    /api/v1/tracking/click/:id     # Redirection lien

# Désabonnement
GET    /api/v1/unsubscribe/:token     # Page désabonnement
POST   /api/v1/unsubscribe/:token     # Confirmer désabonnement

# Analytics
GET    /api/v1/analytics/overview     # Vue d'ensemble
GET    /api/v1/analytics/deliverability # Délivrabilité
GET    /api/v1/analytics/engagement   # Engagement

### Fonctionnalités clés

1. Éditeur email WYSIWYG (drag & drop)
2. Bibliothèque de templates responsives
3. Flow Builder d'automatisation visuel
4. Configuration SMTP multi-providers
5. DNS Authentication (SPF, DKIM, DMARC)
6. A/B Testing (sujet, contenu, heure d'envoi)
7. Segmentation dynamique avancée
8. Tracking d'ouverture (pixel) et de clics
9. Gestion automatique des bounces
10. IP/domaine warmup progressif
11. Pages de désabonnement conformes RGPD
12. Analytics temps réel
13. Score de délivrabilité
14. Variables dynamiques et personnalisation

### Variables d'environnement

EMAIL_PORT=3004
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
DEFAULT_SMTP_HOST=smtp.provider.com
DEFAULT_SMTP_PORT=587
DEFAULT_SMTP_USER=...
DEFAULT_SMTP_PASSWORD=...
TRACKING_DOMAIN=track.actorhub.com
UNSUBSCRIBE_DOMAIN=unsub.actorhub.com
DKIM_PRIVATE_KEY=...
OPENAI_API_KEY=...
STORAGE_BUCKET=email-assets
JWT_SECRET=...
RATE_LIMIT_PER_HOUR=10000
```

## Critères d'acceptation

- [ ] Le service démarre indépendamment sur le port 3004
- [ ] L'envoi d'emails via SMTP fonctionne
- [ ] L'éditeur WYSIWYG produit du HTML email valide
- [ ] Le flow builder exécute les automatisations
- [ ] Le tracking d'ouverture et de clics fonctionne
- [ ] La gestion des bounces est automatisée
- [ ] La segmentation filtre correctement les contacts
- [ ] Le A/B testing sélectionne le gagnant automatiquement
- [ ] L'isolation multi-tenant est effective
- [ ] L'API est documentée en OpenAPI
