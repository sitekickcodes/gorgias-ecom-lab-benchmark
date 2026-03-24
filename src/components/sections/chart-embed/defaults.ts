import type { AxisFormat } from "./types"

/** Default pastel palette — 10 colors that feel warm and cohesive */
export const DEFAULT_COLORS = [
  "#CDC2FF", // lavender
  "#FFB5B5", // salmon
  "#FFCC9D", // peach
  "#B2E6BE", // mint
  "#F5D4FF", // lilac
  "#A8D8EA", // sky
  "#FFD6A5", // apricot
  "#B5D8CC", // seafoam
  "#E2B6CF", // rose
  "#C9DAF8", // periwinkle
]

export const BAR_TWO_TONE = ["#DEDBD5", "#292827"]

export const AXIS_TICK = {
  fill: "#696763",
  fontSize: 12,
  fontFamily: "var(--font-mono)",
} as const

export const GRID_PROPS = {
  strokeDasharray: "0",
  stroke: "var(--border-muted)",
  vertical: false,
} as const

export const DEFAULT_MARGINS = { top: 0, right: 8, bottom: 8, left: 12 }

export const DEFAULT_HEIGHTS: Record<string, number> = {
  bar: 300,
  line: 300,
  area: 300,
  "multi-line": 320,
}

export function createAxisFormatter(
  format?: AxisFormat,
  template?: string,
): (value: number) => string {
  if (template) {
    return (v) => template.replace("{value}", String(v))
  }
  switch (format) {
    case "percent":
      return (v) => `${v}%`
    case "currency":
      return (v) =>
        v >= 1_000_000
          ? `$${(v / 1_000_000).toFixed(1)}M`
          : v >= 1_000
            ? `$${Math.round(v / 1_000)}K`
            : `$${v}`
    case "minutes":
      return (v) => {
        if (v >= 60) {
          const h = v / 60
          return h % 1 === 0 ? `${h}h` : `${h.toFixed(1)}h`
        }
        return `${Math.round(v)}m`
      }
    case "hours":
      return (v) => `${v}h`
    default:
      return (v) => v.toLocaleString()
  }
}
