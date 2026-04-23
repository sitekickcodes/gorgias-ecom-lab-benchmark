#!/usr/bin/env node
/**
 * One-time setup: creates an Airtable webhook subscription that notifies
 * our /api/webhooks/airtable endpoint whenever benchmark data changes.
 *
 * Usage:
 *   1. Make sure AIRTABLE_API_KEY is set (the PAT needs webhooks:manage)
 *   2. Run: node scripts/setup-airtable-webhook.mjs
 *   3. Copy the printed AIRTABLE_WEBHOOK_ID + AIRTABLE_WEBHOOK_SECRET
 *      into Vercel env vars for production
 *   4. Trigger a new deploy so the webhook receiver picks up the secret
 *
 * To point at a different environment, override NOTIFICATION_URL:
 *   NOTIFICATION_URL=https://preview.example.com/api/webhooks/airtable \
 *     node scripts/setup-airtable-webhook.mjs
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"

// Load .env.local manually — we don't want a dotenv dependency just for this
try {
  const env = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8")
  for (const line of env.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "")
    if (!process.env[key]) process.env[key] = value
  }
} catch {
  // .env.local not found — proceed with whatever's in process.env
}

const BASE_ID = "appHTPnidve5znze0"
const API_KEY = process.env.AIRTABLE_API_KEY
const NOTIFICATION_URL =
  process.env.NOTIFICATION_URL ??
  "https://gorgias.sitekick.co/api/webhooks/airtable"

if (!API_KEY) {
  console.error("AIRTABLE_API_KEY env var is required")
  process.exit(1)
}

const auth = { Authorization: `Bearer ${API_KEY}` }

// 1. Check for existing webhooks first — Airtable allows multiple, but we
// want to avoid duplicates. Show what's already there and bail out if our
// URL is already subscribed.
console.log(`Checking existing webhooks on base ${BASE_ID}...`)
const listRes = await fetch(
  `https://api.airtable.com/v0/bases/${BASE_ID}/webhooks`,
  { headers: auth },
)
if (!listRes.ok) {
  console.error(
    `Failed to list webhooks: ${listRes.status} ${await listRes.text()}`,
  )
  process.exit(1)
}
const { webhooks = [] } = await listRes.json()

const existing = webhooks.find((w) => w.notificationUrl === NOTIFICATION_URL)
if (existing) {
  console.log(
    `\nA webhook for ${NOTIFICATION_URL} already exists:\n`,
    JSON.stringify(existing, null, 2),
  )
  console.log(
    "\nIf you need to recreate it, delete it first via the Airtable API, then re-run this script.",
  )
  process.exit(0)
}

if (webhooks.length > 0) {
  console.log(
    `(${webhooks.length} other webhook(s) found on this base — leaving them alone.)`,
  )
}

// 2. Create the webhook. dataTypes: tableData means we fire on record
// changes; no recordChangeScope means all tables.
console.log(`\nCreating webhook -> ${NOTIFICATION_URL} ...`)
const createRes = await fetch(
  `https://api.airtable.com/v0/bases/${BASE_ID}/webhooks`,
  {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      notificationUrl: NOTIFICATION_URL,
      specification: {
        options: {
          filters: {
            dataTypes: ["tableData"],
          },
        },
      },
    }),
  },
)

if (!createRes.ok) {
  console.error(
    `Failed to create webhook: ${createRes.status} ${await createRes.text()}`,
  )
  process.exit(1)
}

const created = await createRes.json()

console.log("\n✓ Webhook created.\n")
console.log("Add these to Vercel env vars (production):\n")
console.log(`  AIRTABLE_WEBHOOK_ID=${created.id}`)
console.log(`  AIRTABLE_WEBHOOK_SECRET=${created.macSecretBase64}`)
console.log(`\nExpires at: ${created.expirationTime}`)
console.log(
  "\nThe daily Vercel Cron at /api/webhooks/airtable/refresh will keep it alive.",
)
