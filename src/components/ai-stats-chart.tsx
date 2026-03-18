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
  const [hovered, setHovered] = useState<HoverState>(null)

  return (
    <div className="bg-card flex h-fit flex-col px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-4 rounded-2xl w-full">
      <ChartContainer config={chartConfig} className="w-full aspect-auto h-[260px] [&_svg.recharts-surface]:!h-fit">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 26, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="metric" width={0} hide />
          <Bar
            dataKey="value"
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
