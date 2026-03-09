import { StatCard } from "@/components/stat-card"
import { AiStatCard } from "@/components/ai-stat-card"
import { IntentTag } from "@/components/intent-tag"

export function StatGrids() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Quality & Satisfaction */}
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-lg sm:text-xl leading-relaxed text-text-primary">
          Quality &amp; Satisfaction
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
          <StatCard
            title="One-touch rate"
            value="27.3%"
            detail="Median"
            highlight={{ value: "48.5%", label: "best" }}
          />
          <StatCard
            title="CSAT score"
            value="4.52"
            detail="Median (out of 5)"
          />
          <StatCard
            title="NPS score"
            value="+11"
            detail="Net promoter score"
          />
          <StatCard
            title="Messages / ticket"
            value="3.3"
            detail="Median per ticket"
          />
        </div>
      </div>

      {/* Response & Resolution */}
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-lg sm:text-xl leading-relaxed text-text-primary">
          Response &amp; Resolution
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
          <StatCard
            title="Chat FRT"
            value="45.0m"
            detail="Median chat channel"
          />
          <StatCard
            title="Email FRT"
            value="9.0h"
            detail="Median email channel"
          />
          <StatCard
            title="Email FRT"
            value="9.0h"
            detail="Median email channel"
          />
          <StatCard
            title="Resolution time"
            value="20.2h"
            detail="Median"
            highlight={{ value: "3.6h", label: "best" }}
          />
        </div>
      </div>

      {/* AI & Automation */}
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-lg sm:text-xl leading-relaxed text-text-primary">
          AI &amp; Automation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
          <AiStatCard
            title="AI Agent Rate"
            value="0.0%"
            percentage={0}
            detail="Median ai-handled %"
          />
          <AiStatCard
            title="AI Success Rate"
            value="30.8%"
            percentage={30.8}
            detail="% with ai agent enabled"
          />
          <AiStatCard
            title="AI Adoption"
            value="21.3%"
            percentage={21.3}
            detail="% with ai agent enabled"
          />
          <AiStatCard
            title="SA Conversion"
            value="11.73%"
            percentage={11.73}
            detail="Shopping assistant cvr"
          />
        </div>
      </div>

      {/* Volume & Efficiency */}
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-lg sm:text-xl leading-relaxed text-text-primary">
          Volume &amp; Efficiency
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <StatCard
              title="Tickets / 100 orders"
              titleCase="upper"
              value="42.5"
              detail="Support intensity"
            />
            <StatCard
              title="Utilization rate"
              titleCase="upper"
              value="53.3%"
              detail="Billable / allotted"
            />
          </div>
          <div className="bg-card flex flex-col items-start justify-between overflow-hidden p-6 rounded-2xl">
            <p className="font-medium text-base tracking-wide uppercase text-text-primary">
              Top Intents
            </p>
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
