import type { TooltipProps } from "recharts"

export function EmbedTooltip({
  active,
  payload,
  label,
  formatter,
  xLabel,
  yLabel,
}: TooltipProps<number, string> & {
  formatter?: (value: number) => string
  /** Label for the X axis value (shown as header context) */
  xLabel?: string
  /** Label for the Y axis value (shown next to the number) */
  yLabel?: string
}) {
  if (!active || !payload?.length) return null

  const isSingleSeries = payload.length === 1
  const row = (name: string, value: string, color?: string) => (
    <div
      key={name}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 2,
      }}
    >
      {color && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            backgroundColor: color,
            flexShrink: 0,
            display: "inline-block",
          }}
        />
      )}
      <span style={{ color: "#696763" }}>{name}</span>
      <span
        style={{
          marginLeft: "auto",
          fontFamily: "'Geist Mono', monospace",
          color: "#292827",
          fontWeight: 500,
        }}
      >
        {value}
      </span>
    </div>
  )

  return (
    <div
      style={{
        backgroundColor: "#FDFCFB",
        border: "1px solid #bfbcb6",
        borderRadius: 8,
        padding: "10px 14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        fontFamily: "'Geist', sans-serif",
        fontSize: 12,
        minWidth: 140,
      }}
    >
      {label && row(xLabel || "X", String(label))}
      {isSingleSeries ? (
        row(
          yLabel || "Value",
          formatter
            ? formatter(payload[0].value as number)
            : (payload[0].value?.toLocaleString() ?? ""),
        )
      ) : (
        payload.map((entry) => {
          const color = entry.payload?.fill || entry.color || "#292827"
          const value = formatter
            ? formatter(entry.value as number)
            : typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : String(entry.value)

          return row(entry.name ?? "Value", value, color)
        })
      )}
    </div>
  )
}
