# Prompt : Initialiser le Monorepo ACTOR Hub

## Contexte
Tu vas créer la structure de base du monorepo pour la plateforme ACTOR Hub.

## Tâche

### 1. Structure racine (package.json — workspace root)

```json
{
  "name": "actor-hub",
  "private": true,
  "workspaces": [
    "apps/*",
    "services/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "prettier": "^3.3.0",
    "typescript": "^5.5.0"
  }
}
```

### 2. Turbo Pipeline (turbo.json)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {}
  }
}
```

### 3. TypeScript Config Partagée (packages/config/tsconfig.base.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

### 4. ESLint Config Partagée (packages/config/eslint.base.js)

Configuré pour Next.js + Node.js + TypeScript strict + règles de sécurité.

### 5. Package UI Partagé (packages/ui/package.json)

Package de composants React/Tailwind partagé entre `apps/landing` et `apps/dashboard`.

### 6. Structure des Répertoires Vides

Créer les `package.json` minimaux pour chaque service/app, avec les dépendances listées dans le AGENTS.md correspondant.

### Services à initialiser :
- `services/auth-service/package.json`
- `services/sms-service/package.json`
- `services/email-service/package.json`
- `services/whatsapp-service/package.json`
- `services/callcenter-service/package.json`
- `services/billing-service/package.json`
- `services/contacts-service/package.json`
- `services/analytics-service/package.json`
- `services/notification-service/package.json`
- `services/ai-service/` (Python — `pyproject.toml` ou `requirements.txt`)

### Apps à initialiser :
- `apps/landing/package.json` (Next.js 14)
- `apps/dashboard/package.json` (Next.js 14)
- `apps/admin/package.json` (Next.js 14)

## Format Attendu

Génère l'arborescence complète de la racine du monorepo avec tous les fichiers de configuration. Ne génère pas le code applicatif — seulement les fichiers de configuration (package.json, tsconfig.json, .gitignore, .env.example, turbo.json, etc.).

Inclure aussi :
- `.gitignore` adapté au monorepo (Node, Python, Next.js, builds)
- `.prettierrc` avec la config de formatage
- `README.md` avec les instructions de démarrage
