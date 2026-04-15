import { StatCard } from "@/components/stat-card"
import { useBenchmark } from "./benchmark-context"
import { formatTime, cn } from "@/lib/utils"

export function ResponseResolution() {
  const { currentRecord: r, loading, containerSize } = useBenchmark()

  const frtMin = r?.medianFrtMin ?? 0
  const chatFrtMin = r?.medianChatFrtMin ?? 0
  const emailFrtMin = r?.medianEmailFrtMin ?? 0
  const resolutionHrs = r?.medianResolutionTimeHrs ?? 0

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
        Response &amp; Resolution
      </h2>
      <div className={cn("grid gap-3 sm:gap-4 w-full", containerSize === "md" ? "grid-cols-4" : "grid-cols-2")}>
        <StatCard
          title="First response time"
          value={loading ? "—" : formatTime(frtMin)}
          detail="All channels"
          tooltip="Median per-account first response time over the 90-day benchmark window."
          topPerformer={!loading && r?.p10FrtMin ? formatTime(r.p10FrtMin) : undefined}
        />
        <StatCard
          title="Chat FRT"
          value={loading ? "—" : formatTime(chatFrtMin)}
          detail="Chat channel"
          tooltip="Median per-account first response time for chat tickets only."
          topPerformer={!loading && r?.p10ChatFrtMin ? formatTime(r.p10ChatFrtMin) : undefined}
        />
        <StatCard
          title="Email FRT"
          value={loading ? "—" : formatTime(emailFrtMin)}
          detail="Email channel"
          tooltip="Median per-account first response time for email tickets only."
          topPerformer={!loading && r?.p10EmailFrtMin ? formatTime(r.p10EmailFrtMin) : undefined}
        />
        <StatCard
          title="Resolution time"
          value={loading ? "—" : formatTime(resolutionHrs * 60)}
          detail="Creation to close"
          tooltip="Median per-account resolution time over the 90-day benchmark window."
          topPerformer={!loading && r?.p10ResolutionTimeHrs ? formatTime(r.p10ResolutionTimeHrs * 60) : undefined}
        />
      </div>
    </div>
  )
}
