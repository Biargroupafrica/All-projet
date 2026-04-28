# Skill 09 — Composants UI Partagés & Design System

## Quand utiliser ce skill
Lorsque vous créez ou modifiez des composants UI réutilisables, le design system, les thèmes, les layouts, ou les composants de base partagés entre tous les modules.

## Design System Actor Hub

### Palette de Couleurs
```css
/* Couleurs primaires */
--color-primary: #E91E8C;        /* Rose Actor Hub (boutons, CTA, accents) */
--color-primary-dark: #C2185B;   /* Rose foncé (hover) */
--color-primary-light: #F48FB1;  /* Rose clair (backgrounds) */

/* Couleurs secondaires */
--color-secondary: #1E3A8A;      /* Bleu marine */
--color-accent: #7C3AED;         /* Violet (gradients) */

/* Couleurs neutres */
--color-dark: #0F172A;           /* Fond sombre (dark mode) */
--color-surface: #1E293B;        /* Surface cards (dark mode) */
--color-border: #334155;         /* Bordures (dark mode) */
--color-text: #F8FAFC;           /* Texte principal (dark mode) */
--color-muted: #94A3B8;          /* Texte secondaire */

/* Couleurs sémantiques */
--color-success: #10B981;        /* Vert succès */
--color-warning: #F59E0B;        /* Orange avertissement */
--color-error: #EF4444;          /* Rouge erreur */
--color-info: #3B82F6;           /* Bleu information */
```

### Typographie
```css
/* Police principale */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Hiérarchie */
.text-display { font-size: 4.5rem; font-weight: 800; line-height: 1.1; }
.text-h1      { font-size: 3rem;   font-weight: 700; line-height: 1.2; }
.text-h2      { font-size: 2rem;   font-weight: 700; line-height: 1.3; }
.text-h3      { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
.text-h4      { font-size: 1.25rem; font-weight: 600; }
.text-body    { font-size: 1rem;   font-weight: 400; }
.text-small   { font-size: 0.875rem; }
.text-xs      { font-size: 0.75rem; }
```

### Espacements
```css
/* Système 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius
```css
--radius-sm: 0.375rem;  /* 6px — inputs */
--radius-md: 0.5rem;    /* 8px — cards */
--radius-lg: 0.75rem;   /* 12px — modals */
--radius-xl: 1rem;      /* 16px — large cards */
--radius-full: 9999px;  /* pills, badges */
```

## Composants UI Partagés

### Dashboard Layout
```typescript
// src/app/components/dashboard-layout.tsx
// Structure : Sidebar fixe + Header + Main content
interface DashboardLayoutProps {
  children: React.ReactNode
}

// Sidebar navigation : catégories et sous-menus
const navItems = [
  { label: 'Vue d\'ensemble', icon: LayoutDashboard, href: '/dashboard' },
  {
    label: 'Call Center',
    icon: Phone,
    children: [
      { label: 'Live Dashboard', href: '/dashboard/call-center-live' },
      { label: 'Softphone', href: '/dashboard/softphone-enhanced' },
      // ...
    ]
  },
  // SMS, Email, WhatsApp, Settings...
]
```

### Cards Standards
```typescript
// Card métriques (KPI)
interface MetricCardProps {
  title: string
  value: string | number
  change?: { value: number; period: string } // ex: +12% vs mois dernier
  icon: LucideIcon
  color?: 'rose' | 'blue' | 'green' | 'purple' | 'orange'
  loading?: boolean
}

// Card contenu
interface ContentCardProps {
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}
```

### Tableaux Responsifs
```typescript
// Tableau avec pagination, tri, filtres, export
interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  pagination?: boolean
  pageSize?: number
  searchable?: boolean
  exportable?: boolean
  selectable?: boolean
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyMessage?: string
}
```

### Formulaires
```typescript
// Input avec validation et états
// Utiliser react-hook-form + zod pour la validation
interface FormFieldProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  description?: string // texte d'aide
  required?: boolean
}

// Schéma de validation type
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Au moins 8 caractères'),
})
```

### Modales / Dialogs
```typescript
// Utiliser shadcn Dialog
interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive'
  loading?: boolean
}
```

### Notifications (Toast)
```typescript
// Utiliser sonner (déjà installé)
import { toast } from 'sonner'

// Types de toast
toast.success('SMS envoyé avec succès!')
toast.error('Erreur lors de l\'envoi')
toast.warning('Crédits insuffisants')
toast.info('Campagne en cours...')
toast.promise(sendSMS(), {
  loading: 'Envoi en cours...',
  success: 'SMS envoyé!',
  error: 'Échec de l\'envoi',
})
```

## Internationalisation (i18n)

```typescript
// src/app/i18n/translations.ts
// 10 langues : FR, EN, AR, ES, PT, DE, IT, ZH, TR, RU

// Utilisation dans les composants
const { t, language, setLanguage } = useLanguage()

// Accéder à une traduction
const title = t('dashboard.overview.title')

// Avec variables
const message = t('sms.sent_count', { count: 1250 })
// → "1 250 messages envoyés"

// RTL pour l'arabe
<div dir={language === 'ar' ? 'rtl' : 'ltr'}>
```

### Langues supportées
```
FR  — Français (défaut)
EN  — English
AR  — العربية (RTL)
ES  — Español
PT  — Português
DE  — Deutsch
IT  — Italiano
ZH  — 中文
TR  — Türkçe
RU  — Русский
```

## Prompts pour les Composants Partagés

### Prompt — Dashboard Layout Principal
```
Crée le layout principal du dashboard Actor Hub avec :
- Sidebar fixe (260px) avec :
  Logo Actor Hub en haut
  Navigation groupée par module : Call Center, SMS, WhatsApp, Email, Analytics, Settings
  Sous-menus expansibles au clic
  Badge de notifications sur chaque module
  Profil utilisateur + déconnexion en bas
  Toggle dark/light mode + sélecteur de langue
- Header (60px) avec :
  Breadcrumb dynamique
  Barre de recherche globale (Cmd+K)
  Notifications (cloche)
  Avatar utilisateur + dropdown
- Zone principale :
  Container responsive avec padding adaptatif
  Gestion du scroll indépendant
Responsive : sidebar devient drawer sur mobile.
```

### Prompt — Système de Notifications In-App
```
Crée un système de notifications in-app pour Actor Hub.
Types de notifications :
- Campagne SMS terminée (avec stats : livrés %)
- Appel manqué
- Ticket support répondu
- Paiement réussi / échoué
- Limite de crédits basse (< 20%)
- Nouvel agent connecté
Interface :
- Cloche dans le header avec badge compteur
- Dropdown panneau avec liste notifications
- Chaque notification : icône, titre, description, date relative ("il y a 5 min")
- Actions : marquer comme lu, voir détails, tout marquer comme lu
- Notifications temps réel via Supabase Realtime
- Option préférences : choisir quels types recevoir
```

### Prompt — Composant Graphiques Partagé
```
Crée un système de composants graphiques réutilisables basé sur recharts.
Composants à créer :
- <LineChart> : courbe temporelle avec tooltip (ex: messages/heure)
- <BarChart> : barres comparatives avec légende
- <DonutChart> : camembert/donut avec centre info (ex: canaux)
- <AreaChart> : aire avec gradient (ex: revenus)
- <SparkLine> : mini courbe inline (ex: dans une table)
- <HeatmapChart> : grille couleur (ex: activité par heure)
- <GaugeChart> : indicateur jauge (ex: SLA %)
Props communes : data, color/colors, height, loading, emptyMessage
Couleurs par défaut : palette Actor Hub (rose, bleu, vert, violet, orange)
Support dark mode automatique.
```

### Prompt — Composant Upload Fichier
```
Crée un composant d'upload de fichier polyvalent pour Actor Hub.
Modes :
- Drag & Drop : zone de dépose avec animation
- Browse : bouton sélectionner fichier
Fonctionnalités :
- Validation : types acceptés (CSV, Excel, Image, PDF), taille max
- Preview : image preview, nom fichier + taille
- Progression : barre de progression pendant upload
- Multi-fichiers : possibilité d'uploader plusieurs fichiers
- États : idle, dragging, uploading, success, error
Props : accept (MIME types), maxSize, multiple, onUpload, onError
Intégrer avec Supabase Storage pour l'upload réel.
Styles: modern, fond gris pointillé, icône upload centrée.
```

## Tests à réaliser
- [ ] Sidebar : navigation vers toutes les sections
- [ ] Responsive : sidebar devient drawer à 768px
- [ ] Dark/Light mode : basculement sans rechargement
- [ ] Langue : changement FR → EN → AR (RTL vérifié)
- [ ] Notifications temps réel : nouvelle notification en live
- [ ] Toast : 4 types affichés correctement
- [ ] DataTable : tri, filtre, pagination, export CSV
- [ ] Formulaire : validation zod, messages d'erreur
- [ ] Upload : drag & drop, prévisualisation, succès upload
