import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Notification, NotificationType } from '@/types/notifications'
import { NOTIFICATION_TYPE_META } from '@/types/notifications'
import { NotificationItem } from './notification-item'

export interface NotificationListGroupProps {
  groupType: NotificationType
  notifications: Notification[]
  isExpanded: boolean
  onToggleExpand: () => void
  onView?: (id: string) => void
  onSnooze?: (id: string) => void
  onMarkRead?: (id: string) => void
  onDismiss?: (id: string) => void
  onUndo?: (id: string) => void
}

export function NotificationListGroup({
  groupType,
  notifications,
  isExpanded,
  onToggleExpand,
  onView,
  onSnooze,
  onMarkRead,
  onDismiss,
  onUndo,
}: NotificationListGroupProps) {
  const safeNotifications = Array.isArray(notifications) ? notifications : []
  const meta = NOTIFICATION_TYPE_META[groupType] ?? NOTIFICATION_TYPE_META.agent_action
  const count = safeNotifications.length
  const unreadCount = safeNotifications.filter((n) => !n?.read).length

  if (count === 0) return null

  return (
    <section
      className="rounded-xl border border-border bg-card"
      aria-label={`${meta.label} notifications`}
    >
      <button
        type="button"
        onClick={onToggleExpand}
        className="flex w-full items-center justify-between gap-4 rounded-t-xl border-b border-border bg-muted/30 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isExpanded}
        aria-controls={`group-${groupType}`}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="font-semibold">{meta.label}</span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              unreadCount > 0 ? 'bg-primary/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {count} {unreadCount > 0 ? `(${unreadCount} unread)` : ''}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div
          id={`group-${groupType}`}
          className="space-y-3 p-4"
          role="region"
        >
          {safeNotifications.map((n) => (
            <NotificationItem
              key={n?.id ?? `n-${Math.random()}`}
              notification={n}
              onView={onView}
              onSnooze={onSnooze}
              onMarkRead={onMarkRead}
              onDismiss={onDismiss}
              onUndo={onUndo}
            />
          ))}
        </div>
      )}
    </section>
  )
}
