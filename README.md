# Worship Gift 🎵

Site web premium du mouvement gospel **Worship Gift** – un espace dédié à la louange, l'adoration et l'unité à travers la musique.

## Stack technique

- **Framework :** Next.js 16 (App Router, TypeScript, Turbopack)
- **Styles :** Tailwind CSS v4 + Shadcn UI
- **Animations :** Framer Motion
- **Base de données / Auth :** Supabase
- **Polices :** Cormorant Garamond (titres) + Inter (corps)

## Design

- Fond noir élégant (`#0D0D0D`)
- Accents or (`#C9A84C`)
- Animations douces, style épuré et premium
- Mobile-first, responsive

## Prérequis

- Node.js >= 18
- npm

## Installation

```bash
cd /Users/info/Downloads/worship_gift
npm install
```

## Configuration Supabase

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Copie les clés dans un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

## Build

```bash
npm run build
npm start
```

## Pages

- [x] Accueil (Hero + présentation, marquee, countdown)
- [x] À propos
- [x] Galerie
- [x] YouTube / Live
- [x] Billetterie
- [x] Contact
- [x] Authentification (connexion, inscription, espace personnel /dashboard)

## Structure du projet

```
worship_gift/
├── src/
│   ├── app/          # Pages App Router
│   ├── components/   # Composants UI (Shadcn)
│   ├── lib/          # Utilitaires, configs
│   └── hooks/        # Hooks personnalisés
├── public/           # Assets statiques
└── .clinerules/      # Règles Cline (ne pas toucher)

## Wake / ping Supabase (éviter les cold starts)

Une route API serveur a été ajoutée pour "réveiller" la base Supabase :

- Route: `GET /api/ping-supabase`
- Fichier: `src/app/api/ping-supabase/route.ts`

But : exécuter une requête très légère côté serveur (lecture d'un `id` limité à 1)
pour empêcher Supabase de mettre le projet en pause. La route utilise la clé
service (server) Supabase — ne pas exposer cette clé côté client.

Variables d'environnement à définir (Vercel ou local) :

- `SUPABASE_URL` — URL du projet Supabase (ex: https://xyz.supabase.co)
- `SUPABASE_SERVICE_ROLE_KEY` — clé service/role (NE PAS exposer côté client)

Recommandation de fréquence pour le ping :

- toutes les 15 minutes : réduit bien les cold starts
- toutes les 30 minutes : plus conservateur pour les quotas
- éviter <10 minutes pour ne pas abuser du service

Options pour appeler la route régulièrement :

- Cron Jobs Vercel : ajouter un cron qui appelle `https://votre-domaine.com/api/ping-supabase`
	avec l'expression cron `*/15 * * * *` (15 min) ou `*/30 * * * *` (30 min).
- Services externes (UptimeRobot, cron-job.org, EasyCron) : créer un monitor HTTP
	qui fait un GET toutes les 15–30 minutes.

Test local :

1. Créez un fichier `.env.local` à la racine et remplissez les variables (voir `.env.local.example`).
2. Lancez Next en dev :

```bash
npm run dev
```

3. Ping la route :

```bash
curl -sS http://localhost:3000/api/ping-supabase | jq .
```

Si votre projet n'a pas la table `orders`, éditez `src/app/api/ping-supabase/route.ts` et
remplacez `orders` par une petite table existante ou adaptez la requête en conséquence.

Pour désactiver facilement : supprimer le cron externe ou retirer/renommer la route `ping-supabase`.
