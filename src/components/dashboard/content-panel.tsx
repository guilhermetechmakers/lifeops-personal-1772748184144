/**
 * ContentPanel - Content drafts, schedules, publish timeline
 * LifeOps Personal Dashboard
 */

import { Link } from 'react-router-dom'
import { FileText, ArrowRight, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { ContentDraft } from '@/types/dashboard'

export interface ContentPanelProps {
  contentDrafts?: ContentDraft[] | null
  isLoading?: boolean
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
}

export function ContentPanel({ contentDrafts, isLoading }: ContentPanelProps) {
  const items = (contentDrafts ?? []).slice(0, 4)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
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
          <FileText className="h-5 w-5 text-primary" />
          Content
        </CardTitle>
        <Link to="/dashboard/content">
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No content drafts. Create one to get started.
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/dashboard/content/${c.id}`}
                  className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:border-primary/50"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">{c.title}</span>
                    {c.scheduleDate && (
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(c.scheduleDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <span
                    className={cn(
                      'ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                      c.status === 'published' && 'bg-green-100 text-green-800',
                      c.status === 'scheduled' && 'bg-primary/20 text-primary-foreground',
                      c.status === 'draft' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {statusLabels[c.status] ?? c.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
