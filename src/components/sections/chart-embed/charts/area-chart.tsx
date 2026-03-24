import {
  AreaChart,
  Area,
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

export function AreaChartEmbed({
  config,
}: {
  config: SingleSeriesChartConfig
}) {
  const height = config.height ?? DEFAULT_HEIGHTS.area
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
      <AreaChart data={config.data} margin={DEFAULT_MARGINS}>
        {config.grid !== false && <CartesianGrid {...GRID_PROPS} />}
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={0}
          tick={AXIS_TICK}
          mirror
          tickMargin={12}
          hide={config.xAxis?.hide}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={0}
          tick={AXIS_TICK}
          mirror
          tickFormatter={yFmt}
          hide={config.yAxis?.hide}
          domain={config.yAxis?.domain}
        />
        <Tooltip content={<EmbedTooltip formatter={yFmt} xLabel={config.xAxis?.label} yLabel={config.yAxis?.label} />} />
        <defs>
          <linearGradient id="chartAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type={config.curve ?? "monotone"}
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill="url(#chartAreaFill)"
          dot={config.dots ? { r: 4, fill: color } : false}
          connectNulls
        />
      </AreaChart>
    </ChartContainer>
  )
}
