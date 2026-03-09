import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { SectionTag } from "@/components/section-tag"

const industryOptions = {
  "all-industries": "All industries",
  fashion: "Fashion",
  beauty: "Beauty",
  electronics: "Electronics",
} as const

export function BenchmarkHeader() {
  const [industry, setIndustry] = useState("all-industries")

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between w-full">
      <div className="flex flex-col gap-4 sm:gap-6 sm:max-w-[512px]">
        <SectionTag number="01" label="Live index" />
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl leading-[1.2] text-text-primary">
            CX Benchmark explorer
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#1a1e23]">
            Interpolated cx metrics by industry and gmv. Data from last 90 days
            across gorgias customers.
          </p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 h-11 px-6 py-3 border border-border-soft rounded-full text-base text-text-primary">
          {industryOptions[industry as keyof typeof industryOptions]}
          <ChevronDown className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={industry}
            onValueChange={setIndustry}
          >
            <DropdownMenuRadioItem value="all-industries">
              All industries
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="fashion">
              Fashion
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="beauty">
              Beauty
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="electronics">
              Electronics
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
