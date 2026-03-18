import { StatCard } from "@/components/stat-card"
import { AiStatsChart } from "@/components/ai-stats-chart"
import { ResponseStatsChart } from "@/components/response-stats-chart"
import { IntentTag } from "@/components/intent-tag"
import {
  Tooltip,
  TooltipTrigger,
  MetricTooltipContent,
} from "@/components/tooltip"

export function StatGrids() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Response & Resolution + AI & Automation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
        <div className="flex flex-col gap-3">
          <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
            Response &amp; Resolution
          </h2>
          <ResponseStatsChart />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
            AI &amp; Automation
          </h2>
          <AiStatsChart />
        </div>
      </div>

      {/* Quality & Satisfaction */}
      <div className="flex flex-col gap-3 w-full">
        <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
          Quality &amp; Satisfaction
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
          <StatCard
            title="One-touch rate"
            value="27.3%"
            detail="Median"
            tooltip="% of tickets fully resolved with a single agent reply"
            highlight={{ value: "48.5%", label: "best" }}
          />
          <StatCard
            title="CSAT score"
            value="4.52"
            detail="Median (out of 5)"
            tooltip="Customer satisfaction score from post-interaction ratings, out of 5"
          />
          <StatCard
            title="NPS score"
            value="+11"
            detail="Net promoter score"
            tooltip="Net Promoter Score measuring how likely customers are to recommend the brand"
          />
          <StatCard
            title="Messages / ticket"
            value="3.3"
            detail="Median per ticket"
            tooltip="Median number of messages exchanged to resolve a single ticket"
          />
        </div>
      </div>

      {/* Volume & Efficiency */}
      <div className="flex flex-col gap-3 w-full">
        <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
          Volume &amp; Efficiency
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <StatCard
              title="Tickets / 100 orders"
              titleCase="upper"
              value="42.5"
              detail="Support intensity"
              tooltip="Number of support tickets generated per 100 orders placed"
            />
            <StatCard
              title="Utilization rate"
              titleCase="upper"
              value="53.3%"
              detail="Billable / allotted"
              tooltip="% of an agent's allotted support hours that were actively billed"
            />
          </div>
          <div className="bg-card flex flex-col items-start justify-between overflow-hidden p-6 rounded-2xl">
            <Tooltip>
              <TooltipTrigger
                render={<p />}
                className="text-sm sm:text-base leading-relaxed text-text-primary underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help mb-3"
              >
                Top Intents
              </TooltipTrigger>
              <MetricTooltipContent
                label="Top Intents"
                description="Most common reasons customers contacted support, ranked by ticket volume"
              />
            </Tooltip>
            <div className="flex flex-wrap gap-2 w-full">
              <IntentTag label="Order" value="43.6%" />
              <IntentTag label="Product" value="11.8%" />
              <IntentTag label="Return" value="10.9%" />
              <IntentTag label="Subscription" value="9.6%" />
              <IntentTag label="Shipping" value="9.4%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
