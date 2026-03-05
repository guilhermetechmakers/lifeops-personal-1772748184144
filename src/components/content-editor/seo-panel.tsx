/**
 * SEOPanel - Keywords, readability, title/meta preview, on-page SEO checks
 */

import { useEffect } from 'react'
import { Search, BarChart3, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useContentEditor } from '@/context/content-editor-context'
import { useSeoSuggestions } from '@/hooks/use-seo-suggestions'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { cn } from '@/lib/utils'

const TITLE_MAX = 60
const META_MAX = 155

export function SEOPanel() {
  const { draft, setSeo } = useContentEditor()
  const content = draft?.content ?? ''
  const title = draft?.title ?? ''
  const debouncedContent = useDebouncedValue(content, 500)

  const {
    keywords,
    readabilityScore,
    titleSuggestion,
    metaSuggestion,
    suggestions,
    isLoading,
    analyze,
  } = useSeoSuggestions()

  useEffect(() => {
    if (debouncedContent || title) {
      analyze(debouncedContent, title)
    }
  }, [debouncedContent, title, analyze])

  useEffect(() => {
    setSeo({
      keywords,
      title: titleSuggestion,
      description: metaSuggestion,
      readabilityScore,
    })
  }, [keywords, titleSuggestion, metaSuggestion, readabilityScore, setSeo])

  const safeKeywords = Array.isArray(keywords) ? keywords : []
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : []
  const score = Math.min(100, Math.max(0, readabilityScore))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Search className="h-5 w-5 text-primary" aria-hidden />
        <CardTitle className="text-base">SEO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Readability</span>
            <span className="font-medium">{score}/100</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        {safeKeywords.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              Keywords
            </p>
            <div className="flex flex-wrap gap-1.5">
              {safeKeywords.slice(0, 6).map((k) => (
                <span
                  key={k}
                  className="rounded-lg border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            Title preview
          </p>
          <p
            className={cn(
              'text-sm text-muted-foreground truncate',
              titleSuggestion.length > TITLE_MAX && 'text-amber-600'
            )}
          >
            {titleSuggestion || 'Enter a title'}
          </p>
          <span className="text-xs text-muted-foreground">
            {titleSuggestion.length}/{TITLE_MAX}
          </span>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Meta description</p>
          <p
            className={cn(
              'text-sm text-muted-foreground line-clamp-2',
              metaSuggestion.length > META_MAX && 'text-amber-600'
            )}
          >
            {metaSuggestion || 'Add content for meta'}
          </p>
          <span className="text-xs text-muted-foreground">
            {metaSuggestion.length}/{META_MAX}
          </span>
        </div>

        {safeSuggestions.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Suggestions</p>
            <ul className="space-y-1.5">
              {safeSuggestions.slice(0, 4).map((s) => (
                <li
                  key={s.id}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  {s.type === 'readability' || s.type === 'alt' ? (
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  )}
                  {s.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!content && !isLoading && (
          <p className="text-sm text-muted-foreground">
            Add content to get SEO suggestions.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
