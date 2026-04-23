import { useState } from "react"
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

  return (
    <div
      className="border border-border-muted rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col w-full transition-[gap] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ gap: open ? 24 : 0 }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
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
          data-accordion-chevron
          className="size-9 rounded-full bg-white flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown className="size-5 text-text-soft" />
        </div>
      </button>
      <div
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
