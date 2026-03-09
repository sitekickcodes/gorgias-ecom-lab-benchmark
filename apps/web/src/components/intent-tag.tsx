interface IntentTagProps {
  label: string
  value: string
}

export function IntentTag({ label, value }: IntentTagProps) {
  return (
    <div className="bg-surface-canvas flex gap-1.5 h-8 items-center px-4 rounded-full font-mono text-sm tracking-widest uppercase whitespace-nowrap">
      <span className="text-text-primary">{label}</span>
      <span className="text-text-muted">{value}</span>
    </div>
  )
}
