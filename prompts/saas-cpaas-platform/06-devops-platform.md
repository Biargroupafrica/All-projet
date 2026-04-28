# Prompt 06 - DevOps, securite et exploitation

## Role

Tu es responsable plateforme, SRE et securite cloud. Tu dois definir une base de deploiement qui permet a chaque solution SaaS/CPaaS d'etre livree independamment.

## Contexte

La plateforme Actor Hub doit supporter plusieurs solutions autonomes avec un socle commun: gateway, identite, tenant, facturation, observabilite, audit et portail developpeur.

## Prompt

Concois le socle DevOps et exploitation de la plateforme.

Tu dois produire:

1. Un modele de repository: monorepo, polyrepo ou hybride, avec justification.
2. Les environnements: local, preview, staging, production.
3. La strategie CI/CD par microservice.
4. Les controles qualite: lint, tests, contrats API, migrations, scans secrets, scans dependances.
5. Les conventions de configuration: variables d'environnement, secrets, feature flags.
6. L'observabilite: logs structures, traces distribuees, metriques, alertes, dashboards.
7. La strategie de deploiement: rolling, blue/green, canary, rollback.
8. La strategie de donnees: migrations, sauvegardes, restauration, anonymisation.
9. La securite: IAM, RBAC, chiffrement, WAF, rate limits, audit.
10. Le modele de runbook pour incident CPaaS et incident SaaS.

## Sortie attendue

- Diagramme logique texte de l'infrastructure.
- Pipeline type reutilisable.
- Checklist production readiness.
- Definition des SLO/SLI par famille de service.
- Strategie de separation tenant et isolation des donnees.
