import { createContext, useContext, useState, useMemo } from "react"
import { useBenchmarkData } from "@/lib/use-benchmark-data"
import type { BenchmarkRecord, Dataset } from "@/lib/types"
import { GMV_TIERS, AUTO_TIERS } from "@/lib/types"

interface BenchmarkContextValue {
  loading: boolean
  error: string | null
  dataset: Dataset
  setDataset: (d: Dataset) => void
  industry: string
  setIndustry: (industry: string) => void
  tier: string
  setTier: (tier: string) => void
  /** The record matching the current industry + tier selection */
  currentRecord: BenchmarkRecord | null
  /** All industries available in the active dataset */
  industries: string[]
  /** Tiers available for the selected industry in the active dataset */
  availableTiers: string[]
  /** All records for the selected industry, sorted by tier */
  industryRecords: BenchmarkRecord[]
  /** All records for "All Industries" in the active dataset, sorted by tier */
  allIndustriesRecords: BenchmarkRecord[]
  /** All records in the active dataset */
  records: BenchmarkRecord[]
}

const BenchmarkContext = createContext<BenchmarkContextValue>({
  loading: true,
  error: null,
  dataset: "gmv",
  setDataset: () => {},
  industry: "All Industries",
  setIndustry: () => {},
  tier: "$1M",
  setTier: () => {},
  currentRecord: null,
  industries: [],
  availableTiers: [],
  industryRecords: [],
  allIndustriesRecords: [],
  records: [],
})

const TIER_ORDER: Record<Dataset, readonly string[]> = {
  gmv: GMV_TIERS,
  "automation-rate": AUTO_TIERS,
}

function tierSorter(dataset: Dataset) {
  const order = TIER_ORDER[dataset]
  return (a: BenchmarkRecord, b: BenchmarkRecord) =>
    order.indexOf(a.tier) - order.indexOf(b.tier)
}

export function BenchmarkProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useBenchmarkData()
  const [dataset, setDatasetRaw] = useState<Dataset>("gmv")
  const [industry, setIndustry] = useState("All Industries")
  const [gmvTier, setGmvTier] = useState("$1M")
  const [autoTier, setAutoTier] = useState("25%")

  const tier = dataset === "gmv" ? gmvTier : autoTier
  const setTier = dataset === "gmv" ? setGmvTier : setAutoTier

  // When switching datasets, keep industry but don't reset tier
  const setDataset = (d: Dataset) => setDatasetRaw(d)

  const records = dataset === "gmv" ? data.gmv : data.auto

  const industries = useMemo(() => {
    const set = new Set(records.map((r) => r.industry))
    const sorted = [...set].filter((i) => i !== "All Industries").sort()
    if (set.has("All Industries")) sorted.unshift("All Industries")
    return sorted
  }, [records])

  const availableTiers = useMemo(() => {
    const tiers = records
      .filter((r) => r.industry === industry)
      .map((r) => r.tier)
    const order = TIER_ORDER[dataset]
    return order.filter((t) => tiers.includes(t)) as string[]
  }, [records, industry, dataset])

  const currentRecord = useMemo(() => {
    return (
      records.find((r) => r.industry === industry && r.tier === tier) ?? null
    )
  }, [records, industry, tier])

  const industryRecords = useMemo(() => {
    return records
      .filter((r) => r.industry === industry)
      .sort(tierSorter(dataset))
  }, [records, industry, dataset])

  const allIndustriesRecords = useMemo(() => {
    return records
      .filter((r) => r.industry === "All Industries")
      .sort(tierSorter(dataset))
  }, [records, dataset])

  return (
    <BenchmarkContext.Provider
      value={{
        loading,
        error,
        dataset,
        setDataset,
        industry,
        setIndustry,
        tier,
        setTier,
        currentRecord,
        industries,
        availableTiers,
        industryRecords,
        allIndustriesRecords,
        records,
      }}
    >
      {children}
    </BenchmarkContext.Provider>
  )
}

export function useBenchmark() {
  return useContext(BenchmarkContext)
}
