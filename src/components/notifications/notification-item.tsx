import {
  Bot,
  Calendar,
  Wallet,
  Heart,
  FolderKanban,
  Eye,
  Clock,
  CheckCheck,
  Undo2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Notification, NotificationType } from '@/types/notifications'
import { NOTIFICATION_TYPE_META } from '@/types/notifications'
import { formatNotificationTimestamp } from '@/utils/notifications'

const TYPE_ICONS: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  agent_action: Bot,
  schedule: Calendar,
  finance: Wallet,
  health: Heart,
  project: FolderKanban,
}

export interface NotificationItemProps {
  notification: Notification
  onView?: (id: string) => void
  onSnooze?: (id: string) => void
  onMarkRead?: (id: string) => void
  onUndo?: (id: string) => void
}

export function NotificationItem({
  notification,
  onView,
  onSnooze,
  onMarkRead,
  onUndo,
}: NotificationItemProps) {
  const {
    id = '',
    type = 'agent_action',
    title = '',
    message = '',
    timestamp = '',
    read = false,
    data,
    canUndo = false,
    snoozable = true,
  } = notification ?? {}

  const meta = NOTIFICATION_TYPE_META[type] ?? NOTIFICATION_TYPE_META.agent_action
  const Icon = TYPE_ICONS[type] ?? Bot

  return (
    <li
      className={cn(
        'group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-card-hover',
        !read && 'border-primary/30 bg-primary/5'
      )}
      data-notification-id={id}
    >
      <div className="flex gap-4">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            meta.color,
            'bg-primary/10'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
            {message}
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {formatNotificationTimestamp(timestamp)}
          </p>
        </div>
      </div>

      {data && Object.keys(data).length > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
          {Object.entries(data).map(([key, val]) => (
            <div key={key} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{key}:</span>
              <span>{String(val ?? '')}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {onView && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(id)}
            className="transition-transform hover:scale-[1.02]"
            aria-label={`View ${title}`}
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
        )}
        {snoozable && onSnooze && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSnooze(id)}
            className="transition-transform hover:scale-[1.02]"
            aria-label={`Snooze ${title}`}
          >
            <Clock className="h-4 w-4" />
            Snooze
          </Button>
        )}
        {canUndo && onUndo && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUndo(id)}
            className="transition-transform hover:scale-[1.02]"
            aria-label={`Undo ${title}`}
          >
            <Undo2 className="h-4 w-4" />
            Undo
          </Button>
        )}
        {!read && onMarkRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkRead(id)}
            className="transition-transform hover:scale-[1.02]"
            aria-label={`Mark ${title} as read`}
          >
            <CheckCheck className="h-4 w-4" />
            Mark as Read
          </Button>
        )}
      </div>
    </li>
  )
}
