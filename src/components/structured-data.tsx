import { buildBenchmarkSchema } from "@/lib/benchmark-schema"

const CANONICAL_URL = "https://gorgias.sitekick.co/"

export function StructuredData() {
  const schema = buildBenchmarkSchema(CANONICAL_URL)
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
