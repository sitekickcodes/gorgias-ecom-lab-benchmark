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
      {/* SVG text for visual rendering */}
      <text
        x={bx}
        y={by - 10}
        textAnchor="start"
        style={{
          textDecoration: "underline",
          textDecorationStyle: "dotted",
          textDecorationColor: "var(--text-soft)",
        }}
      >
        <tspan fontFamily="var(--font-sans)" fontSize={13} fill="var(--text-primary)">
          {payload?.metric}
        </tspan>
      </text>
      <text x={bx + totalWidth} y={by - 10} textAnchor="end">
        <tspan fontFamily="var(--font-mono)" fontSize={13} fill="var(--text-soft)">
          {payload?.label}
        </tspan>
      </text>
      {bw > 0 && (
        <rect x={bx} y={by} width={bw} height={bh} rx={4} ry={4} fill="#F5D4FF" />
      )}
      {/* Transparent HTML overlay so Base UI Tooltip can portal correctly */}
      <foreignObject x={bx} y={by - 26} width={160} height={20}>
        <Tooltip>
          <TooltipTrigger
            render={<span />}
            style={{ display: "block", width: "100%", height: "100%", cursor: "help" }}
          />
          <MetricTooltipContent
            label={payload?.metric ?? ""}
            description={payload?.tooltip ?? ""}
          />
        </Tooltip>
      </foreignObject>
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
      <ChartContainer config={chartConfig} className="w-full aspect-auto h-[260px] [&_svg.recharts-surface]:!h-fit">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="metric" width={0} hide />
          <Bar
            dataKey="value"
            barSize={16}
            background={{ fill: "#F6F4F2", radius: 4 }}
            radius={4}
            shape={(props: any) => <CustomBar {...props} />}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
