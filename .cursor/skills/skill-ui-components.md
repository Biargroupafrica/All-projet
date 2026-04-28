# Skill : UI Components – Actor Hub Design System

## Quand utiliser ce skill
Utiliser pour tout travail sur `packages/ui/` :
- Composants React partagés (basés sur shadcn/ui)
- Design tokens (couleurs, typographie, espacements)
- Icônes et illustrations
- Composants de formulaire réutilisables
- Composants spécifiques à la téléphonie (softphone, statut agent)
- Animations et transitions

---

## Structure du package

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── ui/                          # shadcn/ui (Button, Input, etc.)
│   │   ├── marketing/                   # Composants landing page
│   │   │   ├── hero.tsx
│   │   │   ├── pricing-card.tsx
│   │   │   ├── feature-card.tsx
│   │   │   └── testimonial-card.tsx
│   │   ├── dashboard/                   # Composants dashboard
│   │   │   ├── stat-card.tsx
│   │   │   ├── kpi-chart.tsx
│   │   │   ├── data-table.tsx
│   │   │   └── date-range-picker.tsx
│   │   ├── telephony/                   # Composants téléphonie
│   │   │   ├── softphone.tsx            # Pad d'appel WebRTC
│   │   │   ├── agent-status-badge.tsx   # Statut disponible/occupé/pause
│   │   │   ├── call-card.tsx            # Carte d'appel actif
│   │   │   ├── queue-panel.tsx          # Panneau files d'attente
│   │   │   └── supervision-grid.tsx     # Grille supervision agents
│   │   └── shared/
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── empty-state.tsx
│   │       └── loading-skeleton.tsx
│   ├── hooks/
│   │   ├── use-webrtc.ts               # Hook appels WebRTC
│   │   ├── use-realtime.ts             # Hook WebSocket supervision
│   │   └── use-debounce.ts
│   ├── lib/
│   │   └── utils.ts                    # cn() helper
│   └── index.ts                        # Exports
├── tailwind.config.ts
└── package.json
```

---

## Design Tokens

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#1A56DB',    // Primary
          700: '#1D4ED8',
          900: '#1E3A5F',
        },
        cpaas: {
          500: '#7E3AF2',    // Violet CPaaS
          600: '#6D28D9',
        },
        saas: {
          500: '#0E9F6E',    // Vert SaaS
          600: '#057A55',
        },
        // Statuts agents
        status: {
          available: '#22C55E',
          busy:      '#EF4444',
          paused:    '#F59E0B',
          offline:   '#9CA3AF',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
}
```

---

## Composant Softphone

```typescript
// components/telephony/softphone.tsx
'use client'
import { useState } from 'react'
import { useWebRTC } from '../../hooks/use-webrtc'
import { Button } from '../ui/button'
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react'

export function Softphone({ agentExtension }: { agentExtension: string }) {
  const [dialInput, setDialInput] = useState('')
  const [muted, setMuted] = useState(false)
  const { status, call, hangup, toggleMute } = useWebRTC(agentExtension)

  const digits = ['1','2','3','4','5','6','7','8','9','*','0','#']

  return (
    <div className="bg-brand-900 text-white rounded-xl p-4 w-64 shadow-2xl">
      <div className="text-center mb-4">
        <div className="text-2xl font-mono tracking-widest min-h-8">
          {dialInput || <span className="text-gray-500">Numéro</span>}
        </div>
        <div className="text-sm text-gray-400 capitalize">{status}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {digits.map(d => (
          <button
            key={d}
            onClick={() => setDialInput(p => p + d)}
            className="bg-brand-700 hover:bg-brand-600 rounded-lg py-3 font-semibold text-lg transition-colors"
          >
            {d}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {status === 'active' ? (
          <>
            <Button
              onClick={() => { toggleMute(); setMuted(m => !m) }}
              variant="outline"
              size="icon"
              className="flex-1"
            >
              {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              onClick={hangup}
              variant="destructive"
              className="flex-1"
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              Raccrocher
            </Button>
          </>
        ) : (
          <Button
            onClick={() => call(dialInput)}
            disabled={!dialInput || status === 'calling'}
            className="flex-1 bg-saas-500 hover:bg-saas-600"
          >
            <Phone className="h-4 w-4 mr-2" />
            Appeler
          </Button>
        )}
      </div>
    </div>
  )
}
```

---

## Composant StatCard (KPI)

```typescript
// components/dashboard/stat-card.tsx
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  trend?: number           // % de variation
  description?: string
  color?: 'default' | 'green' | 'red' | 'orange'
}

export function StatCard({ label, value, unit, trend, description, color = 'default' }: StatCardProps) {
  const trendIcon = trend === undefined ? null
    : trend > 0 ? <TrendingUp className="h-4 w-4 text-green-500" />
    : trend < 0 ? <TrendingDown className="h-4 w-4 text-red-500" />
    : <Minus className="h-4 w-4 text-gray-400" />

  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border',
      color === 'green' && 'border-green-200 bg-green-50 dark:bg-green-950',
      color === 'red' && 'border-red-200 bg-red-50 dark:bg-red-950',
      color === 'orange' && 'border-orange-200 bg-orange-50 dark:bg-orange-950',
    )}>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      {(trend !== undefined || description) && (
        <div className="flex items-center gap-1 text-sm text-gray-500">
          {trendIcon}
          {trend !== undefined && (
            <span className={trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : ''}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
          {description && <span>{description}</span>}
        </div>
      )}
    </div>
  )
}
```

---

## Checklist avant PR

- [ ] Composants typés (TypeScript strict)
- [ ] Stories Storybook pour chaque nouveau composant
- [ ] Tests Vitest pour la logique des hooks
- [ ] Dark mode supporté (classes `dark:`)
- [ ] Accessibilité : roles ARIA, focus visible, contraste WCAG AA
- [ ] Mobile-first responsive
- [ ] Export correctement déclaré dans `index.ts`
