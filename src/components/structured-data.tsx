import { buildBenchmarkSchema } from "@/lib/benchmark-schema"
import { SITE_URL } from "@/lib/site-url"

export function StructuredData() {
  const canonicalUrl = SITE_URL.endsWith("/") ? SITE_URL : `${SITE_URL}/`
  const schema = buildBenchmarkSchema(canonicalUrl)
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
