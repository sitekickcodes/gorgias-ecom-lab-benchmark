# Gorgias Ecom Lab Benchmark

## Project Structure

Flat Vite + React app (no monorepo):

- `src/components/` — All components (app + shadcn/ui)
- `src/lib/` — Utilities (cn helper)
- `src/styles/` — Global CSS with Tailwind v4 theme and design tokens
- `src/App.tsx` — Root component
- `src/main.tsx` — Entry point

## Key Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Production build (outputs to dist/)
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
pnpm typecheck    # TypeScript type checking
```

## Adding shadcn Components

```bash
pnpm dlx shadcn@latest add <component> --yes
```

Components are placed in `src/components/` and imported as:

```tsx
import { Button } from "@/components/button"
```

## Tech Stack

- **Package manager**: pnpm (v9)
- **Build system**: Vite
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
