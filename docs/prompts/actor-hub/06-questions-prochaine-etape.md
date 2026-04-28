# Questions pour passer aux etapes suivantes

Utiliser ces questions avant de lancer l'implementation full stack ou la deuxieme partie des maquettes.

## 1. Positionnement produit

1. La marque finale est-elle `Actor Hub`, `BIAR Group Actor Hub`, ou une autre appellation?
2. Quelles offres sont commercialisees en premier: Call Center, SMS, WhatsApp, Email, bundle complet?
3. Quelle cible prioritaire: PME, centres d'appels, banques, e-commerce, institutions, operateurs telecom?
4. Quels pays et langues doivent etre supportes au lancement?
5. Le produit doit-il etre white-label pour revendeurs ou uniquement multi-tenant Actor Hub?

## 2. Perimetre MVP

1. Quels modules doivent etre livres dans la premiere version utilisable?
2. Quelles pages Figma sont prioritaires parmi `/`, `/services`, `/fonctionnalites/call-center`, `/industries`, `/tarifs`, `/actualites`, `/a-propos`, `/contact`, `/login`?
3. Le dashboard doit-il etre livre avec donnees reelles, mocks, ou mode hybride?
4. Quels parcours doivent etre fonctionnels de bout en bout: inscription, achat credits, campagne SMS, appel softphone, WhatsApp, email?
5. Quels modules peuvent rester en "coming soon" sans bloquer la premiere version?

## 3. Architecture et stack

1. Souhaites-tu une base `monorepo` ou plusieurs repositories par microservice?
2. Quelle stack backend preferes-tu: Node/NestJS, FastAPI, Laravel, Go, Spring, Supabase Edge Functions, autre?
3. Quelle stack frontend: Next.js, React/Vite, Angular, Vue, autre?
4. Quelle base de donnees principale: PostgreSQL/Supabase, MySQL, MongoDB, autre?
5. Quelle plateforme de deploiement: Docker Compose, Kubernetes, Vercel/Supabase, AWS, Azure, GCP, bare metal?

## 4. Autonomie des microservices

1. Chaque solution doit-elle avoir sa propre base physique, son propre schema, ou seulement une isolation logique?
2. Les services partagent-ils un `auth-service` central ou chaque solution peut-elle authentifier seule via tokens federes?
3. Quel broker d'evenements souhaites-tu: RabbitMQ, Kafka, NATS, Redis Streams, Supabase Realtime, autre?
4. Les services doivent-ils pouvoir etre vendus/deployes separement?
5. Faut-il un API Gateway unique ou un BFF par experience frontend?

## 5. Integrations CPaaS

1. Fournisseurs SMS/SMPP deja choisis? Host, bind type, DLR, throughput, sender ID, pays?
2. Fournisseur WhatsApp Business: Meta Cloud API, BSP, autre?
3. Fournisseur email: SMTP interne, SendGrid, Mailgun, AWS SES, Brevo, autre?
4. Fournisseur voix/call center: SIP trunk, Twilio, Plivo, Asterisk/FreeSWITCH, operateur local?
5. Quelles contraintes anti-spam, opt-in/opt-out, DNC, consentement et conservation des logs?

## 6. Multi-tenant, roles et facturation

1. Roles definitifs: super admin, admin tenant, manager, agent, customer, support, revendeur?
2. Isolation attendue: sous-domaines par tenant, domaines custom, ou selection de compte apres login?
3. Facturation: abonnement, credits prepayes, postpaid, mixte, commission revendeur?
4. Unite de consommation: SMS, segment SMS, minute appel, message WhatsApp, email envoye, stockage?
5. Quel fournisseur paiement: Stripe, PayPal, mobile money, virement, facturation manuelle?

## 7. Donnees, conformite et securite

1. Des contraintes RGPD, loi locale, conservation telecom ou audit financier sont-elles imposees?
2. Duree de retention des CDR, enregistrements d'appels, messages, logs API et factures?
3. Chiffrement attendu pour secrets, messages, enregistrements et exports?
4. Besoin de SSO, MFA, IP allowlist, journaux d'audit avances?
5. Environnements requis: dev, staging, preprod, production?

## 8. UX et design

1. Les maquettes Figma Make sont-elles source de verite stricte ou une inspiration?
2. Le design system existant doit-il etre conserve: violet `#5906AE`, rose `#FF006F`, shadcn/ui, dark mode?
3. Souhaites-tu importer les assets/logos depuis Figma ou repartir avec des assets fournis separement?
4. Les pages doivent-elles etre responsives mobile-first des la premiere iteration?
5. Quels contenus marketing sont definitifs et lesquels doivent etre reecrits?

## 9. Methode de livraison

1. Veux-tu commencer par le socle technique, la vitrine, l'auth, ou un module CPaaS precis?
2. Souhaites-tu que chaque microservice ait son propre prompt de generation et son backlog?
3. Faut-il produire d'abord une architecture C4, un schema de donnees, ou directement un prototype code?
4. Quel niveau de tests est attendu: unitaires, integration, contrats, e2e UI, charge?
5. Quels criteres d'acceptation doivent etre obligatoires avant de valider une etape?
