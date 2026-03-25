"use client"

import { Benchmark } from "@/components/sections/benchmark"
import { BenchmarkHeader } from "@/components/sections/benchmark-header"
import { TooltipProvider } from "@/components/tooltip"

export default function PreviewPage() {
  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 20px" }}>
      <TooltipProvider delay={200}>
        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 items-start w-full">
          <BenchmarkHeader />
          <Benchmark />
        </div>
      </TooltipProvider>
    </div>
  )
}
