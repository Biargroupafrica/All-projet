# Prompt: ms-contacts - Gestion des Contacts & CRM

## Rôle
Tu es un développeur backend senior spécialisé en CRM et gestion de contacts. Tu dois créer le microservice `ms-contacts` pour la plateforme Actor Hub.

## Mission
Créer un service centralisé de gestion des contacts partagé entre tous les modules (Call Center, SMS, Email, WhatsApp), avec segmentation, pipeline, géolocalisation et import/export.

## Spécifications techniques

### Stack
- **Framework:** NestJS
- **Port:** 8007
- **Base de données:** PostgreSQL - schema `contacts`

### Fonctionnalités requises

1. **CRUD Contacts**
   - Création unitaire et en masse (import CSV/Excel)
   - Champs: nom, prénom, email, téléphone, entreprise, pays, tags, custom fields
   - Déduplication automatique (email ou téléphone)
   - Historique de toutes les interactions cross-canal

2. **Listes & Groupes**
   - Listes statiques (ajout manuel)
   - Listes dynamiques (critères: pays, tag, activité, date)
   - Import/Export CSV, Excel, JSON

3. **Segmentation**
   - Segments basés sur critères multiples (AND/OR)
   - Segments par comportement (ouvert email, répondu SMS, appelé)
   - Segments par géolocalisation

4. **Pipeline (Kanban)**
   - Étapes personnalisables (Prospect, Qualifié, Proposition, Gagné, Perdu)
   - Drag & drop entre étapes
   - Valeur estimée par contact

5. **Géolocalisation**
   - Localisation par numéro de téléphone (préfixe pays/opérateur)
   - Carte interactive des contacts
   - Filtrage par zone géographique

6. **DNC (Do Not Contact)**
   - Liste globale de numéros/emails à ne pas contacter
   - Gestion des opt-out cross-canal
   - Conformité RGPD

### Schéma Base de Données
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  phone_country VARCHAR(3),
  company VARCHAR(255),
  job_title VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  tags VARCHAR[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  pipeline_stage VARCHAR(50) DEFAULT 'prospect',
  pipeline_value DECIMAL(12,2),
  source VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  opted_out_sms BOOLEAN DEFAULT false,
  opted_out_email BOOLEAN DEFAULT false,
  opted_out_whatsapp BOOLEAN DEFAULT false,
  opted_out_call BOOLEAN DEFAULT false,
  last_contacted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contact_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) DEFAULT 'static',
  criteria JSONB,
  contacts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contact_list_members (
  contact_id UUID REFERENCES contacts(id),
  list_id UUID REFERENCES contact_lists(id),
  added_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (contact_id, list_id)
);

CREATE TABLE contact_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  tenant_id UUID NOT NULL,
  channel VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL,
  direction VARCHAR(10),
  summary TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contact_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id),
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
```
CRUD   /api/v1/contacts                 # Contacts
POST   /api/v1/contacts/import          # Import CSV/Excel
GET    /api/v1/contacts/export          # Export
GET    /api/v1/contacts/:id/interactions # Historique interactions
POST   /api/v1/contacts/:id/notes       # Ajouter note

CRUD   /api/v1/contacts/lists           # Listes
POST   /api/v1/contacts/lists/:id/add   # Ajouter contacts à une liste
POST   /api/v1/contacts/lists/:id/remove

GET    /api/v1/contacts/segments        # Segments
POST   /api/v1/contacts/segments/preview # Prévisualiser un segment
GET    /api/v1/contacts/geo             # Géolocalisation
GET    /api/v1/contacts/pipeline        # Pipeline Kanban
PUT    /api/v1/contacts/:id/stage       # Changer étape pipeline

GET    /api/v1/contacts/dnc             # DNC list
POST   /api/v1/contacts/dnc             # Ajouter au DNC
```

### Events publiés
```
contact.created  → { contactId, tenantId, email, phone }
contact.updated  → { contactId, changes }
contact.deleted  → { contactId, tenantId }
contact.imported → { tenantId, count, listId }
contact.opted_out → { contactId, channel }
```
