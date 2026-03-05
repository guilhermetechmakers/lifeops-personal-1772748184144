/**
 * AuditTrailList - Filterable view of agent actions with explainability metadata
 * LifeOps Personal Dashboard
 */

import { useState } from 'react'
import { Filter, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { AIActionAudit } from '@/types/dashboard'

export interface AuditTrailListProps {
  aiAudits?: AIActionAudit[] | null
  isLoading?: boolean
  onViewExplain?: (actionId: string) => void
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function AuditTrailList({
  aiAudits,
  isLoading,
  onViewExplain,
}: AuditTrailListProps) {
  const [filter, setFilter] = useState<string>('all')
  const items = (aiAudits ?? []).filter((a) => {
    if (filter === 'all') return true
    return a.actor?.toLowerCase().includes(filter.toLowerCase())
  })

  const actors = Array.from(
    new Set((aiAudits ?? []).map((a) => a.actor).filter(Boolean))
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Audit trail
        </CardTitle>
        {actors.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-input bg-card px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Filter by actor"
            >
              <option value="all">All agents</option>
              {actors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No audit entries to display.
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-border p-4 transition-colors hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.actionType}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.rationale}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTimestamp(item.timestamp)}</span>
                      <span>•</span>
                      <span>{item.actor}</span>
                      <span>•</span>
                      <span>Confidence: {item.confidence}%</span>
                    </div>
                  </div>
                  {onViewExplain && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewExplain(item.id)}
                      aria-label="View explanation"
                    >
                      Why?
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
