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

export function useBenchmarkData(initialData?: BenchmarkData) {
  const hasInitial = !!initialData
  const [data, setData] = useState<BenchmarkData>(
    initialData ?? { gmv: [], auto: [] },
  )
  const [loading, setLoading] = useState(!hasInitial)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Server-rendered data is already fresh — Next.js cache is invalidated
    // via revalidateTag on Airtable webhook, so we don't need to re-fetch
    // on mount. Skip the client flow entirely.
    if (hasInitial) return

    // Check cache after mount — reading sessionStorage at module init would
    // desync SSR (always null) from client (may have data), causing hydration mismatch.
    // The setState-in-effect lint rule doesn't apply here: we're syncing from an
    // external store (sessionStorage), which is exactly what effects are for.
    const cached = readCache()
    if (cached) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(cached.data)
      setLoading(false)
      if (cached.fresh) return
    }

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
  }, [hasInitial])

  return { data, loading, error }
}
