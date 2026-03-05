/**
 * PriorityPill - Visual priority indicator
 */

import { cn } from '@/lib/utils'
import type { ProjectPriority } from '@/types/projects'

export interface PriorityPillProps {
  priority?: ProjectPriority | null
  className?: string
}

const priorityConfig: Record<ProjectPriority, { label: string; className: string }> = {
  High: { label: 'High', className: 'bg-destructive/10 text-destructive' },
  Medium: { label: 'Medium', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  Low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
}

export function PriorityPill({ priority, className }: PriorityPillProps) {
  if (!priority) return null

  const config = priorityConfig[priority]
  if (!config) return null

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
      aria-label={`Priority: ${config.label}`}
    >
      {config.label}
    </span>
  )
}
