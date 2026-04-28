# Prompts opérationnels: SaaS + CPaaS microservices autonomes

## Utilisation
- Remplacer les variables `{{...}}`.
- Lancer les prompts dans l'ordre: cadrage -> architecture -> microservices -> front -> sécurité -> tests -> déploiement.
- Conserver le principe: **chaque solution est autonome** (code, data, déploiement, monitoring).

## Variables communes
- `{{project_name}}`: nom plateforme (ex: Actor Hub).
- `{{target_market}}`: pays/secteurs cibles.
- `{{cloud_target}}`: Azure/AWS/GCP/Hybride.
- `{{tech_stack}}`: front/back/data/infra.
- `{{sla_target}}`: disponibilité cible.
- `{{compliance}}`: RGPD, PCI-DSS, ISO 27001, etc.
- `{{figma_main_url}}`: maquette principale.

## 1) Prompt cadrage global produit
Tu es architecte produit SaaS/CPaaS senior.
Contexte:
- Projet: {{project_name}}
- Marché: {{target_market}}
- Maquette source: {{figma_main_url}}
- Contraintes conformité: {{compliance}}

Objectif:
Construis un cadrage produit en séparant clairement:
1) offres SaaS,
2) offres CPaaS,
3) services transverses.

Exigences:
- Chaque offre doit être autonome (roadmap, API, data, déploiement).
- Proposer un modèle multi-tenant.
- Inclure métriques North Star + KPI opérationnels.
- Proposer un MVP vertical réaliste.

Format de sortie:
1. Vision produit (10 points max)
2. Domaines métier et frontières
3. MVP v1 (features + exclusions)
4. KPI produit et SLO techniques
5. Risques et mitigations

## 2) Prompt architecture microservices cible
Tu es architecte solution cloud-native.
Conçois l'architecture microservices d'une plateforme SaaS/CPaaS autonome.

Contexte:
- Projet: {{project_name}}
- Cloud: {{cloud_target}}
- Stack: {{tech_stack}}
- SLA: {{sla_target}}

Contraintes obligatoires:
- Database-per-service.
- API contracts versionnés (OpenAPI/AsyncAPI).
- Communication synchrone + événements asynchrones.
- IAM central mais politiques d'accès déléguées par domaine.
- Observabilité complète par service (logs, traces, métriques, alertes).
- Déploiement indépendant de chaque service.

Sortie attendue:
- Diagramme logique textuel (services + flux).
- Table des services (responsabilité, owner, DB, API, événements).
- Stratégie de résilience (retry, circuit breaker, DLQ).
- Stratégie de sécurité (auth, secrets, audit, chiffrement).
- Stratégie CI/CD et gestion des versions.

## 3) Prompt "générateur de microservice autonome"
Tu es un staff engineer.
Génère le blueprint complet d'un microservice autonome nommé `{{service_name}}`.

Contexte métier:
{{service_business_scope}}

Entrées/sorties:
- Commandes API: {{service_commands}}
- Requêtes API: {{service_queries}}
- Événements publiés: {{service_events_out}}
- Événements consommés: {{service_events_in}}

Exigences:
- Inclure structure de dossier standard.
- Proposer schéma de données local.
- Fournir OpenAPI minimal.
- Fournir AsyncAPI minimal.
- Définir stratégie de test (unit, integration, contract, e2e ciblé).
- Définir métriques et logs clés.
- Définir contrôles de sécurité.

Format:
1. Contrat du service
2. Schéma data
3. Endpoints
4. Événements
5. Règles métier critiques
6. Tests
7. Runbook incident

## 4) Prompt mapping Figma -> user journeys -> APIs
Tu es product designer + architecte logiciel.
Analyse ces routes:
- `/`
- `/services`
- `/fonctionnalites/call-center`
- `/industries`
- `/tarifs`
- `/actualites`
- `/a-propos`
- `/contact`
- `/login`

Source design:
- {{figma_main_url}}

Travail demandé:
1) Extraire les user journeys par page.
2) Mapper chaque journey aux capabilities backend.
3) Déduire APIs nécessaires (lecture/écriture).
4) Déduire événements métier.
5) Identifier les dépendances inter-services et les supprimer si couplage fort.

Sortie:
- Tableau par page: objectifs, composants UI, API, événements, services impactés.

## 5) Prompt page Landing (`/`)
Tu es expert conversion B2B SaaS/CPaaS.
Rédige la spécification fonctionnelle et technique de la page Landing de {{project_name}}.

Objectifs:
- Clarifier proposition de valeur.
- Capturer des leads qualifiés.
- Rediriger vers services, tarifs, contact, login.

Détails:
- Sections: hero, bénéfices, preuves, CTA, footer.
- Tracking: vues, clic CTA, scroll depth, conversion formulaire.
- SEO technique + performance web vitals.

Sortie:
- Structure de page.
- Spécification composants.
- Schéma analytics.
- Contrat API de capture lead.
- Critères d'acceptation.

## 6) Prompt page Services (`/services`)
Tu es architecte produit.
Spécifie la page Services en mode catalogue d'offres SaaS/CPaaS.

Exigences:
- Cartes de services avec capacité, cas d'usage, CTA.
- Filtres (secteur, taille entreprise, canal).
- Passage vers détail service.
- Mesure conversion par service.

Inclure:
- Modèle de données catalogue.
- API de listing/recherche.
- Événement `service_viewed` et `service_cta_clicked`.

## 7) Prompt page Fonctionnalité Call Center (`/fonctionnalites/call-center`)
Tu es expert CPaaS voix/call center.
Conçois la spécification complète de la solution call center autonome.

Exigences fonctionnelles:
- Gestion agents, files d'attente, scripts, dispositions.
- Campagnes entrantes/sortantes.
- Enregistrement et qualité.
- KPI temps réel (ASA, AHT, abandon, SLA).

Exigences techniques:
- Service call-routing séparé.
- Service agent-workspace séparé.
- Service quality-monitoring séparé.
- Service reporting séparé.

Sortie:
- Sous-domaines.
- APIs + événements.
- Plan de montée en charge.
- Plan de continuité et reprise.

## 8) Prompt page Industries (`/industries`)
Tu es consultant GTM.
Spécifie la page Industries pour personnaliser l'offre par vertical.

Demandes:
- Définir 5 à 8 verticales prioritaires.
- Pour chaque verticale: pains, cas d'usage CPaaS, bundle SaaS.
- CTA différencié par verticale.
- Tracking attribution par segment.

## 9) Prompt page Tarifs (`/tarifs`)
Tu es expert pricing SaaS/CPaaS.
Construis une page Tarifs claire avec modèle hybride abonnement + usage.

Contraintes:
- Plans SaaS (Starter, Growth, Enterprise).
- Usage CPaaS (par minute, message, session).
- Quotas, overage, remises volume.
- Calculateur de coût estimatif.

Sortie:
- Règles de pricing.
- API estimateur de prix.
- Événements billing.
- Cas limites (taxes, devise, prorata, upgrade/downgrade).

## 10) Prompt page Actualités (`/actualites`)
Tu es architecte CMS headless.
Spécifie la page Actualités autonome.

Exigences:
- Catégories, tags, pagination, SEO.
- Publication planifiée.
- Prévisualisation brouillon.
- Workflow validation éditeur.

Inclure:
- Schéma contenu.
- APIs publiques + backoffice.
- Droits auteurs/éditeurs/admin.

## 11) Prompt page À propos (`/a-propos`)
Tu es responsable marque.
Spécifie la page institutionnelle À propos.

Exigences:
- Histoire, mission, valeurs, équipe, partenaires.
- CTA recrutement/contact.
- Mesure engagement (temps lecture, clics CTA).
- Données gérées via service CMS.

## 12) Prompt page Contact (`/contact`)
Tu es expert expérience client B2B.
Spécifie la landing contact et son workflow lead-to-sales.

Exigences:
- Formulaire multi-cas (vente, support, partenariat).
- Routage automatique vers file adéquate.
- Anti-spam et consentement RGPD.
- SLA de traitement + accusé réception omnicanal.

Inclure:
- API `contact_request`.
- Événements `lead_created`, `lead_assigned`, `lead_responded`.
- Règles de qualification.

## 13) Prompt page Login (`/login`)
Tu es expert IAM.
Spécifie le parcours Login pour une plateforme multi-tenant.

Exigences:
- Email/password + SSO.
- MFA adaptatif.
- Gestion verrouillage/session/device.
- Journal d'audit sécurité.

Inclure:
- Flux authN/authZ.
- Politique de mot de passe et rotation token.
- Endpoints IAM minimaux.
- Stratégie recovery compte.

## 14) Prompt sécurité transverse
Tu es security architect.
Établis la baseline sécurité de la plateforme {{project_name}}.

Inclure impérativement:
- Modèle de menace par domaine.
- Contrôles OWASP ASVS.
- Chiffrement transit/repos.
- Gestion des secrets.
- Audit trail immuable.
- Contrôle d'accès RBAC/ABAC.
- Politique de rétention et anonymisation.

Format:
- Matrice risques x contrôles x preuves.

## 15) Prompt tests end-to-end
Tu es QA lead.
Produis une stratégie de tests E2E pour une plateforme SaaS/CPaaS à microservices autonomes.

Exigences:
- Tests critiques par parcours utilisateur.
- Tests de contrat API/events.
- Tests résilience (latence, panne, DLQ).
- Tests performance (pics d'usage CPaaS).
- Tests sécurité (auth, permissions, abus).

Sortie:
- Matrice test -> service -> environnement -> critère de succès.

## 16) Prompt CI/CD et exploitation
Tu es SRE.
Définis le modèle de delivery autonome par microservice.

Exigences:
- Build/test/scan/release indépendants.
- Environnements dev/staging/prod.
- Feature flags.
- Rollback automatique.
- Dashboards + alerting par SLO.
- Runbooks incidents.

Sortie:
- Pipeline type.
- Politique de release.
- Checklists go-live.

## 17) Prompt "Partie 2"
Tu es architecte de programme.
En t'appuyant sur la Partie 1 validée, construis la Partie 2:
- Décomposition en epics/stories techniques.
- Priorisation par valeur/risque.
- Plan d'industrialisation par domaine.
- Dépendances externes et stratégie de mitigation.

Format:
- Backlog structuré par domaine (IAM, Billing, CPaaS, Call Center, CMS, Analytics).
- Critères de done par epic.
