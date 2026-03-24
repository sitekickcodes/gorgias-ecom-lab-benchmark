export interface BenchmarkRecord {
  industry: string
  /** GMV tier (e.g. "$1M") or automation rate tier (e.g. "25%") */
  tier: string
  medianFrtMin: number
  p10FrtMin: number
  medianChatFrtMin: number
  medianEmailFrtMin: number
  medianResolutionTimeHrs: number
  p10ResolutionTimeHrs: number
  medianOneTouchRate: number
  p90OneTouchRate: number
  medianCsatScore: number
  medianCsatPositive: number
  medianMessagesPerTicket: number
  medianMonthlyTickets: number
  medianEmailShare: number
  medianChatShare: number
  aiAgentAutomationRate: number
  aiAgentSuccessRate: number
  aiAgentAdoptionRate: number
  saConversionRate: number
  saRevenueAttributed: number
  saAdoptionRate: number
  avgEstimatedGmv: number
  avgTotalAutomationRate: number
  medianTicketsPer100Orders: number
  medianCsatResponseRate: number
  topIntents: { intent: string; pct: number }[]
}

export type Dataset = "gmv" | "automation-rate"

/** GMV tiers in ascending order */
export const GMV_TIERS = [
  "$50K",
  "$100K",
  "$250K",
  "$500K",
  "$1M",
  "$2M",
  "$5M",
  "$10M",
  "$25M",
  "$50M",
  "$100M",
  "$250M",
  "$500M",
] as const

/** Automation rate tiers in ascending order */
export const AUTO_TIERS = [
  "0%",
  "5%",
  "10%",
  "15%",
  "20%",
  "25%",
  "30%",
  "35%",
  "40%",
  "45%",
  "50%",
  "55%",
  "60%",
  "65%",
  "70%",
  "75%",
  "80%",
  "85%",
  "90%",
  "95%",
  "100%",
] as const

export interface BenchmarkData {
  gmv: BenchmarkRecord[]
  auto: BenchmarkRecord[]
}

/** Convert tier label to numeric value */
export const GMV_VALUES: Record<string, number> = {
  "$50K": 50_000, "$100K": 100_000, "$250K": 250_000, "$500K": 500_000,
  "$1M": 1_000_000, "$2M": 2_000_000, "$5M": 5_000_000, "$10M": 10_000_000,
  "$25M": 25_000_000, "$50M": 50_000_000, "$100M": 100_000_000,
  "$250M": 250_000_000, "$500M": 500_000_000,
}

export const AUTO_VALUES: Record<string, number> = Object.fromEntries(
  AUTO_TIERS.map((t) => [t, parseFloat(t)]),
)

/** All numeric metric keys on BenchmarkRecord */
export const METRIC_KEYS = [
  "medianFrtMin", "p10FrtMin", "medianChatFrtMin", "medianEmailFrtMin",
  "medianResolutionTimeHrs", "p10ResolutionTimeHrs", "medianOneTouchRate",
  "p90OneTouchRate", "medianCsatScore", "medianCsatPositive",
  "medianMessagesPerTicket", "medianMonthlyTickets", "medianEmailShare",
  "medianChatShare", "aiAgentAutomationRate", "aiAgentSuccessRate",
  "aiAgentAdoptionRate", "saConversionRate", "saRevenueAttributed",
  "saAdoptionRate", "avgEstimatedGmv", "avgTotalAutomationRate",
  "medianTicketsPer100Orders", "medianCsatResponseRate",
] as const

/**
 * Interpolate a BenchmarkRecord at an arbitrary numeric position
 * between sorted records for a given industry.
 */
export function interpolateRecord(
  records: BenchmarkRecord[],
  position: number,
  tierToValue: Record<string, number>,
  logSpace: boolean,
): BenchmarkRecord | null {
  if (records.length === 0) return null
  if (records.length === 1) return records[0]

  const toX = (r: BenchmarkRecord) => {
    const v = tierToValue[r.tier] ?? 0
    return logSpace ? Math.log10(Math.max(v, 1)) : v
  }
  const x = logSpace ? Math.log10(Math.max(position, 1)) : position

  // Find the two records that bracket this position
  const sorted = [...records].sort((a, b) => toX(a) - toX(b))

  // Clamp to range
  if (x <= toX(sorted[0])) return sorted[0]
  if (x >= toX(sorted[sorted.length - 1])) return sorted[sorted.length - 1]

  let lo = sorted[0]
  let hi = sorted[1]
  for (let i = 1; i < sorted.length; i++) {
    if (toX(sorted[i]) >= x) {
      lo = sorted[i - 1]
      hi = sorted[i]
      break
    }
  }

  const loX = toX(lo)
  const hiX = toX(hi)
  const t = hiX === loX ? 0 : (x - loX) / (hiX - loX)

  // Lerp all numeric fields, pick nearest tier's intents
  const nearest = t <= 0.5 ? lo : hi
  const result = { ...lo, tier: "", topIntents: nearest.topIntents ?? [] } as BenchmarkRecord
  for (const key of METRIC_KEYS) {
    const a = lo[key] as number
    const b = hi[key] as number
    if (a != null && b != null) {
      (result as unknown as Record<string, number>)[key] = a + (b - a) * t
    }
  }
  return result
}
