# Skill 02 — Authentification & Multi-Tenancy

## Quand utiliser ce skill
Lorsque vous travaillez sur la connexion, l'inscription, la gestion des sessions, des rôles ou du modèle multi-tenant.

## Routes concernées
```
/login → Sélection type de profil
/login/admin → Formulaire admin
/login/agent → Formulaire agent
/login/customer → Formulaire client
/login/super-admin → Formulaire super admin
/signup → Inscription
/forgot-password → Réinitialisation MDP
```

## Composants clés
```
src/app/components/auth/login-selection.tsx    — Sélection du rôle
src/app/components/auth/login-admin.tsx        — Login Admin
src/app/components/auth/login-agent.tsx        — Login Agent
src/app/components/auth/login-customer.tsx     — Login Client
src/app/components/auth/login-super-admin.tsx  — Login Super Admin
src/app/components/auth/super-admin-dashboard.tsx
src/app/components/signup.tsx
src/app/components/forgot-password.tsx
src/app/components/two-factor-auth.tsx
src/app/components/protected-route.tsx
```

## Modèle de Données

### Tables Supabase
```sql
-- Tenants (organisations clientes)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'starter', -- starter, pro, enterprise
  status TEXT NOT NULL DEFAULT 'active', -- active, suspended, cancelled
  modules JSONB DEFAULT '{"call_center": true, "sms": true, "email": true, "whatsapp": false}',
  max_agents INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Profils utilisateurs (extension de auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id),
  role TEXT NOT NULL DEFAULT 'agent', -- super_admin, admin, agent, customer
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Utilisateurs voient leur profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR 
         (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()) 
          AND (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')));
```

## Flux d'Authentification

```
1. /login → Afficher 4 boutons (Admin, Agent, Client, Super Admin)
2. Clic → /login/{role} → Formulaire email + password
3. POST Supabase Auth → signInWithPassword()
4. Récupérer profil → SELECT FROM profiles WHERE id = user.id
5. Vérifier tenant actif → SELECT FROM tenants WHERE id = profile.tenant_id
6. Redirection selon rôle :
   - super_admin → /dashboard (vue globale)
   - admin → /dashboard (vue entreprise)  
   - agent → /dashboard/call-center-live
   - customer → /dashboard/customer-portal
7. Stocker dans Zustand store : user, tenant, role, permissions
```

## Configuration Supabase Auth

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: localStorage,
    }
  }
)

// Connexion
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  
  const profile = await getProfile(data.user.id)
  return { user: data.user, profile }
}

// Récupérer profil + tenant
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, tenants(*)')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}
```

## Prompts pour l'Authentification

### Prompt — Page Login Selection
```
Crée la page de sélection de connexion pour Actor Hub.
L'utilisateur doit choisir son type de profil parmi :
- Administrateur (icône briefcase, fond rose)
- Agent (icône headset, fond bleu)
- Client (icône user, fond vert)
- Super Admin (icône shield, fond violet)
Chaque option est une grande card cliquable avec hover animé.
Logo Actor Hub en haut, tagline "Qui êtes-vous ?" centré.
Design moderne, fond sombre avec cards glassmorphism.
Stack: React, TypeScript, Tailwind, shadcn/ui
```

### Prompt — Formulaire Login Admin
```
Crée le formulaire de connexion pour les administrateurs d'Actor Hub.
Éléments requis :
- Logo + "Connexion Administrateur"
- Champ Email avec validation
- Champ Mot de passe avec toggle visibilité
- Checkbox "Se souvenir de moi"
- Bouton connexion rose avec loading spinner
- Lien "Mot de passe oublié ?"
- Lien retour vers la sélection de profil
- Option connexion SSO (Google, Microsoft)
- 2FA (OTP input) après connexion réussie
Gérer les erreurs : compte inexistant, mauvais mdp, compte suspendu.
Utiliser Supabase Auth pour la connexion.
```

### Prompt — Protected Route
```
Implémente un composant ProtectedRoute pour React Router qui :
1. Vérifie si l'utilisateur est connecté (Supabase session)
2. Vérifie que le tenant est actif et non expiré
3. Vérifie les permissions par rôle (role-based access)
4. Redirige vers /login si non authentifié
5. Affiche une page "Accès refusé" si permissions insuffisantes
6. Gère le refresh automatique du token JWT
Utiliser un context React (AuthContext) pour partager l'état auth.
```

## Multi-Tenant : Isolation des Données

```typescript
// Middleware API - toujours filtrer par tenant_id
async function getTenantData(table: string, tenantId: string) {
  return supabase
    .from(table)
    .select('*')
    .eq('tenant_id', tenantId) // TOUJOURS filtrer par tenant
}

// Hook personnalisé
function useTenantData() {
  const { tenant } = useAuth()
  
  return {
    tenantId: tenant.id,
    plan: tenant.plan,
    activeModules: tenant.modules,
    isModuleActive: (module: string) => tenant.modules[module] === true,
  }
}
```

## Tests à réaliser
- [ ] Login avec chaque type de compte (admin, agent, client, super_admin)
- [ ] Redirection correcte après login selon le rôle
- [ ] Token refresh automatique (tester après 1h)
- [ ] Déconnexion et suppression de session
- [ ] RLS : vérifier qu'un admin ne voit pas les données d'un autre tenant
- [ ] 2FA : envoi OTP et validation
- [ ] Compte suspendu → message d'erreur clair
- [ ] Mot de passe oublié → email de reset
