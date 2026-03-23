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
