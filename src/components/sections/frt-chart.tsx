import { useMemo } from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useBenchmark } from "./benchmark-context"
import { GMV_TIERS, AUTO_TIERS } from "@/lib/types"
import type { Dataset } from "@/lib/types"

/** Distinct palette — warm/cool mix that works on white */
const INDUSTRY_COLORS = [
  "#7C6FEB", // violet
  "#E8733A", // burnt orange
  "#2D9B83", // teal
  "#D94B7B", // rose
  "#4E88FB", // blue (brand)
  "#B5A33E", // olive gold
  "#9B5DE5", // purple
  "#F15BB5", // hot pink
  "#00BBF9", // sky
  "#6A994E", // sage
  "#BC4749", // brick red
  "#E09F3E", // amber
  "#5B8E7D", // muted green
  "#7B2D8E", // plum
  "#F48C06", // tangerine
  "#277DA1", // steel blue
]

const TIER_ORDER: Record<Dataset, readonly string[]> = {
  gmv: GMV_TIERS,
  "automation-rate": AUTO_TIERS,
}

function formatTimeAxis(minutes: number): string {
  if (minutes >= 60) {
    const hrs = minutes / 60
    return hrs % 1 === 0 ? `${hrs}h` : `${hrs.toFixed(1)}h`
  }
  return `${Math.round(minutes)}m`
}

export function FrtChart() {
  const { records, industries, industry, dataset, loading } = useBenchmark()
  const axisLabel = dataset === "gmv" ? "GMV" : "Automation Rate"
  const tiers = TIER_ORDER[dataset]

  const { chartData, chartConfig, lineIndustries, colorMap } = useMemo(() => {
    const tiersInData = tiers.filter((t) =>
      records.some((r) => r.tier === t),
    )

    const lines = industries.filter((i) => i !== "All Industries")

    const colors: Record<string, string> = {}
    lines.forEach((ind, i) => {
      colors[ind] = INDUSTRY_COLORS[i % INDUSTRY_COLORS.length]
    })

    const data = tiersInData.map((tier) => {
      const row: Record<string, unknown> = { tier }
      for (const ind of lines) {
        const rec = records.find((r) => r.industry === ind && r.tier === tier)
        row[ind] = rec ? Math.round(rec.medianFrtMin) : null
      }
      return row
    })

    const config: ChartConfig = {}
    for (const ind of lines) {
      config[ind] = {
        label: ind,
        color: colors[ind],
      }
    }

    return {
      chartData: data,
      chartConfig: config,
      lineIndustries: lines,
      colorMap: colors,
    }
  }, [records, industries, dataset, tiers])

  if (loading || chartData.length === 0) {
    return (
      <div className="bg-card flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl w-full h-[250px] sm:h-[320px] md:h-[397px]">
        <p className="text-text-soft text-sm">
          {loading ? "Loading chart data…" : "No data available"}
        </p>
      </div>
    )
  }

  const selectedLine =
    industry !== "All Industries" ? industry : null
  const backgroundLines = lineIndustries.filter((i) => i !== industry)

  return (
    <div className="bg-card flex flex-col gap-6 sm:gap-8 md:gap-10 overflow-hidden p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl w-full">
      <div className="flex flex-col gap-0">
        <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
          First response time – by {axisLabel}
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-text-soft">
          Median first response time across all industries
          {selectedLine && (
            <>
              {" — "}
              <span style={{ color: colorMap[selectedLine], fontWeight: 500 }}>
                {selectedLine}
              </span>
              {" highlighted"}
            </>
          )}
        </p>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[250px] sm:h-[320px] md:h-[397px] w-full [&_.recharts-cartesian-axis-tick_text]:fill-[#696763]"
      >
        <LineChart
          data={chartData}
          margin={{ left: 0, bottom: 16, top: 4, right: 8 }}
        >
          <CartesianGrid
            strokeDasharray="0"
            stroke="var(--border-muted)"
            vertical={false}
          />
          <XAxis
            dataKey="tier"
            tickLine={false}
            axisLine={false}
            tick={{
              fill: "#696763",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
            }}
            tickMargin={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={formatTimeAxis}
            tick={{
              fill: "#696763",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
            }}
            width={36}
          />
          <ChartTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              // Sort: selected industry first, then by value descending
              const sorted = [...payload]
                .filter((p) => p.value != null)
                .sort((a, b) => {
                  if (a.name === selectedLine) return -1
                  if (b.name === selectedLine) return 1
                  return (b.value as number) - (a.value as number)
                })
              return (
                <div className="bg-white border border-border-muted rounded-lg shadow-md px-3 py-2">
                  <p className="font-medium text-xs text-text-primary mb-1.5">
                    {label}
                  </p>
                  <div className="flex flex-col gap-1">
                    {sorted.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className="size-2 rounded-sm shrink-0"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span
                          className={
                            entry.name === selectedLine
                              ? "text-text-primary font-medium"
                              : "text-text-soft"
                          }
                        >
                          {entry.name}
                        </span>
                        <span className="ml-auto font-mono text-text-primary">
                          {formatTimeAxis(entry.value as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }}
          />
          {/* Background lines: their own color but thinner + lower opacity */}
          {backgroundLines.map((ind) => (
            <Line
              key={ind}
              type="monotone"
              dataKey={ind}
              stroke={colorMap[ind]}
              strokeWidth={1.5}
              strokeOpacity={0.4}
              dot={false}
              connectNulls
              activeDot={false}
            />
          ))}
          {/* Selected industry: full opacity, thicker, on top */}
          {selectedLine && (
            <Line
              type="monotone"
              dataKey={selectedLine}
              stroke={colorMap[selectedLine]}
              strokeWidth={3}
              dot={false}
              connectNulls
              activeDot={{ r: 5, fill: colorMap[selectedLine] }}
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  )
}
