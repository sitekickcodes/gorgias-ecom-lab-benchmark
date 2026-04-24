import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import crypto from "crypto"
import { BENCHMARK_CACHE_TAG } from "@/lib/get-benchmark-data"

export const runtime = "nodejs"

/**
 * Airtable webhook receiver. Fires when benchmark data changes. Verifies the
 * HMAC signature against AIRTABLE_WEBHOOK_SECRET, then purges the cached
 * data API + rendered PDFs so the next visitor gets fresh content.
 *
 * Airtable signs every notification with HMAC-SHA256 over the raw request
 * body using a secret we received at webhook-creation time. The secret is
 * stored as base64 in AIRTABLE_WEBHOOK_SECRET.
 *
 * Setup: run `pnpm tsx scripts/setup-airtable-webhook.mjs` once to create
 * the webhook subscription and get the secret + webhook ID.
 */
export async function POST(req: Request) {
  const secretBase64 = process.env.AIRTABLE_WEBHOOK_SECRET
  if (!secretBase64) {
    console.error("[airtable-webhook] AIRTABLE_WEBHOOK_SECRET not set")
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  // Read the raw body — signature is computed over the exact bytes Airtable
  // sent, so we can't parse JSON first.
  const rawBody = await req.text()

  const signatureHeader = req.headers.get("x-airtable-content-mac")
  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 })
  }

  // Header format: "hmac-sha256=<hex>" — Airtable signs with hex encoding,
  // not base64 (their docs contradict this in places, but the wire format
  // is hex).
  const expected =
    "hmac-sha256=" +
    crypto
      .createHmac("sha256", Buffer.from(secretBase64, "base64"))
      .update(rawBody)
      .digest("hex")

  const providedBuf = Buffer.from(signatureHeader)
  const expectedBuf = Buffer.from(expected)

  if (
    providedBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(providedBuf, expectedBuf)
  ) {
    console.warn("[airtable-webhook] invalid signature")
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  // Valid — purge everything downstream of Airtable data:
  //  - revalidateTag invalidates the Next.js fetch cache used by getBenchmarkData,
  //    which is shared by the server-rendered pages and the /api/benchmark route.
  //  - revalidatePath invalidates the edge CDN cache for each rendered path.
  try {
    revalidateTag(BENCHMARK_CACHE_TAG, "max")
    revalidatePath("/")
    revalidatePath("/embed/benchmark")
    revalidatePath("/api/benchmark")
    revalidatePath("/api/benchmark-pdf")
  } catch (err) {
    console.error("[airtable-webhook] revalidate failed:", err)
    return NextResponse.json({ error: "Purge failed" }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    purgedAt: new Date().toISOString(),
  })
}
