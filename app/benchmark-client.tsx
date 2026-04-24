"use client"

import { Benchmark } from "@/components/sections/benchmark"
import { BenchmarkHeader } from "@/components/sections/benchmark-header"
import { TooltipProvider } from "@/components/tooltip"
import type { BenchmarkData } from "@/lib/types"

export function BenchmarkClient({
  initialData,
}: {
  initialData?: BenchmarkData
}) {
  return (
    <TooltipProvider delay={200}>
      <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 items-start w-full">
        <BenchmarkHeader />
        <Benchmark initialData={initialData} />
      </div>
    </TooltipProvider>
  )
}
