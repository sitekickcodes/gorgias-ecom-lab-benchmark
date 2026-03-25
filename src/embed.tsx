import React from "react"
import ReactDOM from "react-dom/client"
import { Benchmark } from "./components/sections/benchmark"
import { ChartEmbed } from "./components/sections/chart-embed"
import { parseChartProps } from "./components/sections/chart-embed/parse-config"
import { TooltipProvider } from "@/components/tooltip"

// Import CSS as string for injection into Shadow DOM
import globalsCss from "@/styles/globals.css?inline"
import indexCss from "./index.css?inline"

// ---------------------------------------------------------------------------
// Section registry — add new sections here
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sections: Record<string, React.ComponentType<any>> = {
  benchmark: Benchmark,
  chart: ChartEmbed,
}

// ---------------------------------------------------------------------------
// Derive embed origin for absolute API URLs on external sites
// ---------------------------------------------------------------------------
const _selfScript =
  (document.currentScript as HTMLScriptElement | null) ??
  Array.from(document.querySelectorAll<HTMLScriptElement>("script[src]")).find(
    (s) => s.src.includes("embed"),
  )

const _embedOrigin = _selfScript?.src
  ? new URL(_selfScript.src).origin
  : ""

;(window as unknown as Record<string, string>).__GORGIAS_EMBED_ORIGIN__ = _embedOrigin

// ---------------------------------------------------------------------------
// Google Fonts — inject once on the host page (fonts must be on the page,
// not inside Shadow DOM, for cross-origin font loading to work)
// ---------------------------------------------------------------------------
function injectFonts() {
  const fontUrl =
    "https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400&family=STIX+Two+Text:wght@400&display=swap"
  if (document.querySelector(`link[href="${fontUrl}"]`)) return
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = fontUrl
  document.head.appendChild(link)
}

// ---------------------------------------------------------------------------
// Shadow DOM mounting — creates a sealed CSS boundary per embed instance.
// Host page styles cannot leak in. Embed styles cannot leak out.
// ---------------------------------------------------------------------------
function mountInShadow(
  el: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Section: React.ComponentType<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>,
) {
  // Create shadow root
  const shadow = el.attachShadow({ mode: "open" })

  // Inject all CSS inside the shadow (completely isolated from host)
  const style = document.createElement("style")
  style.textContent = globalsCss + "\n" + indexCss
  shadow.appendChild(style)

  // Create React mount point inside shadow
  const mountPoint = document.createElement("div")
  mountPoint.style.fontFamily = "'Geist', system-ui, sans-serif"
  mountPoint.style.fontSize = "16px"
  mountPoint.style.lineHeight = "1.5"
  mountPoint.style.color = "#292827"
  shadow.appendChild(mountPoint)

  // Render React into the shadow DOM
  ReactDOM.createRoot(mountPoint).render(
    <React.StrictMode>
      <TooltipProvider delay={200}>
        <Section {...props} />
      </TooltipProvider>
    </React.StrictMode>,
  )
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
//   <div data-gorgias="benchmark"></div>
//   <div id="gorgias-benchmark"></div>
// ---------------------------------------------------------------------------
function mountAll() {
  // ID-based fallback
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
        `[gorgias-embed] Unknown section "${sectionName}". Available: ${Object.keys(sections).join(", ")}`,
      )
      return
    }

    const Section = sections[sectionName]
    const props = getPropsFromElement(el, sectionName)
    el.dataset.gorgiasReady = "true"

    mountInShadow(el, Section, props)
  })
}

// ---------------------------------------------------------------------------
// Imperative API
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function render(section: string, el: HTMLElement, props?: Record<string, any>) {
  const Section = sections[section]
  if (!Section) {
    console.warn(
      `[gorgias-embed] Unknown section "${section}". Available: ${Object.keys(sections).join(", ")}`,
    )
    return
  }

  el.dataset.gorgiasReady = "true"
  mountInShadow(el, Section, props ?? {})
}

// Named color palette
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
  injectFonts()
  mountAll()
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}
