import { NextResponse } from "next/server"

export const runtime = "nodejs"

/**
 * Keeps the Airtable webhook subscription alive. Airtable webhooks expire
 * 7 days after creation (or last refresh), after which notifications stop
 * firing silently. A Vercel Cron hits this daily to push the expiration
 * back out by another 7 days.
 *
 * Auth: Vercel Cron automatically sends `Authorization: Bearer $CRON_SECRET`
 * when CRON_SECRET is set in the environment. External calls (testing) need
 * the same header.
 */
const AIRTABLE_BASE_ID = "appHTPnidve5znze0"

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get("authorization")
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const apiKey = process.env.AIRTABLE_API_KEY
  const webhookId = process.env.AIRTABLE_WEBHOOK_ID
  if (!apiKey || !webhookId) {
    return NextResponse.json(
      { error: "AIRTABLE_API_KEY or AIRTABLE_WEBHOOK_ID not set" },
      { status: 500 },
    )
  }

  const res = await fetch(
    `https://api.airtable.com/v0/bases/${AIRTABLE_BASE_ID}/webhooks/${webhookId}/refresh`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
    },
  )

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    console.error(
      "[airtable-refresh] Airtable API failed:",
      res.status,
      body.slice(0, 500),
    )
    return NextResponse.json(
      { error: "Refresh failed", status: res.status },
      { status: 502 },
    )
  }

  const data = (await res.json()) as { expirationTime?: string }
  return NextResponse.json({
    ok: true,
    expirationTime: data.expirationTime,
    refreshedAt: new Date().toISOString(),
  })
}
