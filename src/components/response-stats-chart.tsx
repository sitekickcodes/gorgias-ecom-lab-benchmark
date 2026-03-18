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
        <rect x={bx} y={by} width={bw} height={bh} rx={4} ry={4} fill="#CDC2FF" />
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

// All values in minutes for a true apples-to-apples scale
const data = [
  {
    metric: "Chat FRT",
    minutes: 45,
    label: "45m",
    tooltip: "Median first response time for tickets received via live chat",
  },
  {
    metric: "Email FRT",
    minutes: 540,
    label: "9.0h",
    tooltip: "Median first response time for tickets received via email",
  },
  {
    metric: "Resolution time",
    minutes: 1212,
    label: "20.2h",
    tooltip: "Median time from ticket creation to full resolution across all channels",
  },
  {
    metric: "Resolution (best)",
    minutes: 216,
    label: "3.6h",
    tooltip: "Median resolution time for the top-performing stores in the benchmark",
  },
]

const chartConfig = {
  minutes: {
    label: "Time",
    color: "#CDC2FF",
  },
} satisfies ChartConfig

export function ResponseStatsChart() {
  return (
    <div className="bg-card flex h-fit flex-col px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-4 rounded-2xl w-full">
      <ChartContainer config={chartConfig} className="w-full aspect-auto h-[260px] [&_svg.recharts-surface]:!h-fit">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis type="number" domain={[0, "dataMax"]} hide />
          <YAxis type="category" dataKey="metric" width={0} hide />
          <Bar
            dataKey="minutes"
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
