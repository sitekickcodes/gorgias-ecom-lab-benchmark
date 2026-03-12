import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/chart"

function CustomBar({ x, y, width, height, payload }: any) {
  const bx = x ?? 0
  const by = y ?? 0
  const bw = Math.max(width ?? 0, 0)
  const bh = height ?? 0
  return (
    <g>
      <text x={bx} y={by - 10} textAnchor="start">
        <tspan fontFamily="var(--font-sans)" fontSize={13} fill="var(--text-primary)">
          {payload?.metric}
        </tspan>
        <tspan fontFamily="var(--font-mono)" fontSize={13} fill="var(--text-soft)" dx={12}>
          {payload?.label}
        </tspan>
      </text>
      {bw > 0 && (
        <rect
          x={bx}
          y={by}
          width={bw}
          height={bh}
          rx={4}
          ry={4}
          fill="var(--color-brand-blue-300)"
        />
      )}
    </g>
  )
}

// All values in minutes for a true apples-to-apples scale
const data = [
  { metric: "Chat FRT", minutes: 45, label: "45m", sublabel: "Median chat channel" },
  { metric: "Email FRT", minutes: 540, label: "9.0h", sublabel: "Median email channel" },
  { metric: "Resolution time", minutes: 1212, label: "20.2h", sublabel: "Median" },
  { metric: "Resolution (best)", minutes: 216, label: "3.6h", sublabel: "Top performers" },
]

const chartConfig = {
  minutes: {
    label: "Time",
    color: "var(--color-brand-blue-300)",
  },
} satisfies ChartConfig

export function ResponseStatsChart() {
  return (
    <div className="bg-card flex h-fit flex-col px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-4 rounded-2xl w-full">
      <ChartContainer config={chartConfig} className="w-full aspect-auto h-[260px] [&_svg.recharts-surface]:!h-fit">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 40, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis type="number" domain={[0, "dataMax"]} hide />
          <YAxis type="category" dataKey="metric" width={0} hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(_val, _key, item) => (
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: "var(--color-brand-blue-300)" }}
                    />
                    <span className="text-muted-foreground">
                      {item.payload.sublabel}
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
