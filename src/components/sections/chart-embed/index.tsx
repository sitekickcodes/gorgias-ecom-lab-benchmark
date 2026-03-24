import type {
  ChartType,
  ChartEmbedProps,
  SingleSeriesChartConfig,
  MultiLineChartConfig,
} from "./types"
import { BarChartEmbed } from "./charts/bar-chart"
import { LineChartEmbed } from "./charts/line-chart"
import { AreaChartEmbed } from "./charts/area-chart"
import { MultiLineChartEmbed } from "./charts/multi-line-chart"

const RENDERERS: Record<
  ChartType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ComponentType<{ config: any }>
> = {
  bar: BarChartEmbed,
  line: LineChartEmbed,
  area: AreaChartEmbed,
  "multi-line": MultiLineChartEmbed,
}

export function ChartEmbed({ type, config }: ChartEmbedProps) {
  const Renderer = RENDERERS[type]
  if (!Renderer) {
    console.warn(`[gorgias-embed] Unknown chart type "${type}"`)
    return null
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        overflow: "hidden",
        padding: 24,
        borderRadius: 16,
        width: "100%",
        fontFamily: "'Geist', sans-serif",
      }}
    >
      {(config.title || config.subtitle) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {config.title && (
            <h3
              style={{
                fontSize: 20,
                fontWeight: 400,
                lineHeight: 1.5,
                color: "#292827",
                margin: 0,
              }}
            >
              {config.title}
            </h3>
          )}
          {config.subtitle && (
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: "#696763",
                margin: 0,
              }}
            >
              {config.subtitle}
            </p>
          )}
        </div>
      )}
      <Renderer config={config} />
    </div>
  )
}
