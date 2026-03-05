/**
 * TagChip - Project tag display
 */

import { cn } from '@/lib/utils'

export interface TagChipProps {
  tag: string
  className?: string
}

export function TagChip({ tag, className }: TagChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground',
        className
      )}
    >
      {tag}
    </span>
  )
}
