interface AiStatCardProps {
  title: string
  value: string
  percentage: number
  detail: string
}

export function AiStatCard({ title, value, percentage, detail }: AiStatCardProps) {
  return (
    <div className="aspect-video bg-card flex flex-col items-start justify-between overflow-hidden p-6 rounded-2xl">
      <div className="flex gap-2 items-start w-full">
        <p className="flex-1 text-base leading-relaxed text-text-primary">
          {title}
        </p>
        <p className="text-xl leading-relaxed text-text-primary whitespace-nowrap">
          {value}
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="bg-brand-blue-100 h-6 rounded overflow-hidden w-full">
          {percentage > 0 && (
            <div
              className="bg-brand-blue-300 h-full rounded"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
        <p className="font-mono text-xs text-text-soft tracking-widest uppercase">
          {detail}
        </p>
      </div>
    </div>
  )
}
