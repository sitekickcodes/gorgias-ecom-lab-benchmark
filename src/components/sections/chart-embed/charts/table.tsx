import type { TableConfig } from "../types"

export function TableEmbed({ config }: { config: TableConfig }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "'Geist', sans-serif",
        fontSize: 14,
      }}
    >
      <thead>
        <tr>
          {config.columns.map((col) => (
            <th
              key={col.key}
              style={{
                textAlign: (col.align as React.CSSProperties["textAlign"]) ?? "left",
                fontFamily: "'Geist Mono', monospace",
                fontSize: 11,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "1.4px",
                color: "#a8a49e",
                padding: "8px 16px 10px",
                borderBottom: "2px solid #dedbd5",
                whiteSpace: "nowrap",
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {config.rows.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            style={{
              backgroundColor:
                config.striped && rowIdx % 2 === 1 ? "#faf9f7" : undefined,
            }}
          >
            {config.columns.map((col) => (
              <td
                key={col.key}
                style={{
                  textAlign: (col.align as React.CSSProperties["textAlign"]) ?? "left",
                  padding: "12px 16px",
                  borderBottom: "1px solid #efe9e2",
                  color: col.color ?? "#292827",
                  fontWeight: col.bold ? 600 : 400,
                  fontSize: 14,
                }}
              >
                {row[col.key] ?? ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
