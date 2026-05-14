# Subhash Mandalapu Portfolio

A high-fidelity personal portfolio site for designer-developer Subhash Mandalapu, featuring advanced React Bits animation components integrated throughout.

## Run & Operate

- `pnpm --filter @workspace/portfolio run dev` — run the portfolio (port 21113, preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Portfolio: React + Vite, Tailwind CSS v4
- Fonts: Instrument Serif (display), Geist (body), Geist Mono (mono)
- 3D/Animation: Three.js, gl-matrix, Motion (framer-motion)
- API: Express 5, PostgreSQL + Drizzle ORM

## Where things live

- `artifacts/portfolio/src/pages/Portfolio.tsx` — main portfolio page (all sections)
- `artifacts/portfolio/src/components/PixelCard.tsx` — pixel transition hero cards
- `artifacts/portfolio/src/components/DecryptedText.tsx` — scramble/decrypt text animation
- `artifacts/portfolio/src/components/BorderGlow.tsx` — edge-proximity glow border cards
- `artifacts/portfolio/src/components/InfiniteMenu.tsx` — WebGL sphere project viewer
- `artifacts/portfolio/src/components/TechPillsCanvas.tsx` — Three.js floating 3D pill tags
- `artifacts/portfolio/src/components/CircularTrail.tsx` — mouse trail for testimonials
- `artifacts/portfolio/src/index.css` — design tokens (paper colors, fonts, keyframes)

## Architecture decisions

- All React Bits components (PixelCard, InfiniteMenu, TechPillsCanvas, etc.) have WebGL fallbacks — the InfiniteMenu falls back to a 3×2 project grid, and TechPillsCanvas falls back to a colorful static pill cloud. This is needed because the Replit preview sandbox doesn't support WebGL; deployed production will show the full WebGL experience.
- ErrorBoundary wraps all WebGL-heavy components so the rest of the portfolio never crashes.
- All custom components are co-located in `artifacts/portfolio/src/components/` with their CSS files.
- No backend needed — pure frontend portfolio. The api-server artifact is the monorepo template default.

## Product

- **Hero:** Large editorial headline, PixelCard cards (show name/role, reveal project photo on hover), animated sun star ornament, stats row, marquee strip.
- **About:** DecryptedText paragraphs animate in on scroll, Three.js floating 3D tech pill cloud (or fallback pill cloud), tool tags.
- **Work:** WebGL sphere InfiniteMenu for project browsing (or fallback image grid) with 6 projects: Spardha 2025, Dharani Printing, ACM VVIT, QR Generator, Robo Rift, Echo Trap.
- **Services:** 5 service cards with BorderGlow edge-proximity neon glow effect.
- **Testimonials:** CircularTrail mouse-following dot trail, 3 testimonial cards.
- **Contact:** Canvas-animated CTA section with floating orbs and particles, contact form.
- **Footer:** Editorial large-type footer with "Subhash." wordmark.

## User preferences

- Design palette: paper=#f4f1ea, paper2=#ebe6db, ink=#1a1a17, accent=#c64f17, olive=#5b6244, muted=#6b6a63
- Fonts: Instrument Serif (display/serif), Geist (body/sans), Geist Mono (mono/code)
- Warm, editorial, high-craft aesthetic. Serif display type with mono accents.

## Gotchas

- WebGL (Three.js / InfiniteMenu) does NOT work in the Replit preview sandbox — only in deployed production. Fallbacks are always shown in the preview.
- The `@layer base { * { @apply border-border; } }` Tailwind block must NOT be in index.css — it causes a build error in Tailwind v4 without shadcn configured.
- Always run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec changes.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
