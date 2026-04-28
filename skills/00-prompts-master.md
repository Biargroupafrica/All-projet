# Prompts Maîtres — Actor Hub Platform (SaaS/CPaaS)

Ce fichier contient les prompts de haut niveau pour initialiser chaque module de la plateforme Actor Hub. À utiliser comme point de départ pour les sessions de développement.

---

## PROMPT MAÎTRE — Initialisation Complète de la Plateforme

```
Tu es un développeur senior full-stack expert en plateformes CPaaS/SaaS.
Tu dois construire Actor Hub, une plateforme de communication multi-canal pour Biar Group.

VISION DU PRODUIT :
Actor Hub est une plateforme SaaS multi-tenant et CPaaS (Communication Platform as a Service) qui permet aux entreprises de gérer tous leurs canaux de communication (Call Center, SMS, WhatsApp, Email) depuis une seule interface.

PRINCIPES CLÉS :
1. Multi-tenant : chaque client (tenant) a son propre espace isolé
2. Microservices : chaque canal est un service indépendant, déployable séparément
3. API-first : toutes les fonctionnalités exposées via REST API
4. Mobile-first : interface responsive, fonctionne sur tous les appareils
5. IA-native : fonctionnalités IA intégrées (AIRO, chatbots, analytics)

STACK TECHNIQUE :
- Frontend : React 18 + TypeScript + Tailwind CSS + shadcn/ui
- Backend : Supabase (Auth/DB/Storage) + Node.js microservices
- Protocoles : SMPP (SMS), SIP/WebRTC (Voice), WABA (WhatsApp), SMTP (Email)
- Infra : Docker + Kubernetes + Vercel/Cloudflare
- File de messages : Redis + BullMQ

MODULES À DÉVELOPPER (par ordre de priorité) :
1. Auth & Multi-tenant
2. Landing Page Vitrine
3. Dashboard principal
4. Module SMS Bulk (premier module CPaaS)
5. Module Call Center
6. Module WhatsApp Business
7. Module Email Marketing
8. APIs CPaaS & Documentation
9. Super Admin

Commence par [MODULE] et suis le skill file correspondant.
```

---

## PROMPT — Landing Page Complete

```
Développe le site vitrine complet d'Actor Hub en React/TypeScript/Tailwind.

Pages à créer :
1. Home (/) : Hero, Stats, Modules, Témoignages, CTA
2. Services (/services) : Présentation des 4 modules
3. Fonctionnalités (/fonctionnalites) : Liste détaillée par module
4. Industries (/industries) : 6 secteurs cibles
5. Tarifs (/tarifs) : 3 plans + tableau comparatif
6. À propos (/a-propos) : Biar Group, équipe, mission
7. Actualités (/actualites) : Blog avec articles
8. Contact (/contact) : Formulaire + Map + Coordonnées
9. Login (/login) : Sélection de profil

Design :
- Couleur principale : Rose #E91E8C
- Typographie : Inter
- Mode sombre par défaut, toggle clair/foncé
- Animations fluides (Framer Motion)
- 100% responsive mobile

Fonctionnalités :
- Navigation sticky avec mega menu
- Formulaire de contact fonctionnel (Supabase)
- Changement de langue (10 langues)
- SEO optimisé (meta tags, Open Graph)
- Performance : Lighthouse score > 90

Référence design : https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/
```

---

## PROMPT — Module SMS Complet

```
Développe le module SMS Marketing complet pour Actor Hub.

Ce module doit permettre à un tenant de :
1. Envoyer des SMS unitaires (avec aperçu mobile)
2. Créer et gérer des campagnes SMS en masse
3. Importer et segmenter des listes de contacts
4. Programmer des envois à l'avance
5. Consulter les rapports DLR et analytics
6. Gérer les Sender IDs par pays
7. Utiliser l'API SMS via clé API

Architecture microservice :
- Service SMS autonome (Node.js + SMPP)
- Queue Redis pour les envois
- Webhook DLR pour les statuts
- API REST documentée

Composants UI à créer :
- Dashboard SMS principal avec KPIs
- Campaign builder (wizard 4 étapes)
- Contact manager (import CSV, filtres, tags)
- DLR report avec graphiques
- API documentation interactive

Garantir : multi-tenant isolation, rate limiting, blacklist automatique opt-out.
```

---

## PROMPT — Module Call Center Complet

```
Développe le module Call Center complet pour Actor Hub.

Ce module doit permettre à un tenant de :
1. Gérer un centre d'appels entrants et sortants
2. Distribuer automatiquement les appels (ACD + compétences)
3. Construire des menus IVR visuellement (drag & drop)
4. Utiliser un softphone WebRTC intégré
5. Superviser les agents en temps réel
6. Lancer des campagnes de démarchage téléphonique
7. Enregistrer et analyser les appels avec IA

Architecture :
- WebRTC softphone (sip.js)
- Serveur WebRTC/SIP (Asterisk ou FreeSWITCH)
- IVR engine (flux JSON)
- Real-time dashboard (Supabase Realtime)
- IA : transcription, analyse sentiment, coaching

Modules spécifiques :
- Power Dialer : rapport contacts/agent, détection répondeur
- Predictive Dialer : algorithme de prédiction, abandon rate
- IVR Builder : nœuds drag & drop, simulation
- Supervision : écoute discrète, soufflage, interception
- AIRO : assistant IA temps réel pour agents
```

---

## PROMPT — Module WhatsApp Business Complet

```
Développe le module WhatsApp Business Platform complet pour Actor Hub.

Fonctionnalités requises :
1. Connexion compte WABA (QR Code ou Business API)
2. Chat multi-agents en temps réel
3. Broadcasts avec templates Meta approuvés
4. Constructeur de chatbot (flow builder visuel)
5. Assistant IA (GPT-4) pour réponses automatiques
6. Analytics conversations et templates
7. OTP et notifications transactionnelles

Architecture microservice :
- WhatsApp Business API (Meta officielle)
- Webhook handler pour messages entrants
- Session manager (qui répond : bot ou agent ?)
- Media processor (image, vidéo, document)
- Chatbot engine avec NLP

Interface :
- Chat interface style WhatsApp Web (3 colonnes)
- Flow builder drag & drop
- Template manager avec submission Meta
- Dashboard temps réel (CSAT, temps de réponse)

Gérer : anti-spam, rate limits Meta, warmup du compte, protection anti-block.
```

---

## PROMPT — Module Email Marketing Complet

```
Développe le module Email Marketing complet pour Actor Hub.

Fonctionnalités :
1. Éditeur email WYSIWYG drag & drop
2. Bibliothèque de templates réutilisables
3. Campagnes email avec programmation
4. Automation flows (séquences d'emails)
5. A/B testing automatique (sujet, contenu)
6. Analytics complets (ouvertures, clics, bounces)
7. Gestion délivrabilité (SPF, DKIM, DMARC)

Architecture :
- SMTP multi-relay (SendGrid + backup)
- Bounce handler avec blacklisting automatique
- Open/click tracking (pixel + redirect)
- Segmentation engine (règles dynamiques)
- Automation flow engine (triggers + délais)

Interface :
- Email builder (blocs drag & drop)
- Flow builder automation
- Segmentation builder (règles visuelles)
- Dashboard analytics avec heatmaps de clics
- Guide de délivrabilité step-by-step

Gérer : unsubscribe automatique, RGPD, double opt-in, réputation IP.
```

---

## PROMPT — CPaaS API Gateway Complet

```
Développe la couche API CPaaS d'Actor Hub.

L'API doit permettre aux développeurs d'intégrer Actor Hub dans leurs applications.

Endpoints à implémenter :
SMS : send, bulk, status, reports, hlr, balance
Voice : call, hold, transfer, hangup, recording
WhatsApp : send, template, broadcast, status
Email : send, batch, template, analytics
Contacts : CRUD + import + segmentation
OTP : send (SMS/WhatsApp/Email) + verify

Fonctionnalités transverses :
- Authentification par API Key (Bearer token)
- Rate limiting par clé et par tenant
- Webhooks configurables avec retry et signature HMAC
- Logs de toutes les requêtes (30 jours de rétention)
- SDK officiels : Node.js, Python, PHP

Documentation :
- Style Twilio/Stripe (3 colonnes)
- Playground interactif en ligne
- Quickstart guide (5 minutes)
- Code samples dans 5 langages
- Changelog versioning

Erreurs : codes standards HTTP + codes Actor Hub (AH-SMS-001, etc.)
```

---

## PROMPT — Super Admin Dashboard Complet

```
Développe le Super Admin Dashboard complet de Biar Group pour gérer Actor Hub.

Ce dashboard est accessible uniquement aux équipes Biar Group (super_admin).

Fonctionnalités :
1. Vue globale de la plateforme (tenants, revenus, volume)
2. Gestion des tenants (créer, configurer, suspendre)
3. Gestion des plans et tarifs
4. Facturation et recouvrement
5. Monitoring des services en temps réel
6. Logs d'audit complets
7. Gestion du site vitrine (CMS basique)
8. Support niveau 2 (impersonation)

Métriques clés :
- MRR, ARR, Churn, NPS
- Volume par canal (SMS, Calls, WA, Email)
- Disponibilité des services (SLA)
- Incidents et alertes

Sécurité :
- Connexion 2FA obligatoire
- Session IP-bound
- Log de toutes les actions (audit trail)
- Impersonation loguée et limitée dans le temps

Interface : dark mode professionnel, dense en informations, optimisé desktop.
```

---

## Questions pour les Prochaines Étapes

Avant de continuer vers la partie 2, voici mes questions pour qualifier les besoins :

**Questions Architecture :**
1. Quel est le hébergement cible ? (Vercel + Supabase cloud, ou self-hosted ?)
2. Avez-vous déjà des comptes SMPP/SIP/WABA configurés ou devons-nous guider leur setup ?
3. La plateforme doit-elle être white-label (rebranding pour chaque tenant) ?

**Questions Fonctionnelles :**
4. Quelles sont les 3 fonctionnalités les plus urgentes à développer en premier ?
5. Les agents ont-ils besoin d'une application mobile (React Native) ?
6. Quel niveau d'IA souhaitez-vous ? (Basic chatbot ou GPT-4 avancé avec base de connaissances ?)

**Questions Business :**
7. Dans quels pays la plateforme sera-t-elle déployée en priorité ? (Maghreb, Europe, Afrique ?)
8. Quel volume estimez-vous pour le lancement ? (nb de tenants, SMS/mois)
9. Avez-vous des intégrations CRM prioritaires ? (Salesforce, HubSpot, Zoho)

**Questions Partie 2 :**
10. La "partie 2" mentionnée correspond-elle à :
    - [ ] Les applications mobiles (iOS/Android)
    - [ ] Le portail client self-service
    - [ ] Des modules métier supplémentaires (CRM, ticketing)
    - [ ] L'intégration avec des systèmes existants
    - [ ] Autre chose ?
