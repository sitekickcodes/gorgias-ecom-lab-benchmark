import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
      },
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
