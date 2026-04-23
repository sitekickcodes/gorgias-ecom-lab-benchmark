import { createContext, useContext } from "react"

/**
 * Provides the Shadow DOM container to child components so portals
 * (tooltips, dropdowns, etc.) render inside the shadow root instead
 * of escaping to document.body.
 */
const ShadowContainerContext = createContext<HTMLElement | null>(null)

export function ShadowContainerProvider({
  container,
  children,
}: {
  container: HTMLElement | null
  children: React.ReactNode
}) {
  return (
    <ShadowContainerContext.Provider value={container}>
      {children}
    </ShadowContainerContext.Provider>
  )
}

export function useShadowContainer(): HTMLElement | undefined {
  const container = useContext(ShadowContainerContext)
  return container ?? undefined
}
