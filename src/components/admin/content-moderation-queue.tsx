/**
 * ContentModerationQueue - List of flagged items with Approve/Remove/Escalate actions.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminModQueue } from '@/hooks/use-admin-query'
import { decideModeration } from '@/api/admin'
import { toast } from 'sonner'
import { Check, X, AlertCircle, FileText, MessageSquare, Image } from 'lucide-react'
import type { ModerationItem } from '@/types/admin'

const TYPE_ICONS = {
  post: FileText,
  comment: MessageSquare,
  media: Image,
}

function formatDate(s?: string | null): string {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleString()
  } catch {
    return '—'
  }
}

export function ContentModerationQueue() {
  const { data, isLoading, error, refetch } = useAdminModQueue()
  const items = (data?.items ?? []) as ModerationItem[]
  const total = data?.total ?? 0

  const handleDecide = async (
    itemId: string,
    action: 'approve' | 'reject' | 'remove' | 'escalate'
  ) => {
    try {
      await decideModeration(itemId, action)
      toast.success(`Item ${action}d`)
      refetch()
    } catch (e) {
      toast.error((e as Error)?.message ?? 'Action failed')
    }
  }

  if (error) {
    toast.error(error?.message ?? 'Failed to load moderation queue')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Content Moderation</h1>
        <p className="mt-1 text-muted-foreground">
          Review flagged content and take action
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
          <p className="text-sm text-muted-foreground">{total} items pending</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {(Array.from({ length: 3 }) ?? []).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(items ?? []).map((item) => {
                const Icon = TYPE_ICONS[item?.type ?? 'post'] ?? FileText
                return (
                  <div
                    key={item?.id}
                    className="flex flex-col gap-4 rounded-xl border border-border p-4 transition-all hover:shadow-card sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Badge variant="outline" className="capitalize">
                          {item?.type ?? 'post'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item?.reportedCount ?? 0} reports
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{item?.contentPreview ?? '—'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(item?.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecide(item?.id ?? '', 'approve')}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => handleDecide(item?.id ?? '', 'remove')}
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecide(item?.id ?? '', 'escalate')}
                      >
                        <AlertCircle className="h-4 w-4" />
                        Escalate
                      </Button>
                    </div>
                  </div>
                )
              })}
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No items in moderation queue</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
