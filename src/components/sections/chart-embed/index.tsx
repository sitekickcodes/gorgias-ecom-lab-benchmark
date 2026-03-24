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
    <div className="bg-card flex flex-col gap-8 overflow-hidden p-6 rounded-2xl w-full">
      {(config.title || config.subtitle) && (
        <div className="flex flex-col gap-1">
          {config.title && (
            <h3 className="font-sans font-normal text-lg sm:text-xl leading-tight text-text-primary m-0 p-0">
              {config.title}
            </h3>
          )}
          {config.subtitle && (
            <p className="text-sm leading-snug text-text-soft m-0 p-0">
              {config.subtitle}
            </p>
          )}
        </div>
      )}
      <Renderer config={config} />
      {config.source && (
        <div className="border-t border-border-muted pt-4 -mx-6 px-6 -mb-2">
          <p className="text-[11px] leading-relaxed text-[#a1a1aa] m-0 p-0">
            {config.source}
          </p>
        </div>
      )}
    </div>
  )
}
