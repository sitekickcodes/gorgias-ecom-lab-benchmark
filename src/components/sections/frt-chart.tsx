import { useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/chart"
import {
  Tooltip,
  TooltipTrigger,
  MetricTooltipContent,
} from "@/components/tooltip"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { useBenchmark } from "./benchmark-context"
import { GMV_TIERS, AUTO_TIERS } from "@/lib/types"
import type { Dataset, BenchmarkRecord } from "@/lib/types"
import { formatTime } from "@/lib/utils"

const INDUSTRY_COLORS = [
  "#7C6FEB",
  "#E8733A",
  "#2D9B83",
  "#D94B7B",
  "#4E88FB",
  "#B5A33E",
  "#9B5DE5",
  "#F15BB5",
  "#00BBF9",
  "#6A994E",
  "#BC4749",
  "#E09F3E",
  "#5B8E7D",
  "#7B2D8E",
  "#F48C06",
  "#277DA1",
]

const TIER_ORDER: Record<Dataset, readonly string[]> = {
  gmv: GMV_TIERS,
  "automation-rate": AUTO_TIERS,
}

interface MetricOption {
  key: keyof BenchmarkRecord
  label: string
  format: "time" | "percent" | "number" | "currency"
  tooltip: string
  /** If true, lower values are better (sort ascending in tooltip) */
  lowerIsBetter?: boolean
}

// Ordered to match dashboard sections: Response & Resolution → Quality → Volume & Channels → AI
const METRIC_OPTIONS: MetricOption[] = [
  // Response & Resolution
  { key: "medianFrtMin", label: "First response time", format: "time", tooltip: "Median per-account first response time over the 90-day benchmark window, then median across accounts in each bucket and industry.", lowerIsBetter: true },
  { key: "medianChatFrtMin", label: "Chat FRT", format: "time", tooltip: "Median per-account first response time for chat tickets only.", lowerIsBetter: true },
  { key: "medianEmailFrtMin", label: "Email FRT", format: "time", tooltip: "Median per-account first response time for email tickets only.", lowerIsBetter: true },
  { key: "medianResolutionTimeHrs", label: "Resolution time", format: "time", tooltip: "Median per-account resolution time over the 90-day benchmark window, then median across accounts.", lowerIsBetter: true },
  // Quality & Satisfaction
  { key: "medianOneTouchRate", label: "One-touch rate", format: "percent", tooltip: "Median account-level share of tickets resolved in one touch." },
  { key: "medianCsatScore", label: "CSAT score", format: "number", tooltip: "Median account-level average CSAT score. Only tickets with non-null survey scores contribute." },
  { key: "medianCsatPositive", label: "CSAT positive", format: "percent", tooltip: "Median account-level positive CSAT rate. Positive means survey score 4 or 5." },
  { key: "medianMessagesPerTicket", label: "Messages / ticket", format: "number", tooltip: "Median account-level median ticket message count.", lowerIsBetter: true },
  // Volume & Channels
  { key: "medianMonthlyTickets", label: "Monthly tickets", format: "number", tooltip: "Median account-level average monthly ticket volume inside the 90-day window." },
  { key: "medianTicketsPer100Orders", label: "Support intensity", format: "number", tooltip: "Median account-level billed ticket volume normalized per 100 orders.", lowerIsBetter: true },
  { key: "medianEmailShare", label: "Email share", format: "percent", tooltip: "Median account-level share of tickets created via email." },
  { key: "medianChatShare", label: "Chat share", format: "percent", tooltip: "Median account-level share of tickets created via chat." },
  { key: "medianCsatResponseRate", label: "CSAT response rate", format: "percent", tooltip: "Median account-level response rate to sent CSAT surveys." },
  // AI Adoption
  { key: "aiAgentAdoptionRate", label: "Adoption rate", format: "percent", tooltip: "Share of accounts in this segment with AI Agent enabled and active." },
  { key: "aiAgentAutomationRate", label: "Resolution rate", format: "percent", tooltip: "Among AI adopters, the median share of tickets fully resolved by AI Agent without human intervention." },
  { key: "aiAgentSuccessRate", label: "Success rate", format: "percent", tooltip: "Among AI-covered tickets, the median share successfully handled (billed). Spam tickets excluded from denominator unless billed." },
  { key: "saConversionRate", label: "Conversion rate", format: "percent", tooltip: "Median Shopping Assistant conversion rate among active SA accounts. Measures orders influenced per SA conversation." },
  { key: "saAdoptionRate", label: "SA adoption rate", format: "percent", tooltip: "Share of accounts in this segment with active Shopping Assistant usage (conversion rate > 0)." },
]

function formatValue(value: number, format: MetricOption["format"]): string {
  switch (format) {
    case "time":
      // Resolution time is in hours, others in minutes
      return formatTime(value)
    case "percent":
      return `${value.toFixed(1)}%`
    case "currency":
      return value >= 1_000_000
        ? `$${(value / 1_000_000).toFixed(1)}M`
        : value >= 1_000
          ? `$${Math.round(value / 1_000)}K`
          : `$${Math.round(value)}`
    default:
      return value.toFixed(1)
  }
}

function formatAxis(value: number, format: MetricOption["format"]): string {
  switch (format) {
    case "time": {
      if (value < 1) return `${Math.round(value * 60)}s`
      if (value < 60) return `${Math.round(value)}m`
      const h = Math.round((value / 60) * 2) / 2
      return h % 1 === 0 ? `${h}h` : `${h.toFixed(1)}h`
    }
    case "percent":
      return `${Math.round(value)}%`
    case "currency":
      return value >= 1_000_000
        ? `$${(value / 1_000_000).toFixed(0)}M`
        : `$${Math.round(value / 1_000)}K`
    default:
      return value.toLocaleString()
  }
}

export function FrtChart() {
  const { records, industries, industry, dataset, loading } = useBenchmark()
  const [metricKey, setMetricKey] = useState<string>("medianFrtMin")
  const metric = METRIC_OPTIONS.find((m) => m.key === metricKey) ?? METRIC_OPTIONS[0]
  const axisLabel = dataset === "gmv" ? "Annual sales" : "Automation Rate"
  const tiers = TIER_ORDER[dataset]

  // For resolution time, convert hours to minutes for consistent time formatting
  const isResolution = metricKey === "medianResolutionTimeHrs"

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
        if (rec) {
          let val = rec[metric.key as keyof BenchmarkRecord] as number
          // Convert resolution hours to minutes for time formatting
          if (isResolution && val != null) val = val * 60
          row[ind] = val != null ? Math.round(val * 100) / 100 : null
        } else {
          row[ind] = null
        }
      }
      return row
    })

    const config: ChartConfig = {}
    for (const ind of lines) {
      config[ind] = { label: ind, color: colors[ind] }
    }

    return { chartData: data, chartConfig: config, lineIndustries: lines, colorMap: colors }
  }, [records, industries, dataset, tiers, metric.key, isResolution])

  if (loading || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[250px] sm:h-[320px] md:h-[397px]">
        <p className="text-text-soft text-sm">
          {loading ? "Loading chart data…" : "No data available"}
        </p>
      </div>
    )
  }

  const selectedLine = industry !== "All Industries" ? industry : null
  const backgroundLines = lineIndustries.filter((i) => i !== industry)
  const fmtForAxis = (v: number) => formatAxis(v, isResolution ? "time" : metric.format)
  const fmtForTooltip = (v: number) => formatValue(v, isResolution ? "time" : metric.format)

  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-0">
        <h3 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
          <Tooltip>
            <TooltipTrigger render={<span />} className="inline">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1 underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-pointer hover:text-text-primary transition-colors">
                  {metric.label} – by {axisLabel}
                  <ChevronDown className="size-4 shrink-0" />
                </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={metricKey}
                onValueChange={setMetricKey}
              >
                {METRIC_OPTIONS.map((opt) => (
                  <DropdownMenuRadioItem key={opt.key} value={opt.key}>
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <MetricTooltipContent label={metric.label} description={metric.tooltip} />
          </Tooltip>
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-text-soft">
          {selectedLine ? (
            <>
              <span style={{ color: colorMap[selectedLine], fontWeight: 500 }}>
                {selectedLine}
              </span>
              {" highlighted"}
            </>
          ) : (
            "All industries compared"
          )}
        </p>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[280px] sm:h-[350px] md:h-[420px] w-full [&_.recharts-cartesian-axis-tick_text]:fill-[#696763]"
      >
        <LineChart
          data={chartData}
          margin={{ left: 8, bottom: 24, top: 4, right: 8 }}
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
            tick={{ fill: "#696763", fontSize: 12, fontFamily: "var(--font-mono)" }}
            tickMargin={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={fmtForAxis}
            tick={{ fill: "#696763", fontSize: 12, fontFamily: "var(--font-mono)" }}
            width={42}
          />
          <ChartTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const sorted = [...payload]
                .filter((p) => p.value != null)
                .sort((a, b) => {
                  if (a.name === selectedLine) return -1
                  if (b.name === selectedLine) return 1
                  return metric.lowerIsBetter
                    ? (a.value as number) - (b.value as number)
                    : (b.value as number) - (a.value as number)
                })
              return (
                <div className="bg-[#FDFCFB] border border-border-soft rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] px-3.5 py-3">
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
                          {fmtForTooltip(entry.value as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }}
          />
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
