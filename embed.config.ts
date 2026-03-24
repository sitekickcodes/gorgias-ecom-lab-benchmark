import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

/**
 * Vite config for building the embed bundle only.
 * Outputs embed.js + embed.css to public/ (served by Next.js as static files).
 *
 * Usage: vite build -c embed.config.ts
 */
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "public",
    emptyOutDir: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: path.resolve(__dirname, "src/embed.tsx"),
      output: {
        entryFileNames: "embed.js",
        inlineDynamicImports: true,
        assetFileNames: (asset) => {
          if (asset.names?.some((n) => n.endsWith(".css"))) return "embed.css"
          return "assets/[name]-[hash][extname]"
        },
      },
    },
  },
})
