import { useState, useEffect } from "react"
import {
  Tooltip,
  TooltipTrigger,
  MetricTooltipContent,
} from "@/components/tooltip"
import { useBenchmark } from "./benchmark-context"

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${Math.round(n)}`
}

function ColorBar({ value, color }: { value: number; color: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const pct = Math.min(Math.max(value, 0), 100)

  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height: 6, backgroundColor: "#F6F4F2" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: mounted ? `${pct}%` : "0%",
          backgroundColor: color,
          transition: "width 1s ease-out",
        }}
      />
    </div>
  )
}

function MetricRow({
  value,
  label,
  tooltip,
  color,
  barValue,
}: {
  value: string
  label: string
  tooltip: string
  color: string
  barValue: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <Tooltip>
          <TooltipTrigger
            render={<span />}
            className="font-sans text-base text-text-primary underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help self-start"
          >
            {label}
          </TooltipTrigger>
          <MetricTooltipContent label={label} description={tooltip} />
        </Tooltip>
        <p className="font-heading text-3xl sm:text-4xl text-text-primary leading-none tabular-nums">
          {value}
        </p>
      </div>
      <ColorBar value={barValue} color={color} />
    </div>
  )
}

export function AiAgentSection() {
  const { currentRecord: r, loading } = useBenchmark()

  const aiAdoption = r?.aiAgentAdoptionRate ?? 0
  const aiResolution = r?.aiAgentAutomationRate ?? 0
  const aiSuccess = r?.aiAgentSuccessRate ?? 0
  const saAdoption = r?.saAdoptionRate ?? 0
  const saConversion = r?.saConversionRate ?? 0
  const saRevenue = r?.saRevenueAttributed ?? 0

  const fmt = (n: number, d = 1) => (loading ? "—" : `${n.toFixed(d)}%`)

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
        AI Adoption &amp; Usage
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Card 1: AI Agent */}
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-8">
          <p className="font-sans text-xl leading-relaxed text-text-primary">
            AI Agent
          </p>
          <div className="flex flex-col gap-5">
            <MetricRow
              value={fmt(aiAdoption)}
              label="Adoption rate"
              tooltip="Share of accounts in this segment with AI Agent enabled and active."
              color="#FFB5B5"
              barValue={aiAdoption}
            />
            <div className="border-t border-[#efe9e2]" />
            <MetricRow
              value={fmt(aiResolution)}
              label="Resolution rate"
              tooltip="Among AI adopters, the median share of tickets fully resolved by AI Agent without human intervention."
              color="#FFCC9D"
              barValue={aiResolution}
            />
            <div className="border-t border-[#efe9e2]" />
            <MetricRow
              value={fmt(aiSuccess)}
              label="Success rate"
              tooltip="Among AI-covered tickets, the median share successfully handled (billed). Spam tickets excluded from denominator unless billed."
              color="#F5D4FF"
              barValue={aiSuccess}
            />
          </div>
        </div>

        {/* Card 2: Shopping Assistant */}
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-8">
          <p className="font-sans text-xl leading-relaxed text-text-primary">
            Shopping Assistant
          </p>
          <div className="flex flex-col gap-5">
            <MetricRow
              value={fmt(saAdoption)}
              label="Adoption rate"
              tooltip="Share of accounts in this segment with active Shopping Assistant usage (conversion rate > 0)."
              color="#CDC2FF"
              barValue={saAdoption}
            />
            <div className="border-t border-[#efe9e2]" />
            <MetricRow
              value={fmt(saConversion, 2)}
              label="Conversion rate"
              tooltip="Median Shopping Assistant conversion rate among active SA accounts. Measures orders influenced per SA conversation."
              color="#B2E6BE"
              barValue={saConversion}
            />
            <div className="border-t border-[#efe9e2]" />
            <div className="flex flex-col gap-2">
              <Tooltip>
                <TooltipTrigger
                  render={<span />}
                  className="font-sans text-base text-text-primary underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help self-start"
                >
                  Revenue influenced
                </TooltipTrigger>
                <MetricTooltipContent
                  label="Revenue influenced"
                  description="Average revenue attributed to Shopping Assistant interactions per active SA store."
                />
              </Tooltip>
              <p
                className="font-heading text-3xl sm:text-4xl leading-none tabular-nums rounded-lg px-3 py-2 self-start"
                style={{ backgroundColor: "#F6F4F2", color: "#292827" }}
              >
                {loading ? "—" : formatCurrency(saRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
