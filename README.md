# Worship Gift 🎵

Site web premium du mouvement gospel **Worship Gift** – un espace dédié à la louange, l'adoration et l'unité à travers la musique.

## Stack technique

- **Framework :** Next.js 15 (App Router, TypeScript)
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

## Pages prévues

- [x] Accueil (Hero + présentation)
- [ ] À propos
- [ ] Galerie
- [ ] YouTube / Live
- [ ] Billetterie
- [ ] Contact
- [ ] Authentification (connexion, inscription, espace personnel)

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