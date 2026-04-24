# Gorgias Ecom Lab Benchmark

## Project Structure

Next.js app + standalone Vite embed build:

- `app/` — Next.js pages and API routes
  - `app/page.tsx` — Preview page (renders Benchmark directly)
  - `app/docs/page.tsx` — Chart embed API documentation + live examples
  - `app/embed/benchmark/page.tsx` — Iframe-able full benchmark (transparent bg, auto-height via postMessage)
  - `app/embed/chart/page.tsx` — Iframe-able single chart (reads `type` + URL-encoded `config` from query params)
  - `app/api/benchmark/route.ts` — Airtable data API
- `src/components/sections/` — Embeddable sections (benchmark, header, slider, stats, compare-chart, benchmark-download)
- `src/components/sections/chart-embed/` — Standalone chart embed system (bar / line / area / multi-line / table)
- `src/components/chart-attribution.tsx` — Attribution bar (Source • Get the data • Embed + logo) shown below every chart
- `src/components/popover.tsx` — Base UI Popover wrapper in shadcn style
- `src/components/` — Shared UI components (shadcn/ui + app components)
- `src/lib/` — Utilities (cn, types, airtable config, data hooks, CSV helpers, iframe snippet builder, JSON-LD schema)
- `src/styles/` — Global CSS with Tailwind v4 theme and design tokens
- `src/embed.tsx` — Embed entry point (builds to `public/embed.js`, CSS inlined)
- `embed.config.ts` — Vite config for embed-only build (includes the `inlineCompiledCss` plugin)
- `public/gorgias-logo.svg` — Watermark/attribution logo (loaded via `__GORGIAS_EMBED_ORIGIN__` when running inside shadow DOM)

## Key Commands

```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Production build (Vite embed + Next.js)
pnpm build:embed  # Build embed bundle only
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
pnpm typecheck    # TypeScript type checking
```

## Embed System

Build outputs a single stable-named file: `public/embed.js` with CSS inlined as a string. The `inlineCompiledCss` Vite plugin substitutes `__EMBED_CSS_PLACEHOLDER__` with the compiled Tailwind output after build. **The plugin throws if the placeholder can't be found** — do not remove this check; Vite bundler upgrades have silently broken the substitution before.

### Declarative (Webflow)

```html
<div data-gorgias="benchmark"></div>
<script src="https://ecom-lab.gorgias.com/embed.js" defer></script>
```

The script auto-loads fonts from Google, injects JSON-LD structured data for SEO/LLM citation, and mounts each section inside a Shadow DOM for CSS isolation. Multiple sections can be embedded on one page.

### Iframe (for CMSes that strip `<script>`)

```html
<iframe src="https://ecom-lab.gorgias.com/embed/chart?type=bar&config=..."
        style="width: 0; min-width: 100% !important; border: none;" height="500"></iframe>
<script>/* auto-height postMessage listener */</script>
```

Chart embeds in `/docs` generate this snippet via `buildIframeSnippet()` in `src/lib/embed-snippet.ts`. The iframe route sends document height via `postMessage({ "gorgias-embed-height": { [id]: px } }, "*")`; the wrapper script on the host page listens and resizes accordingly.

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

## Chart attribution bar

Every chart includes a `<ChartAttribution>` below the plot area, rendering:

- `Source: Gorgias Ecom Lab` — link to https://www.gorgias.com/ecom-lab
- **Get the data** — CSV download of the chart's data (uses `downloadCsv()` from `src/lib/csv.ts`)
- **Embed** — popover with a copy-pasteable iframe snippet
- Gorgias logo on the right, linking to gorgias.com

For tables, the wrapping card uses `gap-0` and the last row's `border-bottom` is removed so the attribution's `border-top` becomes the single dividing line (seamless look).

## Adding shadcn Components

```bash
pnpm dlx shadcn@latest add <component> --yes
```

Components go to `src/components/` and are imported as `@/components/<name>`. Note: shadcn occasionally adds `card.tsx` or similar as a transitive dependency — if unused, delete it.

## Tech Stack

- **Package manager**: pnpm (v10)
- **App framework**: Next.js 16 (App Router)
- **Embed build**: Vite 8 (single-file IIFE bundle)
- **UI framework**: React 19.2+
- **UI primitives**: Base UI (`@base-ui/react`) via shadcn `base-nova` style
- **Charts**: Recharts 3 via shadcn chart component
- **Styling**: Tailwind CSS v4, CSS variables for theming
- **Fonts**: Geist (body), Geist Mono (labels/details), STIX Two Text (headings) — loaded via Next.js layout
- **TypeScript**: v6 (`baseUrl` removed from tsconfig; `paths` alone)
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
- Soft surface (tags, dividers): `#efe9e2`
- Warm off-white (shelves): `#fdfcfb`
- Text primary: `#292827`, soft: `#696763`, muted: `#73716d`
- Borders: soft `#bfbcb6`, muted `#dedbd5`
- Brand blue: `#4e88fb` (charts/accents), light `#eaf1ff`
- Success green: `#2d783e`

## Known gotchas

- **Embed CSS placeholder**: `__EMBED_CSS_PLACEHOLDER__` must be replaced at build time by `inlineCompiledCss`. The plugin matches any string delimiter (`"`, `'`, or `` ` ``) and throws if no match is found — Vite minifier upgrades have silently broken this before.
- **Shadow DOM + portals**: Tooltips, dropdowns, and popovers must portal into the shadow root container via `useShadowContainer()` (in `src/lib/shadow-context.tsx`), otherwise they render in `document.body` and lose all CSS.
- **Hydration**: Don't read `sessionStorage` / `window` at module init in hooks that run on both server and client — use `useEffect`. See `src/lib/use-benchmark-data.ts`.
- **Transparent embed pages**: `app/layout.tsx` uses `has-[data-embed-page]:bg-transparent` so iframe routes blend into their host. Add `data-embed-page` to the root of any new embed route.
