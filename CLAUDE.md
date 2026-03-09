# Gorgias Ecom Lab Benchmark

## Project Structure

Turborepo monorepo using pnpm workspaces:

- `apps/web` — Vite + React app (lightweight embed)
- `packages/ui` — Shared UI library using shadcn/ui with **Base UI** primitives (`base-nova` style)
- `packages/eslint-config` — Shared ESLint configuration
- `packages/typescript-config` — Shared TypeScript configuration

## Key Commands

```bash
pnpm dev          # Start Vite dev server
pnpm build        # Production build (outputs to apps/web/dist)
pnpm lint         # Run ESLint across all packages
pnpm format       # Run Prettier
pnpm typecheck    # TypeScript type checking
```

## Adding shadcn Components

Run from the `packages/ui` directory:

```bash
cd packages/ui && pnpm dlx shadcn@latest add <component> --yes
```

Components are placed in `packages/ui/src/components/` and imported as:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Tech Stack

- **Package manager**: pnpm (v9)
- **Build system**: Turborepo + Vite
- **Framework**: React 19 (Vite, no SSR)
- **UI primitives**: Base UI (`@base-ui/react`) via shadcn `base-nova` style
- **Charts**: Recharts via shadcn chart component
- **Styling**: Tailwind CSS v4, CSS variables for theming
- **Fonts**: Geist (body), Geist Mono (labels/details), STIX Two Text (headings) — loaded via Google Fonts in index.html
- **Formatting**: Prettier with tailwindcss plugin

## Design Tokens (from Figma)

Warm neutral palette:
- Background/canvas: `#f6f4f2`
- Card surfaces: `#ffffff`
- Soft surface (tags): `#efe9e2`
- Text primary: `#292827`, soft: `#696763`, muted: `#73716d`
- Borders: soft `#bfbcb6`, muted `#dedbd5`
- Brand blue: `#4e88fb` (charts/accents), light `#eaf1ff`
- Success green: `#2d783e`
