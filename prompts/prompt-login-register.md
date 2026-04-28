# Prompt : Pages Login & Register – Actor Hub

## Contexte
Tu génères les pages d'authentification de **Actor Hub**.  
Stack : **Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, Auth.js v5, Zod, React Hook Form**.

## Tâche
Génère les pages `/login` et `/register` avec le flux complet.

---

## Page Login (`/login`)

### UI
- Logo Actor Hub en haut (centré)
- Titre : "Connectez-vous à votre espace"
- Formulaire : Email + Mot de passe + "Se souvenir de moi"
- Bouton : "Se connecter" (loading state)
- Séparateur "ou"
- Bouton Google OAuth
- Bouton Microsoft OAuth
- Lien "Mot de passe oublié ?" → `/forgot-password`
- Lien "Pas encore de compte ? Créer un compte" → `/register`

### Logique
```typescript
// Server Action login
'use server'
export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({ /* ... */ })
  if (!parsed.success) return { error: parsed.error.flatten() }

  const result = await signIn('credentials', {
    email: parsed.data.email,
    password: parsed.data.password,
    redirect: false,
  })

  if (result?.error) {
    if (result.error === 'CredentialsSignin') {
      return { error: { _form: 'Email ou mot de passe incorrect' } }
    }
    return { error: { _form: 'Une erreur est survenue' } }
  }

  redirect('/dashboard')
}
```

### Cas d'erreur à afficher
- Email / mot de passe invalide
- Compte suspendu
- MFA requis → redirection vers `/verify-mfa`
- Trop de tentatives → "Compte temporairement bloqué, réessayez dans 15 minutes"

---

## Page Register (`/register`)

### UI
- Formulaire en 2 étapes (wizard léger)

**Étape 1 – Compte**
- Prénom + Nom
- Email professionnel
- Mot de passe (avec indicateur de force)
- Confirmation mot de passe
- Checkbox CGU obligatoire

**Étape 2 – Entreprise** (après validation étape 1)
- Nom de l'entreprise (requis)
- Secteur d'activité (select)
- Pays (select, France par défaut)
- Téléphone (optionnel)

**Confirmation**
- Email de vérification envoyé
- Lien "Renvoyer l'email"
- Redirection auto vers `/onboarding` après vérification

### Validations

```typescript
const registerSchema = z.object({
  firstName: z.string().min(2, 'Minimum 2 caractères'),
  lastName: z.string().min(2),
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial'),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les CGU' }),
  }),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})
```

---

## Page Forgot Password (`/forgot-password`)

- Champ email
- Message : "Un lien de réinitialisation vous sera envoyé"
- Après envoi : confirmation (même si email inexistant, pour sécurité)
- Délai de renvoi : 60 secondes (countdown)

---

## Contraintes communes

1. **Layouts** : fond dégradé brand, card blanche centrée (max-w-md), logo en haut.
2. **Loading states** : spinner sur les boutons pendant les actions.
3. **Erreurs** : affichées inline sous chaque champ + message global en haut.
4. **Sécurité** :
   - Rate limiting côté serveur (5 tentatives → blocage 15 min)
   - CSRF protection (Auth.js intégré)
   - Pas d'indication si l'email existe ou non (forgot password)
5. **Redirection post-login** : si `callbackUrl` en query param, rediriger vers cette URL.
6. **Persistance** : "Se souvenir de moi" → session 30 jours vs 24h.
7. **Onboarding** : après register + vérification email → `/onboarding` automatiquement.
