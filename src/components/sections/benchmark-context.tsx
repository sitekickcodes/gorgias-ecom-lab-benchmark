import { createContext, useContext, useState } from "react"

export type BenchmarkMetric = "approximate-gmv" | "orders"

interface BenchmarkContextValue {
  metric: BenchmarkMetric
  setMetric: (metric: BenchmarkMetric) => void
}

const BenchmarkContext = createContext<BenchmarkContextValue>({
  metric: "approximate-gmv",
  setMetric: () => {},
})

export function BenchmarkProvider({ children }: { children: React.ReactNode }) {
  const [metric, setMetric] = useState<BenchmarkMetric>("approximate-gmv")
  return (
    <BenchmarkContext.Provider value={{ metric, setMetric }}>
      {children}
    </BenchmarkContext.Provider>
  )
}

export function useBenchmarkMetric() {
  return useContext(BenchmarkContext)
}
