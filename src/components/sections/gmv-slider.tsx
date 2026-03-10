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

const metricOptions = {
  "approximate-gmv": "Approximate GMV",
  orders: "Monthly Orders",
  tickets: "Monthly Tickets",
} as const

export function GmvSlider() {
  const [metric, setMetric] = useState("approximate-gmv")

  return (
    <div className="bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 overflow-hidden p-4 sm:p-6 rounded-2xl w-full">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 h-11 px-6 py-3 border border-border-muted hover:border-border-soft rounded-full text-base text-text-primary whitespace-nowrap transition-colors">
          {metricOptions[metric as keyof typeof metricOptions]}
          <ChevronDown className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={metric} onValueChange={setMetric}>
            <DropdownMenuRadioItem value="approximate-gmv">
              Approximate GMV
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="orders">
              Monthly Orders
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="tickets">
              Monthly Tickets
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex-1 flex flex-col gap-2 min-h-px min-w-px max-w-[768px]">
        <Slider defaultValue={[50]} min={0} max={100} />
        <div className="flex items-center justify-between font-mono text-xs sm:text-sm text-[#73716d] tracking-[0.1em] uppercase w-full">
          <span>$100K</span>
          <span>$1M</span>
          <span>$100M</span>
          <span>$250M+</span>
        </div>
      </div>
    </div>
  )
}
