/**
 * AIAssistantPane - AI-generated suggestions with explanations, accept/modify actions
 */

import { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp, Check, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AISuggestion } from '@/types/projects'

export interface AIAssistantPaneProps {
  suggestions: AISuggestion[]
  isLoading?: boolean
  onApply?: (suggestionId: string) => void
  onRefresh?: () => void
}

export function AIAssistantPane({
  suggestions = [],
  isLoading = false,
  onApply,
  onRefresh,
}: AIAssistantPaneProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [applyingId, setApplyingId] = useState<string | null>(null)

  const list = Array.isArray(suggestions) ? suggestions : []

  const handleApply = async (id: string) => {
    setApplyingId(id)
    await onApply?.(id)
    setApplyingId(null)
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && list.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
          </div>
        ) : list.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No suggestions yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">AI will analyze your project and suggest next steps.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((s) => {
              const isExpanded = expandedId === s.id
              const isApplying = applyingId === s.id
              return (
                <li key={s.id}>
                  <div
                    className={cn(
                      'rounded-xl border border-border bg-card p-4 transition-all duration-200',
                      'hover:border-primary/30'
                    )}
                  >
                    <p className="font-medium">{s.content ?? 'Suggestion'}</p>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : s.id)}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide explanation
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Show explanation
                          </>
                        )}
                      </button>
                      {isExpanded && (
                        <p className="mt-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                          {s.explanation ?? 'No explanation available.'}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 gap-2 gradient-primary text-primary-foreground"
                      onClick={() => handleApply(s.id)}
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Apply
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
