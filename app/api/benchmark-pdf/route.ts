import { NextResponse } from "next/server"
import type { Browser } from "puppeteer-core"
import type { Dataset } from "@/lib/types"

// Puppeteer cold start + page render can take 10–30s; bump past the
// Hobby-tier default of 10s. Must be Node runtime (not edge) — Chrome
// binary needs a real filesystem.
export const runtime = "nodejs"
export const maxDuration = 60

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

// On Vercel/AWS Lambda we use @sparticuz/chromium's bundled binary.
// Locally we use a Chrome install on disk (set CHROME_PATH in .env.local,
// or default to the common macOS / Linux paths).
//
// Detection: LAMBDA_TASK_ROOT is auto-set by the AWS Lambda runtime ("/var/task")
// and not by Vercel's env var system, so it can't leak into .env.local via
// `vercel env pull` the way plain VERCEL=1 can.
const isServerless = !!process.env.LAMBDA_TASK_ROOT

async function launchBrowser(): Promise<Browser> {
  const puppeteer = await import("puppeteer-core")

  if (isServerless) {
    const chromium = (await import("@sparticuz/chromium")).default
    const executablePath = await chromium.executablePath()
    if (!executablePath) {
      throw new Error("@sparticuz/chromium executablePath() returned empty")
    }
    return puppeteer.launch({
      // Extra args on top of @sparticuz/chromium's defaults, trimmed for
      // faster startup in our specific use case (no WebGL, no audio,
      // no background throttling, no update checks).
      args: [
        ...chromium.args,
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
      executablePath,
      headless: true,
    })
  }

  const localChromePaths = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
  ].filter(Boolean) as string[]

  return puppeteer.launch({
    headless: true,
    executablePath: localChromePaths[0],
  })
}

function baseUrl(req: Request): string {
  // Prefer explicit env var; fall back to request origin (dev / preview).
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  const url = new URL(req.url)
  return `${url.protocol}//${url.host}`
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const industry = url.searchParams.get("industry")
  const datasetRaw = url.searchParams.get("dataset")
  const sliderRaw = url.searchParams.get("sliderValue")
  const sliderValue = sliderRaw != null ? Number(sliderRaw) : NaN

  const dataset: Dataset | null =
    datasetRaw === "gmv" || datasetRaw === "automation-rate" ? datasetRaw : null

  if (!industry || !dataset || !Number.isFinite(sliderValue)) {
    return NextResponse.json(
      { error: "Missing or invalid query params" },
      { status: 400, headers: CORS_HEADERS },
    )
  }

  const snapshotUrl = new URL(`${baseUrl(req)}/embed/benchmark-snapshot`)
  snapshotUrl.searchParams.set("industry", industry)
  snapshotUrl.searchParams.set("dataset", dataset)
  snapshotUrl.searchParams.set("slider", String(sliderValue))

  let browser: Browser | null = null
  try {
    browser = await launchBrowser()
    const page = await browser.newPage()

    // Render at a proper desktop width so the dashboard shows its real
    // 4-column layout with comfortable spacing (matches the live UI at
    // md+ breakpoints). Use a very tall viewport height so ALL cards
    // count as "visible" — the StatCard count-up animation is gated on
    // IntersectionObserver, and cards below the fold never fire IO in
    // a headless browser, leaving their values blank.
    const VIEWPORT_WIDTH = 1200
    await page.setViewport({
      width: VIEWPORT_WIDTH,
      height: 5000,
      deviceScaleFactor: 2,
    })

    // DOMContentLoaded is enough — we have our own [data-snapshot-ready]
    // signal that only fires once data has loaded, so we don't need to wait
    // for full network idle (which is a conservative 500ms of inactivity).
    await page.goto(snapshotUrl.toString(), {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    })

    await page.waitForSelector("[data-snapshot-ready]", { timeout: 15_000 })
    await page.evaluateHandle("document.fonts.ready")
    // No artificial animation wait — snapshot mode skips count-up and gauge
    // fill animations (see src/lib/snapshot-context.tsx).

    // Use the snapshot content element's own rendered size — NOT
    // document.documentElement.scrollHeight, which returns the viewport
    // height (5000px) when content is shorter than the viewport, leading
    // to a tall PDF with empty whitespace at the bottom.
    const contentHeight = await page.evaluate(() => {
      const el = document.querySelector(
        "[data-benchmark-snapshot]",
      ) as HTMLElement | null
      if (el) {
        const rect = el.getBoundingClientRect()
        return Math.ceil(rect.bottom + window.scrollY)
      }
      return document.body.scrollHeight
    })

    const pdf = await page.pdf({
      width: `${VIEWPORT_WIDTH}px`,
      height: `${contentHeight}px`,
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    })

    return new NextResponse(pdf as unknown as BodyInit, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length.toString(),
        // Cache by full URL on Vercel's edge CDN. Same filter state = same
        // PDF, so repeat downloads (same user, same Industry/Dataset/Slider)
        // are served from the edge without re-invoking Puppeteer. Browser
        // gets a short cache too so double-clicks don't regenerate.
        "Cache-Control":
          "public, max-age=300, s-maxage=21600, stale-while-revalidate=86400",
      },
    })
  } catch (err) {
    // Log full detail to Vercel runtime logs; return a generic error to the
    // client so stack traces aren't exposed publicly.
    console.error("[api/benchmark-pdf] Puppeteer failed:", err)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500, headers: CORS_HEADERS },
    )
  } finally {
    if (browser) await browser.close().catch(() => {})
  }
}
