import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
} from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/chart"
import { EmbedTooltip } from "../embed-tooltip"
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
          width="auto"
          tick={AXIS_TICK}
          tickFormatter={yFmt}
          hide={config.yAxis?.hide}
          domain={config.yAxis?.domain}
        />
        <Tooltip
          content={<EmbedTooltip valueFormatter={yFmt} xLabel={config.xAxis?.label} yLabel={config.yAxis?.label} />}
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
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
