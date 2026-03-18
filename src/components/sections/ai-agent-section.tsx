import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/chart"
import {
  Tooltip,
  TooltipTrigger,
  MetricTooltipContent,
} from "@/components/tooltip"
import { useBenchmarkMetric } from "./benchmark-context"

const SALMON = "#FFB5B5"
const SAGE_GREEN = "#B2E6BE"
const AMBER = "#FFCC9D"
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
  const fillLength = r * theta // arc length of the fill portion

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        viewBox={`0 0 ${w} ${viewH}`}
        className="w-full max-w-[220px]"
        aria-hidden="true"
      >
        {/* Track arc with 2px-radius end caps (~4px at display size) */}
        <path
          d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y0}`}
          fill="none"
          stroke={TRACK}
          strokeWidth={sw}
          strokeLinecap="butt"
        />
        <rect x={x0 - sw / 2} y={y0 - sw / 2} width={sw} height={sw} rx={2} fill={TRACK} />
        <rect x={x1 - sw / 2} y={y0 - sw / 2} width={sw} height={sw} rx={2} fill={TRACK} />
        {/* Fill arc — animates from hidden to full on mount */}
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
      <p className="font-sans text-2xl text-text-primary leading-none">
        {valueLabel}
      </p>
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
        <p className="font-sans text-base text-text-primary tracking-wide text-center">
          {label}
        </p>
      )}
    </div>
  )
}

const perfData = [
  {
    key: "automation",
    value: 16.1,
    label: "16.1%",
    metric: "Automation rate",
    tooltip: "% of tickets fully resolved by AI without any human intervention",
  },
  {
    key: "conversion",
    value: 13.68,
    label: "13.68%",
    metric: "Conversion rate",
    tooltip:
      "% of Shopping Assistant conversations that resulted in a completed purchase",
  },
]

const perfConfig = {
  value: { label: "Value", color: AMBER },
} satisfies ChartConfig

// Average GMV bar — shown in Revenue card when "Approx. GMV" dataset is selected
const AVG_GMV_VALUE = 34 // % of max for visual fill (represents ~$3.4M avg out of ~$10M scale)
const AVG_GMV_LABEL = "$3.4M"

function GmvBarChart() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <Tooltip>
          <TooltipTrigger
            render={<span />}
            className="font-sans text-base text-text-primary tracking-wide underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help"
          >
            Average GMV
          </TooltipTrigger>
          <MetricTooltipContent
            label="Average GMV"
            description="Average annual gross merchandise value across stores in this dataset"
          />
        </Tooltip>
        <span className="font-sans text-base text-text-primary">{AVG_GMV_LABEL}</span>
      </div>
      <div className="relative w-full bg-[#F6F4F2]" style={{ height: 20, borderRadius: 4 }}>
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: mounted ? `${AVG_GMV_VALUE}%` : "0%",
            backgroundColor: SAGE_GREEN,
            borderRadius: 4,
            transition: "width 1s ease-out",
          }}
        />
      </div>
    </div>
  )
}

export function AiAgentSection() {
  const { metric } = useBenchmarkMetric()
  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
        AI Agent &amp; Shopping Assistant
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1fr] gap-3 sm:gap-4">
        {/* Card 1: AI Agent Adoption Rate */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 flex flex-col gap-3">
          <Tooltip>
            <TooltipTrigger
              render={<span />}
              className="text-base leading-relaxed text-text-primary underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help"
            >
              AI Agent Adoption Rate
            </TooltipTrigger>
            <MetricTooltipContent
              label="AI Agent Adoption Rate"
              description="% of stores in the benchmark that have the AI Agent enabled on their Gorgias account"
            />
          </Tooltip>
          <div className="flex flex-col flex-1 gap-4 items-center justify-center py-2">
            <GaugeChart
              value={25.1}
              color={SALMON}
              valueLabel="25.1%"
              label="AI Agent adoption"
              tooltip="% of stores that have the AI Agent enabled on their Gorgias account"
            />
          </div>
        </div>

        {/* Card 2: AI Performance */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 flex flex-col gap-3">
          <Tooltip>
            <TooltipTrigger
              render={<span />}
              className="text-base leading-relaxed text-text-primary underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help"
            >
              How AI performs once enabled
            </TooltipTrigger>
            <MetricTooltipContent
              label="How AI performs once enabled"
              description="Key performance metrics for stores that have AI Agent or Shopping Assistant active"
            />
          </Tooltip>
          <ChartContainer
            config={perfConfig}
            className="w-full h-[180px]"
          >
            <BarChart
              data={perfData}
              barCategoryGap="35%"
              margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
            >
              <XAxis type="category" dataKey="key" hide />
              <YAxis type="number" domain={[0, 100]} hide />
              <Bar
                dataKey="value"
                barSize={24}
                fill={AMBER}
                background={{ fill: TRACK, radius: 4 } as React.SVGProps<SVGRectElement>}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
          <div className="grid grid-cols-2 text-center gap-1 mt-3">
            {perfData.map((item) => (
              <Tooltip key={item.key}>
                <TooltipTrigger
                  render={<div />}
                  className="flex flex-col gap-0.5 cursor-help"
                >
                  <p className="font-sans text-2xl text-text-primary leading-tight">
                    {item.label}
                  </p>
                  <p className="font-sans text-base text-text-primary tracking-wide leading-snug underline decoration-dotted decoration-text-soft/50 underline-offset-2">
                    {item.metric}
                  </p>
                </TooltipTrigger>
                <MetricTooltipContent label={item.metric} description={item.tooltip} />
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Card 3: Revenue Impact */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 flex flex-col gap-8">
          <Tooltip>
            <TooltipTrigger
              render={<span />}
              className="text-base leading-relaxed text-text-primary underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help"
            >
              Revenue impact from conversational AI
            </TooltipTrigger>
            <MetricTooltipContent
              label="Revenue impact from conversational AI"
              description="Average revenue attributed to Shopping Assistant interactions per store"
            />
          </Tooltip>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-1.5 bg-[#F6F4F2] rounded-xl px-4 py-3">
              <p className="font-heading text-4xl text-text-primary leading-none">
                $17K
              </p>
              <p className="font-sans text-sm text-text-soft tracking-wide leading-snug">
                Average revenue influenced by Shopping Assistant
              </p>
            </div>
            {metric === "approximate-gmv" ? (
              <GmvBarChart />
            ) : (
              <GaugeChart
                value={10.0}
                color={SAGE_GREEN}
                valueLabel="10.0%"
                label="Average automation rate"
                tooltip="Average % of tickets fully resolved by AI without human intervention, across stores with AI enabled"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
