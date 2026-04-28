# Skill : Design System — ACTOR Hub

## Scénario d'utilisation
Créer ou étendre les composants UI partagés (`packages/ui/`).

## Palette de Couleurs

```css
/* packages/ui/src/tokens/colors.css */
:root {
  /* Primary — Bleu ACTOR Hub */
  --color-primary-50:  #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;  /* Main */
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;

  /* Gradient principal */
  --gradient-primary: linear-gradient(135deg, #2563eb, #4f46e5);
  --gradient-secondary: linear-gradient(135deg, #2563eb, #06b6d4);

  /* Canaux — Couleurs distinctives */
  --color-sms:        #2563eb;  /* Blue */
  --color-email:      #7c3aed;  /* Purple */
  --color-whatsapp:   #16a34a;  /* Green */
  --color-callcenter: #ea580c;  /* Orange */

  /* Sémantique */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error:   #ef4444;
  --color-info:    #3b82f6;

  /* Neutres */
  --color-gray-50:  #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-600: #4b5563;
  --color-gray-900: #111827;
}
```

## Composants Partagés

### Buttons
```tsx
// variants: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
// sizes: 'sm' | 'md' | 'lg'
<Button variant="primary" size="lg" icon={<Send />} loading={isLoading}>
  Envoyer le SMS
</Button>
```

### Cards
```tsx
<FeatureCard
  icon={<MessageSquare className="text-blue-600" />}
  title="SMS Marketing"
  description="Envoyez des SMS en masse avec un taux de livraison de 98%"
  color="blue"
/>
```

### Badges / Pills
```tsx
<Badge variant="success">Livré</Badge>
<Badge variant="warning">En attente</Badge>
<Badge variant="error">Échoué</Badge>
<ChannelBadge channel="sms" />      // "SMS" en bleu
<ChannelBadge channel="whatsapp" /> // "WhatsApp" en vert
```

### Stats Cards
```tsx
<StatCard
  label="Messages envoyés"
  value="1,234,567"
  change={+12.5}
  period="vs mois dernier"
  icon={<TrendingUp />}
/>
```

### DataTable
```tsx
<DataTable
  columns={columns}
  data={messages}
  pagination
  sorting
  filtering
  exportable
/>
```

### Charts (wrappers Recharts)
```tsx
<LineChart data={dailyStats} metrics={['sms', 'email', 'whatsapp']} />
<BarChart data={campaignStats} groupBy="campaign" />
<DonutChart data={channelDistribution} />
```

## Tailwind Config

```typescript
// packages/ui/tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          600: '#2563eb',  // Main blue
          700: '#1d4ed8',
        },
        sms: '#2563eb',
        email: '#7c3aed',
        whatsapp: '#16a34a',
        callcenter: '#ea580c',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
    },
  },
}
```

## Critères de Succès

- [ ] Tous les composants utilisés dans landing ET dashboard sont dans `packages/ui`
- [ ] Storybook disponible pour visualiser les composants isolément
- [ ] Aucun composant UI dupliqué entre landing et dashboard
- [ ] Dark mode supporté via `class="dark"` sur `<html>`
- [ ] Composants entièrement accessibles (WCAG 2.1 AA)
