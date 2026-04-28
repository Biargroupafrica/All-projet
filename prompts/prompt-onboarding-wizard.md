# Prompt : Onboarding Wizard – Actor Hub

## Contexte
Tu génères le **wizard d'onboarding multi-étapes** pour les nouveaux clients de **Actor Hub**.  
Stack : **Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Zod, React Hook Form**.

## Tâche
Génère le flux d'onboarding complet avec les 5 étapes définies dans le tenant-service.

## Étapes du wizard

### Étape 1 – Informations entreprise
- Nom de l'entreprise (requis)
- Secteur d'activité (select : Banque, Retail, Santé, Logistique, Énergie, Télécoms, Collectivités, Autre)
- Pays (select)
- Site web (optionnel)
- Taille de l'équipe (select : 1-5, 6-20, 21-100, 100+)

### Étape 2 – Contact principal
- Prénom + Nom (requis)
- Numéro de téléphone (E.164, requis)
- Fonction (optionnel)

### Étape 3 – Vos besoins
- Canaux souhaités (checkboxes : Téléphonie, SMS, WhatsApp, Email, RCS)
- Volume mensuel appels estimé (select : < 1000, 1000-10000, > 10000)
- Volume mensuel SMS estimé (select : < 5000, 5000-50000, > 50000)
- Cas d'usage principal (select : Support client, Télévente, Marketing, Notifications, Autre)

### Étape 4 – Inviter l'équipe (optionnel)
- Ajouter jusqu'à 5 emails de collaborateurs
- Rôle pour chaque (select : Admin, Superviseur, Agent)
- Bouton "Passer cette étape"

### Étape 5 – Choisir un plan
- Afficher les 3 plans (Starter, Pro, Enterprise)
- Sélectionner un plan
- Bouton "Démarrer l'essai gratuit 14 jours" ou "Contacter un expert" (Enterprise)

## Contraintes

1. **Persistance** : chaque étape sauvegardée en BDD via tenant-service avant de passer à la suivante.
2. **Reprise** : si l'utilisateur recharge la page, il revient à la dernière étape non complétée.
3. **Validation** : Zod + React Hook Form pour chaque formulaire.
4. **Progression** : barre de progression en haut (1/5, 2/5, etc.).
5. **Navigation** : boutons Précédent/Suivant, l'étape 4 peut être ignorée.
6. **Mobile** : chaque étape occupe tout l'écran sur mobile.
7. **Design** : fond dégradé de marque, card blanche centré, logo en haut.

## Structure de fichiers

```
apps/dashboard/app/(onboarding)/
├── layout.tsx                    # Layout minimal (logo + barre progression)
├── onboarding/
│   ├── page.tsx                  # Redirect vers étape 1 ou étape en cours
│   ├── [step]/
│   │   └── page.tsx              # Rendu dynamique selon l'étape (1 à 5)
│   └── complete/page.tsx         # Page succès → redirect dashboard
└── _components/
    ├── onboarding-shell.tsx       # Container + progress bar
    ├── step-company.tsx
    ├── step-contact.tsx
    ├── step-needs.tsx
    ├── step-team.tsx
    └── step-plan.tsx
```

## Pattern React Hook Form + Zod

```typescript
// _components/step-company.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { saveOnboardingStep } from '../actions'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@actor-hub/ui'
import { Input } from '@actor-hub/ui'
import { Select } from '@actor-hub/ui'
import { Button } from '@actor-hub/ui'

const companySchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères'),
  industry: z.string().min(1, 'Veuillez sélectionner un secteur'),
  country: z.string().min(1, 'Veuillez sélectionner un pays'),
  website: z.string().url().optional().or(z.literal('')),
  employeesCount: z.enum(['1-5', '6-20', '21-100', '100+']),
})

type CompanyForm = z.infer<typeof companySchema>

export function StepCompany({ defaultValues }: { defaultValues?: Partial<CompanyForm> }) {
  const router = useRouter()
  const form = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues,
  })

  async function onSubmit(data: CompanyForm) {
    const result = await saveOnboardingStep(1, data)
    if (result.success) router.push('/onboarding/2')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de l'entreprise</FormLabel>
            <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {/* autres champs... */}
        <Button type="submit" className="w-full">Continuer →</Button>
      </form>
    </Form>
  )
}
```
