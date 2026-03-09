# Gorgias Ecom Lab Benchmark

CX Benchmark Explorer — an embeddable React widget for Webflow.

## Setup

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

Outputs `dist/embed.js` and `dist/embed.css` with stable filenames.

## Embedding in Webflow

Add this to any Webflow page (custom code embed or site-level):

```html
<div data-gorgias="benchmark"></div>
<script src="https://gorgias-ecom-lab-benchmark-web.vercel.app/embed.js" defer></script>
```

The script automatically loads the CSS — no `<link>` tag needed.

## Imperative API

For programmatic rendering (e.g., dynamic chart generation):

```js
GorgiasEmbed.render("benchmark", document.getElementById("target"))
GorgiasEmbed.sections // List available sections
```

## Available Sections

| Section | Description |
|---|---|
| `benchmark` | Full dashboard: header, GMV slider, stat grids, and FRT chart |

More sections coming soon.
