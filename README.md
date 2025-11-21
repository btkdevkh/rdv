# Daily SaaS (En cours de développement)

Un SaaS de gestionnnaire d'utilités développée avec Next.js et TypeScript.

![Daily SaaS Signup](https://github.com/btkdevkh/daily-saas/blob/main/public/signup_v1.png?raw=true)
![Daily SaaS Login](https://github.com/btkdevkh/daily-saas/blob/main/public/login_v3.png?raw=true)
![Daily SaaS Users](https://github.com/btkdevkh/daily-saas/blob/main/public/users_v5.png?raw=true)
![Daily SaaS Chat AI](https://github.com/btkdevkh/daily-saas/blob/main/public/chatai_v4.png?raw=true)

## Technologies utilisées

- Next.js
- TypeScript
- NextAuth
- TailwindCSS
- Prisma ORM (PostgreSQL, SQLite)

## Structure du projet

- `/app` - Pages et layout de l'application
- `/components` - Composants réutilisables
- `/data` - Données mockées
- `/types` - Types et interfaces TypeScript
- `/etc.`

## Installation

Créer un fichier `.env` avec les variables ci-dessous

```bash
DATABASE_URL="url_bdd"
NEXTAUTH_URL="url_origin"
AUTH_SECRET="auth_secret"
NEXT_PUBLIC_CHAT_AI_API_URL="https://votre_domaine.com/api/chat"
```

Dans le terminal, tapez

```bash
npm install
```

Migrer, Générer PrismaClient & Seeder le fake data

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

## Démarrage en développement

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000
