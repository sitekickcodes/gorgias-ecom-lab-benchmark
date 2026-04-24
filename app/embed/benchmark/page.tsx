import { getBenchmarkData } from "@/lib/get-benchmark-data"
import { EmbedBenchmarkClient } from "./embed-client"

export default async function EmbedBenchmarkPage() {
  const initialData = await getBenchmarkData()
  return <EmbedBenchmarkClient initialData={initialData} />
}
