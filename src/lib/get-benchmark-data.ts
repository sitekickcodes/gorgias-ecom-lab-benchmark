import "server-only"
import { unstable_cache } from "next/cache"
import {
  GMV_TABLE_ID,
  AUTO_TABLE_ID,
  GMV_FIELD_MAP,
  AUTO_FIELD_MAP,
  fetchTable,
} from "./airtable"
import type { BenchmarkData, BenchmarkRecord } from "./types"

export const BENCHMARK_CACHE_TAG = "benchmark"

// Cache the AGGREGATE result, not each paginated Airtable request.
// Airtable's `offset` pagination tokens expire after a few hours, so caching
// individual page responses with `revalidate: false` left us holding a stale
// offset whenever any one page entry got evicted while its predecessor stuck
// around — leading to LIST_RECORDS_ITERATOR_NOT_AVAILABLE 422s on the next
// re-fetch. Caching the assembled result means the chained-pagination loop
// runs to completion atomically on every cache miss, and the offsets never
// outlive the request that created them.
//
// Webhook-driven invalidation still works: revalidateTag(BENCHMARK_CACHE_TAG)
// drops this cache entry and the next request rebuilds it from a fresh
// pagination chain.
export const getBenchmarkData = unstable_cache(
  async (): Promise<BenchmarkData> => {
    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID
    if (!apiKey || !baseId) {
      throw new Error("Missing AIRTABLE env vars")
    }

    const [gmv, auto] = await Promise.all([
      fetchTable(apiKey, baseId, GMV_TABLE_ID, GMV_FIELD_MAP),
      fetchTable(apiKey, baseId, AUTO_TABLE_ID, AUTO_FIELD_MAP),
    ])

    return {
      gmv: gmv as unknown as BenchmarkRecord[],
      auto: auto as unknown as BenchmarkRecord[],
    }
  },
  ["benchmark-data"],
  { tags: [BENCHMARK_CACHE_TAG], revalidate: false },
)
