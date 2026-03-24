import { StatCard } from "@/components/stat-card"
import { IntentTag } from "@/components/intent-tag"
import {
  Tooltip,
  TooltipTrigger,
  MetricTooltipContent,
} from "@/components/tooltip"
import { useBenchmark } from "./benchmark-context"

function fmt(n: number | undefined, decimals = 1): string {
  if (n == null) return "—"
  return n.toFixed(decimals)
}

function formatTickets(n: number | undefined): string {
  if (n == null) return "—"
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toFixed(0)
}

export function StatGrids() {
  const { currentRecord: r, loading } = useBenchmark()

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Quality & Satisfaction */}
      <div className="flex flex-col gap-3 w-full">
        <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
          Quality &amp; Satisfaction
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
          <StatCard
            title="One-touch rate"
            value={loading ? "—" : `${fmt(r?.medianOneTouchRate)}%`}
            detail="Single reply resolved"
            tooltip="Median account-level share of tickets resolved in one touch."
          />
          <StatCard
            title="CSAT score"
            value={loading ? "—" : fmt(r?.medianCsatScore, 2)}
            detail="Out of 5"
            tooltip="Median account-level average CSAT score. Only tickets with non-null survey scores contribute."
          />
          <StatCard
            title="CSAT positive"
            value={loading ? "—" : `${fmt(r?.medianCsatPositive)}%`}
            detail="Score 4 or 5"
            tooltip="Median account-level positive CSAT rate. Positive means survey score 4 or 5."
          />
          <StatCard
            title="Messages / ticket"
            value={loading ? "—" : fmt(r?.medianMessagesPerTicket, 1)}
            detail="Per conversation"
            tooltip="Median account-level median ticket message count."
          />
        </div>
      </div>

      {/* Volume & Channels */}
      <div className="flex flex-col gap-3 w-full">
        <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
          Volume &amp; Channels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
          <StatCard
            title="Monthly tickets"
            value={loading ? "—" : formatTickets(r?.medianMonthlyTickets)}
            detail="Per month average"
            tooltip="Median account-level average monthly ticket volume inside the 90-day window."
          />
          <StatCard
            title="Support intensity"
            value={loading ? "—" : fmt(r?.medianTicketsPer100Orders, 1)}
            detail="Tickets / 100 orders"
            tooltip="Median account-level billed ticket volume normalized per 100 orders."
          />
          <StatCard
            title="Email share"
            value={loading ? "—" : `${fmt(r?.medianEmailShare)}%`}
            detail="Tickets via email"
            tooltip="Median account-level share of tickets created via email."
          />
          <StatCard
            title="Chat share"
            value={loading ? "—" : `${fmt(r?.medianChatShare)}%`}
            detail="Tickets via chat"
            tooltip="Median account-level share of tickets created via chat."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
          <StatCard
            title="CSAT response rate"
            value={loading ? "—" : `${fmt(r?.medianCsatResponseRate)}%`}
            detail="Surveys answered"
            tooltip="Median account-level response rate to sent CSAT surveys."
          />
          <div className="bg-card flex flex-col items-start justify-between overflow-hidden p-6 rounded-2xl">
            <Tooltip>
              <TooltipTrigger
                render={<span />}
                className="text-sm sm:text-base leading-relaxed text-text-primary underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help mb-3 block"
              >
                Top Intents
              </TooltipTrigger>
              <MetricTooltipContent
                label="Top Intents"
                description="Most common reasons customers contacted support, ranked by ticket volume."
              />
            </Tooltip>
            <div className="flex flex-wrap gap-2 w-full">
              {(r?.topIntents ?? [])
                .filter((i) => i.pct >= 2)
                .slice(0, 5)
                .map((i) => (
                  <IntentTag
                    key={i.intent}
                    label={i.intent}
                    value={`${i.pct.toFixed(1)}%`}
                  />
                ))}
              {(!r?.topIntents || r.topIntents.length === 0) && !loading && (
                <span className="text-sm text-text-soft">No intent data</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
