import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
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
  DEFAULT_COLORS,
  createAxisFormatter,
} from "../defaults"

export function LineChartEmbed({
  config,
}: {
  config: SingleSeriesChartConfig
}) {
  const height = config.height ?? DEFAULT_HEIGHTS.line
  const color = config.colors?.[0] ?? DEFAULT_COLORS[0]
  const yFmt = createAxisFormatter(
    config.yAxis?.format,
    config.yAxis?.formatTemplate,
  )

  const chartConfig: ChartConfig = {
    value: { label: config.yAxis?.label ?? "Value", color },
  }

  return (
    <ChartContainer
      config={chartConfig}
      style={{ height }}
      className="w-full"
    >
      <LineChart data={config.data} margin={DEFAULT_MARGINS}>
        {config.grid !== false && <CartesianGrid {...GRID_PROPS} />}
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
        <Tooltip content={<EmbedTooltip formatter={yFmt} />} />
        <Line
          type={config.curve ?? "monotone"}
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={config.dots !== false ? { r: 4, fill: color } : false}
          connectNulls
        />
      </LineChart>
    </ChartContainer>
  )
}
