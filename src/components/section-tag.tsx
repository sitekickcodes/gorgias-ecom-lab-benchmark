interface SectionTagProps {
  number: string
  label: string
}

export function SectionTag({ number, label }: SectionTagProps) {
  return (
    <div className="bg-surface-soft inline-flex w-fit self-start gap-1.5 h-8 items-center px-4 rounded-full font-mono text-sm text-text-primary tracking-widest uppercase">
      <span>({number})</span>
      <span>{label}</span>
    </div>
  )
}
