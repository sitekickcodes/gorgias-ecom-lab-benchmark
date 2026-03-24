"use client"

import { Benchmark } from "@/components/sections/benchmark"
import { TooltipProvider } from "@/components/tooltip"

export default function PreviewPage() {
  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 20px" }}>
      <TooltipProvider delay={200}>
        <Benchmark />
      </TooltipProvider>
    </div>
  )
}
