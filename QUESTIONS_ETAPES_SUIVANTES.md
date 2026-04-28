# Questions pour les Etapes Suivantes - Actor Hub Platform

## Phase 1 : Landing Page & Frontend (Partie actuelle)

Les skills et prompts pour la landing page et le dashboard sont prêts. Voici les questions pour avancer :

---

### 1. Infrastructure & Hébergement

- **Q1:** Quel hébergement souhaitez-vous utiliser ?
  - a) Vercel (frontend) + Supabase (backend) — recommandé pour démarrer
  - b) AWS (EC2/ECS/Lambda) — plus flexible, plus complexe
  - c) Azure — si vous êtes déjà dans l'écosystème Microsoft
  - d) VPS (OVH, Hetzner, DigitalOcean) — budget serré

- **Q2:** Souhaitez-vous utiliser Docker/Kubernetes pour orchestrer les microservices, ou démarrer plus simplement avec Supabase Edge Functions ?

- **Q3:** Avez-vous déjà un nom de domaine ? (ex: `actorhub.com`, `actorhub.io`)

---

### 2. Providers Télécom (CPaaS)

- **Q4:** Pour le **Call Center (SIP/VoIP)**, quel provider souhaitez-vous intégrer ?
  - a) Twilio
  - b) Plivo
  - c) Vonage (Nexmo)
  - d) Provider SIP africain spécifique ?
  - e) Votre propre infrastructure SIP ?

- **Q5:** Pour le **SMS (SMPP)**, avez-vous déjà un compte SMPP avec un agrégateur ?
  - Si oui, quel provider ? (ex: Infobip, Route Mobile, Africa's Talking)
  - Si non, souhaitez-vous que je configure l'intégration avec un provider spécifique ?

- **Q6:** Pour **WhatsApp Business API**, avez-vous déjà un compte Meta Business vérifié et un numéro approuvé ?

- **Q7:** Pour **l'Email**, quel provider SMTP souhaitez-vous ?
  - a) SendGrid
  - b) AWS SES
  - c) Mailgun
  - d) SMTP propre

---

### 3. Base de données & Backend

- **Q8:** Confirmez-vous l'utilisation de **Supabase** comme backend principal (PostgreSQL + Auth + Storage + Edge Functions) ?

- **Q9:** Souhaitez-vous une architecture **monorepo** (tous les microservices dans un seul repo) ou **multi-repo** (un repo par microservice) ?

- **Q10:** Pour le **Message Broker** entre microservices, préférez-vous :
  - a) Redis Streams (plus simple, déjà dans la stack)
  - b) RabbitMQ (plus robuste, plus complexe)
  - c) Kafka (très scalable, overkill pour démarrer)

---

### 4. Paiements

- **Q11:** Pour la **facturation**, confirmez-vous **Stripe** comme processeur de paiement principal ?

- **Q12:** Souhaitez-vous intégrer **Mobile Money** (M-Pesa, Orange Money, Airtel Money) dès la première version ?
  - Si oui, quels pays cibles en priorité ? (RDC, Congo, Cameroun, Côte d'Ivoire, etc.)

- **Q13:** Les tarifs des plans (Starter 49€, Business 199€) sont-ils validés ?
  - Monnaie de facturation : EUR, USD, ou CDF ?

---

### 5. Sécurité & Conformité

- **Q14:** Avez-vous des exigences spécifiques de conformité ?
  - RGPD (Europe)
  - Régulation télécom locale (ARPTC pour la RDC)
  - PCI DSS (paiements)

- **Q15:** Souhaitez-vous intégrer l'**authentification sociale** (Google, Microsoft) dès la v1 ?

---

### 6. IA & Fonctionnalités Avancées

- **Q16:** Pour le **chatbot IA** (WhatsApp, Call Center), confirmez-vous l'utilisation d'**OpenAI (GPT-4)** ?
  - Ou préférez-vous une alternative (Claude, Mistral, modèle open-source) ?

- **Q17:** Souhaitez-vous l'**analyse de sentiment** et la **transcription automatique** des appels dès la v1 ?

---

### 7. Priorités de Développement

- **Q18:** Dans quel ordre souhaitez-vous développer les modules ?
  Proposition :
  1. **Phase 1:** Landing Page + Auth + Dashboard base
  2. **Phase 2:** SMS Bulk (module le plus demandé en Afrique)
  3. **Phase 3:** WhatsApp Business
  4. **Phase 4:** Call Center
  5. **Phase 5:** Email Marketing
  6. **Phase 6:** Analytics & Billing avancés

- **Q19:** Y a-t-il un **MVP deadline** ? Une date de lancement cible ?

---

### 8. Equipe & Organisation

- **Q20:** Combien de développeurs travailleront sur le projet ?
  - Cela influence le choix monorepo vs multi-repo

- **Q21:** Avez-vous des développeurs backend et frontend séparés, ou des fullstack ?

---

### 9. Design & Branding

- **Q22:** Les designs Figma Make sont-ils **finaux** ou y aura-t-il des itérations ?

- **Q23:** Le logo et la charte graphique Actor Hub (Violet #5906AE, Rose #FF006F) sont-ils validés définitivement ?

---

### 10. Partie 2 - Fonctionnalités Additionnelles

- **Q24:** Vous avez mentionné une "partie deux". Quelles fonctionnalités supplémentaires prévoyez-vous ?
  - Application mobile (React Native / Flutter) ?
  - White-label pour les revendeurs ?
  - Intégrations CRM spécifiques ?
  - Marketplace d'extensions ?
  - API publique pour développeurs tiers ?

---

## Résumé des livrables prêts

| Livrable | Status |
|---|---|
| Skill principal (`skills/actor-hub-platform.md`) | Prêt |
| Architecture microservices (`docs/architecture/`) | Prêt |
| Prompt ms-gateway | Prêt |
| Prompt ms-auth | Prêt |
| Prompt ms-tenant | Prêt |
| Prompt ms-call-center | Prêt |
| Prompt ms-sms | Prêt |
| Prompt ms-email | Prêt |
| Prompt ms-whatsapp | Prêt |
| Prompt ms-contacts | Prêt |
| Prompt ms-billing | Prêt |
| Prompt ms-analytics | Prêt |
| Prompt ms-notification | Prêt |
| Prompt ms-frontend | Prêt |
| Prompt landing page | Prêt |
| Prompt dashboard modules | Prêt |

Répondez à ces questions et je pourrai démarrer le développement de chaque composant de manière précise et adaptée à vos besoins.
