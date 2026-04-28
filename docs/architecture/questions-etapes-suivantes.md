# Questions pour les étapes suivantes – Actor Hub

Ce document liste les questions à répondre avant de passer à la génération de code des modules suivants.

---

## Questions Partie 2 – Éléments manquants / à clarifier

### A. Identité visuelle & Design

1. **Charte graphique** : Avez-vous les couleurs HEX exactes de la marque Biar Group / Actor Hub (primaire, secondaire, accent) ?
2. **Logo** : Pouvez-vous fournir le logo Actor Hub (SVG ou PNG) ?
3. **Typographies** : Quelles polices sont utilisées (si différentes d'Inter / DM Sans) ?
4. **Illustrations** : Utilisez-vous des illustrations vectorielles spécifiques ou des icônes personnalisées ?

### B. Contenu & Textes

5. **Langues** : La plateforme doit-elle être disponible en arabe (RTL) ou d'autres langues en plus du FR/EN ?
6. **Pages Actualités** : Blog géré en CMS (Contentful, Sanity, Strapi) ou statique (MDX) ?
7. **Testimonials / Logos clients** : Avez-vous une liste de clients de référence à afficher sur la landing ?
8. **Page Industries** : Quels cas d'usage concrets pour chaque secteur (Banque, Santé, etc.) ?

### C. Fonctionnalités avancées

9. **Portail Revendeur / Whitelabel** : La plateforme doit-elle supporter des revendeurs (mode agence) avec leurs propres clients ?
10. **API publique** : Prévoyez-vous une API publique pour vos clients (webhooks entrants, SDK) ? Faut-il générer une page de documentation développeur ?
11. **Chatbot / IA** : Les fonctionnalités IA (transcription automatique, résumé d'appels, sentiment analysis) sont-elles dans le périmètre Phase 1 ou Phase 2 ?
12. **Numéros virtuels (DID)** : Gérez-vous votre propre stock de numéros ou passez-vous par un agrégateur (Twilio, Vonage, Bandwidth) ?

### D. Intégrations

13. **CRM externes** : Quelles intégrations CRM sont prioritaires ? (Salesforce, HubSpot, Zoho, Pipedrive, autre)
14. **Connecteurs métier** : Des intégrations sectorielles spécifiques ? (ex: Salesforce Health Cloud pour la santé, SAP pour l'industrie)
15. **SSO entreprise** : Le SSO SAML (Okta, Azure AD, G Suite) est-il requis dès la Phase 1 ou Phase 2 ?

### E. Infrastructure & Déploiement

16. **Cloud cible** : Azure uniquement, GCP, AWS, ou multi-cloud ?
17. **On-premise** : Pour les clients Enterprise, une offre on-premise est-elle prévue dès maintenant ?
18. **Régions** : Déploiement France uniquement, EU, ou international (USA, Afrique, MENA) ?
19. **Conformité** : Des certifications spécifiques requises ? (ISO 27001, RGPD, HDS pour la santé, PCI-DSS pour le paiement)

### F. Go-to-market & Priorités

20. **Phases** : Quels microservices/modules constituent la **Phase 1** (MVP) vs Phase 2 ? La landing page et le call center semblent être Phase 1 – confirmez-vous ?
21. **Industries prioritaires** : Quel(s) secteur(s) ciblez-vous en premier pour les cas d'usage et témoignages ?
22. **Freemium** : Existe-t-il un plan gratuit permanent (limité) en plus du trial 14 jours ?

---

## Réponses attendues

Pour passer à la **Partie 2** (génération du code réel), merci de répondre à ces questions.  
Les plus critiques pour démarrer sont : **A (design), E16 (cloud), F20 (MVP scope)**.

Une fois vos réponses reçues, nous pourrons :
1. Initialiser le monorepo (`pnpm`, `turbo`)
2. Générer les pages de la landing complète
3. Bootstrapper les microservices prioritaires
4. Configurer l'infrastructure Docker Compose
