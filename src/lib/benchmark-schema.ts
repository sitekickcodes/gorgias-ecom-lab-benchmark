const DATA_API = "https://gorgias.sitekick.co/api/benchmark"

export function buildBenchmarkSchema(canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        "@id": `${canonicalUrl}#gorgias-live-index-dataset`,
        name: "Gorgias Live Index",
        alternateName: "Gorgias Ecommerce CX Benchmarks",
        description:
          "Live customer support benchmarks for ecommerce brands, updated from a rolling 90-day window of real Gorgias customer data. Segments by annual sales, industry, and AI automation rate. Covers first response time, resolution time, CSAT, one-touch rate, ticket volume, channel mix, and AI agent adoption.",
        url: canonicalUrl,
        keywords: [
          "ecommerce customer support benchmarks",
          "CX benchmarks",
          "first response time benchmark",
          "CSAT benchmark",
          "AI agent adoption",
          "AI automation rate",
          "support ticket volume",
          "Gorgias benchmark data",
          "Shopify customer service metrics",
        ],
        creator: {
          "@type": "Organization",
          name: "Gorgias",
          url: "https://www.gorgias.com",
          sameAs: [
            "https://www.linkedin.com/company/gorgias-inc-",
            "https://x.com/gorgiasio",
          ],
        },
        publisher: {
          "@type": "Organization",
          name: "Gorgias",
          url: "https://www.gorgias.com",
        },
        temporalCoverage: "P90D",
        isAccessibleForFree: true,
        measurementTechnique:
          "Metrics aggregated from live Gorgias customer accounts over a rolling 90-day window. Each metric is computed per account, then summarized across the segment as a median (typical performer) and P10 or P90 (top performer). Segmented by annual sales tier, AI automation rate tier, and industry. Only accounts with non-null values for the given metric contribute to that metric.",
        variableMeasured: [
          {
            "@type": "PropertyValue",
            name: "First Response Time",
            description:
              "Median per-account time from ticket creation to first human or AI response across all channels",
            unitText: "minutes",
          },
          {
            "@type": "PropertyValue",
            name: "Chat First Response Time",
            description:
              "Median per-account first response time for chat tickets only",
            unitText: "minutes",
          },
          {
            "@type": "PropertyValue",
            name: "Email First Response Time",
            description:
              "Median per-account first response time for email tickets only",
            unitText: "minutes",
          },
          {
            "@type": "PropertyValue",
            name: "Resolution Time",
            description: "Median per-account time from ticket creation to close",
            unitText: "hours",
          },
          {
            "@type": "PropertyValue",
            name: "One-Touch Rate",
            description:
              "Share of tickets resolved with a single response, including both AI and human agents",
            unitText: "percent",
          },
          {
            "@type": "PropertyValue",
            name: "CSAT Score",
            description:
              "Median per-account average customer satisfaction score on completed surveys",
            unitText: "score out of 5",
          },
          {
            "@type": "PropertyValue",
            name: "CSAT Positive Rate",
            description:
              "Share of CSAT surveys with a score of 4 or 5 (positive)",
            unitText: "percent",
          },
          {
            "@type": "PropertyValue",
            name: "CSAT Response Rate",
            description: "Share of CSAT surveys that receive a response",
            unitText: "percent",
          },
          {
            "@type": "PropertyValue",
            name: "Messages per Ticket",
            description: "Median per-account median message count per ticket",
            unitText: "messages",
          },
          {
            "@type": "PropertyValue",
            name: "Monthly Ticket Volume",
            description: "Median per-account average monthly ticket volume",
            unitText: "tickets per month",
          },
          {
            "@type": "PropertyValue",
            name: "Support Intensity",
            description: "Billed tickets per 100 orders",
            unitText: "tickets per 100 orders",
          },
          {
            "@type": "PropertyValue",
            name: "Email Channel Share",
            description: "Share of tickets created via email",
            unitText: "percent",
          },
          {
            "@type": "PropertyValue",
            name: "Chat Channel Share",
            description: "Share of tickets created via chat",
            unitText: "percent",
          },
          {
            "@type": "PropertyValue",
            name: "AI Agent Adoption Rate",
            description: "Share of Gorgias accounts that have enabled AI Agent",
            unitText: "percent",
          },
          {
            "@type": "PropertyValue",
            name: "AI Automation Rate",
            description:
              "Share of total tickets handled autonomously by AI among AI-enabled accounts",
            unitText: "percent",
          },
          {
            "@type": "PropertyValue",
            name: "AI Conversion Rate",
            description:
              "Orders influenced per AI conversation among AI-enabled merchants",
            unitText: "percent",
          },
          {
            "@type": "PropertyValue",
            name: "AI Revenue Influenced",
            description:
              "Average revenue influenced by AI conversations among AI-enabled merchants",
            unitText: "USD",
          },
        ],
        distribution: {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: DATA_API,
        },
        license: "https://www.gorgias.com/legal/terms-of-service",
      },
    ],
  }
}

export const SCHEMA_SCRIPT_ID = "gorgias-live-index-schema"

export function injectBenchmarkSchema() {
  if (typeof document === "undefined") return
  if (document.getElementById(SCHEMA_SCRIPT_ID)) return

  const canonicalUrl = window.location.origin + window.location.pathname
  const schema = buildBenchmarkSchema(canonicalUrl)

  const script = document.createElement("script")
  script.id = SCHEMA_SCRIPT_ID
  script.type = "application/ld+json"
  script.textContent = JSON.stringify(schema)
  document.head.appendChild(script)
}
