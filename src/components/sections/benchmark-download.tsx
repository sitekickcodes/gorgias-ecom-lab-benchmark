import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { track } from "@vercel/analytics"
import { useBenchmark } from "./benchmark-context"

function slugIndustry(industry: string): string {
  return industry
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function BenchmarkDownload() {
  const { currentRecord, industry, dataset, sliderValue, sliderLabel, loading } =
    useBenchmark()
  const [generating, setGenerating] = useState(false)

  async function handleDownload() {
    if (!currentRecord || generating) return

    track("pdf_downloaded", {
      industry,
      dataset,
      sliderValue,
      sliderLabel,
    })

    setGenerating(true)
    try {
      // Use the embed origin so the request reaches gorgias.sitekick.co even
      // when the embed runs inside a Webflow page.
      const origin =
        (window as unknown as Record<string, string>)
          .__GORGIAS_EMBED_ORIGIN__ || ""

      // GET rather than POST so Vercel's edge CDN caches by URL.
      // String-concat the URL (not `new URL(...)`) so it works with an empty
      // origin — the Next.js preview page has no `__GORGIAS_EMBED_ORIGIN__`
      // and we want a relative URL there.
      const params = new URLSearchParams({
        industry,
        dataset,
        sliderValue: String(sliderValue),
      })
      const res = await fetch(`${origin}/api/benchmark-pdf?${params}`)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      const segment = dataset === "gmv" ? "annual-sales" : "automation-rate"
      const cleanSegment = sliderLabel.replace(/[^a-zA-Z0-9]/g, "")
      a.href = url
      a.download = `gorgias-cx-benchmark-${slugIndustry(industry)}-${segment}-${cleanSegment}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("[BenchmarkDownload] PDF generation failed:", err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading || generating || !currentRecord}
      className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] uppercase text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed underline decoration-dotted decoration-text-muted/40 underline-offset-2"
    >
      {generating ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        <Download className="size-3" />
      )}
      {generating ? "Generating PDF…" : "Download your full CX Benchmark"}
    </button>
  )
}
