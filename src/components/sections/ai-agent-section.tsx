import { useState, useEffect } from "react"
import {
  Tooltip,
  TooltipTrigger,
  MetricTooltipContent,
} from "@/components/tooltip"
import { AccordionSection } from "@/components/accordion-section"
import { useBenchmark } from "./benchmark-context"

const PURPLE = "#CDC2FF"
const AMBER = "#FFCC9D"
const PINK = "#F5D4FF"
const TRACK = "#F6F4F2"

function GaugeChart({
  value,
  color,
  valueLabel,
  label,
  tooltip,
}: {
  value: number
  color: string
  valueLabel: string
  label: string
  tooltip?: string
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const pct = Math.min(Math.max(value / 100, 0), 1)
  const r = 40
  const sw = 9
  const w = (r + sw) * 2
  const cx = w / 2
  const cy = r + sw
  const x0 = cx - r
  const x1 = cx + r
  const y0 = cy
  const theta = pct * Math.PI
  const fx = cx - r * Math.cos(theta)
  const fy = cy - r * Math.sin(theta)
  const viewH = cy + sw / 2 + 2
  const fillLength = r * theta

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        viewBox={`0 0 ${w} ${viewH}`}
        className="w-full max-w-[191px]"
        aria-hidden="true"
      >
        <path
          d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y0}`}
          fill="none"
          stroke={TRACK}
          strokeWidth={sw}
          strokeLinecap="butt"
        />
        <rect x={x0 - sw / 2} y={y0 - sw / 2} width={sw} height={sw} rx={2} fill={TRACK} />
        <rect x={x1 - sw / 2} y={y0 - sw / 2} width={sw} height={sw} rx={2} fill={TRACK} />
        {pct > 0.005 && (
          <>
            <path
              d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${fx} ${fy}`}
              fill="none"
              stroke={color}
              strokeWidth={sw}
              strokeLinecap="butt"
              style={{
                strokeDasharray: fillLength,
                strokeDashoffset: mounted ? 0 : fillLength,
                transition: "stroke-dashoffset 1s ease-out",
              }}
            />
            <rect
              x={x0 - sw / 2} y={y0 - sw / 2} width={sw} height={sw} rx={2} fill={color}
              style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.1s ease 0.05s" }}
            />
          </>
        )}
      </svg>
      <p className="font-sans text-2xl text-text-primary leading-none">{valueLabel}</p>
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger
            render={<span />}
            className="font-sans text-base text-text-primary tracking-wide text-center underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help"
          >
            {label}
          </TooltipTrigger>
          <MetricTooltipContent label={label} description={tooltip} sideOffset={40} />
        </Tooltip>
      ) : (
        <p className="font-sans text-base text-text-primary tracking-wide text-center">{label}</p>
      )}
    </div>
  )
}


function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${Math.round(n)}`
}

export function AiAgentSection() {
  const { currentRecord: r, loading, containerSize } = useBenchmark()

  const adoptionRate = r?.aiAgentAdoptionRate ?? 0
  const automationRate = r?.aiAgentAutomationRate ?? 0
  const conversionRate = r?.saConversionRate ?? 0
  const saRevenue = r?.saRevenueAttributed ?? 0

  return (
    <AccordionSection
      title="AI Adoption Index"
      subtitle="How ecommerce stores are adopting and performing with AI"
    >
      <div className={`grid gap-3 sm:gap-4 ${containerSize === "md" ? "grid-cols-4" : "grid-cols-2"}`}>
        <div className="bg-card rounded-2xl p-6 flex flex-col items-center justify-end min-h-[220px]">
          <GaugeChart
            value={adoptionRate}
            color={PINK}
            valueLabel={loading ? "—" : `${adoptionRate.toFixed(1)}%`}
            label="AI adoption"
            tooltip="Share of accounts that have enabled AI"
          />
        </div>
        <div className="bg-card rounded-2xl p-6 flex flex-col items-center justify-end min-h-[220px]">
          <GaugeChart
            value={automationRate}
            color={PURPLE}
            valueLabel={loading ? "—" : `${automationRate.toFixed(1)}%`}
            label="AI automation rate"
            tooltip="Share of AI-handled tickets out of total tickets."
          />
        </div>
        <div className="bg-card rounded-2xl p-6 flex flex-col items-center justify-end min-h-[220px]">
          <GaugeChart
            value={conversionRate}
            color={AMBER}
            valueLabel={loading ? "—" : `${conversionRate.toFixed(2)}%`}
            label="AI conversion rate"
            tooltip="Median conversion rate among merchants with AI enabled, measured as orders influenced per AI conversation"
          />
        </div>
        <div className="bg-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px]">
          <div className="flex flex-col items-center gap-1.5">
            <p className="font-heading text-4xl sm:text-5xl text-text-primary leading-none tabular-nums">
              {loading ? "—" : formatCurrency(saRevenue)}
            </p>
            <Tooltip>
              <TooltipTrigger
                render={<span />}
                className="font-sans text-base text-text-primary tracking-wide text-center underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help"
              >
                AI revenue influenced
              </TooltipTrigger>
              <MetricTooltipContent
                label="AI revenue influenced"
                description="Average revenue influenced by AI conversations among enabled merchants"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </AccordionSection>
  )
}
