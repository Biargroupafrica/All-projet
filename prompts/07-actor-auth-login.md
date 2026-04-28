# Prompt : Système d'Authentification & Login - Actor Hub

## Rôle

Tu es un développeur fullstack spécialisé en sécurité et authentification. Tu construis le système de login multi-rôles pour la plateforme Actor Hub.

## Description

Le système d'authentification gère 4 types d'utilisateurs avec des interfaces de login distinctes et des permissions différentes. Il utilise Supabase Auth avec JWT et implémente le RBAC.

## Flux d'Authentification

```
                    ┌──────────────┐
                    │  /login      │
                    │              │
                    │  Qui êtes-   │
                    │  vous ?      │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
    │   Admin   │   │   Agent   │   │  Customer  │
    │   Login   │   │   Login   │   │   Login    │
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────┴───────┐
                    │  Supabase    │
                    │  Auth        │
                    │  (JWT)       │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
    │ /dashboard│   │ /dashboard │   │ /dashboard │
    │           │   │ /call-     │   │ /customer  │
    │           │   │  center    │   │  -portal   │
    └───────────┘   └───────────┘   └───────────┘
```

## Composants Frontend

### Login Selection (`/login`)
- 4 cartes cliquables : Admin, Agent, Customer, Super Admin
- Chaque carte avec icône, titre, description
- Animation hover
- Design cohérent avec le design system (violet/rose)

### Login Form (par type)
- Email + Mot de passe
- Checkbox "Se souvenir de moi"
- Bouton "Connexion"
- Lien "Mot de passe oublié"
- Lien "Créer un compte" (pour Customer uniquement)
- Logo Actor Hub en haut
- Fond avec gradient ou pattern

### Signup (`/signup`)
- Nom, Prénom, Email, Téléphone, Mot de passe, Confirmation
- Entreprise (nom de la société)
- Acceptation des CGU
- Plan sélectionné (si vient de la page tarifs)

### Forgot Password (`/forgot-password`)
- Email
- Envoi du lien de réinitialisation
- Page de confirmation

## Sécurité

- Tokens JWT avec expiration (access: 1h, refresh: 7j)
- Rate limiting sur le login (5 tentatives / 15 min)
- Validation email à l'inscription
- Mots de passe : min 8 caractères, 1 majuscule, 1 chiffre, 1 spécial
- Protection CSRF
- Headers de sécurité (CSP, HSTS, etc.)
- 2FA optionnel (TOTP via authenticator app)

## Protection des Routes

```typescript
// Middleware de protection
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  
  return children;
}
```

## Instructions

1. Utilise Supabase Auth (signInWithPassword, signUp, resetPasswordForEmail)
2. Stocke le profil étendu dans `user_profiles`
3. Implémente le RLS pour que chaque tenant ne voie que ses données
4. Le token JWT doit contenir : user_id, tenant_id, role
5. Redirige après login selon le rôle
6. Le login doit être responsive et accessible
7. Supporte le dark mode
8. Gère les erreurs avec des messages clairs et localisés
