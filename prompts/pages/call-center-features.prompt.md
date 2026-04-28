# Prompt : Page Fonctionnalités Call Center

## Contexte
Tu vas créer la page dédiée aux fonctionnalités du Centre d'Appels Cloud ACTOR Hub.
URL : `/fonctionnalites/call-center`

## Contenu Exact à Implémenter

### Hero Section

```
Badge : "Centre d'Appels Cloud"
Titre : "Transformez votre Service Client"
Sous-titre : "Déployez un centre d'appels professionnel en moins d'une heure, 
              sans infrastructure matérielle, accessible depuis n'importe quel navigateur."

[Démarrer gratuitement] [Demander une démo]

Image côté droit : Dashboard call center avec overlay badge "99.9% Uptime Garanti"

Fond : Gradient subtil bg-blue-50 to-purple-50 avec formes géométriques décoratives
```

### Grille 6 Fonctionnalités Clés (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

```
[1] 📞 Softphone Web HD
    "Passez et recevez des appels HD directement depuis votre navigateur. 
     Aucun plugin, aucune installation requise."
    → Technologie WebRTC, Compatible Chrome/Firefox/Safari/Edge, Qualité HD 720p

[2] 🔀 IVR Visuel Intelligent  
    "Créez des arbres de réponse vocale interactifs par drag & drop. 
     Configurez sans coder, modifiez en temps réel."
    → Drag & Drop visuel, IA de routage, Synthèse vocale (TTS) en 10 langues

[3] 👁️ Supervision Temps Réel
    "Monitorer votre équipe en direct. Tableau de bord avec état de tous les agents, 
     files d'attente et appels en cours."
    → Écoute silencieuse, Chuchotement agent, Double écoute (barge)

[4] 🎙️ Enregistrement & Transcription
    "Enregistrez automatiquement tous les appels et obtenez une transcription 
     IA en quelques secondes."
    → Enregistrement auto ou manuel, Transcription IA, Analyse de sentiment

[5] ⚡ Power & Predictive Dialer
    "Automatisez vos campagnes d'appels sortants avec des algorithmes intelligents 
     qui maximisent le contact rate."
    → 4 modes : Preview, Progressif, Power, Prédictif

[6] 👥 Gestion Multi-Agents
    "Gérez votre équipe, définissez les rôles, créez des files d'attente spécialisées 
     et suivez les performances individuelles."
    → Rôles & permissions granulaires, Files d'attente spécialisées, KPIs par agent
```

### Section Inbound vs Outbound (2 colonnes côte à côte)

```
APPELS ENTRANTS (fond blue-50, bordure blue)          APPELS SORTANTS (fond orange-50, bordure orange)
📥                                                     📤

✅ Files d'attente intelligentes (ACD)                ✅ Campagnes automatisées multi-listes
✅ Distribution automatique (ACD)                      ✅ Dialers Power / Predictive / Progressive / Preview
✅ Callback automatique (éviter attente)              ✅ Click-to-Call depuis votre CRM
✅ Numéros verts internationaux                       ✅ Scripts dynamiques pour agents
✅ Routage géographique                               ✅ Qualification et disposition après appel
✅ Musique d'attente personnalisée                    ✅ Limitation horaire et réglementation
```

### Section Analytics & Rapports

Titre : "Des analytics qui font la différence"

```
4 métriques avec icône + chiffre + description :

📊 Tableaux de bord temps réel
   Visualisez l'état de votre équipe, des files et des campagnes en direct

📈 Rapports détaillés
   Agent, campagne, période, canal : exportez en CSV ou PDF

🤖 Analyse sentiment IA
   Détectez automatiquement la satisfaction client durant l'appel

⏱️ KPIs métiers
   DMT (Durée Moy. Traitement), FCR (First Call Resolution), CSAT
```

### Intégrations CRM

Titre : "Synchronisé avec votre CRM"

Logos en grid (6 logos) :
- Salesforce
- HubSpot  
- Zoho CRM
- Microsoft Dynamics
- Zendesk
- Freshdesk
- "API Personnalisée" (icône code)

Texte : "Affichez automatiquement la fiche client lors d'un appel entrant. 
          Enregistrez les appels et notes dans votre CRM. 
          Click-to-Call depuis votre interface CRM."

### Section "Pourquoi Actor Hub?" (4 piliers)

```
[🌍 Couverture Mondiale]          [🔒 Sécurité Entreprise]
190+ pays, 800+ opérateurs         Chiffrement TLS + RGPD
connectés directement              + ISO 27001

[⏱️ Déploiement Rapide]           [📊 Scalabilité Illimitée]
Opérationnel en moins              De 1 à 10 000+ agents
d'1 heure                          sans réarchitecture
```

### CTA Final (bande bleue)

```
"Prêt à moderniser votre centre d'appels ?"
"14 jours d'essai gratuit • Aucune carte bancaire • Support inclus"

[Démarrer maintenant →] [Parler à un expert]
```

## Style Spécifique

- Les cards fonctionnalités ont un effet hover : léger lift + ombre + border bleue gauche (4px)
- Les icônes des fonctionnalités sont dans un carré arrondi avec fond coloré (bg-blue-50 icon text-blue-600)
- Animations au scroll : les cards apparaissent avec `fadeInUp` via Framer Motion `whileInView`
- L'image hero doit avoir un badge flottant "99.9% Uptime" avec une icône shield verte
- La section Inbound/Outbound : les deux colonnes sont égales en hauteur

## Critères de Succès

- [ ] Page rendue correctement sur mobile (1 colonne), tablette (2 colonnes), desktop (3 colonnes)
- [ ] Animations au scroll fluides
- [ ] Liens CTA vers /login et /contact fonctionnels
- [ ] Badges Inbound/Outbound clairement différenciés visuellement
- [ ] Page traduite en FR et EN
- [ ] Score Lighthouse SEO ≥ 95 (meta title, description, schema.org)
