# Skill : Plateforme Actor Hub - SaaS & CPaaS Microservices

## Contexte

Actor Hub est une plateforme SaaS/CPaaS multi-tenant développée par **BIAR GROUP AFRICA SARLU**, basée à Kinshasa, RDC. Elle regroupe 4 solutions autonomes de communication unifiée, chacune déployable indépendamment en tant que microservice.

**Slogan** : "Pour vous, on se dépasse." / "One platform - Infinite connections"

**Figma Make (source de vérité UI)** :
- Landing Page : `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/`
- Services : `preview-route=%2Fservices`
- Call Center : `preview-route=%2Ffonctionnalites%2Fcall-center`
- Industries : `preview-route=%2Findustries`
- Tarifs : `preview-route=%2Ftarifs`
- Actualités : `preview-route=%2Factualites`
- À propos : `preview-route=%2Fa-propos`
- Contact : `actorhub.figma.site/contact`
- Login : `preview-route=%2Flogin`

---

## Architecture Globale

```
┌─────────────────────────────────────────────────────────┐
│                    ACTOR HUB PLATFORM                    │
│              SaaS / CPaaS Multi-Tenant Cloud             │
├──────────┬──────────┬──────────┬────────────────────────┤
│  Actor   │  Actor   │  Actor   │  Actor                 │
│  Call    │  Bulk    │  WhatsApp│  Emailing              │
│  Center  │  SMS     │  Mktg   │  Marketing             │
├──────────┴──────────┴──────────┴────────────────────────┤
│              Services Transversaux (Shared)               │
│  Auth | Billing | Contacts | Analytics | Gateway | CMS   │
├─────────────────────────────────────────────────────────┤
│              Infrastructure                              │
│  API Gateway | Message Queue | CDN | Storage | DB        │
└─────────────────────────────────────────────────────────┘
```

---

## Stack Technique

### Frontend
- **Framework** : React 18 + TypeScript
- **Router** : React Router v7 (170+ routes)
- **CSS** : Tailwind CSS v4
- **Composants UI** : shadcn/ui + Radix UI
- **Thème** : next-themes (Dark/Light mode)
- **i18n** : 10 langues (FR, EN, AR, ZH, RU, SW, PT, HI, ES, NL)
- **Build** : Vite
- **Icons** : Lucide React

### Design System
- **Primaire** : Violet `#5906AE`
- **Accent** : Rose `#FF006F`
- **Bleu secondaire** : `#2B7FFF`
- **Texte auto-blanc** sur fonds colorés

### Backend (à implémenter)
- **BaaS** : Supabase (Auth, Database, Storage, Edge Functions)
- **Base de données** : PostgreSQL (via Supabase)
- **File d'attente** : Redis / BullMQ
- **Stockage** : Supabase Storage / S3
- **CDN** : Cloudflare
- **Déploiement Frontend** : Vercel

### Protocoles CPaaS
- **Voix** : SIP / WebRTC (Twilio, Plivo, ou Nexmo)
- **SMS** : SMPP (connexion directe opérateurs)
- **Email** : SMTP (SendGrid, AWS SES)
- **WhatsApp** : WhatsApp Business API (Cloud API)
- **RCS** : RCS Business Messaging API

---

## Les 4 Microservices Autonomes

### 1. Actor CallCenter (Centre d'Appels Cloud)

**Description** : Solution complète de centre d'appels cloud avec softphone WebRTC intégré, IVR visuel, routage intelligent, dialers prédictifs, et supervision en temps réel.

**Sous-modules** :
- Softphone WebRTC
- Dashboard agent / superviseur
- IVR Builder visuel (drag & drop)
- ACD (Distribution Automatique d'Appels)
- Routage par compétences (Skill-Based Routing)
- Files d'attente intelligentes
- Power / Predictive / Preview Dialer
- Enregistrement d'appels
- Script agent dynamique
- Géolocalisation des appels
- Numéros verts
- Téléprospection / Prospection bancaire
- Extensions VoIP / PBX
- IA & Coaching (analyse d'appels, transcription)
- CTI / CRM Integration

**Routes Dashboard** : 60+ routes sous `/dashboard/`

**Passerelle** : SIP Gateway (configuration dans `/dashboard/sip-gateway-config`)

### 2. Actor Bulk SMS (Marketing SMS en Masse)

**Description** : Plateforme d'envoi de SMS en masse via SMPP, avec gestion de campagnes, A/B testing, segmentation avancée, HLR Lookup, rapports DLR, et API REST complète.

**Sous-modules** :
- SMS unitaire et en masse
- Campagne Builder
- Gestion des contacts et listes
- SMS Templates (modèles)
- Messages programmés
- Sender ID Management
- SMS A2P
- RCS Messages
- URL Shortener
- HLR Lookup
- DLR Reports
- Analytics & rapports
- API SMS (documentation complète)
- Crédits & tarification

**Routes Dashboard** : 40+ routes sous `/dashboard/`

**Passerelle** : SMPP Gateway (configuration dans `/dashboard/smpp-gateway`)

### 3. Actor WhatsApp Marketing

**Description** : Solution de marketing WhatsApp Business complète avec chatbot IA, broadcast de masse, auto-répondeur, gestion multi-comptes, et analytics avancés.

**Sous-modules** :
- Dashboard Analytics
- Conversations & Diffusion
- Connexion multi-comptes & agents
- Envoi en masse (Bulk)
- Flow Builder (Chatbot)
- Plateforme WhatsApp Business
- Auto-répondeur intelligent
- Module Broadcast
- Module Chat multi-agent
- Module Contacts
- Assistant IA
- Campagnes publicitaires
- Analyseur de compte
- Messages programmés
- Modèles de messages (Templates)
- Groupes WhatsApp
- Messages multimédia
- QR Code Generator
- OTP WhatsApp
- Module Anti-Block
- API WhatsApp
- Export de données

**Routes Dashboard** : 30+ routes sous `/dashboard/`

**Passerelle** : WhatsApp API Gateway (configuration dans `/dashboard/whatsapp-gateway-config`)

### 4. Actor Emailing Marketing

**Description** : Plateforme de marketing email professionnelle avec éditeur WYSIWYG, flow builder d'automatisation, segmentation, A/B testing, et monitoring de délivrabilité.

**Sous-modules** :
- Campagnes Email
- Éditeur WYSIWYG d'emails
- Templates Library
- Flow Builder (Automatisation)
- Email Flow Editor
- Analytics Email
- Segmentation avancée
- Configuration SMTP
- Authentification DNS (SPF, DKIM, DMARC)
- Monitoring délivrabilité

**Routes Dashboard** : 15+ routes sous `/dashboard/`

**Passerelle** : SMTP Gateway (configuration dans `/dashboard/smtp-gateway-config`)

---

## Services Transversaux (Shared Services)

### Authentification & Multi-Tenancy
- 4 types d'utilisateurs : Super Admin, Admin, Agent, Customer
- JWT tokens via Supabase Auth
- RBAC (Role-Based Access Control)
- Login par type : `/login` avec sélection du profil
- Forgot Password / Signup

### Gestion des Contacts (CRM Léger)
- Contact Management (basique + avancé)
- Géolocalisation des contacts
- Pipeline Contacts (Kanban)
- Import/Export contacts
- Tags et champs personnalisés

### Billing & Facturation
- Abonnements (Starter, Pro, Enterprise)
- Factures et paiements
- Crédits compte (SMS/Appels)
- Historique des paiements
- Méthodes de paiement

### Analytics & Reporting
- Dashboard Analytics global
- Dashboard interactif
- Dashboard superviseur
- Rapports par module
- Rapports transactionnels

### Frontend / CMS
- Gestionnaire de site vitrine
- Pages & Contenu
- Sections & Widgets
- Médias & Assets
- Menus & Navigation
- SEO & Métadonnées

### Support & Assistance
- Tickets de support
- Base de connaissances
- FAQ
- Centre d'aide
- Chat en direct
- Rapports de bugs
- Documentation technique
- Tutoriels vidéo

### Intégrations & API
- Intégrations tierces (CRM, etc.)
- Webhooks
- HTTP Callbacks
- URL Shortlinks
- API Status Dashboard

### Système
- Logs système
- Communication Logs
- Audit Logs
- User Management
- Rôles & Permissions

---

## Architecture Multi-Tenant

```
Tenant (Entreprise)
├── Plan d'abonnement (Starter / Pro / Enterprise)
├── Utilisateurs
│   ├── Admins
│   ├── Agents
│   └── Customers
├── Modules activés
│   ├── Actor CallCenter ✓/✗
│   ├── Actor Bulk SMS ✓/✗
│   ├── Actor WhatsApp ✓/✗
│   └── Actor Emailing ✓/✗
├── Configuration passerelles
│   ├── SIP Gateway
│   ├── SMPP Gateway
│   ├── SMTP Gateway
│   └── WhatsApp API
├── Contacts (CRM)
├── Billing & Crédits
└── Logs & Analytics
```

---

## Site Vitrine (Landing Pages)

### Pages publiques
| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Hero, Features (4 modules), Stats, Testimonials, Pricing, CTA |
| `/services` | Solutions | Présentation des 4 solutions |
| `/fonctionnalites` | Fonctionnalités | Vue d'ensemble des features |
| `/fonctionnalites/call-center` | Call Center Features | Détail du module Call Center |
| `/fonctionnalites/sms-marketing` | SMS Features | Détail du module SMS |
| `/fonctionnalites/whatsapp-business` | WhatsApp Features | Détail du module WhatsApp |
| `/fonctionnalites/email-marketing` | Email Features | Détail du module Email |
| `/industries` | Industries | Secteurs d'activité ciblés |
| `/tarifs` | Tarifs | Plans et pricing |
| `/actualites` | Actualités | Blog / News |
| `/a-propos` | À propos | L'entreprise, équipe, mission |
| `/contact` | Contact | Formulaire de contact |
| `/login` | Connexion | Sélection profil + login |

### Layout Vitrine
- Header avec navigation + CTA
- Footer avec coordonnées BIAR GROUP
- Menu mobile responsive
- Dark/Light mode
- Multi-langues

---

## Schéma Base de Données Simplifié

```sql
-- Multi-tenancy
tenants (id, name, subdomain, plan, status, created_at)
users (id, email, password_hash, role, tenant_id, created_at)

-- Call Center
calls (id, tenant_id, from_number, to_number, agent_id, duration, recording_url, status, created_at)
call_recordings (id, call_id, file_url, duration, size)
ivr_flows (id, tenant_id, name, config_json, created_at)
call_queues (id, tenant_id, name, strategy, max_wait, created_at)
agents (id, user_id, tenant_id, skills, status, extension)

-- SMS
sms_campaigns (id, tenant_id, name, message, sender_id, contacts_count, sent, delivered, status, scheduled_at, created_at)
sms_messages (id, campaign_id, to_number, message, status, dlr_status, created_at)
sms_templates (id, tenant_id, name, content, variables, created_at)
sender_ids (id, tenant_id, name, status, created_at)

-- Email
email_campaigns (id, tenant_id, name, subject, html_content, contacts_count, sent, opened, clicked, status, scheduled_at, created_at)
email_templates (id, tenant_id, name, html_content, category, created_at)
email_flows (id, tenant_id, name, flow_config_json, status, created_at)

-- WhatsApp
whatsapp_accounts (id, tenant_id, phone_number, business_id, api_key, status, created_at)
whatsapp_messages (id, tenant_id, account_id, from_number, to_number, message, media_url, status, created_at)
whatsapp_templates (id, tenant_id, name, content, category, status, created_at)
whatsapp_chatbot_flows (id, tenant_id, name, flow_config_json, status, created_at)

-- Contacts (CRM partagé)
contacts (id, tenant_id, phone, email, name, company, tags, custom_fields, created_at)
contact_lists (id, tenant_id, name, contacts_count, created_at)
contact_list_members (contact_id, list_id)

-- Billing
subscriptions (id, tenant_id, plan, status, amount, billing_cycle, next_billing_date, created_at)
invoices (id, tenant_id, amount, status, due_date, paid_at, created_at)
credits (id, tenant_id, type, amount, balance, created_at)
payment_methods (id, tenant_id, type, details_json, is_default, created_at)

-- Support
tickets (id, tenant_id, user_id, subject, description, status, priority, created_at)
ticket_messages (id, ticket_id, user_id, message, created_at)

-- System
audit_logs (id, tenant_id, user_id, action, resource, details, created_at)
webhooks (id, tenant_id, url, events, status, created_at)
api_keys (id, tenant_id, key_hash, name, permissions, created_at)
```

---

## Informations de l'Entreprise

- **Nom** : BIAR GROUP AFRICA SARLU
- **Marque** : Actor Hub
- **Adresse** : 5 Rue Gemena, Quartier Haut Commandement, Gombe, Kinshasa, RDC
- **BP** : 12345 Kinshasa
- **Téléphone** : +243 978 979 898 / +243 822 724 146
- **Email** : contact@biargroup.com / biar.groupafrica@gmail.com
- **Site** : actorhub.figma.site (prototype)

---

## Quand utiliser ce skill

Utilisez ce skill lorsque :
- Vous devez créer, modifier ou comprendre un composant de la plateforme Actor Hub
- Vous travaillez sur l'un des 4 microservices (CallCenter, SMS, WhatsApp, Email)
- Vous devez implémenter un backend/API pour la plateforme
- Vous devez configurer une passerelle (SIP, SMPP, SMTP, WhatsApp API)
- Vous devez comprendre le système multi-tenant
- Vous travaillez sur le site vitrine (landing pages)
- Vous devez implémenter l'authentification multi-rôles
