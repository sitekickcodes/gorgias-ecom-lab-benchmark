import type { VercelRequest, VercelResponse } from "@vercel/node"
import {
  GMV_TABLE_ID,
  AUTO_TABLE_ID,
  GMV_FIELD_MAP,
  AUTO_FIELD_MAP,
  fetchTable,
} from "./airtable"

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!apiKey || !baseId) {
    return res.status(500).json({ error: "Missing AIRTABLE env vars" })
  }

  try {
    const [gmv, auto] = await Promise.all([
      fetchTable(apiKey, baseId, GMV_TABLE_ID, GMV_FIELD_MAP),
      fetchTable(apiKey, baseId, AUTO_TABLE_ID, AUTO_FIELD_MAP),
    ])
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800",
    )
    return res.json({ gmv, auto })
  } catch (error) {
    console.error("Failed to fetch benchmark data:", error)
    return res.status(500).json({ error: "Failed to fetch data" })
  }
}
