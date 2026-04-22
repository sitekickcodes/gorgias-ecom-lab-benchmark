import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "fs"

/**
 * Vite plugin: after build, reads the compiled CSS file, injects it into
 * the JS bundle as a string constant, and deletes the CSS file.
 *
 * Result: single embed.js with CSS baked in. No separate embed.css.
 */
function inlineCompiledCss(): Plugin {
  return {
    name: "inline-compiled-css",
    enforce: "post",
    writeBundle(options) {
      const outDir = options.dir || "public"
      const cssPath = path.join(outDir, "embed.css")
      const jsPath = path.join(outDir, "embed.js")

      if (!fs.existsSync(cssPath) || !fs.existsSync(jsPath)) {
        console.warn("[inline-compiled-css] Missing embed.css or embed.js")
        return
      }

      const compiledCss = fs.readFileSync(cssPath, "utf-8")
      let js = fs.readFileSync(jsPath, "utf-8")

      // Match the placeholder with any string delimiter the minifier may use.
      // Vite 6 emitted "..." ; Vite 8 emits `...` (template literal). Match all
      // to stay resilient across bundler version bumps.
      const placeholderRe = /(["'`])__EMBED_CSS_PLACEHOLDER__\1/g
      const matches = js.match(placeholderRe)
      if (!matches || matches.length === 0) {
        throw new Error(
          "[inline-compiled-css] Could not find __EMBED_CSS_PLACEHOLDER__ in embed.js. " +
            "The bundler may have reformatted it — update the regex.",
        )
      }

      js = js.replace(placeholderRe, JSON.stringify(compiledCss))
      fs.writeFileSync(jsPath, js)
      fs.unlinkSync(cssPath)

      const jsSizeKB = (Buffer.byteLength(js) / 1024).toFixed(0)
      const cssSizeKB = (Buffer.byteLength(compiledCss) / 1024).toFixed(0)
      console.log(
        `[inline-compiled-css] Inlined ${cssSizeKB}KB CSS into embed.js (${jsSizeKB}KB total)`,
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), inlineCompiledCss()],
  publicDir: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "public",
    emptyOutDir: false,
    chunkSizeWarningLimit: 1200,
    cssCodeSplit: false,
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
