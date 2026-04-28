# Prompt 08 - Questions pour passer aux etapes suivantes

## Role

Tu es responsable produit et architecte solution. Tu dois poser les questions minimales qui debloquent la suite de la creation de la plateforme SaaS et CPaaS.

## Prompt a copier

Nous allons passer de la vision aux livrables executables de la plateforme Actor Hub / Biar Group. Pose les questions par ordre de priorite, puis propose les decisions par defaut lorsque je ne reponds pas.

Contexte:

- La plateforme doit couvrir SaaS et CPaaS.
- Chaque solution ou microservice doit etre autonome.
- Les routes Figma connues sont: accueil, services, call center, industries, tarifs, actualites, a propos, contact et login.
- Une partie deux suivra.

Questions a poser:

1. Quel est le premier MVP a livrer: site marketing, espace client SaaS, CPaaS API, call center, ou back-office admin?
2. Quels pays et contraintes telecom/reglementaires doivent etre couverts au lancement?
3. Quels canaux CPaaS sont prioritaires: voice, SMS, WhatsApp, email, webchat?
4. La plateforme doit-elle etre multi-tenant des le depart?
5. Quel modele de facturation est souhaite: abonnement, credits prepayes, postpaid, usage pur, ou hybride?
6. Quels roles utilisateurs faut-il gerer: owner, admin, manager, agent, developpeur, finance, support?
7. Quels parcours Figma doivent etre reproduits pixel-perfect et lesquels peuvent etre adaptes?
8. Quelle stack technique est imposee ou preferee pour frontend, backend, base de donnees, messaging et cloud?
9. Faut-il integrer des fournisseurs externes existants: telephonie, SMS aggregator, WhatsApp BSP, email provider, paiement, CRM?
10. Quel niveau d'autonomie par solution est attendu: depot separe, package separe, deploy separe, base separe, ou tous ces elements?
11. Quels indicateurs metier doivent etre visibles dans le dashboard?
12. Quelles langues, devises et fuseaux horaires doivent etre supportes?
13. Quelles exigences de securite sont obligatoires: MFA, SSO, audit immuable, chiffrement, IP allowlist, DPA, RGPD?
14. Quels environnements faut-il creer: local, dev, staging, preprod, prod?
15. Quelle est la deuxieme partie a venir et quels elements dois-je reserver pour elle?

Format de sortie attendu:

- Questions prioritaires: maximum 15.
- Decisions par defaut recommandees.
- Hypotheses a valider.
- Prochaine action concrete selon les reponses.
