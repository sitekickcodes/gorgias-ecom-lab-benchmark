import { useEffect, useMemo, useRef, useState } from "react"
import {
  Tooltip,
  TooltipTrigger,
  MetricTooltipContent,
} from "@/components/tooltip"

// Parse a value string like "27.3%", "$17K", "+11", "4.52" into parts
function parseValue(str: string) {
  const match = str.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix, numStr, suffix] = match
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0
  return { prefix, num: parseFloat(numStr), suffix, decimals }
}

function formatValue(parsed: ReturnType<typeof parseValue>, t: number): string {
  if (!parsed) return ""
  const current = parsed.num * t
  return `${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`
}

function useCountUp(value: string, duration = 1200) {
  const ref = useRef<HTMLDivElement>(null)
  const parsed = useMemo(() => parseValue(value), [value])
  const [display, setDisplay] = useState(() => formatValue(parsed, 0))

  useEffect(() => {
    if (!parsed) {
      setDisplay(value)
      return
    }

    const el = ref.current
    if (!el) return

    let animFrame: number
    let startTime: number | null = null

    const animate = (time: number) => {
      if (startTime === null) startTime = time
      const elapsed = time - startTime
      const t = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(formatValue(parsed, eased))
      if (t < 1) {
        animFrame = requestAnimationFrame(animate)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        animFrame = requestAnimationFrame(animate)
      },
      { threshold: 0.4 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animFrame)
    }
  }, [parsed, duration, value])

  return { ref, display }
}

interface StatCardProps {
  title: string
  titleCase?: "normal" | "upper"
  value: string
  detail: string
  tooltip?: string
  highlight?: {
    value: string
    label: string
  }
}

export function StatCard({
  title,
  titleCase = "normal",
  value,
  detail,
  tooltip,
  highlight,
}: StatCardProps) {
  const { ref, display } = useCountUp(value)

  return (
    <div ref={ref} className="min-h-36 bg-card flex flex-col items-start justify-between gap-2 p-4 sm:p-6 rounded-2xl">
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger
            render={<span />}
            className="text-base leading-relaxed text-text-primary underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help text-left"
          >
            {title}
          </TooltipTrigger>
          <MetricTooltipContent label={title} description={tooltip} />
        </Tooltip>
      ) : (
        <p className="text-base leading-relaxed text-text-primary">
          {title}
        </p>
      )}
      <p className="font-heading text-3xl sm:text-4xl md:text-5xl leading-[1.2] text-text-primary tabular-nums">
        {display}
      </p>
      {highlight ? (
        <div className="flex gap-2 font-mono text-xs text-text-soft tracking-widest uppercase whitespace-nowrap">
          <span>Median</span>
          <span>
            <span className="text-success">{highlight.value}</span>
            <span> {highlight.label}</span>
          </span>
        </div>
      ) : (
        <p className="font-mono text-xs text-text-soft tracking-widest uppercase">
          {detail}
        </p>
      )}
    </div>
  )
}
