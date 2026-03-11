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
        <tspan fontFamily="var(--font-sans)" fontSize={13} fill="var(--text-soft)">
          {payload?.metric}
        </tspan>
        <tspan fontFamily="var(--font-mono)" fontSize={13} fill="var(--text-primary)" dx={12}>
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
          fill="var(--accent-primary)"
        />
      )}
    </g>
  )
}

const data = [
  { metric: "AI Agent Rate", value: 0.0, label: "0.0%", detail: "Median ai-handled %" },
  { metric: "AI Success Rate", value: 30.8, label: "30.8%", detail: "% with ai agent enabled" },
  { metric: "AI Adoption", value: 21.3, label: "21.3%", detail: "% with ai agent enabled" },
  { metric: "SA Conversion", value: 11.73, label: "11.73%", detail: "Shopping assistant cvr" },
]

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--accent-primary)",
  },
} satisfies ChartConfig

export function AiStatsChart() {
  return (
    <div className="bg-card flex h-fit flex-col px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-4 rounded-2xl w-full">
      <ChartContainer config={chartConfig} className="w-full aspect-auto h-[260px] [&_svg.recharts-surface]:!h-fit">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 40, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
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
                      style={{ backgroundColor: "var(--accent-primary)" }}
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
            barSize={16}
            background={{ fill: "var(--accent-primary-faded)", radius: 4 }}
            radius={4}
            shape={(props: any) => <CustomBar {...props} />}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
