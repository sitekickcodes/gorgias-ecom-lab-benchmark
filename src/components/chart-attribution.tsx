"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { track } from "@vercel/analytics"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/popover"
import { downloadCsv } from "@/lib/csv"

interface ChartAttributionProps {
  /** Rows to offer as CSV download. Omit to hide the "Get the data" link. */
  csvRows?: ReadonlyArray<Record<string, unknown>>
  /** CSV filename without extension. Defaults to "gorgias-chart-data". */
  csvFilename?: string
  /** iframe HTML to show in the Embed popover. Omit to hide the "Embed" link. */
  embedSnippet?: string
  /** Extra source note appended after "Gorgias Ecom Lab" (e.g., date range, methodology). */
  sourceNote?: string
}

function getLogoUrl(): string {
  if (typeof window === "undefined") return "/gorgias-logo.svg"
  const origin = (window as unknown as Record<string, string>)
    .__GORGIAS_EMBED_ORIGIN__
  return origin ? `${origin}/gorgias-logo.svg` : "/gorgias-logo.svg"
}

export function ChartAttribution({
  csvRows,
  csvFilename = "gorgias-chart-data",
  embedSnippet,
  sourceNote,
}: ChartAttributionProps) {
  const [copied, setCopied] = useState(false)

  async function copyEmbed() {
    if (!embedSnippet) return
    try {
      await navigator.clipboard.writeText(embedSnippet)
      track("embed_copied", { chart: csvFilename })
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked — ignore silently
    }
  }

  const linkClass =
    "underline decoration-dotted decoration-text-soft/40 underline-offset-2 hover:text-text-primary transition-colors cursor-pointer"

  return (
    <div className="pt-3 border-t border-[#efe9e2] flex items-center justify-between gap-4 text-xs leading-relaxed text-text-soft">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span>Source:</span>
        <a
          href="https://www.gorgias.com/ecom-lab"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Gorgias Ecom Lab
        </a>
        {sourceNote && (
          <>
            <span aria-hidden>·</span>
            <span>{sourceNote}</span>
          </>
        )}
        {csvRows && csvRows.length > 0 && (
          <>
            <span aria-hidden>·</span>
            <button
              type="button"
              onClick={() => {
                track("csv_downloaded", { chart: csvFilename })
                downloadCsv(csvRows, csvFilename)
              }}
              className={linkClass}
            >
              Get the data
            </button>
          </>
        )}
        {embedSnippet && (
          <>
            <span aria-hidden>·</span>
            <Popover
              onOpenChange={(open) => {
                if (open) track("embed_opened", { chart: csvFilename })
              }}
            >
              <PopoverTrigger className={linkClass}>Embed</PopoverTrigger>
              <PopoverContent
                side="top"
                align="end"
                className="w-72 p-3"
              >
                <p className="text-xs text-text-soft leading-snug mb-2">
                  Copy this iframe to embed the chart:
                </p>
                <div className="flex items-stretch gap-2">
                  <code className="flex-1 min-w-0 text-[11px] font-mono bg-[#f6f4f2] px-2 py-1.5 rounded border border-[#efe9e2] overflow-hidden whitespace-nowrap text-ellipsis text-text-primary">
                    {embedSnippet}
                  </code>
                  <button
                    type="button"
                    onClick={copyEmbed}
                    aria-label={copied ? "Copied" : "Copy embed code"}
                    className="inline-flex items-center justify-center size-8 shrink-0 rounded-md border border-border-muted bg-card hover:bg-[#f6f4f2] text-text-soft hover:text-text-primary transition-colors"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-[#2d783e]" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>

      <a
        href="https://www.gorgias.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Gorgias home"
        className="opacity-50 hover:opacity-100 transition-opacity shrink-0"
      >
        <img
          src={getLogoUrl()}
          alt="Gorgias"
          className="h-4 w-auto block"
        />
      </a>
    </div>
  )
}
