# Questions de cadrage pour passer aux etapes suivantes

Ces questions servent a verrouiller les choix de produit, d'architecture et de livraison avant de generer le backlog, les schemas d'API, les microservices et les premiers squelettes de code.

## 1. Vision produit et priorites

1. Quel est le nom final de la plateforme : Actor Hub, Biar Group, ou autre ?
2. La plateforme cible-t-elle d'abord les clients B2B, les revendeurs, les centres d'appels internes, ou plusieurs segments en parallele ?
3. Quelle solution doit etre livree en premier : SMS, WhatsApp, call center, email marketing, portail client, portail admin, ou vitrine publique ?
4. Quelles routes Figma sont prioritaires pour la prochaine etape : `/`, `/services`, `/fonctionnalites/call-center`, `/industries`, `/tarifs`, `/actualites`, `/a-propos`, `/contact`, `/login` ?
5. Faut-il conserver exactement le design Figma Make ou l'utiliser comme reference produit a adapter ?

## 2. Autonomie des solutions

1. Chaque solution doit-elle avoir sa propre base de donnees ?
2. Chaque solution doit-elle pouvoir etre deployee seule avec son frontend, son backend et ses workers ?
3. Les solutions doivent-elles partager un design system commun sous forme de package ?
4. Les solutions doivent-elles partager l'authentification, la facturation et les credits via des services communs ?
5. Faut-il autoriser l'installation d'une seule solution chez un client sans deployer le reste de la plateforme ?

## 3. Roles, tenants et securite

1. Quels roles sont obligatoires au lancement : super admin, admin tenant, manager, agent, client, support, revendeur ?
2. Le multi-tenant doit-il etre strictement isole par base, par schema, ou par `tenant_id` ?
3. Faut-il prevoir SSO, MFA, OAuth, magic link, mot de passe classique, ou plusieurs modes ?
4. Quels journaux d'audit sont obligatoires pour la conformite ?
5. Quelles contraintes legales s'appliquent : RGPD, conservation des donnees, opt-in marketing, DNC, enregistrement d'appels ?

## 4. Canaux CPaaS

1. Quels fournisseurs doivent etre supportes au depart : Twilio, Plivo, Nexmo/Vonage, Meta WhatsApp, SMPP, SIP trunk, SMTP, autre ?
2. Faut-il une abstraction multi-provider avec bascule automatique en cas d'echec ?
3. Quels pays et operateurs sont prioritaires pour les tarifs, sender IDs, numeros et conformite ?
4. Quels canaux doivent gerer les webhooks entrants des la premiere version ?
5. Faut-il une logique de credits unifiee ou un wallet par canal ?

## 5. Call center et voix

1. Le call center doit-il integrer WebRTC, SIP, softphone navigateur, ou un PBX externe ?
2. Les fonctions IVR, ACD, skill-based routing, dialers, supervision et enregistrement sont-elles toutes prioritaires ?
3. Faut-il supporter les campagnes sortantes predictive, preview et power dialer des la premiere version ?
4. Quel niveau de reporting temps reel est attendu pour superviseurs et wallboards ?
5. Faut-il de l'analyse IA des appels, transcription, scoring qualite ou resume automatique ?

## 6. Donnees et integrations

1. Quels CRM doivent etre integres en priorite ?
2. Faut-il importer des contacts par CSV, API, webhook, connecteur CRM, ou tous ces modes ?
3. Quels exports sont obligatoires : CSV, Excel, PDF, API, webhook, S3 compatible ?
4. Quels evenements metier doivent etre publies sur un bus d'evenements ?
5. Les clients doivent-ils pouvoir creer leurs propres webhooks et cles API ?

## 7. Facturation, offres et tarification

1. Les tarifs sont-ils par abonnement, par usage, par credit, par utilisateur, ou hybrides ?
2. Faut-il une facturation prepayee, postpayee, ou les deux ?
3. Quels plans doivent apparaitre sur `/tarifs` ?
4. Faut-il gerer les taxes, devises multiples, factures PDF et paiements en ligne ?
5. Quel fournisseur de paiement est cible : Stripe, PayPal, CinetPay, Orange Money, Wave, virement, autre ?

## 8. Stack technique et exploitation

1. Quelle stack frontend preferee : Next.js, React/Vite, autre ?
2. Quelle stack backend preferee : NestJS, FastAPI, Go, Laravel, Spring Boot, autre ?
3. Quelle base de donnees preferee : PostgreSQL, MySQL, MongoDB, Supabase, autre ?
4. Quelle plateforme de deploiement : Kubernetes, Docker Compose, VPS, AWS, Azure, GCP, Supabase, Vercel ?
5. Quels outils d'observabilite sont souhaites : Prometheus, Grafana, OpenTelemetry, Sentry, ELK, autre ?

## 9. Prochaine livraison attendue

1. Souhaites-tu que la prochaine etape produise une architecture complete, un backlog MVP, des contrats API, ou directement un monorepo scaffold ?
2. Dois-je generer les prompts separement pour frontend, backend, DevOps, QA, UX et securite ?
3. Faut-il creer une partie deux pour les autres liens et modules quand ils seront fournis ?
4. Souhaites-tu un format de sortie en francais uniquement ?
5. Quel niveau de detail veux-tu pour les livrables : synthese executive, specification produit, specification technique, ou ticket par microservice ?
