# Prompt: Dashboard & Modules - Actor Hub

## Contexte
Le dashboard est la partie privée de la plateforme Actor Hub, accessible après authentification. Il contient 170+ routes organisées en modules.

## Référence Design
**Figma Make:** `XDPnl4zhusx3vecuWQTYFx`

## Layout Dashboard
- **Sidebar gauche:** Navigation hiérarchique avec sections dépliables
- **Header top:** Barre de recherche, toggle theme, sélecteur langue (10 langues), notifications, profil
- **Content area:** Contenu principal avec `<Outlet />`
- **Footer:** Informations Actor Hub, fond bleu `#2B7FFF`

## Modules

### 1. Tableau de Bord (Overview)
- Vue d'ensemble multi-canal
- KPIs globaux (messages, appels, taux, coûts)
- Graphiques de tendance (Recharts)
- Activité récente

### 2. Centre d'Appels (60+ pages)
- Live Dashboard, Supervision, CTI
- Gestion contacts (basique, avancée, géolocalisation, pipeline)
- Chat interne
- Appels entrants (files d'attente, ACD, routage, IVR)
- Campagnes sortantes (Power/Predictive/Preview Dialer)
- Agents & Rôles
- Enregistrement & Supervision live
- Softphone WebRTC, Extensions, Numéros
- IA & Coaching

### 3. Marketing SMS (40+ pages)
- Envoi unitaire & en masse
- Campagnes & Rapports
- Templates, Contacts, Listes
- Programmation, Analytics
- Sender IDs, A2P, RCS
- API Documentation

### 4. Analytics SMS
- Rapports, Historique, Transactions
- DLR Reports, Trafic client

### 5. WhatsApp Business (30+ pages)
- Dashboard Analytics
- Anti-Block, Conversations, Comptes
- Envoi en masse, Flow Builder
- Plateforme Business, Auto-répondeur
- Broadcast, Chat, Contacts, IA
- Campagnes Ads, Templates
- Chatbot, QR Code, API

### 6. Email Marketing (15+ pages)
- Campagnes, Éditeur WYSIWYG
- Templates, Flow Builder
- Analytics, Segmentation
- Configuration SMTP, DNS, Délivrabilité

### 7. Frontend Management
- Gestionnaire site vitrine
- Pages, Sections, Médias
- Menus, SEO

### 8. Support & Assistance
- Tickets, Base de connaissances
- FAQ, Centre d'aide, Chat live
- Bugs, Documentation, Tutoriels vidéo

### 9. Système & Paramètres
- Intégrations, Webhooks, Logs
- Facturation, Paiements
- Paramètres généraux

### 10. Gestion Utilisateurs
- Utilisateurs, Rôles & Permissions, Profil

### 11. Passerelles & API
- SIP (Call Center), SMPP (SMS)
- SMTP (Email), WhatsApp API
- API SMS, HTTP Callback, URL Shortener
