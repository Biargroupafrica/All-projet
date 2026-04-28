# Skills Overview — ACTOR Hub Platform

Ce répertoire contient les fichiers de skills (Standard Operating Procedures) pour construire la plateforme ACTOR Hub.

## Index des Skills

| Fichier | Scénario d'utilisation |
|---------|----------------------|
| `01-landing-page.md` | Construire ou modifier le site vitrine public |
| `02-auth-service.md` | Implémenter l'authentification et la gestion des utilisateurs |
| `03-sms-service.md` | Développer le microservice SMS Bulk & SMPP |
| `04-email-service.md` | Développer le microservice Email Marketing |
| `05-whatsapp-service.md` | Développer le microservice WhatsApp Business API |
| `06-callcenter-service.md` | Développer le microservice Centre d'Appels WebRTC |
| `07-billing-service.md` | Implémenter la facturation et la gestion des crédits |
| `08-dashboard-app.md` | Construire l'espace client unifié (dashboard) |
| `09-admin-app.md` | Construire le backoffice opérateur |
| `10-ai-service.md` | Développer le service IA (transcription, chatbot, sentiment) |
| `11-infrastructure.md` | Déploiement Kubernetes, Terraform, CI/CD |
| `12-design-system.md` | Créer ou étendre les composants UI partagés |

## Règle d'utilisation

Avant toute implémentation, lire le fichier de skill correspondant à la tâche. Les skills contiennent :
- Le contexte métier et les exigences fonctionnelles
- La structure de fichiers attendue
- Les dépendances et intégrations
- Les critères de succès et tests requis
- Les pièges à éviter

## Principes Architecture

1. **Autonomie** : Chaque microservice est déployable et opérable indépendamment
2. **API-first** : Toute fonctionnalité est exposée via API REST documentée (OpenAPI)
3. **Event-driven** : Communication asynchrone via Kafka/RabbitMQ entre services
4. **Multi-tenant** : Isolation stricte par organisation (RLS PostgreSQL)
5. **Observabilité** : Logs structurés, métriques Prometheus, traces OpenTelemetry
