import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { track } from "@vercel/analytics"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { Slider } from "@/components/slider"
import { BenchmarkDownload } from "./benchmark-download"
import { useBenchmark } from "./benchmark-context"
import type { Dataset } from "@/lib/types"

const datasetOptions: { value: Dataset; label: string }[] = [
  { value: "gmv", label: "Annual Sales" },
  { value: "automation-rate", label: "Automation Rate" },
]

const TICK_LABELS_FULL: Record<Dataset, { label: string; pct: number }[]> = {
  gmv: [
    { label: "$50K", pct: 0 },
    { label: "$500K", pct: 25 },
    { label: "$5M", pct: 50 },
    { label: "$50M", pct: 75 },
    { label: "$500M", pct: 100 },
  ],
  "automation-rate": [
    { label: "0%", pct: 0 },
    { label: "25%", pct: 25 },
    { label: "50%", pct: 50 },
    { label: "75%", pct: 75 },
    { label: "100%", pct: 100 },
  ],
}

const TICK_LABELS_COMPACT: Record<Dataset, { label: string; pct: number }[]> = {
  gmv: [
    { label: "$50K", pct: 0 },
    { label: "$5M", pct: 50 },
    { label: "$500M", pct: 100 },
  ],
  "automation-rate": [
    { label: "0%", pct: 0 },
    { label: "50%", pct: 50 },
    { label: "100%", pct: 100 },
  ],
}

export function GmvSlider() {
  const {
    loading,
    dataset,
    setDataset,
    industry,
    setIndustry,
    sliderValue,
    setSliderValue,
    sliderLabel,
    industries,
  } = useBenchmark()

  const sliderRef = useRef<HTMLDivElement>(null)
  const [wide, setWide] = useState(true)

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    const check = () => setWide(el.offsetWidth >= 500)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const ticks = wide
    ? TICK_LABELS_FULL[dataset]
    : TICK_LABELS_COMPACT[dataset]

  return (
    <div className="bg-card rounded-2xl overflow-hidden w-full">
      <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Controls: industry dropdown + dataset buttons */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3 shrink-0">
        <div className="flex flex-col gap-1.5">
          <span className="text-base text-text-primary">Industry</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex items-center justify-between gap-3 h-8 px-3 py-2 border border-border-muted hover:border-border-soft active:border-border-soft data-[state=open]:border-border-soft rounded-lg text-sm text-text-primary whitespace-nowrap transition-colors">
              <span className="invisible h-0 block" suppressHydrationWarning>
                {industries.reduce(
                  (a, b) => ((a || "").length >= (b || "").length ? a : b),
                  "",
                )}
              </span>
              <span className="absolute left-3">
                {loading ? "Loading…" : industry}
              </span>
              <ChevronDown className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={industry}
                onValueChange={(v) => {
                  track("industry_selected", { industry: v })
                  setIndustry(v)
                }}
              >
                {industries.map((ind) => (
                  <DropdownMenuRadioItem key={ind} value={ind}>
                    {ind}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-base text-text-primary">Dataset</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between gap-3 h-8 px-3 py-2 min-w-[160px] border border-border-muted hover:border-border-soft active:border-border-soft data-[state=open]:border-border-soft rounded-lg text-sm text-text-primary whitespace-nowrap transition-colors">
              {datasetOptions.find((d) => d.value === dataset)?.label}
              <ChevronDown className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={dataset}
                onValueChange={(v) => {
                  track("dataset_selected", { dataset: v })
                  setDataset(v as Dataset)
                }}
              >
                {datasetOptions.map((opt) => (
                  <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Slider */}
      <div ref={sliderRef} className="flex flex-col gap-3 w-full min-w-0">
        <div className="flex items-center justify-between">
          <span
            key={dataset}
            className="font-sans text-base text-text-primary animate-in fade-in duration-300"
          >
            {datasetOptions.find((d) => d.value === dataset)?.label}
          </span>
          <span className="font-mono text-sm text-text-primary tabular-nums">
            {sliderLabel}
          </span>
        </div>
        <Slider
          value={[sliderValue]}
          onValueChange={(v) => {
            const val = Array.isArray(v) ? v[0] : v
            setSliderValue(val)
          }}
          onValueCommitted={(v) => {
            const val = Array.isArray(v) ? v[0] : v
            track("slider_changed", {
              dataset,
              sliderValue: val,
              sliderLabel,
            })
          }}
          min={0}
          max={100}
          step={0.5}
          formatValue={() => sliderLabel}
        />
        {/* Tick labels laid out in N flex cells. First/last cells are half
            width with text anchored to the outer edge; middle cells are full
            width with text centered. Result: label *centers* land at
            0%, 100/(N-1)%, 2*100/(N-1)%, … of the container — matching the
            slider thumb positions. No transforms, no custom properties —
            just percentages, which stays robust inside the shadow DOM. */}
        <div
          key={dataset}
          className="flex h-5 font-mono text-xs sm:text-sm text-[#73716d] tracking-[0.1em] uppercase animate-in fade-in duration-300"
        >
          {ticks.map((tick, i) => {
            const isEdge = i === 0 || i === ticks.length - 1
            const cellWidthPct = (isEdge ? 50 : 100) / (ticks.length - 1)
            const textAlign =
              i === 0 ? "left" : i === ticks.length - 1 ? "right" : "center"
            return (
              <span
                key={tick.label}
                style={{
                  width: `${cellWidthPct}%`,
                  flexShrink: 0,
                  textAlign,
                }}
              >
                {tick.label}
              </span>
            )
          })}
        </div>
      </div>
      </div>
      <div className="w-full bg-[#fdfcfb] border-t border-[#efe9e2] px-4 sm:px-6 py-2.5 flex items-center gap-1.5">
        <BenchmarkDownload />
      </div>
    </div>
  )
}
