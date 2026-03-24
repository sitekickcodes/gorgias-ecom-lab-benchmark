import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts"
import {
  ChartContainer,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/chart"
import { EmbedTooltip } from "../embed-tooltip"
import type { MultiLineChartConfig } from "../types"
import {
  AXIS_TICK,
  GRID_PROPS,
  DEFAULT_MARGINS,
  DEFAULT_HEIGHTS,
  DEFAULT_COLORS,
  createAxisFormatter,
} from "../defaults"

export function MultiLineChartEmbed({
  config,
}: {
  config: MultiLineChartConfig
}) {
  const height = config.height ?? DEFAULT_HEIGHTS["multi-line"]
  const yFmt = createAxisFormatter(
    config.yAxis?.format,
    config.yAxis?.formatTemplate,
  )

  // Pivot: one row per label, one column per series key
  const { chartData, chartConfig, seriesColors } = useMemo(() => {
    const labels = config.series[0]?.data.map((d) => d.label) ?? []

    const data = labels.map((label) => {
      const row: Record<string, unknown> = { label }
      for (const s of config.series) {
        const point = s.data.find((d) => d.label === label)
        row[s.key] = point?.value ?? null
      }
      return row
    })

    const colors: Record<string, string> = {}
    const cfg: ChartConfig = {}
    config.series.forEach((s, i) => {
      const c = s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]
      colors[s.key] = c
      cfg[s.key] = { label: s.label, color: c }
    })

    return { chartData: data, chartConfig: cfg, seriesColors: colors }
  }, [config.series])

  return (
    <ChartContainer
      config={chartConfig}
      style={{ height }}
      className="w-full"
    >
      <LineChart data={chartData} margin={DEFAULT_MARGINS}>
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
        <Tooltip content={<EmbedTooltip formatter={yFmt} xLabel={config.xAxis?.label} yLabel={config.yAxis?.label} />} />
        {config.legend !== false && (
          <Legend content={<ChartLegendContent />} />
        )}
        {config.series.map((s) => (
          <Line
            key={s.key}
            type={config.curve ?? "monotone"}
            dataKey={s.key}
            stroke={seriesColors[s.key]}
            strokeWidth={2}
            dot={config.dots !== false ? { r: 4, fill: seriesColors[s.key] } : false}
            connectNulls
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}
