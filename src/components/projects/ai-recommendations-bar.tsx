/**
 * AIRecommendationsBar - Compact area within each card displaying a suggested next step
 */

import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AIRecommendationsBarProps {
  recommendation?: string | null
  className?: string
}

export function AIRecommendationsBar({ recommendation, className }: AIRecommendationsBarProps) {
  if (!recommendation?.trim()) return null

  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3',
        className
      )}
      role="complementary"
      aria-label="AI recommendation"
    >
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <p className="text-sm text-muted-foreground line-clamp-2">{recommendation}</p>
    </div>
  )
}
