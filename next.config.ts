import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Tailwind v4 works via PostCSS — no special config needed

  // Don't bundle these into the serverless function — they ship binaries /
  // non-JS files (Chromium in a tarball, puppeteer resources) that the
  // bundler relocates incorrectly. Keeping them as external node_modules
  // references lets @sparticuz/chromium find its own `bin/` directory at
  // runtime.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],

  // Vercel's file tracing doesn't follow the dynamic fs.readFile() that
  // @sparticuz/chromium uses to unpack its bundled Chrome from bin/, so
  // the tarball gets left behind at deploy time. Explicitly include it
  // for the benchmark-pdf function. pnpm nests packages under .pnpm/.
  outputFileTracingIncludes: {
    "/api/benchmark-pdf": [
      "./node_modules/.pnpm/@sparticuz+chromium**/node_modules/@sparticuz/chromium/bin/**",
      "./node_modules/@sparticuz/chromium/bin/**",
    ],
  },
}

export default nextConfig
