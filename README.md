# Johan Melkersson — Game Developer Portfolio

A personal portfolio website showcasing game development projects, built with React, TypeScript, and Vite.

## About

This portfolio presents 14+ projects spanning Unity, Unreal Engine, custom C++ engines, and web development work done during studies at The Game Assembly (TGA) and Lexicon. It includes a dedicated section on AI & Behavior specialization, covering state machines, behavior trees, and navmesh integration.

## Pages

- **Home** — Hero landing with intro and navigation
- **Projects** — Infinite carousel with git-style timeline, strip nav, and full-card view
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
├── components/     # Reusable UI components (cards, timeline, carousel)
├── pages/          # Page-level components (Home, About, Projects, Specialization)
├── data/           # Project data, timeline entries, and constants
└── index.css       # Global styles and CSS custom properties
public/
├── images/         # Project key art and specialization diagrams
└── assets/badges/  # Platform badges (Steam, Itch, Google Play)
```

## Projects Page — Carousel System

The projects page is built around a three-layer interactive system:

- **Git-style SVG timeline** — hand-rolled with greedy lane assignment, fork/merge curves, per-segment hover tooltips, and cross-component highlight sync
- **Strip carousel** — three-copy infinite loop with center-based boundary detection, hold-to-scroll nav with acceleration/deceleration, screensaver auto-scroll after 3s idle, and distinct selected vs. hovered card states
- **Large card carousel** — native overflow scroll on mobile for fluid swipe, scrollend-based nearest-card sync, ResizeObserver to keep the selected card centered on resize

## Design

- Dark navy background (`#0f172a`) with cyan accent (`#38bdf8`)
- Glassmorphic cards with transparency and blur
- Responsive layouts, mobile-friendly with touch swipe support
- Data-driven: all projects defined in `src/data/projects.ts` and `src/data/timeline.ts`
