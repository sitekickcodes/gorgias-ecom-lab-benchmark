import { StatCard } from "@/components/stat-card"
import { useBenchmark } from "./benchmark-context"

function formatTime(minutes: number): string {
  if (minutes >= 60) {
    const hrs = minutes / 60
    return hrs % 1 === 0 ? `${hrs}h` : `${hrs.toFixed(1)}h`
  }
  const m = Math.round(minutes)
  return `${m}m`
}

export function ResponseResolution() {
  const { currentRecord: r, loading } = useBenchmark()

  const frtMin = r?.medianFrtMin ?? 0
  const chatFrtMin = r?.medianChatFrtMin ?? 0
  const emailFrtMin = r?.medianEmailFrtMin ?? 0
  const resolutionHrs = r?.medianResolutionTimeHrs ?? 0

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full">
      <h2 className="font-sans font-normal text-lg sm:text-xl leading-relaxed text-text-primary">
        Response &amp; Resolution
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
        <StatCard
          title="First response time"
          value={loading ? "—" : formatTime(frtMin)}
          detail="All channels"
          tooltip="Median per-account first response time over the 90-day benchmark window, then median across accounts in each bucket and industry."
        />
        <StatCard
          title="Chat FRT"
          value={loading ? "—" : formatTime(chatFrtMin)}
          detail="Chat channel"
          tooltip="Median per-account first response time for chat tickets only."
        />
        <StatCard
          title="Email FRT"
          value={loading ? "—" : formatTime(emailFrtMin)}
          detail="Email channel"
          tooltip="Median per-account first response time for email tickets only."
        />
        <StatCard
          title="Resolution time"
          value={loading ? "—" : formatTime(resolutionHrs * 60)}
          detail="Creation to close"
          tooltip="Median per-account resolution time over the 90-day benchmark window, then median across accounts."
        />
      </div>
    </div>
  )
}
