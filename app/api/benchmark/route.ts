import { NextResponse } from "next/server"
import {
  GMV_TABLE_ID,
  AUTO_TABLE_ID,
  GMV_FIELD_MAP,
  AUTO_FIELD_MAP,
  fetchTable,
} from "@/lib/airtable"

export async function GET() {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!apiKey || !baseId) {
    return NextResponse.json(
      { error: "Missing AIRTABLE env vars" },
      { status: 500 },
    )
  }

  try {
    const [gmv, auto] = await Promise.all([
      fetchTable(apiKey, baseId, GMV_TABLE_ID, GMV_FIELD_MAP),
      fetchTable(apiKey, baseId, AUTO_TABLE_ID, AUTO_FIELD_MAP),
    ])

    return NextResponse.json(
      { gmv, auto },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    )
  } catch (error) {
    console.error("Failed to fetch benchmark data:", error)
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    )
  }
}
