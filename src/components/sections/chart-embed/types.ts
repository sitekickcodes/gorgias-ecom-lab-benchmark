export type ChartType = "bar" | "line" | "area" | "multi-line"

export type AxisFormat =
  | "number"
  | "percent"
  | "currency"
  | "minutes"
  | "hours"

export interface DataPoint {
  label: string
  value: number
  color?: string
}

export interface Series {
  key: string
  label: string
  color?: string
  data: DataPoint[]
}

export interface AxisConfig {
  label?: string
  format?: AxisFormat
  formatTemplate?: string
  hide?: boolean
  domain?: [number | "auto", number | "auto"]
}

export interface BaseChartConfig {
  title?: string
  subtitle?: string
  height?: number
  colors?: string[]
  grid?: boolean
  legend?: boolean
  xAxis?: AxisConfig
  yAxis?: AxisConfig
}

export interface SingleSeriesChartConfig extends BaseChartConfig {
  data: DataPoint[]
  /** For bar charts: bars before this index get colors[0], after get colors[1] */
  splitIndex?: number
  curve?: "monotone" | "linear" | "step"
  dots?: boolean
  fill?: boolean
}

export interface MultiLineChartConfig extends BaseChartConfig {
  series: Series[]
  curve?: "monotone" | "linear"
  dots?: boolean
}

export type ChartEmbedConfig = SingleSeriesChartConfig | MultiLineChartConfig

export interface ChartEmbedProps {
  type: ChartType
  config: ChartEmbedConfig
}
