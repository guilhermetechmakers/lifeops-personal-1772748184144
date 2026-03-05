/**
 * PublishQueue - Queue view for scheduled items with status, channel, time
 */

import { Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ScheduledItem {
  id: string
  title: string
  status: 'scheduled' | 'publishing' | 'published'

  channel: string
  scheduledAt: string
}

export interface PublishQueueProps {
  items?: ScheduledItem[]
  className?: string
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function PublishQueue({ items = [], className }: PublishQueueProps) {
  const safeItems = Array.isArray(items) ? items : []

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Calendar className="h-5 w-5 text-primary" aria-hidden />
        <CardTitle className="text-base">Publish queue</CardTitle>
      </CardHeader>
      <CardContent>
        {safeItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No scheduled posts. Schedule content to see it here.
          </p>
        ) : (
          <ul className="space-y-2">
            {safeItems.slice(0, 5).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDateTime(item.scheduledAt)}
                    <Badge variant="secondary" className="text-xs">
                      {item.channel}
                    </Badge>
                  </div>
                </div>
                <Badge
                  variant={
                    item.status === 'published' ? 'default' : 'secondary'
                  }
                >
                  {item.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
