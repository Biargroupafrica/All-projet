# Prompts prets a l'emploi - Plateforme SaaS + CPaaS (microservices autonomes)

Ce pack sert a piloter la conception et l'implementation d'une plateforme SaaS/CPaaS avec des solutions autonomes par domaine.

## 0) Contexte de reference a injecter dans chaque prompt

Utiliser ces routes comme source de vision produit/UX:
- `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1`
- `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fservices`
- `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ffonctionnalites%2Fcall-center`
- `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Findustries`
- `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Ftarifs`
- `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Factualites`
- `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Fa-propos`
- `https://actorhub.figma.site/contact`
- `https://www.figma.com/make/XDPnl4zhusx3vecuWQTYFx/Plateforme-Biar-group-Actor-hub-VFinal-15-03-2026--copie-?fullscreen=1&t=xydTwQ2WmU0jdH7u-1&preview-route=%2Flogin`

## 1) Prompt Discovery (vision + scope)

```text
Tu es un architecte produit SaaS/CPaaS senior.
Objectif: transformer les ecrans/sections de reference en backlog de capacites metier.

Contraintes:
- Architecture microservices.
- Chaque solution doit etre autonome (build, deploy, data, run).
- Eviter tout couplage fort entre domaines.

Livrables:
1) Liste des domaines metier prioritaires.
2) Capacites par domaine (MVP vs phase suivante).
3) Personas cibles par domaine.
4) Risques majeurs (techniques, produits, compliance).

Format:
- Tableau "Domaine | Capacites MVP | Capacites Phase 2 | KPI".
- Puis une liste de 10 hypotheses a valider.
```

## 2) Prompt Architecture macro (domain-driven + autonomy)

```text
Agis comme principal architect.
Concois une architecture SaaS + CPaaS basee sur des microservices autonomes.

Regles obligatoires:
- Database per service.
- API contracts versionnes.
- Event-driven pour integration inter-domaines.
- Zero shared schema en ecriture.
- Deployments independants par service.

Produis:
1) Domain map (bounded contexts).
2) Liste des microservices par domaine.
3) Matrice des dependances minimales.
4) Choix sync/async pour chaque interaction.
5) Strates transverses: IAM, observabilite, billing, audit, secrets.

Ajoute une section "anti-patterns a eviter" specifique a ce contexte.
```

## 3) Prompt Design par microservice (fiche executable)

```text
Tu dois decrire les microservices un par un avec un niveau implementation-ready.

Pour chaque service, fournir:
- Mission metier.
- Endpoints API (REST/gRPC) versionnes.
- Evenements publies/consommes (nom + version).
- Modele de donnees possede (et uniquement possede).
- SLO/SLA cibles.
- Strategie de resilience (retry, circuit breaker, idempotence).
- Strategie securite (authn/authz, chiffrement, PII).
- Plan de deploiement et rollback.
- Runbook MEP + incidents.

Sortie attendue:
- Une fiche complete par service, sans ambiguite.
```

## 4) Prompt CPaaS specialise (voice, messaging, call center)

```text
Tu es expert CPaaS entreprise.
Concevoir le bloc CPaaS en services autonomes:
- Voice
- Messaging (SMS/OTT/email si necessaire)
- Contact/Call Center
- Routing intelligent
- Recording/Quality

Exigences:
- Scalabilite elevee.
- Haute disponibilite.
- Tracabilite legale des interactions.
- APIs exposees pour integrer des SaaS tiers.

Donne:
1) Les services CPaaS detailles.
2) Le flux principal d'un appel entrant et d'une campagne sortante.
3) Les points d'observabilite obligatoires.
4) Les risques conformite (pays, retention, consentement).
```

## 5) Prompt SaaS business model (offres, pricing, tenancy)

```text
Agis comme architecte produit + monetisation.
Definis un modele SaaS/CPaaS multi-offres:
- Plans tarifaires.
- Limites et quotas.
- Facturation usage + abonnement.
- Tenancy (single tenant, pooled, hybride).

Sortie:
1) Catalogue des offres (Starter/Pro/Enterprise ou equivalent).
2) Mapping "offre -> fonctionnalites -> limites techniques".
3) Regles de facturation orientees evenements.
4) Strategie d'evolution sans casser les clients existants.
```

## 6) Prompt Security & Compliance by design

```text
Tu es CISO/architecte securite.
Construis le cadre securite/compliance pour une plateforme SaaS + CPaaS:
- IAM central + policies par service.
- Chiffrement en transit/au repos.
- Gestion secrets/cles.
- Journalisation d'audit.
- Classification et retention des donnees.

Retour attendu:
1) Controle de securite par couche (edge, app, data, ops).
2) Matrice des menaces (top 15).
3) Controles prioritaires a implementer en MVP.
4) Exigences pour SOC2/ISO27001/GDPR-ready.
```

## 7) Prompt Plan de livraison (roadmap technique)

```text
Tu es directeur technique programme.
Construis une roadmap d'execution en vagues, pour une equipe multi-squads:
- Wave 1: fondations plateforme.
- Wave 2: verticales metier prioritaires.
- Wave 3: industrialisation et expansion.

Contraintes:
- Chaque squad livre des services deployables de maniere autonome.
- Definition of done inclut runbook + monitoring + alerting.

Livrables:
1) Ordonnancement technique par vagues.
2) Dependances minimales inter-equipes.
3) Criteres de passage entre vagues.
4) KPI delivery + fiabilite.
```

## 8) Prompt Questions a poser au client avant la phase 2

```text
Genere une checklist de questions de cadrage pour passer en phase suivante.
Les questions doivent etre courtes, decisives, et organisees par themes:
- Business et priorisation.
- Architecture et stack.
- Donnees et gouvernance.
- Securite et conformite.
- Integrations externes.
- Exploitation et SLA.

Sortie:
- 25 questions max.
- Chaque question doit inclure l'impact d'une mauvaise reponse.
```

## 9) Prompt "execution immediate" (utilisable tel quel)

```text
A partir des references UX fournies, produis:
1) Une architecture cible SaaS/CPaaS en microservices autonomes.
2) Les 12 a 20 microservices prioritaires avec leur role.
3) Une matrice API/Event de niveau MVP.
4) Un plan de delivery en 3 vagues.
5) Les decisions critiques a arbitrer.
6) Les questions bloquees a poser au sponsor pour lancer la phase 2.

Important:
- Reste concret, oriente implementation.
- Pas de generalites.
- Toute proposition doit expliciter son impact sur l'autonomie des solutions.
```
