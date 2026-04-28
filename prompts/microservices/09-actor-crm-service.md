# Prompt: Actor CRM Service - Microservice Gestion des Contacts

## Contexte
Tu es un développeur senior spécialisé en CRM et gestion de données clients. Tu dois créer le microservice **Actor CRM** pour la plateforme Actor Hub. Ce service centralise la gestion des contacts utilisés par tous les modules (Call Center, SMS, WhatsApp, Email).

## Mission
Créer un microservice CRM autonome avec gestion avancée des contacts, listes, segments, tags, pipeline commercial, et import/export massif.

## Spécifications techniques

### Stack
- **Runtime** : Node.js 20+ / NestJS
- **Base de données** : PostgreSQL (schéma `crm`)
- **Recherche** : PostgreSQL Full-Text Search (ou MeiliSearch)
- **Queue** : Redis + Bull (imports massifs)
- **ORM** : Prisma

### Endpoints API
```
# Contacts
GET    /api/v1/contacts                  # Lister (pagination, filtres, recherche)
POST   /api/v1/contacts                  # Créer
GET    /api/v1/contacts/:id              # Détail
PUT    /api/v1/contacts/:id              # Modifier
DELETE /api/v1/contacts/:id              # Supprimer
POST   /api/v1/contacts/bulk-delete      # Suppression en masse
POST   /api/v1/contacts/merge            # Fusionner des doublons
GET    /api/v1/contacts/:id/history      # Historique communications
GET    /api/v1/contacts/:id/timeline     # Timeline activité
POST   /api/v1/contacts/import           # Import CSV/Excel
GET    /api/v1/contacts/export           # Export
POST   /api/v1/contacts/search           # Recherche avancée

# Listes
GET    /api/v1/lists                     # Lister
POST   /api/v1/lists                     # Créer
PUT    /api/v1/lists/:id                 # Modifier
DELETE /api/v1/lists/:id                 # Supprimer
POST   /api/v1/lists/:id/contacts        # Ajouter des contacts
DELETE /api/v1/lists/:id/contacts         # Retirer des contacts

# Segments
GET    /api/v1/segments                  # Lister
POST   /api/v1/segments                  # Créer
PUT    /api/v1/segments/:id              # Modifier
GET    /api/v1/segments/:id/preview      # Prévisualiser

# Tags
GET    /api/v1/tags                      # Lister
POST   /api/v1/tags                      # Créer
PUT    /api/v1/tags/:id                  # Modifier
DELETE /api/v1/tags/:id                  # Supprimer
POST   /api/v1/contacts/:id/tags         # Tagger un contact

# Pipeline
GET    /api/v1/pipeline                  # Voir le pipeline
GET    /api/v1/pipeline/stages           # Étapes du pipeline
POST   /api/v1/pipeline/stages           # Créer une étape
PUT    /api/v1/pipeline/deals/:id/move   # Déplacer un deal

# Champs personnalisés
GET    /api/v1/custom-fields             # Lister
POST   /api/v1/custom-fields             # Créer
PUT    /api/v1/custom-fields/:id         # Modifier
DELETE /api/v1/custom-fields/:id         # Supprimer

# Géolocalisation
GET    /api/v1/contacts/geo              # Contacts géolocalisés
GET    /api/v1/contacts/geo/heatmap      # Heatmap
```

### Événements Message Broker
```typescript
'crm.contact.created'       // { contactId, tenantId, phone, email }
'crm.contact.updated'       // { contactId, tenantId, changes }
'crm.contact.deleted'       // { contactId, tenantId }
'crm.contact.merged'        // { primaryId, mergedIds }
'crm.import.started'        // { importId, tenantId, count }
'crm.import.completed'      // { importId, created, updated, skipped, errors }
'crm.segment.updated'       // { segmentId, contactsCount }
'crm.deal.stage_changed'    // { dealId, oldStage, newStage }
```

## Critères d'acceptation
- [ ] CRUD contacts avec recherche full-text
- [ ] Import massif CSV/Excel (>100k contacts)
- [ ] Segmentation dynamique par règles
- [ ] Pipeline commercial (Kanban)
- [ ] Champs personnalisés par tenant
- [ ] Historique de communication cross-module
- [ ] Détection et fusion de doublons
- [ ] Géolocalisation des contacts
- [ ] Export avec filtres
