/**
 * Shared Airtable configuration — used by both the Vercel API route
 * and the Vite dev proxy. Single source of truth for table IDs,
 * field mappings, and data transformation.
 */

export const GMV_TABLE_ID = "tblujgg5KS99DcFYX"
export const AUTO_TABLE_ID = "tblc06IHbf1NKM9Kc"

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
  "Top Intents": "topIntents",
  // P90 (top 10% performers) for each metric
  "P90 Across Accounts - Median First Response Time (min)": "p90FrtMin",
  "P10 Median Chat FRT (min)": "p10ChatFrtMin",
  "P10 Median Email FRT (min)": "p10EmailFrtMin",
  "P90 Across Accounts - Median Resolution Time (hrs)": "p90ResolutionTimeHrs",
  "P90 Across Accounts - Median One-Touch Rate (%)": "p90MedianOneTouchRate",
  "P90 Across Accounts - Median CSAT Score": "p90CsatScore",
  "P90 Across Accounts - Median CSAT Positive (%)": "p90CsatPositive",
  "P90 Across Accounts - Median Messages / Ticket": "p90MessagesPerTicket",
  "P90 Across Accounts - Median Monthly Tickets": "p90MonthlyTickets",
  "P90 Across Accounts - Median Tickets / 100 Orders": "p90TicketsPer100Orders",
  "P90 Across Accounts - Median CSAT Response Rate (%)": "p90CsatResponseRate",
  "P90 Across Accounts - AI Agent Automation Rate - Active Only (%)": "p90AiAutomationRate",
  "P90 Across Accounts - AI Agent Success Rate (%)": "p90AiSuccessRate",
  "P90 Across Accounts - Shopping Assistant Conversion Rate (%)": "p90SaConversionRate",
}

export const GMV_FIELD_MAP: Record<string, string> = {
  ...SHARED_FIELDS,
  "Approximated Gmv": "tier",
}

export const AUTO_FIELD_MAP: Record<string, string> = {
  ...SHARED_FIELDS,
  "Automation Rate Pct": "tier",
}

export function transformRecord(
  fields: Record<string, unknown>,
  fieldMap: Record<string, string>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [airtableKey, camelKey] of Object.entries(fieldMap)) {
    if (fields[airtableKey] !== undefined) {
      // Parse JSON string fields (like Top Intents)
      if (camelKey === "topIntents" && typeof fields[airtableKey] === "string") {
        try {
          result[camelKey] = JSON.parse(fields[airtableKey] as string)
        } catch {
          result[camelKey] = []
        }
      } else {
        result[camelKey] = fields[airtableKey]
      }
    }
  }
  return result
}

export async function fetchTable(
  apiKey: string,
  baseId: string,
  tableId: string,
  fieldMap: Record<string, string>,
): Promise<Record<string, unknown>[]> {
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
