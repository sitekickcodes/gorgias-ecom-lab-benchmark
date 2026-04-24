// Absolute origin for the deployed site. Used for JSON-LD canonical URLs,
// the dataset's data-download URL, and iframe embed snippets shown in the docs.
//
// Reads from `NEXT_PUBLIC_SITE_URL` if set (inlined at build time into both
// the Next.js bundle and the Vite embed bundle — see `define` in embed.config.ts).
// Falls back to the production URL so the app works even if the env var is
// never configured.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ecom-lab.gorgias.com"
