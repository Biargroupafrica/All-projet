## Pack de prompts: plateforme SaaS + CPaaS (microservices autonomes)

Ce pack est concu pour piloter la conception d une plateforme SaaS/CPaaS a partir des ecrans references et de routes web.

### Contexte de reference (a copier dans chaque prompt)
- Home: `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1`
- Services: `...&preview-route=%2Fservices`
- Call center: `...&preview-route=%2Ffonctionnalites%2Fcall-center`
- Industries: `...&preview-route=%2Findustries`
- Tarifs: `...&preview-route=%2Ftarifs`
- Actualites: `...&preview-route=%2Factualites`
- A propos: `...&preview-route=%2Fa-propos`
- Contact: `https://actorhub.figma.site/contact`
- Login: `...&preview-route=%2Flogin`

---

## Prompt 1 - Discovery produit + domaines metier
Tu es Architecte Produit et Solution.

Objectif:
- Extraire les capacites metier depuis les pages de reference.
- Proposer les bounded contexts et les microservices associes.

Contraintes:
- Chaque service doit etre autonome (donnees, deploiement, exploitation).
- Eviter les bases partagees et les couplages forts.

Livrables attendus:
1. Tableau "Page -> Capacites metier".
2. Tableau "Capacite -> Domaine -> Microservice".
3. Liste des dependances inter-services autorisees.
4. Risques de decoupage et mitigations.

Format de sortie:
- Markdown, tableaux lisibles, bullets actionnables.

---

## Prompt 2 - Blueprint microservices autonomes
Tu es Solution Architect senior SaaS/CPaaS.

Objectif:
- Construire le blueprint technique de la plateforme en microservices autonomes.

Exigences:
- Multi-tenant by design.
- Event-driven par defaut entre services.
- APIs versionnees pour les integrations externes.
- Observabilite complete (logs, metrics, traces).

Pour chaque microservice, fournir:
- Nom
- Responsabilite unique
- Endpoints API (3-5 minimum)
- Evenements publies et consommes
- Stockage dedie (type + justification)
- SLO cibles
- Strategie de deploiement independant
- Runbook incident niveau 1
- Score autonomie (1 a 5) + justification

Ajouter:
- Diagramme logique textuel (ASCII) des flux sync/async.
- Matrice des dependances techniques.

---

## Prompt 3 - CPaaS call center (domaine prioritaire)
Tu es Lead Architect CPaaS.

Objectif:
- Definir l architecture autonome de la solution Call Center visible dans `/fonctionnalites/call-center`.

Inclure obligatoirement:
- Inbound/outbound calls
- IVR
- Routage ACD
- Agent desktop APIs
- Enregistrement et qualite
- Supervision temps reel
- Reporting et analytics

Livrables:
1. Liste des microservices call center (autonomes).
2. Contrats API et evenements temps reel.
3. Design de resilience (idempotence, retries, DLQ, fallback).
4. Exigences non-fonctionnelles (latence audio, disponibilite, RPO/RTO).
5. Plan de montee en charge.

---

## Prompt 4 - SaaS foundation (tenant, auth, billing)
Tu es Architecte plateforme SaaS.

Objectif:
- Definir les fondations transverses sans casser l autonomie des domaines metier.

Couvrir:
- Identity and Access (login, roles, permissions)
- Tenant lifecycle (creation, isolation, quotas)
- Billing and Subscription (plans, usage metering, facturation)
- Catalog services/pricing alignment (`/services`, `/tarifs`)

Sortie attendue:
- Microservices transverses et leurs limites.
- Regles d isolation tenant.
- Contrats d usage metering vers billing.
- Strategie de versioning des plans/prix.
- Points de controle securite + conformite.

---

## Prompt 5 - Plan implementation par lots
Tu es Engineering Manager + Architecte.

Objectif:
- Produire un plan de mise en oeuvre incremental.

Demande:
- Lot 1: fondations indispensables
- Lot 2: services coeur business
- Lot 3: extension CPaaS avancee
- Lot 4: optimisation scale et fiabilite

Pour chaque lot:
- Microservices inclus
- Definition of Done
- KPI de validation
- Risques techniques et dettes acceptees

Ajouter:
- Ordonnancement des migrations de donnees.
- Strategie de tests E2E inter-services.

---

## Prompt 6 - Prompt de revue d autonomie (quality gate)
Tu es Principal Engineer en revue d architecture.

Objectif:
- Auditer la proposition et verifier que chaque solution est vraiment autonome.

Checklist stricte:
- Deploiement independant
- Stockage dedie
- Contrats versionnes
- Tolere la panne d un service voisin
- Telemetrie exploitable
- Securite (least privilege)

Rendu:
- Verdict global (GO / GO sous conditions / NO GO)
- Tableau des ecarts critiques
- Actions correctives priorisees P0/P1/P2

---

## Prompt 7 - Questions de cadrage Etape 2 (a poser au client)
Utilise ce prompt pour generer un questionnaire complet:

"Genere une liste de questions de cadrage pour passer a l etape suivante de conception SaaS/CPaaS microservices autonomes. Classe les questions par themes: business model, utilisateurs, compliance, architecture cible, operations, data, securite, roadmap. Pour chaque question, ajoute pourquoi elle est critique et la decision d architecture qu elle impacte."

