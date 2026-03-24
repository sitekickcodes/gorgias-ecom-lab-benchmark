import { defineConfig, loadEnv, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

/** Shared fields present in both Airtable tables */
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

const GMV_FIELDS: Record<string, string> = {
  ...SHARED_FIELDS,
  "Approximated Gmv": "tier",
}

const AUTO_FIELDS: Record<string, string> = {
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

    const resp = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!resp.ok) throw new Error(`Airtable ${resp.status}`)

    const data = await resp.json()
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

/**
 * Dev-only plugin that serves /api/benchmark by proxying to Airtable.
 * In production, Vercel serverless functions handle this route.
 */
const DEV_CACHE_TTL = 10 * 60 * 1000 // 10 minutes
let devCache: { data: string; timestamp: number } | null = null

function airtableDevProxy(env: Record<string, string>): Plugin {
  return {
    name: "airtable-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/benchmark", async (_req, res) => {
        // Serve from dev cache if fresh
        if (devCache && Date.now() - devCache.timestamp < DEV_CACHE_TTL) {
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          })
          res.end(devCache.data)
          return
        }

        const apiKey = env.AIRTABLE_API_KEY
        const baseId = env.AIRTABLE_BASE_ID

        if (!apiKey || !baseId) {
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Missing AIRTABLE env vars" }))
          return
        }

        try {
          const [gmv, auto] = await Promise.all([
            fetchTable(apiKey, baseId, "tblujgg5KS99DcFYX", GMV_FIELDS),
            fetchTable(apiKey, baseId, "tblc06IHbf1NKM9Kc", AUTO_FIELDS),
          ])

          const json = JSON.stringify({ gmv, auto })
          devCache = { data: json, timestamp: Date.now() }

          res.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          })
          res.end(json)
        } catch (err) {
          console.error("Airtable proxy error:", err)
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Failed to fetch data" }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [
      react(),
      airtableDevProxy(env),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "index.html"),
        },
        output: {
          entryFileNames: "embed.js",
          chunkFileNames: "embed-[name].js",
          assetFileNames: (asset) => {
            if (asset.names?.some((n) => n.endsWith(".css")))
              return "embed.css"
            return "assets/[name]-[hash][extname]"
          },
          manualChunks: {
            vendor: ["react", "react-dom", "recharts"],
          },
        },
      },
    },
  }
})
