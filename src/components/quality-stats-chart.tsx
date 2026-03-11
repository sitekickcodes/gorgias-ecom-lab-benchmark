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
          fill="var(--color-brand-blue-300)"
        />
      )}
    </g>
  )
}

// Values normalized to 0–100 scale so bars are comparable.
// Labels show the original formatted values.
const data = [
  {
    metric: "One-touch rate",
    value: 27.3,
    label: "27.3%",
    detail: "Median",
  },
  {
    metric: "CSAT score",
    value: (4.52 / 5) * 100,
    label: "4.52 / 5",
    detail: "Median (out of 5)",
  },
  {
    metric: "NPS score",
    value: ((11 + 100) / 200) * 100,
    label: "+11",
    detail: "Net promoter score",
  },
  {
    metric: "Messages / ticket",
    value: (3.3 / 10) * 100,
    label: "3.3",
    detail: "Median per ticket",
  },
]

const chartConfig = {
  value: {
    label: "Score",
    color: "var(--color-brand-blue-300)",
  },
} satisfies ChartConfig

export function QualityStatsChart() {
  return (
    <div className="bg-card flex flex-col gap-6 px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-4 md:px-6 md:pt-4 md:pb-4 rounded-2xl sm:rounded-3xl w-full">
      <div className="flex flex-col gap-0">
        <h3 className="text-lg sm:text-xl leading-relaxed text-text-primary">
          Quality &amp; Satisfaction
        </h3>
        <p className="font-mono text-xs text-text-soft tracking-widest uppercase">
          Normalized to comparable scale · median across all merchants
        </p>
      </div>
      <ChartContainer config={chartConfig} className="w-full aspect-auto h-[360px] [&_svg.recharts-surface]:h-fit">
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
                      style={{ backgroundColor: "var(--color-brand-blue-300)" }}
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
            background={{ fill: "var(--color-brand-blue-100)", radius: 4 }}
            radius={4}
            shape={(props: any) => <CustomBar {...props} />}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
