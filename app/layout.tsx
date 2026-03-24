import type { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Gorgias Live Index",
  description:
    "Live CX benchmarks from the last 90 days across Gorgias customers.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400&family=STIX+Two+Text:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: "#f6f4f2" }}>{children}</body>
    </html>
  )
}
