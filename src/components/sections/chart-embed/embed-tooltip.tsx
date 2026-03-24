import type { TooltipProps } from "recharts"

export function EmbedTooltipContent({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

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
        minWidth: 120,
      }}
    >
      {label && (
        <p style={{ fontWeight: 500, color: "#292827", marginBottom: 6 }}>
          {label}
        </p>
      )}
      {payload.map((entry) => (
        <div
          key={entry.name ?? entry.dataKey}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              backgroundColor: entry.color,
              flexShrink: 0,
            }}
          />
          <span style={{ color: "#696763", flex: 1 }}>
            {entry.name ?? "Value"}
          </span>
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              color: "#292827",
              fontWeight: 500,
            }}
          >
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}
