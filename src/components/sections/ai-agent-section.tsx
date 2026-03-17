import { BarChart, Bar, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/chart"

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

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        viewBox={`0 0 ${w} ${viewH}`}
        className="w-full max-w-[160px]"
        aria-hidden="true"
      >
        <path
          d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y0}`}
          fill="none"
          stroke={TRACK}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        {pct > 0.005 && (
          <path
            d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${fx} ${fy}`}
            fill="none"
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        )}
      </svg>
      <p className="font-sans text-2xl text-text-primary leading-none">
        {valueLabel}
      </p>
      {tooltip ? (
        <div className="group relative flex flex-col items-center cursor-help">
          <p className="font-sans text-xs text-text-primary tracking-wide text-center underline decoration-dotted decoration-text-soft/50 underline-offset-2">
            {label}
          </p>
          <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-44 -translate-x-1/2 rounded-xl border border-border-muted bg-card px-3 py-2.5 text-left shadow-sm opacity-0 transition-opacity group-hover:opacity-100">
            <p className="font-sans text-xs text-text-primary font-medium mb-1">
              {label}
            </p>
            <p className="text-xs text-text-soft leading-snug">{tooltip}</p>
          </div>
        </div>
      ) : (
        <p className="font-sans text-xs text-text-primary tracking-wide text-center">
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
    metric: "Auto rate",
    tooltip: "% of tickets fully resolved by AI without any human intervention",
  },
  {
    key: "success",
    value: 33.8,
    label: "33.8%",
    metric: "Success rate",
    tooltip: "% of AI-handled conversations that reached a successful resolution",
  },
  {
    key: "conversion",
    value: 13.68,
    label: "13.68%",
    metric: "SA conversion",
    tooltip:
      "% of Shopping Assistant conversations that resulted in a completed purchase",
  },
]

const perfConfig = {
  value: { label: "Value", color: AMBER },
} satisfies ChartConfig

export function AiAgentSection() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      <h2 className="text-lg sm:text-xl leading-relaxed text-text-primary">
        AI Agent &amp; Shopping Assistant
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1fr] gap-3 sm:gap-4">
        {/* Card 1: AI Agent Adoption Rate */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 flex flex-col gap-3">
          <p className="text-sm sm:text-base leading-relaxed text-text-primary">AI Agent Adoption Rate</p>
          <div className="flex flex-col gap-6 flex-1 items-center justify-center py-2">
            <GaugeChart
              value={25.1}
              color={SALMON}
              valueLabel="25.1%"
              label="AI Agent adoption"
              tooltip="% of stores that have the AI Agent enabled on their Gorgias account"
            />
            <GaugeChart
              value={9.4}
              color={SALMON}
              valueLabel="9.4%"
              label="Shopping Assistant adoption"
              tooltip="% of stores that have the Shopping Assistant enabled on their Gorgias account"
            />
          </div>
        </div>

        {/* Card 2: AI Performance */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 flex flex-col gap-3">
          <p className="text-sm sm:text-base leading-relaxed text-text-primary">How AI performs once enabled</p>
          <ChartContainer
            config={perfConfig}
            className="flex-1 min-h-0 w-full"
          >
            <BarChart
              data={perfData}
              barCategoryGap="35%"
              margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
            >
              <XAxis type="category" dataKey="key" hide />
              <YAxis type="number" domain={[0, 100]} hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(_val, _key, item) => (
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: AMBER }}
                        />
                        <span className="text-muted-foreground">
                          {item.payload.metric}
                        </span>
                        <span className="font-mono font-medium text-foreground tabular-nums ml-auto">
                          {item.payload.label}
                        </span>
                      </span>
                    )}
                  />
                }
              />
              <Bar
                dataKey="value"
                barSize={24}
                fill={AMBER}
                background={{ fill: TRACK, radius: 4 } as React.SVGProps<SVGRectElement>}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
          <div className="grid grid-cols-3 text-center gap-1 mt-3">
            {perfData.map((item) => (
              <div key={item.key} className="group relative flex flex-col gap-0.5 cursor-help">
                <p className="font-sans text-2xl text-text-primary leading-tight">
                  {item.label}
                </p>
                <p className="font-sans text-xs text-text-primary tracking-wide leading-snug underline decoration-dotted decoration-text-soft/50 underline-offset-2">
                  {item.metric}
                </p>
                {/* Hover card */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-44 -translate-x-1/2 rounded-xl border border-border-muted bg-card px-3 py-2.5 text-left shadow-sm opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="font-sans text-xs text-text-primary font-medium mb-1">
                    {item.metric}
                  </p>
                  <p className="text-xs text-text-soft leading-snug">{item.tooltip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Revenue Impact */}
        <div className="bg-card rounded-2xl p-4 sm:p-6 flex flex-col gap-3">
          <p className="text-sm sm:text-base leading-relaxed text-text-primary">
            Revenue impact from conversational AI
          </p>
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="font-heading text-5xl sm:text-6xl text-text-primary leading-none">
                $17K
              </p>
              <p className="font-sans text-xs text-text-soft tracking-wide leading-snug">
                Average revenue influenced by Shopping Assistant
              </p>
            </div>
            <GaugeChart
              value={10.0}
              color={SAGE_GREEN}
              valueLabel="10.0%"
              label="Average automation rate"
              tooltip="Average % of tickets fully resolved by AI without human intervention, across stores with AI enabled"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
