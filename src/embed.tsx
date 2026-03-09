import React from "react"
import ReactDOM from "react-dom/client"
import { Benchmark } from "./components/sections/benchmark"
import "@/styles/globals.css"
import "./index.css"

// ---------------------------------------------------------------------------
// Section registry — add new sections here
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sections: Record<string, React.ComponentType<any>> = {
  benchmark: Benchmark,
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
    el.dataset.gorgiasReady = "true"
    ReactDOM.createRoot(el).render(
      <React.StrictMode>
        <Section />
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
      <Section {...props} />
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
