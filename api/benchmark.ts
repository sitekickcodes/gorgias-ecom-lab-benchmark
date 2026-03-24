import type { VercelRequest, VercelResponse } from "@vercel/node"

const GMV_TABLE_ID = "tblujgg5KS99DcFYX"
const AUTO_TABLE_ID = "tblc06IHbf1NKM9Kc"

const SHARED_FIELDS: Record<string, string> = {
  Industry: "industry",
  "Median First Response Time (min)": "medianFrtMin",
  "P10 First Response Time (min)": "p10FrtMin",
  "Median Chat FRT (min)": "medianChatFrtMin",
  "Median Email FRT (min)": "medianEmailFrtMin",
  "Median Resolution Time (hrs)": "medianResolutionTimeHrs",
  "P10 Resolution Time (hrs)": "p10ResolutionTimeHrs",
  "Median One-Touch Rate (%)": "medianOneTouchRate",
  "P90 One-Touch Rate (%)": "p90OneTouchRate",
  "Median CSAT Score": "medianCsatScore",
  "Median CSAT Positive (%)": "medianCsatPositive",
  "Median Messages / Ticket": "medianMessagesPerTicket",
  "Median Monthly Tickets": "medianMonthlyTickets",
  "Median Email Share (%)": "medianEmailShare",
  "Median Chat Share (%)": "medianChatShare",
  "AI Agent Automation Rate \u2014 Official Adopters (%)":
    "aiAgentAutomationRate",
  "AI Agent Success Rate \u2014 Official Adopters (%)": "aiAgentSuccessRate",
  "AI Agent Adoption Rate (%)": "aiAgentAdoptionRate",
  "Shopping Assistant Conversion Rate \u2014 Official Adopters (%)":
    "saConversionRate",
  "Shopping Assistant Revenue Attributed \u2014 Average Official Adopter ($)":
    "saRevenueAttributed",
  "Shopping Assistant Adoption Rate (%)": "saAdoptionRate",
  "Average Estimated GMV ($)": "avgEstimatedGmv",
  "Average Total Automation Rate (%)": "avgTotalAutomationRate",
  "Median Tickets / 100 Orders": "medianTicketsPer100Orders",
  "Median CSAT Response Rate (%)": "medianCsatResponseRate",
}

const GMV_FIELD_MAP: Record<string, string> = {
  ...SHARED_FIELDS,
  "Approximated Gmv": "tier",
}

const AUTO_FIELD_MAP: Record<string, string> = {
  ...SHARED_FIELDS,
  "Automation Rate Pct": "tier",
}

function transformRecord(
  fields: Record<string, unknown>,
  fieldMap: Record<string, string>,
) {
  const result: Record<string, unknown> = {}
  for (const [airtableKey, camelKey] of Object.entries(fieldMap)) {
    if (fields[airtableKey] !== undefined) {
      result[camelKey] = fields[airtableKey]
    }
  }
  return result
}

async function fetchTable(
  apiKey: string,
  baseId: string,
  tableId: string,
  fieldMap: Record<string, string>,
) {
  const records: Record<string, unknown>[] = []
  let offset: string | undefined

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${baseId}/${tableId}`,
    )
    url.searchParams.set("pageSize", "100")
    if (offset) url.searchParams.set("offset", offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (!res.ok) throw new Error(`Airtable API error: ${res.status}`)

    const data = await res.json()
    records.push(
      ...data.records.map(
        (r: { fields: Record<string, unknown> }) =>
          transformRecord(r.fields, fieldMap),
      ),
    )
    offset = data.offset
  } while (offset)

  return records
}

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
