"use client"

import { useEffect } from "react"
import { Benchmark } from "@/components/sections/benchmark"
import { BenchmarkHeader } from "@/components/sections/benchmark-header"
import { TooltipProvider } from "@/components/tooltip"
import type { BenchmarkData } from "@/lib/types"

const EMBED_ID = "benchmark"

export function EmbedBenchmarkClient({
  initialData,
}: {
  initialData?: BenchmarkData
}) {
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

  return (
    <div data-embed-page className="p-4 flex flex-col gap-8">
      <TooltipProvider delay={200}>
        <BenchmarkHeader />
        <Benchmark initialData={initialData} />
      </TooltipProvider>
    </div>
  )
}
