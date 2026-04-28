# Prompt 03 - Template de solution autonome

## Role

Tu es tech lead microservices. Ta mission est de creer une solution Actor Hub autonome, exploitable seule, mais integrable a la plateforme globale.

## Entrees

- Nom de la solution: `[call-center | sms | whatsapp | email | billing | auth | support | analytics | frontend-cms]`
- Objectif metier:
- Personas:
- Routes UI concernees:
- Fournisseurs externes:
- Donnees sensibles:
- Contraintes de delivrabilite, latence, cout ou conformite:

## Prompt a executer

Conçois puis implemente la solution `[NOM]` comme un microservice autonome.

Respecte ces exigences:

1. Domaine et limites
   - Definis le bounded context.
   - Liste les responsabilites incluses et exclues.
   - Identifie les dependances autorisees.

2. API publique
   - Cree les endpoints REST ou GraphQL necessaires.
   - Versionne les contrats.
   - Ajoute validation, pagination, idempotence et erreurs normalisees.

3. Evenements
   - Publie les evenements metier importants.
   - Consomme uniquement des evenements contractuels d'autres services.
   - Prevois retries, dead letter queue et correlation id.

4. Donnees
   - Cree un schema propre a la solution.
   - Ajoute `tenant_id`, audit fields, statuts et index.
   - Definis migrations, seeds minimaux et retention.

5. Workers
   - Isole les traitements longs en jobs.
   - Rends les jobs idempotents.
   - Ajoute reprise apres echec.

6. Observabilite
   - Logs structures.
   - Metriques metier et techniques.
   - Traces distribuees.
   - Tableaux de bord et alertes.

7. Securite
   - RBAC par role.
   - Isolation tenant.
   - Secrets hors code.
   - Rate limiting et anti-abus.

8. Tests
   - Tests unitaires du domaine.
   - Tests d'API.
   - Tests de contrats.
   - Smoke test deployable.

## Definition of done

- La solution peut demarrer sans les autres solutions metier.
- Les integrations externes sont mockables.
- Les contrats sont documentes.
- Les tests prouvent le flux principal.
- Le runbook explique configuration, incidents, rollback et monitoring.
