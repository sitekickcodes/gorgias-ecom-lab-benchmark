import { StructuredData } from "@/components/structured-data"
import { getBenchmarkData } from "@/lib/get-benchmark-data"
import { BenchmarkClient } from "./benchmark-client"

export default async function PreviewPage() {
  const initialData = await getBenchmarkData()
  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "40px 20px" }}>
      <StructuredData />
      <BenchmarkClient initialData={initialData} />
    </div>
  )
}
