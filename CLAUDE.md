# Gorgias Ecom Lab Benchmark

## Project Structure

Next.js app + standalone Vite embed build:

- `app/` — Next.js pages and API routes
  - `app/page.tsx` — Preview page (renders Benchmark directly)
  - `app/docs/page.tsx` — Chart embed API documentation
  - `app/api/benchmark/route.ts` — Airtable data API
- `src/components/sections/` — Embeddable sections (benchmark, header, slider, stats, chart)
- `src/components/sections/chart-embed/` — Standalone chart embed system
- `src/components/` — Shared UI components (shadcn/ui + app components)
- `src/lib/` — Utilities (cn helper, types, airtable config, data hooks)
- `src/styles/` — Global CSS with Tailwind v4 theme and design tokens
- `src/embed.tsx` — Embed entry point (builds to `public/embed.js` + `public/embed.css`)
- `embed.config.ts` — Vite config for embed-only build

## Key Commands

```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Production build (Next.js + Vite embed)
pnpm build:embed  # Build embed bundle only
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
pnpm typecheck    # TypeScript type checking
```

## Embed System

Build outputs two stable-named files: `public/embed.js` and `public/embed.css`.

### Declarative (Webflow)

```html
<div data-gorgias="benchmark"></div>
<script src="https://gorgias.sitekick.co/embed.js" defer></script>
```

The script auto-loads `embed.css` from the same origin. Multiple sections can be embedded on one page.

### Imperative API

```js
GorgiasEmbed.render("benchmark", document.getElementById("target"), { /* props */ })
GorgiasEmbed.sections // ["benchmark", "chart"]
GorgiasEmbed.colors   // { lavender: "#CDC2FF", salmon: "#FFB5B5", ... }
```

### Adding new sections

1. Create component in `src/components/sections/`
2. Add to the `sections` map in `src/embed.tsx`
3. Embed with `<div data-gorgias="section-name"></div>`

## Adding shadcn Components

```bash
pnpm dlx shadcn@latest add <component> --yes
```

Components go to `src/components/` and are imported as `@/components/<name>`.

## Tech Stack

- **Package manager**: pnpm (v9)
- **App framework**: Next.js 16 (App Router)
- **Embed build**: Vite (single-file bundle, no code splitting)
- **UI framework**: React 19
- **UI primitives**: Base UI (`@base-ui/react`) via shadcn `base-nova` style
- **Charts**: Recharts via shadcn chart component
- **Styling**: Tailwind CSS v4, CSS variables for theming
- **Fonts**: Geist (body), Geist Mono (labels/details), STIX Two Text (headings) — loaded via Next.js layout
- **Formatting**: Prettier with tailwindcss plugin

## Responsive Breakpoints

Custom breakpoints matching Webflow embed (mobile-first):
- `xs`: 320px
- `sm`: 568px
- `md`: 768px

## Design Tokens (from Figma)

Warm neutral palette:
- Background/canvas: `#f6f4f2`
- Card surfaces: `#ffffff`
- Soft surface (tags): `#efe9e2`
- Text primary: `#292827`, soft: `#696763`, muted: `#73716d`
- Borders: soft `#bfbcb6`, muted `#dedbd5`
- Brand blue: `#4e88fb` (charts/accents), light `#eaf1ff`
- Success green: `#2d783e`
