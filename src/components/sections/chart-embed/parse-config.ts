import type { ChartType, ChartEmbedProps } from "./types"

export function parseChartProps(el: HTMLElement): ChartEmbedProps | null {
  const type = el.dataset.chartType as ChartType | undefined
  if (!type) {
    console.warn(
      "[gorgias-embed] chart section requires data-chart-type attribute",
    )
    return null
  }

  const configStr = el.dataset.chartConfig
  if (!configStr) {
    console.warn(
      "[gorgias-embed] chart section requires data-chart-config attribute",
    )
    return null
  }

  try {
    return { type, config: JSON.parse(configStr) }
  } catch (e) {
    console.warn("[gorgias-embed] Invalid JSON in data-chart-config:", e)
    return null
  }
}
