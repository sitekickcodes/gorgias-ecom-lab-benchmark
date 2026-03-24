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
// Auto-load embed.css from the same origin as this script
// ---------------------------------------------------------------------------
function injectStyles() {
  const scripts = document.querySelectorAll<HTMLScriptElement>("script[src]")
  for (const script of scripts) {
    if (script.src.includes("embed.js")) {
      const cssUrl = script.src.replace("embed.js", "embed.css")
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = cssUrl
      document.head.appendChild(link)
      return
    }
  }
}

// ---------------------------------------------------------------------------
// Extract props from DOM element for any section
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPropsFromElement(el: HTMLElement, sectionName: string): Record<string, any> {
  // Generic props via data-gorgias-props
  const genericStr = el.dataset.gorgiasProps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let props: Record<string, any> = {}
  if (genericStr) {
    try {
      props = JSON.parse(genericStr)
    } catch {}
  }
  // Chart-specific convenience attributes
  if (sectionName === "chart") {
    const chartProps = parseChartProps(el)
    if (chartProps) Object.assign(props, chartProps)
  }
  return props
}

// ---------------------------------------------------------------------------
// Declarative mounting: <div data-gorgias="benchmark"></div>
// ---------------------------------------------------------------------------
function mountAll() {
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
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <TooltipProvider delay={200}>
        <Section {...props} />
      </TooltipProvider>
    </React.StrictMode>
  )
}

// Expose global API
const GorgiasEmbed = {
  render,
  sections: Object.keys(sections),
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
