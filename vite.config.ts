import { defineConfig, loadEnv, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "fs"
import {
  GMV_TABLE_ID,
  AUTO_TABLE_ID,
  GMV_FIELD_MAP,
  AUTO_FIELD_MAP,
  fetchTable,
} from "./api/airtable"

/**
 * Dev-only plugin that serves /api/benchmark by proxying to Airtable.
 * In production, Vercel serverless functions handle this route.
 * Caches responses for 10 minutes to avoid hammering Airtable during dev.
 */
const DEV_CACHE_TTL = 10 * 60 * 1000
let devCache: { data: string; timestamp: number } | null = null

function airtableDevProxy(env: Record<string, string>): Plugin {
  return {
    name: "airtable-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/benchmark", async (_req, res) => {
        if (devCache && Date.now() - devCache.timestamp < DEV_CACHE_TTL) {
          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(devCache.data)
          return
        }

        const apiKey = env.AIRTABLE_API_KEY
        const baseId = env.AIRTABLE_BASE_ID

        if (!apiKey || !baseId) {
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Missing AIRTABLE env vars in .env.local" }))
          return
        }

        try {
          const [gmv, auto] = await Promise.all([
            fetchTable(apiKey, baseId, GMV_TABLE_ID, GMV_FIELD_MAP),
            fetchTable(apiKey, baseId, AUTO_TABLE_ID, AUTO_FIELD_MAP),
          ])

          const json = JSON.stringify({ gmv, auto })
          devCache = { data: json, timestamp: Date.now() }

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(json)
        } catch (err) {
          console.error("Airtable proxy error:", err)
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Failed to fetch data" }))
        }
      })
    },
  }
}

/**
 * Copies docs/index.html to dist/docs/index.html at build time,
 * replacing the dev module script with the production embed files.
 */
function copyDocs(): Plugin {
  return {
    name: "copy-docs",
    closeBundle() {
      const src = path.resolve(__dirname, "docs/index.html")
      const destDir = path.resolve(__dirname, "dist/docs")
      if (!fs.existsSync(src)) return

      fs.mkdirSync(destDir, { recursive: true })
      let html = fs.readFileSync(src, "utf-8")
      html = html.replace(
        '<script type="module" src="/src/embed.tsx"></script>',
        '<link rel="stylesheet" href="/embed.css" />\n    <script src="/embed.js" defer></script>',
      )
      fs.writeFileSync(path.join(destDir, "index.html"), html)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), airtableDevProxy(env), copyDocs()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "index.html"),
        },
        output: {
          entryFileNames: "embed.js",
          inlineDynamicImports: true,
          assetFileNames: (asset) => {
            if (asset.names?.some((n) => n.endsWith(".css")))
              return "embed.css"
            return "assets/[name]-[hash][extname]"
          },
        },
      },
    },
  }
})
