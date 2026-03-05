/**
 * AIAssistantPane - AI-generated suggestions with explanations, accept/modify actions
 */

import { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AISuggestion } from '@/types/projects'

export interface AIAssistantPaneProps {
  suggestions: AISuggestion[]
  isLoading?: boolean
  onAccept?: (suggestion: AISuggestion) => void
  onRequestMore?: () => void
}

export function AIAssistantPane({
  suggestions = [],
  isLoading = false,
  onAccept,
  onRequestMore,
}: AIAssistantPaneProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const list = Array.isArray(suggestions) ? suggestions : []

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" aria-hidden />
        <CardTitle className="text-lg">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          AI-generated next steps with explainable reasoning. Accept to apply to your project.
        </p>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-lg bg-muted h-20" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center">
            <p className="text-sm text-muted-foreground">No suggestions yet</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onRequestMore}
            >
              <Sparkles className="h-4 w-4" />
              Generate suggestions
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((s) => {
              const isExpanded = expandedId === s?.id
              return (
                <li
                  key={s?.id}
                  className="rounded-lg border border-border bg-card p-3 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex-1 text-sm font-medium">{s?.content ?? ''}</p>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onAccept?.(s)}
                        aria-label="Accept suggestion"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setExpandedId((p) => (p === s?.id ? null : s?.id ?? null))}
                        aria-label={isExpanded ? 'Collapse' : 'Expand explanation'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-2 rounded bg-muted/50 p-2 text-xs text-muted-foreground">
                      {s?.explanation ?? 'No explanation provided.'}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {list.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onRequestMore}
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4" />
            Get more suggestions
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
