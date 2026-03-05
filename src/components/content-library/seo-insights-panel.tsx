/**
 * SEOInsightsPanel - SEO suggestions, scoring, outline ideas, publish scheduling
 */

import { Sparkles, BarChart3, Calendar, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface SEOInsight {
  type: 'suggestion' | 'score' | 'outline' | 'schedule'
  title: string
  description?: string
  value?: number
  actions?: { label: string; onClick?: () => void }[]
}

export interface SEOInsightsPanelProps {
  seoScore?: number
  suggestions?: string[]
  outlineSuggestions?: string[]
  scheduledDate?: string
  onGenerateIdeas?: () => void
  onGetSEOSuggestions?: () => void
  onSchedule?: () => void
  className?: string
}

export function SEOInsightsPanel({
  seoScore = 0,
  suggestions = [],
  outlineSuggestions = [],
  scheduledDate,
  onGenerateIdeas,
  onGetSEOSuggestions,
  onSchedule,
  className,
}: SEOInsightsPanelProps) {
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : []
  const safeOutline = Array.isArray(outlineSuggestions) ? outlineSuggestions : []
  const score = typeof seoScore === 'number' ? Math.min(100, Math.max(0, seoScore)) : 0

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Sparkles className="h-5 w-5 text-primary" aria-hidden />
        <CardTitle className="text-base">SEO & AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {seoScore > 0 && (
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                SEO Score
              </span>
              <span className="font-medium">{score}/100</span>
            </div>
            <Progress value={score} className="mt-2 h-2" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onGenerateIdeas}
          >
            <Lightbulb className="h-4 w-4" />
            Generate ideas
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onGetSEOSuggestions}
          >
            <BarChart3 className="h-4 w-4" />
            SEO suggestions
          </Button>
        </div>

        {safeSuggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium">Suggestions</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {safeSuggestions.slice(0, 4).map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}

        {safeOutline.length > 0 && (
          <div>
            <h4 className="text-sm font-medium">Outline ideas</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {safeOutline.slice(0, 3).map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}

        {scheduledDate && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Scheduled: {new Date(scheduledDate).toLocaleDateString()}</span>
          </div>
        )}

        {onSchedule && (
          <Button
            className="w-full gradient-primary text-primary-foreground"
            size="sm"
            onClick={onSchedule}
          >
            <Calendar className="h-4 w-4" />
            Schedule publish
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
