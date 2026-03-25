import React from "react"
import ReactDOM from "react-dom/client"
import { Benchmark } from "./components/sections/benchmark"
import { ChartEmbed } from "./components/sections/chart-embed"
import { parseChartProps } from "./components/sections/chart-embed/parse-config"
import { TooltipProvider } from "@/components/tooltip"
import "@/styles/globals.css"
import "./index.css"

// ---------------------------------------------------------------------------
// Section registry — add new sections here
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sections: Record<string, React.ComponentType<any>> = {
  benchmark: Benchmark,
  chart: ChartEmbed,
}

// ---------------------------------------------------------------------------
// Auto-load embed.css from the same origin as this script.
// Uses the script's own URL to derive the CSS path — works regardless
// of filename, CDN rewrites, or query strings.
// ---------------------------------------------------------------------------
const _selfScript =
  (document.currentScript as HTMLScriptElement | null) ??
  Array.from(document.querySelectorAll<HTMLScriptElement>("script[src]")).find(
    (s) => s.src.includes("embed"),
  )

// Derive the embed origin for API calls (e.g. https://gorgias.sitekick.co)
const _embedOrigin = _selfScript?.src
  ? new URL(_selfScript.src).origin
  : ""

// Expose origin so data hooks can build absolute API URLs
;(window as unknown as Record<string, string>).__GORGIAS_EMBED_ORIGIN__ = _embedOrigin

function injectStyles() {
  if (!_selfScript?.src) return
  const cssUrl = _selfScript.src.replace(/embed[^/]*\.js/, "embed.css").split("?")[0]
  if (document.querySelector(`link[href="${cssUrl}"]`)) return
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = cssUrl
  document.head.appendChild(link)
}

// ---------------------------------------------------------------------------
// Extract props from DOM element for any section
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPropsFromElement(el: HTMLElement, sectionName: string): Record<string, any> {
  const genericStr = el.dataset.gorgiasProps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: Record<string, any> = {}
  if (genericStr) {
    try {
      props = JSON.parse(genericStr)
    } catch {}
  }
  if (sectionName === "chart") {
    const chartProps = parseChartProps(el)
    if (chartProps) Object.assign(props, chartProps)
  }
  return props
}

// ---------------------------------------------------------------------------
// Declarative mounting:
//   <div data-gorgias="benchmark"></div>       (attribute-based)
//   <div id="gorgias-benchmark"></div>         (ID-based fallback)
//   <div id="gorgias-chart" data-chart-type="bar" data-chart-config='...'></div>
// ---------------------------------------------------------------------------
function mountAll() {
  // ID-based fallback: auto-detect #gorgias-{sectionName} elements
  for (const name of Object.keys(sections)) {
    const el = document.getElementById(`gorgias-${name}`)
    if (el && !el.dataset.gorgias) {
      el.dataset.gorgias = name
    }
  }

  const targets = document.querySelectorAll<HTMLElement>("[data-gorgias]")

  targets.forEach((el) => {
    if (el.dataset.gorgiasReady) return

    const sectionName = el.dataset.gorgias
    if (!sectionName || !sections[sectionName]) {
      console.warn(
        `[gorgias-embed] Unknown section "${sectionName}". Available: ${Object.keys(sections).join(", ")}`
      )
      return
    }

    const Section = sections[sectionName]
    const props = getPropsFromElement(el, sectionName)
    el.dataset.gorgiasReady = "true"

    // Reset CSS inheritance from host page
    el.style.fontFamily = "'Geist', system-ui, sans-serif"
    el.style.fontSize = "16px"
    el.style.lineHeight = "1.5"
    el.style.color = "#292827"
    el.style.boxSizing = "border-box"

    ReactDOM.createRoot(el).render(
      <React.StrictMode>
        <TooltipProvider delay={200}>
          <Section {...props} />
        </TooltipProvider>
      </React.StrictMode>
    )
  })
}

// ---------------------------------------------------------------------------
// Imperative API: window.GorgiasEmbed.render("chart", el, { data: [...] })
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function render(section: string, el: HTMLElement, props?: Record<string, any>) {
  const Section = sections[section]
  if (!Section) {
    console.warn(
      `[gorgias-embed] Unknown section "${section}". Available: ${Object.keys(sections).join(", ")}`
    )
    return
  }

  injectStyles()
  el.dataset.gorgiasReady = "true"
  el.style.fontFamily = "'Geist', system-ui, sans-serif"
  el.style.fontSize = "16px"
  el.style.lineHeight = "1.5"
  el.style.color = "#292827"
  el.style.boxSizing = "border-box"
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <TooltipProvider delay={200}>
        <Section {...props} />
      </TooltipProvider>
    </React.StrictMode>
  )
}

// Named color palette for easy reference
const colors = {
  lavender: "#CDC2FF",
  salmon: "#FFB5B5",
  peach: "#FFCC9D",
  mint: "#B2E6BE",
  lilac: "#F5D4FF",
  sky: "#A8D8EA",
  apricot: "#FFD6A5",
  seafoam: "#B5D8CC",
  rose: "#E2B6CF",
  periwinkle: "#C9DAF8",
} as const

// Expose global API
const GorgiasEmbed = {
  render,
  sections: Object.keys(sections),
  colors,
}

declare global {
  interface Window {
    GorgiasEmbed: typeof GorgiasEmbed
  }
}

window.GorgiasEmbed = GorgiasEmbed

// ---------------------------------------------------------------------------
// Auto-mount on load
// ---------------------------------------------------------------------------
function init() {
  injectStyles()
  mountAll()
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}
