# Questions & Étapes Suivantes — Actor Hub

## Questions posées à l'utilisateur avant de passer aux étapes suivantes

Ce document liste les questions clés que l'agent doit poser à l'utilisateur pour cadrer chaque phase de développement.

---

## PARTIE 1 — Site Vitrine (Landing Page) ✅ Définie ci-dessus

### Questions de validation avant de développer la vitrine :

**Q1 — Contenu & Marque**
- Le nom commercial est-il "Actor Hub" ou "BIAR Group" ou les deux ?
- Quel est le slogan / tagline principal de la plateforme ?
- Quelles sont les langues à supporter dès le lancement ? (FR obligatoire, EN, AR ?)
- Avez-vous une charte graphique ou des assets (logo PNG/SVG, photos, vidéos) ?

**Q2 — Tarification**
- Les prix sont-ils publics sur le site ou "sur devis" uniquement ?
- Quelles devises afficher ? (FCFA, EUR, USD ?)
- Y a-t-il un plan "Essai gratuit" ? Si oui, quelle durée et quelles limitations ?

**Q3 — Contact & CRM**
- Les formulaires de contact doivent-ils alimenter un CRM ? (HubSpot, Salesforce ?)
- Quel est l'email de destination des formulaires de contact ?
- Avez-vous un système de support existant ? (Zendesk, Freshdesk ?)

**Q4 — SEO & Domaine**
- Quel est le domaine principal ? (actorhub.com ? actorhub.africa ?)
- Y a-t-il des pages piliers SEO prioritaires ? (ex: "Call Center Afrique", "SMS Marketing Burkina")

---

## PARTIE 2 — Authentification & Gestion des Comptes

### Questions à poser :

**Q5 — Processus d'inscription**
- Les clients peuvent-ils s'inscrire en self-service ou inscription manuelle uniquement ?
- Si self-service : validation par email uniquement ou validation manuelle par l'équipe ?
- Y a-t-il une période d'essai gratuite ? (14 jours ? 30 jours ?)

**Q6 — Structure des comptes**
- Un client peut-il avoir plusieurs modules (ex: SMS + Call Center) dans un seul compte ?
- Un agent peut-il être affecté à plusieurs modules simultanément ?
- Y a-t-il des sous-comptes (ex: filiales d'un grand groupe) ?

**Q7 — SSO & Intégration**
- Faut-il supporter le SSO (Single Sign-On) avec Google Workspace, Azure AD ?
- Les entreprises peuvent-elles utiliser leur propre LDAP/Active Directory ?

---

## PARTIE 3 — Call Center (CPaaS Voix)

### Questions à poser :

**Q8 — Opérateurs & Connectivité**
- Avez-vous déjà des accords avec des opérateurs télécom ? (SIP Trunks ?)
- Quels pays/préfixes sont prioritaires au lancement ?
- Faut-il supporter les numéros verts (0800...) ?

**Q9 — Fonctionnalités prioritaires Call Center**
- Quelles fonctionnalités sont "must-have" pour le MVP ?
  - [ ] Softphone WebRTC
  - [ ] IVR Builder
  - [ ] ACD / Queues
  - [ ] Enregistrement des appels
  - [ ] Supervision temps réel
  - [ ] Dialers (Power/Predictive/Preview)
  - [ ] Intégration CRM (Salesforce, HubSpot...)
  - [ ] Analyse IA des appels
- Lesquelles peuvent attendre la V2 ?

**Q10 — Capacités**
- Nombre estimé d'agents simultanés au lancement ?
- Volume estimé d'appels/heure au pic ?

---

## PARTIE 4 — SMS Marketing

### Questions à poser :

**Q11 — Passerelles SMS**
- Avez-vous déjà des comptes SMPP chez des opérateurs ?
- Quels pays sont couverts ? (Afrique de l'Ouest prioritaire ?)
- Avez-vous les Sender IDs approuvés dans les pays cibles ?

**Q12 — Fonctionnalités SMS prioritaires**
- SMS MT (Mobile Terminated) seulement, ou aussi SMS MO (Mobile Originated, 2 sens) ?
- OTP/Transactionnel ou Marketing ou les deux ?
- Faut-il supporter le RCS dès le début ?
- Intégration HLR (vérification de numéros) nécessaire ?

---

## PARTIE 5 — WhatsApp Business

### Questions à poser :

**Q13 — WhatsApp Business API**
- Avez-vous déjà un compte WhatsApp Business API approuvé par Meta ?
- Avez-vous un Business Manager Facebook vérifié ?
- Quels numéros WhatsApp Business sont disponibles ?
- Êtes-vous BSP (Business Solution Provider) Meta, ou revendeur d'un BSP ?

**Q14 — Cas d'usage WhatsApp prioritaires**
- Chatbot automatisé ?
- Service client en direct (live chat) ?
- Diffusions marketing en masse ?
- Notifications transactionnelles ?
- Tout cela ?

---

## PARTIE 6 — Email Marketing

### Questions à poser :

**Q15 — Infrastructure Email**
- Avez-vous des serveurs SMTP / IPs dédiés ?
- Quels domaines d'envoi ? (actorhub.com, notifications.actorhub.com ?)
- SPF/DKIM/DMARC déjà configurés ?

**Q16 — Volume et délivrabilité**
- Volume estimé d'emails/mois ?
- Faut-il du "warm-up" d'IPs au démarrage ?
- Intégration avec un fournisseur existant (SendGrid, Mailgun, Amazon SES) ?

---

## PARTIE 7 — Déploiement & Infrastructure

### Questions à poser :

**Q17 — Cloud & Hébergement**
- Quel cloud provider ? (OVH, AWS, Google Cloud, Azure, Scaleway ?)
- Hébergement en Europe (RGPD) ou Afrique ?
- Avez-vous des contraintes de souveraineté des données ?

**Q18 — DevOps & CI/CD**
- Avez-vous une équipe DevOps ?
- Quel outil de CI/CD ? (GitHub Actions, GitLab CI, Jenkins ?)
- Faut-il du Kubernetes ou Docker Compose suffit pour commencer ?

**Q19 — Scalabilité**
- Nombre estimé de tenants au lancement ? (10 ? 50 ? 500 ?)
- Croissance prévue sur 12 mois ?

---

## PARTIE 8 — Business & Conformité

### Questions à poser :

**Q20 — Modèle commercial**
- SaaS (abonnement mensuel) uniquement, ou CPaaS (pay-as-you-go) aussi ?
- White-label prévu ? (revente de la plateforme sous une autre marque ?)
- Partenariats revendeurs prévus ?

**Q21 — Conformité & Légal**
- Quels pays sont dans la portée initiale ? (Burkina Faso, Côte d'Ivoire, Sénégal, France ?)
- RGPD applicable ? (si clients européens : oui)
- Certifications ISO 27001 ou SOC2 envisagées ?

---

## Résumé — Ordre de développement recommandé

### Phase MVP (lancement initial) :
1. ✅ Site vitrine (landing, services, tarifs, contact, login)
2. ✅ Auth & Multi-tenant (inscription, login, gestion comptes)
3. ✅ Module SMS (le plus rapide à déployer)
4. Dashboard principal + Analytics basiques

### Phase V1 (3-6 mois post-MVP) :
5. Module WhatsApp
6. Module Call Center (softphone + IVR)
7. Facturation & crédits
8. API CPaaS publique

### Phase V2 (6-12 mois) :
9. Module Email Marketing
10. IA (transcription, sentiment, assistant)
11. SDK et documentation développeurs
12. White-label

---

## Pour passer aux étapes suivantes

Indiquez :
1. **La partie sur laquelle travailler** (Partie 1, 2, 3...)
2. **Les réponses aux questions** de la partie concernée
3. **Toute contrainte spécifique** non couverte par les questions

L'agent démarrera alors le développement en s'appuyant sur :
- Le skill `skills/saas-cpaas-platform.md`
- Le prompt spécifique à la partie concernée
- Le code source Figma Make (`XDPnl4zhusx3vecuWQTYFx`)
