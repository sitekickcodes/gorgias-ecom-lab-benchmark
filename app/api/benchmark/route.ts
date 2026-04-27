import { NextResponse } from "next/server"
import { getBenchmarkData } from "@/lib/get-benchmark-data"

// Cached for 1 year at the edge — the Airtable webhook calls revalidatePath
// to purge on actual data changes, so time-based expiry is unnecessary.
// Also tagged internally (via getBenchmarkData) so revalidateTag invalidates
// the underlying Airtable fetches shared with the server-rendered pages.
const ONE_YEAR = 31_536_000

// Embedded on third-party origins (Webflow, etc.), so every response —
// including errors — must carry CORS headers, otherwise the browser hides
// 5xx responses behind an opaque "TypeError: Failed to fetch".
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
} as const

export async function GET() {
  try {
    const data = await getBenchmarkData()
    return NextResponse.json(data, {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": `public, s-maxage=${ONE_YEAR}, stale-while-revalidate=604800`,
      },
    })
  } catch (error) {
    console.error("Failed to fetch benchmark data:", error)
    const message =
      error instanceof Error && error.message === "Missing AIRTABLE env vars"
        ? error.message
        : "Failed to fetch data"
    return NextResponse.json(
      { error: message },
      { status: 500, headers: CORS_HEADERS },
    )
  }
}
