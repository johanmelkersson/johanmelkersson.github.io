# Johan Melkersson — Game Developer Portfolio

A personal portfolio website showcasing game development projects, built with React, TypeScript, and Vite.

## About

This portfolio presents 12+ game projects spanning Unity, Unreal Engine, and custom engines developed during studies at The Game Assembly (TGA). It also includes a dedicated section on AI & Behavior specialization, covering state machines, behavior trees, and navmesh integration.

## Pages

- **Home** — Hero landing with intro and navigation
- **Projects** — Tabbed view of game projects and system development work
- **About** — Career background, skills, and CV download
- **Specialization** — Deep-dive into AI & Behavior systems

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Routing | React Router DOM 7 |
| Styling | CSS Modules + CSS Variables |
| Build | Vite 8 |
| Linting | ESLint 9 |

No external UI libraries — all components hand-coded with pure CSS Modules.

## Getting Started

```bash
npm install
npm run dev
```

### Available Scripts

```bash
npm run dev       # Start development server with HMR
npm run build     # Type-check and build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Project Structure

```
src/
├── components/     # Reusable UI components (cards, icons, scroll)
├── pages/          # Page-level components (Home, About, Projects, Specialization)
├── data/           # Project data, stats, and constants
└── index.css       # Global styles and CSS custom properties
public/
├── images/         # Project key art and specialization diagrams
└── assets/badges/  # Platform badges (Steam, Itch, Google Play)
```

## Design

- Dark navy background (`#0f172a`) with cyan accent (`#38bdf8`)
- Glassmorphic cards with transparency and blur
- Responsive grid layouts, mobile-friendly
- Data-driven: all projects defined in `src/data/projects.ts`
