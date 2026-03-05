import { cn } from '@/lib/utils'

export interface InfoRowProps {
  label: string
  value: React.ReactNode
  className?: string
}

export function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value ?? '—'}</span>
    </div>
  )
}
