/**
 * ProgressBar - Generic progress visualization for projects
 */

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface ProgressBarProps {
  value: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({
  value,
  className,
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value ?? 0))

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{clamped}%</span>
        </div>
      )}
      <Progress value={clamped} className="h-2" />
    </div>
  )
}
