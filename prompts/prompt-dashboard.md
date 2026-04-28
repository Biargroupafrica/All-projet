# Prompt : Génération Dashboard SaaS – Actor Hub

## Contexte
Tu génères du code pour le **portail client** (dashboard) de **Actor Hub**, accessible après authentification.  
Stack : **Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Recharts**.

## Tâche
Génère la page de dashboard `{DASHBOARD_PAGE}` avec les fonctionnalités suivantes :

### Fonctionnalités requises
{FEATURES}

## Architecture dashboard

```
apps/dashboard/
├── app/
│   ├── (authenticated)/
│   │   ├── layout.tsx                # Layout avec sidebar + topbar
│   │   ├── dashboard/page.tsx        # Vue d'ensemble (KPIs globaux)
│   │   ├── call-center/
│   │   │   ├── page.tsx              # Dashboard call center
│   │   │   ├── calls/page.tsx        # Historique appels
│   │   │   ├── agents/page.tsx       # Gestion agents
│   │   │   ├── queues/page.tsx       # Files d'attente
│   │   │   ├── ivr/page.tsx          # Éditeur IVR
│   │   │   └── supervision/page.tsx  # Supervision temps réel
│   │   ├── sms/
│   │   │   ├── page.tsx
│   │   │   ├── campaigns/page.tsx
│   │   │   └── templates/page.tsx
│   │   ├── messaging/
│   │   │   ├── page.tsx              # Boîte de réception unifiée
│   │   │   └── [conversationId]/page.tsx
│   │   ├── crm/
│   │   │   ├── contacts/page.tsx
│   │   │   └── tickets/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx              # Paramètres généraux
│   │   │   ├── team/page.tsx         # Gestion équipe
│   │   │   ├── billing/page.tsx      # Facturation
│   │   │   └── integrations/page.tsx
│   │   └── softphone/page.tsx        # Softphone agent
│   └── (auth)/
│       ├── login/page.tsx
│       └── register/page.tsx
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   └── nav-items.ts
│   ├── call-center/
│   ├── messaging/
│   └── shared/
└── lib/
    ├── api.ts                        # Client API (fetch + TanStack Query)
    └── auth.ts                       # Session client
```

## Contraintes impératives

1. **Auth guard** : toutes les pages dans `(authenticated)/` vérifient la session. Redirection `/login` si non connecté.
2. **Multi-tenant** : le `tenantId` est extrait du JWT et injecté dans toutes les requêtes API.
3. **Sidebar** : navigation avec icônes Lucide, groupes pliables, badge de notifications.
4. **Permissions** : masquer les sections selon le rôle de l'utilisateur (RBAC).
5. **Chargement** : Suspense + skeleton loaders sur toutes les sections de données.
6. **Erreurs** : Error boundaries avec message d'erreur utile + bouton "Réessayer".
7. **Temps réel** : WebSocket pour les données de supervision (reconnexion automatique).
8. **Mobile** : sidebar collapsible sur mobile (drawer).
9. **Dark mode** : supporté via `next-themes`.
10. **i18n** : textes en français.

## Sidebar navigation

```typescript
const NAV_ITEMS = [
  {
    title: 'Vue d\'ensemble',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'owner', 'supervisor', 'agent', 'viewer'],
  },
  {
    title: 'Call Center',
    icon: Phone,
    roles: ['admin', 'supervisor', 'agent'],
    children: [
      { title: 'Supervision', href: '/call-center/supervision', icon: MonitorDot },
      { title: 'Appels', href: '/call-center/calls', icon: PhoneCall },
      { title: 'Agents', href: '/call-center/agents', icon: Users },
      { title: 'Files d\'attente', href: '/call-center/queues', icon: ListOrdered },
      { title: 'Éditeur IVR', href: '/call-center/ivr', icon: GitBranch },
    ],
  },
  {
    title: 'SMS',
    icon: MessageSquare,
    roles: ['admin', 'agent'],
    children: [
      { title: 'Campagnes', href: '/sms/campaigns', icon: Send },
      { title: 'Templates', href: '/sms/templates', icon: FileText },
    ],
  },
  {
    title: 'Messagerie',
    icon: Inbox,
    href: '/messaging',
    roles: ['admin', 'agent'],
    badge: 'unresolvedCount',   // KPI dynamique
  },
  {
    title: 'CRM',
    icon: BookUser,
    roles: ['admin', 'agent'],
    children: [
      { title: 'Contacts', href: '/crm/contacts', icon: Contact },
      { title: 'Tickets', href: '/crm/tickets', icon: Ticket },
    ],
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['admin', 'supervisor'],
  },
  {
    title: 'Paramètres',
    icon: Settings,
    roles: ['admin', 'owner'],
    children: [
      { title: 'Général', href: '/settings' },
      { title: 'Équipe', href: '/settings/team' },
      { title: 'Facturation', href: '/settings/billing' },
      { title: 'Intégrations', href: '/settings/integrations' },
    ],
  },
]
```

## Variables à remplacer

| Variable | Description |
|----------|-------------|
| `{DASHBOARD_PAGE}` | Page spécifique à générer (ex: "Supervision Call Center") |
| `{FEATURES}` | Liste détaillée des fonctionnalités de cette page |
