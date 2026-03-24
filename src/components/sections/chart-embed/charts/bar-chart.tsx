import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/chart"
import type { SingleSeriesChartConfig } from "../types"
import {
  AXIS_TICK,
  GRID_PROPS,
  DEFAULT_MARGINS,
  DEFAULT_HEIGHTS,
  BAR_TWO_TONE,
  DEFAULT_COLORS,
  createAxisFormatter,
} from "../defaults"

export function BarChartEmbed({
  config,
}: {
  config: SingleSeriesChartConfig
}) {
  const height = config.height ?? DEFAULT_HEIGHTS.bar
  const colors = config.colors ?? (config.splitIndex != null ? BAR_TWO_TONE : DEFAULT_COLORS)
  const yFmt = createAxisFormatter(
    config.yAxis?.format,
    config.yAxis?.formatTemplate,
  )

  const chartConfig: ChartConfig = {
    value: { label: config.yAxis?.label ?? "Value", color: colors[0] },
  }

  return (
    <ChartContainer
      config={chartConfig}
      style={{ height }}
      className="w-full"
    >
      <BarChart
        data={config.data}
        margin={DEFAULT_MARGINS}
      >
        {config.grid !== false && (
          <CartesianGrid {...GRID_PROPS} />
        )}
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
          tickMargin={12}
          hide={config.xAxis?.hide}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
          tickFormatter={yFmt}
          width={36}
          hide={config.yAxis?.hide}
          domain={config.yAxis?.domain}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {config.data.map((d, i) => (
            <Cell
              key={d.label}
              fill={
                d.color ??
                (config.splitIndex != null
                  ? i < config.splitIndex
                    ? colors[0]
                    : colors[1]
                  : colors[i % colors.length])
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
