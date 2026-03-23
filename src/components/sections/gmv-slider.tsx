import { useEffect } from "react"
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

export function GmvSlider() {
  const {
    loading,
    dataset,
    setDataset,
    industry,
    setIndustry,
    tier,
    setTier,
    industries,
    availableTiers,
  } = useBenchmark()

  const tierIndex = availableTiers.indexOf(tier)
  const maxIndex = Math.max(availableTiers.length - 1, 0)

  // When industry changes and current tier isn't available, pick the closest
  useEffect(() => {
    if (availableTiers.length > 0 && tierIndex === -1) {
      const mid = Math.floor(availableTiers.length / 2)
      setTier(availableTiers[mid])
    }
  }, [availableTiers, tierIndex, setTier])

  // Pick label positions by matching target values when possible
  const targetLabels =
    dataset === "automation-rate"
      ? ["0%", "25%", "50%", "75%", "100%"]
      : ["$50K", "$500K", "$5M", "$50M", "$500M"]

  const labelIndices = targetLabels
    .map((t) => availableTiers.indexOf(t))
    .filter((i) => i !== -1)

  return (
    <div className="bg-card flex flex-col md:flex-row md:items-start gap-10 sm:gap-16 p-4 sm:p-6 rounded-2xl w-full">
      {/* Controls: industry dropdown + dataset buttons */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3 shrink-0">
        <div className="flex flex-col gap-1.5">
          <span className="text-base text-text-primary">Industry</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex items-center justify-between gap-3 h-8 px-3 py-2 border border-border-muted hover:border-border-soft active:border-border-soft data-[state=open]:border-border-soft rounded-lg text-sm text-text-primary whitespace-nowrap transition-colors">
              {/* Invisible sizer: renders widest option to set min-width */}
              <span className="invisible h-0 block">
                {industries.reduce(
                  (a, b) => (a.length >= b.length ? a : b),
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
          <div className="flex items-center gap-2">
            {datasetOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDataset(opt.value)}
                className={[
                  "h-8 px-3 rounded-lg text-sm whitespace-nowrap transition-colors hover:bg-[#F6F4F2]",
                  dataset === opt.value
                    ? "bg-[#F6F4F2] text-text-primary"
                    : "text-text-soft hover:text-text-primary",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="flex flex-col gap-3 w-full min-w-0 md:pl-6 md:ml-auto">
        <div className="flex items-center justify-between">
          <span
            key={dataset}
            className="font-sans text-base text-text-primary animate-in fade-in duration-300"
          >
            {datasetOptions.find((d) => d.value === dataset)?.label}
          </span>
          <span className="font-mono text-sm text-text-primary tabular-nums">
            {tier}
          </span>
        </div>
        <Slider
          value={[Math.max(tierIndex, 0)]}
          onValueChange={(v) => {
            const idx = Array.isArray(v) ? v[0] : v
            if (availableTiers[idx]) {
              setTier(availableTiers[idx])
            }
          }}
          min={0}
          max={maxIndex}
          step={1}
          formatValue={(v) => availableTiers[v] ?? ""}
        />
        <div
          key={dataset}
          className="relative h-5 animate-in fade-in duration-300"
        >
          {labelIndices.map((idx, i) => {
            const pct = maxIndex > 0 ? (idx / maxIndex) * 100 : 0
            const isFirst = i === 0
            const isLast = i === labelIndices.length - 1
            return (
              <span
                key={idx}
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
                      : { left: `calc(10px + ${pct} * (100% - 20px) / 100)` }
                }
              >
                {availableTiers[idx] ?? ""}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
