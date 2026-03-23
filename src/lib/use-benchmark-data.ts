import { useState, useEffect } from "react"
import type { BenchmarkData } from "./types"

const CACHE_KEY = "gorgias-benchmark-data"
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

function readCache(): BenchmarkData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function writeCache(data: BenchmarkData) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    )
  } catch {
    // storage full or unavailable — ignore
  }
}

const initial = readCache()

export function useBenchmarkData() {
  const [data, setData] = useState<BenchmarkData>(
    initial ?? { gmv: [], auto: [] },
  )
  const [loading, setLoading] = useState(initial === null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) return

    fetch("/api/benchmark")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        writeCache(json)
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch benchmark data:", err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
