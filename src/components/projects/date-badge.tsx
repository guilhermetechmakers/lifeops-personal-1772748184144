/**
 * DateBadge - Human-readable due date or milestone indicator
 */

import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/date'

export interface DateBadgeProps {
  date?: string | null
  label?: string
  variant?: 'default' | 'overdue' | 'upcoming'
  className?: string
}

export function DateBadge({ date, label, variant = 'default', className }: DateBadgeProps) {
  if (!date) return null

  const formatted = formatDate(date)
  const dateObj = new Date(date)
  const now = new Date()
  const isOverdue = dateObj < now && dateObj.toDateString() !== now.toDateString()
  const resolvedVariant = variant === 'default' && isOverdue ? 'overdue' : variant

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        resolvedVariant === 'overdue' && 'bg-destructive/10 text-destructive',
        resolvedVariant === 'upcoming' && 'bg-primary/10 text-primary-foreground',
        resolvedVariant === 'default' && 'bg-muted text-muted-foreground',
        className
      )}
      aria-label={label ? `${label}: ${formatted}` : `Due ${formatted}`}
    >
      {label && <span className="text-muted-foreground">{label}</span>}
      {formatted}
    </span>
  )
}
