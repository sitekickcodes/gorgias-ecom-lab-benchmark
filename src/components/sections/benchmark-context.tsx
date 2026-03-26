import { createContext, useContext, useState, useMemo, useEffect, useRef } from "react"
import { useBenchmarkData } from "@/lib/use-benchmark-data"
import type { BenchmarkRecord, Dataset } from "@/lib/types"
import {
  GMV_TIERS,
  AUTO_TIERS,
  GMV_VALUES,
  AUTO_VALUES,
  interpolateRecord,
} from "@/lib/types"

interface BenchmarkContextValue {
  loading: boolean
  error: string | null
  dataset: Dataset
  setDataset: (d: Dataset) => void
  industry: string
  setIndustry: (industry: string) => void
  /** Continuous numeric slider position */
  sliderValue: number
  setSliderValue: (v: number) => void
  /** Display label for the current slider position */
  sliderLabel: string
  /** The interpolated record at the current slider position */
  currentRecord: BenchmarkRecord | null
  /** All industries available in the active dataset */
  industries: string[]
  /** All records for the selected industry, sorted by tier */
  industryRecords: BenchmarkRecord[]
  /** All records for "All Industries" in the active dataset, sorted by tier */
  allIndustriesRecords: BenchmarkRecord[]
  /** All records in the active dataset */
  records: BenchmarkRecord[]
  /** Container width breakpoint: "sm" (< 700px) or "md" (>= 700px) */
  containerSize: "sm" | "md"
  /** Ref to attach to the benchmark root div for width measurement */
  containerRef: React.RefObject<HTMLDivElement | null>
}

// GMV slider range in log10 space: $50K to $500M
const GMV_MIN = Math.log10(50_000)
const GMV_MAX = Math.log10(500_000_000)
// Auto slider range: 0 to 100
const AUTO_MIN = 0
const AUTO_MAX = 100

function gmvSliderToValue(pct: number): number {
  return Math.pow(10, GMV_MIN + (pct / 100) * (GMV_MAX - GMV_MIN))
}

function autoSliderToValue(pct: number): number {
  return AUTO_MIN + (pct / 100) * (AUTO_MAX - AUTO_MIN)
}

function formatGmvLabel(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`
  return `$${Math.round(value)}`
}

function formatAutoLabel(value: number): string {
  return `${Math.round(value)}%`
}

const BenchmarkContext = createContext<BenchmarkContextValue>({
  loading: true,
  error: null,
  dataset: "gmv",
  setDataset: () => {},
  industry: "All Industries",
  setIndustry: () => {},
  sliderValue: 50,
  setSliderValue: () => {},
  sliderLabel: "$5M",
  currentRecord: null,
  industries: [],
  industryRecords: [],
  allIndustriesRecords: [],
  records: [],
  containerSize: "md",
  containerRef: { current: null },
})

const TIER_ORDER: Record<Dataset, readonly string[]> = {
  gmv: GMV_TIERS,
  "automation-rate": AUTO_TIERS,
}

const TIER_VALUES: Record<Dataset, Record<string, number>> = {
  gmv: GMV_VALUES,
  "automation-rate": AUTO_VALUES,
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
  const [gmvSlider, setGmvSlider] = useState(50)
  const [autoSlider, setAutoSlider] = useState(25)

  // Container width measurement for responsive grids inside embeds
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState<"sm" | "md">("md")

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = () => setContainerSize(el.offsetWidth >= 700 ? "md" : "sm")
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const sliderValue = dataset === "gmv" ? gmvSlider : autoSlider
  const setSliderValue = dataset === "gmv" ? setGmvSlider : setAutoSlider

  const setDataset = (d: Dataset) => setDatasetRaw(d)

  const records = dataset === "gmv" ? data.gmv : data.auto

  // Convert slider percentage to actual axis value
  const axisValue = useMemo(() => {
    return dataset === "gmv"
      ? gmvSliderToValue(sliderValue)
      : autoSliderToValue(sliderValue)
  }, [dataset, sliderValue])

  const sliderLabel = useMemo(() => {
    return dataset === "gmv"
      ? formatGmvLabel(axisValue)
      : formatAutoLabel(axisValue)
  }, [dataset, axisValue])

  const industries = useMemo(() => {
    const set = new Set(records.map((r) => r.industry))
    const sorted = [...set].filter((i) => i !== "All Industries").sort()
    if (set.has("All Industries")) sorted.unshift("All Industries")
    return sorted
  }, [records])

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

  // Interpolate the current record at the slider position
  const currentRecord = useMemo(() => {
    const industryData = records.filter((r) => r.industry === industry)
    if (industryData.length === 0) return null
    return interpolateRecord(
      industryData,
      axisValue,
      TIER_VALUES[dataset],
      dataset === "gmv",
    )
  }, [records, industry, axisValue, dataset])

  return (
    <BenchmarkContext.Provider
      value={{
        loading,
        error,
        dataset,
        setDataset,
        industry,
        setIndustry,
        sliderValue,
        setSliderValue,
        sliderLabel,
        currentRecord,
        industries,
        industryRecords,
        allIndustriesRecords,
        records,
        containerSize,
        containerRef,
      }}
    >
      {children}
    </BenchmarkContext.Provider>
  )
}

export function useBenchmark() {
  return useContext(BenchmarkContext)
}
