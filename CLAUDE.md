# Gorgias Ecom Lab Benchmark

## Project Structure

Flat Vite + React app built as an embeddable widget for Webflow:

- `src/components/sections/` — Embeddable sections (benchmark, header, slider, stats, chart)
- `src/components/` — Shared UI components (shadcn/ui + app components)
- `src/lib/` — Utilities (cn helper)
- `src/styles/` — Global CSS with Tailwind v4 theme and design tokens
- `src/embed.tsx` — Embed entry point (builds to `dist/embed.js` + `dist/embed.css`)
- `src/main.tsx` — Dev entry point (used by `pnpm dev` via `index.html`)

## Key Commands

```bash
pnpm dev          # Start Vite dev server (uses index.html + main.tsx)
pnpm build        # Production build (outputs dist/embed.js + dist/embed.css)
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
pnpm typecheck    # TypeScript type checking
```

## Embed System

Build outputs two stable-named files: `dist/embed.js` and `dist/embed.css`.

### Declarative (Webflow)

```html
<div data-gorgias="benchmark"></div>
<script src="https://gorgias-ecom-lab-benchmark-web.vercel.app/embed.js" defer></script>
```

The script auto-loads `embed.css` from the same origin. Multiple sections can be embedded on one page.

### Imperative API

```js
GorgiasEmbed.render("benchmark", document.getElementById("target"), { /* props */ })
GorgiasEmbed.sections // ["benchmark"]
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
- **Build system**: Vite (single-file embed build, no code splitting)
- **Framework**: React 19 (Vite, no SSR)
- **UI primitives**: Base UI (`@base-ui/react`) via shadcn `base-nova` style
- **Charts**: Recharts via shadcn chart component
- **Styling**: Tailwind CSS v4, CSS variables for theming
- **Fonts**: Geist (body), Geist Mono (labels/details), STIX Two Text (headings) — loaded via Google Fonts in index.html
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
