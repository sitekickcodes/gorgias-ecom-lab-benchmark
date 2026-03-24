import type { TooltipProps } from "recharts"

export function EmbedTooltip({
  active,
  payload,
  label,
  formatter,
}: TooltipProps<number, string> & {
  formatter?: (value: number) => string
}) {
  if (!active || !payload?.length) return null

  const isSingleSeries = payload.length === 1

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
      }}
    >
      {label && (
        <div style={{ fontWeight: 500, color: "#292827", marginBottom: isSingleSeries ? 4 : 6 }}>
          {label}
        </div>
      )}
      {isSingleSeries ? (
        <div style={{ fontWeight: 500, color: "#292827", fontFamily: "'Geist Mono', monospace" }}>
          {formatter
            ? formatter(payload[0].value as number)
            : payload[0].value?.toLocaleString()}
        </div>
      ) : (
        payload.map((entry) => {
          const color = entry.payload?.fill || entry.color || "#292827"
          const value = formatter
            ? formatter(entry.value as number)
            : typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value

          return (
            <div
              key={entry.name ?? entry.dataKey}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 2,
              }}
            >
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
              <span style={{ color: "#696763" }}>
                {entry.name}
              </span>
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
        })
      )}
    </div>
  )
}
