import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { Slider } from "@/components/slider"
import { useBenchmark } from "./benchmark-context"
import type { Dataset } from "@/lib/types"

const datasetOptions: { value: Dataset; label: string }[] = [
  { value: "gmv", label: "Estimated GMV" },
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
    <div className="bg-card flex flex-col gap-6 p-4 sm:p-6 rounded-2xl w-full">
      {/* Controls: industry dropdown + dataset buttons */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3 shrink-0">
        <div className="flex flex-col gap-1.5">
          <span className="text-base text-text-primary">Industry</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex items-center justify-between gap-3 h-8 px-3 py-2 border border-border-muted hover:border-border-soft active:border-border-soft data-[state=open]:border-border-soft rounded-lg text-sm text-text-primary whitespace-nowrap transition-colors">
              <span className="invisible h-0 block">
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
                onValueChange={setIndustry}
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
                onValueChange={(v) => setDataset(v as Dataset)}
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
          min={0}
          max={100}
          step={0.5}
          formatValue={() => sliderLabel}
        />
        <div
          key={dataset}
          className="relative h-5 animate-in fade-in duration-300"
        >
          {ticks.map((tick, i) => {
            const isFirst = i === 0
            const isLast = i === ticks.length - 1
            return (
              <span
                key={tick.label}
                className={`absolute font-mono text-xs sm:text-sm text-[#73716d] tracking-[0.1em] uppercase ${
                  isFirst
                    ? ""
                    : isLast
                      ? ""
                      : "-translate-x-1/2 text-center"
                }`}
                style={
                  isFirst
                    ? { left: 0 }
                    : isLast
                      ? { right: 0 }
                      : {
                          left: `calc(10px + ${tick.pct} * (100% - 20px) / 100)`,
                        }
                }
              >
                {tick.label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
