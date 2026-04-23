"use client"

import { Suspense, use, useEffect, useState } from "react"
import { BenchmarkProvider, useBenchmark } from "@/components/sections/benchmark-context"
import { AiAgentSection } from "@/components/sections/ai-agent-section"
import { ResponseResolution } from "@/components/sections/response-resolution"
import { StatGrids } from "@/components/sections/stat-grids"
import { TooltipProvider } from "@/components/tooltip"
import { SnapshotProvider } from "@/lib/snapshot-context"
import type { Dataset } from "@/lib/types"

function Header() {
  const { industry, dataset, sliderLabel } = useBenchmark()
  const segmentLabel = dataset === "gmv" ? "Annual Sales" : "Automation Rate"

  return (
    <div className="flex flex-col gap-5">
      <img src="/gorgias-logo.svg" alt="Gorgias" className="h-7 w-auto" />
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl leading-[1.1] text-text-primary">
          CX Benchmark
        </h1>
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-muted">
              Industry
            </span>
            <span className="text-lg leading-snug text-text-primary">
              {industry}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-muted">
              {segmentLabel}
            </span>
            <span className="text-lg leading-snug text-text-primary tabular-nums">
              {sliderLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-heading text-2xl leading-[1.2] text-text-primary">
        {title}
      </h2>
      <p className="text-sm leading-relaxed text-text-soft">{subtitle}</p>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-[#efe9e2]" />
}

function Footer() {
  const generatedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  return (
    <div className="flex items-center justify-between gap-4 pt-2 text-xs text-text-soft">
      <span>
        Source:{" "}
        <a
          href="https://www.gorgias.com/ecom-lab"
          className="text-text-primary"
        >
          Gorgias Ecom Lab
        </a>{" "}
        · gorgias.com/ecom-lab
      </span>
      <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-muted">
        Generated {generatedDate}
      </span>
    </div>
  )
}

/**
 * Signals to Puppeteer that the dashboard has finished rendering — waits for
 * `currentRecord` to be truthy and bumps a `data-snapshot-ready` attribute
 * so `page.waitForSelector()` can fire.
 */
function ReadySignal() {
  const { currentRecord, loading } = useBenchmark()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!loading && currentRecord) {
      const raf = requestAnimationFrame(() => setReady(true))
      return () => cancelAnimationFrame(raf)
    }
  }, [loading, currentRecord])

  return ready ? <div data-snapshot-ready /> : null
}

function SnapshotContent({
  industry,
  dataset,
  sliderValue,
}: {
  industry: string
  dataset: Dataset
  sliderValue: number
}) {
  return (
    <SnapshotProvider>
    <BenchmarkProvider
      initialIndustry={industry}
      initialDataset={dataset}
      initialSliderValue={sliderValue}
    >
      <TooltipProvider delay={0}>
        <div
          data-embed-page
          data-benchmark-snapshot
          className="flex flex-col gap-8 p-10 bg-background"
        >
          <Header />
          <Divider />

          <section className="flex flex-col gap-5">
            <SectionHeading
              title="AI Adoption Index"
              subtitle="How ecommerce stores are adopting and performing with AI"
            />
            <AiAgentSection />
          </section>
          <Divider />

          <section className="flex flex-col gap-5">
            <SectionHeading
              title="CX Benchmarks"
              subtitle="Response times, satisfaction scores, ticket volume, and channel mix"
            />
            <ResponseResolution />
            <StatGrids />
          </section>

          <Divider />
          <Footer />
          <ReadySignal />
        </div>
      </TooltipProvider>
    </BenchmarkProvider>
    </SnapshotProvider>
  )
}

function SnapshotPageInner({
  searchParams,
}: {
  searchParams: Promise<{
    industry?: string
    dataset?: string
    slider?: string
  }>
}) {
  const params = use(searchParams)
  const industry = params.industry ?? "All Industries"
  const dataset: Dataset =
    params.dataset === "automation-rate" ? "automation-rate" : "gmv"
  const sliderRaw = Number(params.slider)
  const sliderValue =
    Number.isFinite(sliderRaw) && sliderRaw >= 0 && sliderRaw <= 100
      ? sliderRaw
      : dataset === "gmv"
        ? 50
        : 25

  return (
    <SnapshotContent
      industry={industry}
      dataset={dataset}
      sliderValue={sliderValue}
    />
  )
}

export default function SnapshotPage({
  searchParams,
}: {
  searchParams: Promise<{
    industry?: string
    dataset?: string
    slider?: string
  }>
}) {
  return (
    <Suspense fallback={null}>
      <SnapshotPageInner searchParams={searchParams} />
    </Suspense>
  )
}
