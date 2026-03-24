import React from "react"
import ReactDOM from "react-dom/client"
import { ChartEmbed } from "./components/sections/chart-embed"
import { parseChartProps } from "./components/sections/chart-embed/parse-config"
import { TooltipProvider } from "@/components/tooltip"
import "@/styles/globals.css"
import "./index.css"

// ---------------------------------------------------------------------------
// Section registry — chart is eagerly loaded (lightweight),
// benchmark is lazy-loaded (heavy: Airtable, context, all sections)
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sections: Record<string, React.ComponentType<any> | (() => Promise<React.ComponentType<any>>)> = {
  chart: ChartEmbed,
  benchmark: () =>
    import("./components/sections/benchmark").then((m) => m.Benchmark),
}

// ---------------------------------------------------------------------------
// Auto-load embed.css from the same origin as this script
// ---------------------------------------------------------------------------
function injectStyles() {
  const scripts = document.querySelectorAll<HTMLScriptElement>("script[src]")
  for (const script of scripts) {
    if (script.src.includes("embed.js")) {
      const cssUrl = script.src.replace("embed.js", "embed.css")
      if (document.querySelector(`link[href="${cssUrl}"]`)) return
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
// Render a section into a target element
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function renderSection(Section: React.ComponentType<any>, el: HTMLElement, props: Record<string, any>) {
  el.dataset.gorgiasReady = "true"
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <TooltipProvider delay={200}>
        <Section {...props} />
      </TooltipProvider>
    </React.StrictMode>
  )
}

// ---------------------------------------------------------------------------
// Resolve a section (may be lazy)
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolveSection(entry: React.ComponentType<any> | (() => Promise<React.ComponentType<any>>)): Promise<React.ComponentType<any>> {
  if (typeof entry === "function" && entry.length === 0 && !("$$typeof" in entry)) {
    // It's a lazy loader function
    try {
      return await (entry as () => Promise<React.ComponentType>)()
    } catch {
      return entry as React.ComponentType
    }
  }
  return entry as React.ComponentType
}

// ---------------------------------------------------------------------------
// Declarative mounting: <div data-gorgias="benchmark"></div>
// ---------------------------------------------------------------------------
async function mountAll() {
  const targets = document.querySelectorAll<HTMLElement>("[data-gorgias]")

  for (const el of targets) {
    if (el.dataset.gorgiasReady) continue

    const sectionName = el.dataset.gorgias
    if (!sectionName || !sections[sectionName]) {
      console.warn(
        `[gorgias-embed] Unknown section "${sectionName}". Available: ${Object.keys(sections).join(", ")}`
      )
      continue
    }

    const entry = sections[sectionName]
    const props = getPropsFromElement(el, sectionName)
    const Section = await resolveSection(entry)
    await renderSection(Section, el, props)
  }
}

// ---------------------------------------------------------------------------
// Imperative API: window.GorgiasEmbed.render("chart", el, { data: [...] })
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function render(section: string, el: HTMLElement, props?: Record<string, any>) {
  const entry = sections[section]
  if (!entry) {
    console.warn(
      `[gorgias-embed] Unknown section "${section}". Available: ${Object.keys(sections).join(", ")}`
    )
    return
  }

  injectStyles()
  const Section = await resolveSection(entry)
  await renderSection(Section, el, props ?? {})
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
