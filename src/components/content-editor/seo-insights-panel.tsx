/**
 * SEOInsightsPanel - SEO suggestions, scoring, outline suggestions
 */

import { Sparkles, BarChart3, FileText, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface SEOInsightsPanelProps {
  seoScore?: number
  suggestions?: string[]
  outlineSuggestions?: string[]
  onApplySuggestion?: (suggestion: string) => void
  className?: string
}

export function SEOInsightsPanel({
  seoScore = 0,
  suggestions = [],
  outlineSuggestions = [],
  onApplySuggestion,
  className,
}: SEOInsightsPanelProps) {
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : []
  const safeOutline = Array.isArray(outlineSuggestions) ? outlineSuggestions : []
  const score = typeof seoScore === 'number' ? Math.min(100, Math.max(0, seoScore)) : 0

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden />
          <CardTitle className="text-base">SEO Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">SEO Score</span>
              <span className="font-medium">{score}/100</span>
            </div>
            <Progress value={score} className="h-2" />
          </div>

          {safeSuggestions.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" />
                Suggestions
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {safeSuggestions.slice(0, 5).map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{s}</span>
                    {onApplySuggestion && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs shrink-0"
                        onClick={() => onApplySuggestion(s)}
                      >
                        Apply
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {safeOutline.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Outline ideas
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {safeOutline.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {safeSuggestions.length === 0 && safeOutline.length === 0 && score === 0 && (
            <p className="text-sm text-muted-foreground">
              Add content to get SEO suggestions and scoring.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
