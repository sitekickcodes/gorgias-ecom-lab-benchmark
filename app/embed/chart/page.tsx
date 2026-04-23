"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChartEmbed } from "@/components/sections/chart-embed"
import { TooltipProvider } from "@/components/tooltip"
import type {
  ChartType,
  ChartEmbedConfig,
} from "@/components/sections/chart-embed/types"

const VALID_TYPES: ReadonlyArray<ChartType> = [
  "bar",
  "line",
  "area",
  "multi-line",
  "table",
]

const EMBED_ID = "chart"

function EmbeddedChart() {
  const params = useSearchParams()
  const type = params.get("type")
  const configParam = params.get("config")

  useEffect(() => {
    const sendHeight = () => {
      const h = document.documentElement.scrollHeight
      window.parent.postMessage(
        { "gorgias-embed-height": { [EMBED_ID]: h } },
        "*",
      )
    }
    sendHeight()
    const ro = new ResizeObserver(sendHeight)
    ro.observe(document.documentElement)
    window.addEventListener("load", sendHeight)
    return () => {
      ro.disconnect()
      window.removeEventListener("load", sendHeight)
    }
  }, [])

  if (!type || !VALID_TYPES.includes(type as ChartType)) {
    return (
      <div className="p-6 text-sm text-text-soft">
        Missing or invalid <code>type</code> parameter.
      </div>
    )
  }

  if (!configParam) {
    return (
      <div className="p-6 text-sm text-text-soft">
        Missing <code>config</code> parameter.
      </div>
    )
  }

  let config: ChartEmbedConfig
  try {
    config = JSON.parse(decodeURIComponent(configParam))
  } catch {
    return (
      <div className="p-6 text-sm text-text-soft">
        Invalid JSON in <code>config</code> parameter.
      </div>
    )
  }

  return (
    <TooltipProvider delay={200}>
      <ChartEmbed type={type as ChartType} config={config} />
    </TooltipProvider>
  )
}

export default function EmbedChartPage() {
  return (
    <div data-embed-page className="p-4">
      <Suspense fallback={null}>
        <EmbeddedChart />
      </Suspense>
    </div>
  )
}
