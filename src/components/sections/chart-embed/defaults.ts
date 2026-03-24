import type { AxisFormat } from "./types"

/** Default palette from the Figma design system accent colors */
export const DEFAULT_COLORS = [
  "#CDC2FF", // purple
  "#FFB5B5", // salmon
  "#FFCC9D", // amber
  "#B2E6BE", // sage green
  "#F5D4FF", // pink
  "#4E88FB", // brand blue
  "#7C6FEB", // violet
  "#E8733A", // burnt orange
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

export const DEFAULT_MARGINS = { top: 8, right: 4, bottom: 4, left: 4 }

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
