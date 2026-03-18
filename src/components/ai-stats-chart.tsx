import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/chart"
import {
  Tooltip,
  TooltipTrigger,
  MetricTooltipContent,
} from "@/components/tooltip"

const CHART_HEIGHT = 290
const MARGIN_TOP = 26
const BAR_SIZE = 16

function getBarTop(index: number, total: number) {
  const slotHeight = (CHART_HEIGHT - MARGIN_TOP) / total
  return MARGIN_TOP + index * slotHeight + (slotHeight - BAR_SIZE) / 2
}

function CustomBar({
  x,
  y,
  width,
  height,
  payload,
  background,
}: any) {
  const bx = x ?? 0
  const by = y ?? 0
  const bw = Math.max(width ?? 0, 0)
  const bh = height ?? 0
  const totalWidth = background?.width ?? bw

  return (
    <g>
      <text x={bx + totalWidth} y={by - 10} textAnchor="end">
        <tspan fontFamily="var(--font-sans)" fontSize={16} fill="var(--text-primary)">
          {payload?.label}
        </tspan>
      </text>
      {bw > 0 && (
        <rect x={bx} y={by} width={bw} height={bh} rx={4} ry={4} fill="#F5D4FF" />
      )}
    </g>
  )
}

const data = [
  {
    metric: "AI Agent Rate",
    value: 0.0,
    label: "0.0%",
    tooltip: "Median % of tickets handled end-to-end by AI across all stores",
  },
  {
    metric: "AI Success Rate",
    value: 30.8,
    label: "30.8%",
    tooltip: "% of AI-handled conversations that reached a successful resolution",
  },
  {
    metric: "AI Adoption",
    value: 21.3,
    label: "21.3%",
    tooltip: "% of stores that have AI agents enabled on their account",
  },
  {
    metric: "SA Conversion",
    value: 11.73,
    label: "11.73%",
    tooltip: "% of Shopping Assistant sessions that led to a completed purchase",
  },
]

const chartConfig = {
  value: {
    label: "Value",
    color: "#F5D4FF",
  },
} satisfies ChartConfig

export function AiStatsChart() {
  return (
    <div className="bg-card flex h-fit flex-col px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-4 rounded-2xl w-full">
      <div className="relative">
        <ChartContainer config={chartConfig} className="w-full aspect-auto h-[290px] [&_svg.recharts-surface]:!h-fit">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: MARGIN_TOP, right: 0, bottom: 0, left: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="metric" width={0} hide />
            <Bar
              dataKey="value"
              barSize={BAR_SIZE}
              background={{ fill: "#F6F4F2", radius: 4 }}
              radius={4}
              shape={(props: any) => <CustomBar {...props} />}
            />
          </BarChart>
        </ChartContainer>

        <div className="absolute inset-0 pointer-events-none">
          {data.map((item, i) => (
            <div
              key={item.metric}
              className="absolute pointer-events-auto"
              style={{ top: getBarTop(i, data.length) - 28, left: 0 }}
            >
              <Tooltip>
                <TooltipTrigger
                  render={<span />}
                  className="font-sans text-base text-text-primary underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help whitespace-nowrap leading-[22px]"
                >
                  {item.metric}
                </TooltipTrigger>
                <MetricTooltipContent label={item.metric} description={item.tooltip} />
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
