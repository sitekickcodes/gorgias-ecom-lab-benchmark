import type { ChartType, ChartEmbedProps } from "./types"
import { BarChartEmbed } from "./charts/bar-chart"
import { LineChartEmbed } from "./charts/line-chart"
import { AreaChartEmbed } from "./charts/area-chart"
import { MultiLineChartEmbed } from "./charts/multi-line-chart"
import { TableEmbed } from "./charts/table"
import { ChartAttribution } from "@/components/chart-attribution"
import { buildIframeSnippet } from "@/lib/embed-snippet"

const RENDERERS: Record<
  ChartType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ComponentType<{ config: any }>
> = {
  bar: BarChartEmbed,
  line: LineChartEmbed,
  area: AreaChartEmbed,
  "multi-line": MultiLineChartEmbed,
  table: TableEmbed,
}

function getCsvRows(
  type: ChartType,
  config: ChartEmbedProps["config"],
): ReadonlyArray<Record<string, unknown>> | undefined {
  if (type === "multi-line" && "series" in config) {
    const labels = config.series[0]?.data.map((d) => d.label) ?? []
    return labels.map((label) => {
      const row: Record<string, unknown> = { label }
      for (const s of config.series) {
        const point = s.data.find((d) => d.label === label)
        row[s.key] = point?.value ?? null
      }
      return row
    })
  }
  if (type === "table" && "rows" in config) {
    return config.rows
  }
  if ("data" in config) {
    return config.data.map(({ label, value }) => ({ label, value }))
  }
  return undefined
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function ChartEmbed({ type, config }: ChartEmbedProps) {
  const Renderer = RENDERERS[type]
  if (!Renderer) {
    console.warn(`[gorgias-embed] Unknown chart type "${type}"`)
    return null
  }

  const csvRows = getCsvRows(type, config)
  const chartSlug = slugify(config.title ?? "chart")
  const csvFilename = `gorgias-${chartSlug}`

  const configParam = encodeURIComponent(JSON.stringify(config))
  const embedSnippet = buildIframeSnippet({
    path: `/embed/chart?type=${type}&config=${configParam}`,
    id: chartSlug,
    title: config.title ?? "Gorgias chart",
    initialHeight: type === "multi-line" ? 520 : 500,
  })

  return (
    <div className="bg-card flex flex-col gap-0 overflow-hidden p-6 rounded-2xl w-full">
      <div className="flex flex-col gap-6">
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
      </div>
      <ChartAttribution
        csvRows={csvRows}
        csvFilename={csvFilename}
        embedSnippet={embedSnippet}
        sourceNote={config.source}
      />
    </div>
  )
}
