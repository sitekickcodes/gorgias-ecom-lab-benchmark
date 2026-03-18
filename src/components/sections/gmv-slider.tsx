import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { Slider } from "@/components/slider"

type Metric = "approximate-gmv" | "orders"

const metricOptions: { value: Metric; label: string }[] = [
  { value: "approximate-gmv", label: "Approx. GMV" },
  { value: "orders", label: "Monthly Orders" },
]

const sliderLabels: Record<Metric, string[]> = {
  "approximate-gmv": ["$100K", "$1M", "$100M", "$250M+"],
  orders: ["1K", "10K", "100K", "500K+"],
}

const industryOptions = {
  "all-industries": "All industries",
  fashion: "Fashion",
  beauty: "Beauty",
  electronics: "Electronics",
} as const

function getSliderLabel(value: number, labels: string[]): string {
  const idx = Math.min(
    Math.floor((value / 100) * labels.length),
    labels.length - 1
  )
  return labels[idx]
}

export function GmvSlider() {
  const [industry, setIndustry] = useState("all-industries")
  const [metric, setMetric] = useState<Metric>("approximate-gmv")
  const [sliderValue, setSliderValue] = useState([50])

  return (
    <div className="bg-card flex flex-col md:flex-row md:items-start gap-10 sm:gap-16 p-4 sm:p-6 rounded-2xl w-full">
      {/* Controls: industry dropdown + metric buttons */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3 shrink-0">
        <div className="flex flex-col gap-1.5">
          <span className="text-base text-text-primary">Industry</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between gap-3 h-8 px-3 py-2 min-w-[140px] border border-border-muted hover:border-border-soft active:border-border-soft data-[state=open]:border-border-soft rounded-lg text-sm text-text-primary whitespace-nowrap transition-colors">
              {industryOptions[industry as keyof typeof industryOptions]}
              <ChevronDown className="size-4 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={industry} onValueChange={setIndustry}>
                <DropdownMenuRadioItem value="all-industries">
                  All industries
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="fashion">Fashion</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="beauty">Beauty</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="electronics">
                  Electronics
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-base text-text-primary">Dataset</span>
          <div className="flex items-center gap-2">
            {metricOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMetric(opt.value)}
                className={[
                  "h-8 px-3 rounded-lg text-sm whitespace-nowrap transition-colors hover:bg-[#F6F4F2]",
                  metric === opt.value
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
        {/* Label row: dataset name + current selected value */}
        <div className="flex items-center justify-between">
          <span
            key={metric}
            className="font-sans text-base text-text-primary animate-in fade-in duration-300"
          >
            {metricOptions.find((m) => m.value === metric)?.label}
          </span>
        </div>
        <Slider
          value={sliderValue}
          onValueChange={(v) => setSliderValue(Array.isArray(v) ? v : [v])}
          min={0}
          max={100}
          formatValue={(v) => getSliderLabel(v, sliderLabels[metric])}
        />
        <div
          key={metric}
          className="flex justify-between animate-in fade-in duration-300"
        >
          {sliderLabels[metric].map((label) => (
            <span
              key={label}
              className="font-mono text-xs sm:text-sm text-[#73716d] tracking-[0.1em] uppercase"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}
