# Daily SaaS (En cours de développement)

Un SaaS de gestionnnaire d'utilités développée avec Next.js et TypeScript.

- Gestionnaire des comptes d'utilisateur (Admin)
- Gestionnaire des rendez-vous
- Gestionnaire des mots de passe
- Gestionnaire des course à pied
- Chat I.A d'OpenAI

![Daily SaaS Signup](https://github.com/btkdevkh/daily-saas/blob/main/public/signup_v2.png?raw=true)
![Daily SaaS Login](https://github.com/btkdevkh/daily-saas/blob/main/public/login_v4.png?raw=true)
![Daily SaaS Forget](https://github.com/btkdevkh/daily-saas/blob/main/public/forgetpass_v1.png?raw=true)
![Daily SaaS Reset](https://github.com/btkdevkh/daily-saas/blob/main/public/resetpass_v1.png?raw=true)
![Daily SaaS Users](https://github.com/btkdevkh/daily-saas/blob/main/public/users_v7.png?raw=true)
![Daily SaaS Rdv](https://github.com/btkdevkh/daily-saas/blob/main/public/rdv_v3.png?raw=true)
![Daily SaaS Password](https://github.com/btkdevkh/daily-saas/blob/main/public/password_v1.png?raw=true)
![Daily SaaS Running](https://github.com/btkdevkh/daily-saas/blob/main/public/running_v1.png?raw=true)
![Daily SaaS Chat AI](https://github.com/btkdevkh/daily-saas/blob/main/public/chatai_v6.png?raw=true)

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
MASTER_KEY="master_key"
NEXT_PUBLIC_CHAT_AI_API_URL="https://votre_domaine.com/api/chat"
```

Le `MASTER_KEY` peut être générer avec cette commande sous Linux: `openssl rand -hex 16`

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
