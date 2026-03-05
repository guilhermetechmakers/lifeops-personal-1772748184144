/**
 * ContentScoringPanel - Multi-metric scoring with actionable recommendations
 */

import { useMemo, useEffect } from 'react'
import { Target, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useContentEditor } from '@/context/content-editor-context'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { cn } from '@/lib/utils'

function scoreCompleteness(title: string, content: string): number {
  let s = 0
  if (title.length >= 6) s += 25
  if (title.length >= 20) s += 15
  if (content.length >= 100) s += 30
  if (content.length >= 500) s += 30
  return Math.min(100, s)
}

function scoreReadability(content: string): number {
  const trimmed = (content ?? '').trim()
  if (!trimmed) return 0
  const sentences = trimmed.split(/[.!?]+/).filter(Boolean)
  const words = trimmed.split(/\s+/).filter(Boolean)
  if (sentences.length === 0) return 70
  const avgWords = words.length / sentences.length
  if (avgWords <= 12) return 90
  if (avgWords <= 18) return 75
  return Math.max(40, 80 - avgWords)
}

function scoreEngagement(content: string): number {
  const c = (content ?? '').toLowerCase()
  let s = 50
  if (c.includes('?')) s += 10
  if (c.includes('!')) s += 5
  if (c.includes('you') || c.includes('your')) s += 10
  if (c.split(/\n/).length > 3) s += 10
  if (c.length > 300) s += 15
  return Math.min(100, s)
}

export function ContentScoringPanel() {
  const { draft, setMetrics } = useContentEditor()
  const title = draft?.title ?? ''
  const content = draft?.content ?? ''
  const debouncedContent = useDebouncedValue(content, 400)

  const metrics = useMemo(() => {
    const completeness = scoreCompleteness(title, debouncedContent)
    const readability = scoreReadability(debouncedContent)
    const engagement = scoreEngagement(debouncedContent)
    const score = Math.round((completeness + readability + engagement) / 3)
    return {
      score: Math.min(100, score),
      completeness,
      readability,
      engagementPotential: engagement,
    }
  }, [title, debouncedContent])

  useEffect(() => {
    setMetrics(metrics)
  }, [metrics, setMetrics])

  const recommendations = useMemo(() => {
    const recs: string[] = []
    if (metrics.completeness! < 50) recs.push('Add a longer title (20+ chars) and more body content (100+ words)')
    if (metrics.readability! < 60) recs.push('Shorten sentences for better readability')
    if (metrics.engagementPotential! < 60) recs.push('Add questions or direct address (you/your) to boost engagement')
    if (recs.length === 0) recs.push('Content looks good! Consider adding subheadings for structure.')
    return recs
  }, [metrics])

  const safeRecs = Array.isArray(recommendations) ? recommendations : []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Target className="h-5 w-5 text-primary" aria-hidden />
        <CardTitle className="text-base">Content Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall</span>
            <span
              className={cn(
                'font-bold',
                (metrics.score ?? 0) >= 70
                  ? 'text-green-600'
                  : (metrics.score ?? 0) >= 50
                    ? 'text-amber-600'
                    : 'text-muted-foreground'
              )}
            >
              {metrics.score ?? 0}/100
            </span>
          </div>
          <Progress
            value={metrics.score ?? 0}
            className={cn(
              'h-3',
              (metrics.score ?? 0) >= 70 && '[&>div]:bg-green-500',
              (metrics.score ?? 0) >= 50 &&
                (metrics.score ?? 0) < 70 &&
                '[&>div]:bg-amber-500'
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground">Completeness</p>
            <p className="text-sm font-semibold">{metrics.completeness ?? 0}%</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground">Readability</p>
            <p className="text-sm font-semibold">{metrics.readability ?? 0}%</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground">Engagement</p>
            <p className="text-sm font-semibold">
              {metrics.engagementPotential ?? 0}%
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Recommendations</p>
          <ul className="space-y-1.5">
            {safeRecs.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                {rec.startsWith('Content looks good') ? (
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
