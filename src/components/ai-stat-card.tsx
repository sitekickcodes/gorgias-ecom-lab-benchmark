import { Bar, BarChart, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/chart"

interface AiStatCardProps {
  title: string
  value: string
  percentage: number
  detail: string
}

const chartConfig = {
  percentage: {
    label: "Value",
    color: "var(--brand-blue-300)",
  },
} satisfies ChartConfig

export function AiStatCard({
  title,
  value,
  percentage,
  detail,
}: AiStatCardProps) {
  const data = [{ name: title, percentage }]

  return (
    <div className="min-h-36 bg-card flex flex-col items-start justify-between gap-3 p-4 sm:p-6 rounded-2xl">
      <div className="flex gap-2 items-start w-full">
        <p className="flex-1 text-base leading-relaxed text-text-primary">
          {title}
        </p>
        <p className="text-xl leading-relaxed text-text-primary whitespace-nowrap">
          {value}
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <ChartContainer
          config={chartConfig}
          className="h-6 w-full aspect-auto"
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap={0}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(val) => (
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: "var(--brand-blue-300)" }}
                      />
                      <span className="text-muted-foreground">{title}</span>
                      <span className="font-mono font-medium text-foreground tabular-nums ml-auto">
                        {val}%
                      </span>
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="percentage"
              fill="var(--brand-blue-300)"
              background={{ fill: "var(--brand-blue-100)", radius: 4 }}
              radius={4}
              maxBarSize={24}
            />
          </BarChart>
        </ChartContainer>
        <p className="font-mono text-xs text-text-soft tracking-widest uppercase">
          {detail}
        </p>
      </div>
    </div>
  )
}
