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

export function GmvSlider() {
  const [industry, setIndustry] = useState("all-industries")
  const [metric, setMetric] = useState<Metric>("approximate-gmv")

  return (
    <div className="bg-card flex flex-col sm:flex-row sm:items-center gap-4 overflow-hidden p-4 sm:p-6 rounded-2xl w-full">
      {/* Controls: metric buttons + industry dropdown */}
      <div className="flex items-end gap-4 shrink-0">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-text-soft uppercase tracking-widest font-mono">Dataset</span>
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

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-text-soft uppercase tracking-widest font-mono">Industry</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 h-8 px-3 py-2 border border-border-muted hover:border-border-soft active:border-border-soft data-[state=open]:border-border-soft rounded-lg text-sm text-text-primary whitespace-nowrap transition-colors">
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
      </div>

      {/* Slider */}
      <div className="flex flex-col gap-3 w-full sm:w-[576px] shrink-0 sm:pl-6 sm:ml-auto">
        <Slider defaultValue={[50]} min={0} max={100} />
        <div className="flex items-center justify-between font-mono text-xs sm:text-sm text-[#73716d] tracking-[0.1em] uppercase w-full">
          {sliderLabels[metric].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
