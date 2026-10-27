# Code, Court, Ring & Altar

A personal almanac about programming, tennis, Muay Thai and the Catholic faith.
Built with Next.js (App Router), React and TypeScript. No UI libraries, no Tailwind: just CSS.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static production build
npm run lint
```

## Making it yours

Personal content lives in **`src/content/site.ts`**: name, intro, the phrases the hero types, links
and projects. The chapter text is in `src/components/sections/*.tsx`.

## How it's put together

| Where | What |
| --- | --- |
| `src/app/layout.tsx` | Fonts (Fraunces, Newsreader, JetBrains Mono), metadata, and a tiny script that restores the theme before first paint |
| `src/app/globals.css` | Design tokens (light + dark), and page/section layout |
| `src/lib/liturgical.ts` | A simplified Roman Rite calendar: Easter, seasons, weeks, major feasts, liturgical color |
| `src/components/LiturgyProvider.tsx` | Computes today's liturgical day in the visitor's browser and sets `<html data-lit>`, which drives the site-wide `--altar` accent |
| `src/components/Terminal.tsx` | Chapter I: a small shell (`help`, `date`, `cd court`, …) |
| `src/components/RallyCourt.tsx` | Chapter II: a to-scale clay court rally game; personal best kept in `localStorage` |
| `src/components/EightLimbs.tsx`, `RoundTimer.tsx` | Chapter III: the eight weapons of Muay Thai, and a 5 × 3:00 round timer with a synthesized bell |
| `src/components/RoseWindow.tsx`, `LiturgicalCalendar.tsx` | Chapter IV: a stained-glass rose window and the liturgical year strip, where clicking a season previews its color |

## Deploying

The home page prerenders as static HTML, so it deploys anywhere that runs Next.js
(Vercel is the zero-config option).
