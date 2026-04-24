import "server-only"
import {
  GMV_TABLE_ID,
  AUTO_TABLE_ID,
  GMV_FIELD_MAP,
  AUTO_FIELD_MAP,
  fetchTable,
} from "./airtable"
import type { BenchmarkData, BenchmarkRecord } from "./types"

export const BENCHMARK_CACHE_TAG = "benchmark"

// Cached indefinitely (revalidate: false) and invalidated on-demand by the
// Airtable webhook via revalidateTag(BENCHMARK_CACHE_TAG).
export async function getBenchmarkData(): Promise<BenchmarkData> {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  if (!apiKey || !baseId) {
    throw new Error("Missing AIRTABLE env vars")
  }

  const cacheOpts: RequestInit = {
    next: { tags: [BENCHMARK_CACHE_TAG], revalidate: false },
  }

  const [gmv, auto] = await Promise.all([
    fetchTable(apiKey, baseId, GMV_TABLE_ID, GMV_FIELD_MAP, cacheOpts),
    fetchTable(apiKey, baseId, AUTO_TABLE_ID, AUTO_FIELD_MAP, cacheOpts),
  ])

  return {
    gmv: gmv as unknown as BenchmarkRecord[],
    auto: auto as unknown as BenchmarkRecord[],
  }
}
