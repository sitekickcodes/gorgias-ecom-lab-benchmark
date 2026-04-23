"use client"

import { createContext, useContext } from "react"

/**
 * True when the current tree is rendered inside a snapshot page (a dedicated
 * route Puppeteer visits to generate a PDF). Components check this to skip
 * entrance animations that are meaningless in a static export and would
 * otherwise force the PDF generator to wait for them to complete.
 */
const SnapshotContext = createContext(false)

export function SnapshotProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SnapshotContext.Provider value={true}>{children}</SnapshotContext.Provider>
  )
}

export function useIsSnapshot(): boolean {
  return useContext(SnapshotContext)
}
