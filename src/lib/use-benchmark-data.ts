import { useState, useEffect } from "react"
import type { BenchmarkData } from "./types"

// Versioned cache key — prevents stale data when embed version changes
const CACHE_VERSION = "2"
const CACHE_KEY = `gorgias-benchmark-v${CACHE_VERSION}`
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

function readCache(): { data: BenchmarkData; fresh: boolean } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    return { data, fresh: Date.now() - timestamp < CACHE_TTL }
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

const cached = readCache()

export function useBenchmarkData() {
  const [data, setData] = useState<BenchmarkData>(
    cached?.data ?? { gmv: [], auto: [] },
  )
  // Only show loading if we have absolutely no data
  const [loading, setLoading] = useState(cached === null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Skip fetch entirely if cache is fresh
    if (cached?.fresh) return

    // Use embed origin for absolute URL when embedded on external sites
    const origin =
      (window as unknown as Record<string, string>).__GORGIAS_EMBED_ORIGIN__ || ""
    fetch(`${origin}/api/benchmark`)
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
