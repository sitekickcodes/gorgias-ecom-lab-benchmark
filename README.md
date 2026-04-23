# Gorgias Ecom Lab Benchmark

CX Benchmark Explorer — an embeddable React widget for Webflow and other third-party sites.

## Setup

```bash
pnpm install
pnpm dev          # Next.js preview at http://localhost:3000
pnpm build:embed  # Build standalone embed bundle
```

## Build

```bash
pnpm build
```

Outputs `public/embed.js` (with CSS inlined) and deploys the Next.js app. The embed JS has a stable filename so embedders' `<script src=…>` keeps working across deploys.

## Embed formats

There are two ways to embed, for two different use cases.

### Script + div — best for Webflow, Gorgias-owned sites, or anywhere `<script>` tags are allowed

```html
<div data-gorgias="benchmark"></div>
<script src="https://gorgias.sitekick.co/embed.js" defer></script>
```

The script auto-injects CSS, fonts, and JSON-LD structured data. Multiple sections can be embedded on one page with a single `<script>` tag.

### iframe — best for blog CMSes that strip `<script>` tags

Each chart in the docs (`/docs`) has an **Embed** button that generates a Ramp/Datawrapper-style iframe snippet:

```html
<iframe title="..." src="https://gorgias.sitekick.co/embed/chart?type=bar&config=..."
        scrolling="no" frameborder="0"
        style="width: 0; min-width: 100% !important; border: none;"
        height="500"></iframe>
<script>/* auto-height listener — included in snippet */</script>
```

The iframe routes auto-resize via `postMessage`, so embedders don't need to guess heights.

## Available sections

| Section | Description | Iframe route |
|---|---|---|
| `benchmark` | Full interactive dashboard: filters, slider, stats, AI adoption, compare chart | `/embed/benchmark` |
| `chart` | Standalone chart (bar / line / area / multi-line / table) from a config object | `/embed/chart?type=…&config=…` |

See `app/docs/page.tsx` for the full chart-embed API (config shape, axis formats, color palette).

## Imperative API

```js
GorgiasEmbed.render("benchmark", document.getElementById("target"))
GorgiasEmbed.render("chart", document.getElementById("target"), { type: "bar", config: {...} })
GorgiasEmbed.sections // ["benchmark", "chart"]
GorgiasEmbed.colors   // { lavender, salmon, peach, ... }
```

## Attribution bar

Every rendered chart includes an attribution bar at the bottom with:

- Source link to **Gorgias Ecom Lab** (https://www.gorgias.com/ecom-lab)
- **Get the data** — downloads a CSV of the chart's current data
- **Embed** — opens a popover with a copy-pasteable iframe snippet
- Gorgias logo (links to gorgias.com)

The main benchmark also includes a **Download your full CX Benchmark** button in the filter card that exports all metrics for the visitor's current Industry + Slider selection.
