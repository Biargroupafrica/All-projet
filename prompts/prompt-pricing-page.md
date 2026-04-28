# Prompt : Page Tarifs – Actor Hub

## Contexte
Tu génères la page `/tarifs` du site marketing **Actor Hub**.  
Stack : **Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui**.

## Tâche
Génère la page de tarification complète :

## Structure de la page

### Section 1 – Hero
- Titre : "Des tarifs clairs et transparents"
- Sous-titre : "Commencez gratuitement, évoluez selon votre croissance"
- Toggle mensuel / annuel (-20% annuel)

### Section 2 – Plans
3 colonnes (mobile : accordéon) :

**Starter – 49€/mois**
- Jusqu'à 3 agents
- 500 min d'appels incluses
- 1 000 SMS inclus
- Téléphonie + SMS
- Support email
- Analytics basique
- Uptime 99.5%
- CTA : "Démarrer l'essai gratuit"

**Pro – 149€/mois** (mis en avant / badge "Populaire")
- Jusqu'à 15 agents
- 2 000 min d'appels incluses
- 5 000 SMS inclus
- 500 conversations WhatsApp
- Tous les canaux (voix, SMS, WhatsApp, email)
- Enregistrement des appels
- Analytics avancé
- Support chat
- Uptime 99.9%
- CTA : "Démarrer l'essai gratuit"

**Enterprise – Sur devis**
- Agents illimités
- Volume illimité
- Tous les canaux + RCS
- IVR avancé + routage par compétences
- Intégrations personnalisées
- On-premise disponible
- SLA 99.99%
- Support dédié 24/7
- CTA : "Contacter notre équipe"

### Section 3 – Tarifs CPaaS à l'usage
Tableau des tarifs unitaires :
- Appels France : 0,012€/min
- Appels International : à partir de 0,045€/min
- SMS France : 0,065€/SMS
- SMS International : à partir de 0,095€/SMS
- WhatsApp : 0,058€/conversation
- Email transactionnel : 0,00012€/email

### Section 4 – Tableau comparatif complet
Toutes les fonctionnalités en lignes, colonnes Starter/Pro/Enterprise.
Utiliser ✓, ✗, ou texte pour chaque cellule.

### Section 5 – FAQ Tarifs
6 questions fréquentes :
- "Puis-je changer de plan à tout moment ?"
- "Que se passe-t-il après les 14 jours d'essai ?"
- "Les tarifs CPaaS sont-ils inclus dans l'abonnement ?"
- "Proposez-vous des remises volume ?"
- "Comment fonctionne la facturation annuelle ?"
- "Puis-je annuler à tout moment ?"

### Section 6 – CTA final
"Besoin d'un devis personnalisé ?" → bouton Contactez-nous

## Contraintes

1. **Toggle annuel/mensuel** : `'use client'`, useState, les prix s'actualisent instantanément.
2. **Plan mis en avant** : Pro avec border colorée, badge "Populaire", légèrement plus grand.
3. **Sticky header** : le toggle reste visible en scrollant.
4. **Schema.org PriceSpecification** : pour le SEO, balises JSON-LD des plans.
5. **CTA différenciés** : Starter/Pro → Checkout Stripe, Enterprise → formulaire contact.
6. **Mobile** : plans en accordéon sur < 768px.
7. **Accessibilité** : le toggle utilise `role="switch"` avec `aria-checked`.
