import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronDown } from "lucide-react"

export function AccordionSection({
  title,
  subtitle,
  defaultOpen = true,
  children,
}: {
  title: string
  subtitle: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [animating, setAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => {
    if (!contentRef.current) return
    const el = contentRef.current

    if (open) {
      // Closing: set explicit height first so transition has a start value
      el.style.maxHeight = `${el.scrollHeight}px`
      el.style.overflow = "hidden"
      // Force reflow
      el.offsetHeight
      setAnimating(true)
      setOpen(false)
    } else {
      // Opening: measure target height and animate to it
      setAnimating(true)
      setOpen(true)
    }
  }, [open])

  useEffect(() => {
    const el = contentRef.current
    if (!el || !animating) return

    if (open) {
      // Animate open
      el.style.maxHeight = `${el.scrollHeight}px`
      el.style.overflow = "hidden"
      const onEnd = () => {
        el.style.maxHeight = "none"
        el.style.overflow = "visible"
        setAnimating(false)
      }
      el.addEventListener("transitionend", onEnd, { once: true })
      return () => el.removeEventListener("transitionend", onEnd)
    }
  }, [open, animating])

  return (
    <div
      className="border border-border-muted rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col w-full transition-[gap] duration-400 ease-in-out"
      style={{ gap: open ? 24 : 0 }}
    >
      <button
        onClick={toggle}
        className="flex items-center justify-between gap-4 w-full text-left cursor-pointer"
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl sm:text-3xl leading-[1.2] text-text-primary">
            {title}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-text-soft">
            {subtitle}
          </p>
        </div>
        <div
          className="size-9 rounded-full bg-white flex items-center justify-center shrink-0 transition-transform duration-400 ease-in-out"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown className="size-5 text-text-soft" />
        </div>
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: open && !animating ? "none" : open ? undefined : 0,
          opacity: open ? 1 : 0,
          overflow: open && !animating ? "visible" : "hidden",
          transition:
            "max-height 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease",
        }}
      >
        {children}
      </div>
    </div>
  )
}
