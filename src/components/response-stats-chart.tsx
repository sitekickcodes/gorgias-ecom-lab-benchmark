import { useState } from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/chart"
import { MetricCard } from "@/components/tooltip"

type HoverState = { item: any; x: number; y: number } | null

function CustomBar({
  x,
  y,
  width,
  height,
  payload,
  background,
  onHover,
}: any) {
  const bx = x ?? 0
  const by = y ?? 0
  const bw = Math.max(width ?? 0, 0)
  const bh = height ?? 0
  const totalWidth = background?.width ?? bw

  return (
    <g
      style={{ cursor: "help" }}
      onMouseEnter={(e) => onHover?.({ item: payload, x: e.clientX, y: e.clientY })}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* foreignObject lets HTML handle dotted underline (SVG text doesn't support text-decoration-style) */}
      <foreignObject x={bx} y={by - 28} width={180} height={22}>
        <span style={{
          display: "inline-block",
          fontFamily: "var(--font-sans)",
          fontSize: "16px",
          color: "var(--text-primary)",
          textDecoration: "underline dotted rgba(105, 103, 99, 0.5)",
          textUnderlineOffset: "2px",
          whiteSpace: "nowrap",
          lineHeight: "22px",
        }}>
          {payload?.metric}
        </span>
      </foreignObject>
      <text x={bx + totalWidth} y={by - 10} textAnchor="end">
        <tspan fontFamily="var(--font-mono)" fontSize={13} fill="var(--text-soft)">
          {payload?.label}
        </tspan>
      </text>
      {bw > 0 && (
        <rect x={bx} y={by} width={bw} height={bh} rx={4} ry={4} fill="#CDC2FF" />
      )}
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
  const [hovered, setHovered] = useState<HoverState>(null)

  return (
    <div className="bg-card flex h-fit flex-col px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-4 rounded-2xl w-full">
      <ChartContainer config={chartConfig} className="w-full aspect-auto h-[260px] [&_svg.recharts-surface]:!h-fit">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 26, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis type="number" domain={[0, "dataMax"]} hide />
          <YAxis type="category" dataKey="metric" width={0} hide />
          <Bar
            dataKey="minutes"
            barSize={16}
            background={{ fill: "#F6F4F2", radius: 4 }}
            radius={4}
            shape={(props: any) => <CustomBar {...props} onHover={setHovered} />}
          />
        </BarChart>
      </ChartContainer>

      {hovered && (
        <div
          className="pointer-events-none fixed z-50 flex w-44 flex-col items-start -translate-x-1/2 -translate-y-full rounded-xl border border-border-muted bg-card px-3 py-2.5 shadow-sm"
          style={{
            left: Math.max(96, Math.min(hovered.x, (typeof window !== "undefined" ? window.innerWidth : 9999) - 96)),
            top: hovered.y - 8,
          }}
        >
          <MetricCard label={hovered.item.metric} description={hovered.item.tooltip} />
        </div>
      )}
    </div>
  )
}
