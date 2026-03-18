import {
  Tooltip,
  TooltipTrigger,
  MetricTooltipContent,
} from "@/components/tooltip"

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
  return (
    <div className="min-h-36 bg-card flex flex-col items-start justify-between gap-2 p-4 sm:p-6 rounded-2xl">
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger
            render={<p />}
            className="text-sm sm:text-base leading-relaxed text-text-primary underline decoration-dotted decoration-text-soft/50 underline-offset-2 cursor-help text-left"
          >
            {title}
          </TooltipTrigger>
          <MetricTooltipContent label={title} description={tooltip} />
        </Tooltip>
      ) : (
        <p className="text-sm sm:text-base leading-relaxed text-text-primary">
          {title}
        </p>
      )}
      <p className="font-heading text-3xl sm:text-4xl md:text-5xl leading-[1.2] text-text-primary">
        {value}
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
