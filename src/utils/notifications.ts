import type { Notification, NotificationType } from '@/types/notifications'

const NOTIFICATION_ORDER: NotificationType[] = [
  'agent_action',
  'schedule',
  'finance',
  'health',
  'project',
]

export function filterNotifications(
  notifications: Notification[],
  filters: { searchQuery?: string; unreadOnly?: boolean; selectedTypes?: NotificationType[] }
): Notification[] {
  let result = Array.isArray(notifications) ? [...notifications] : []
  const { searchQuery = '', unreadOnly = false, selectedTypes = [] } = filters ?? {}

  if (unreadOnly) {
    result = result.filter((n) => !n?.read)
  }
  if (selectedTypes.length > 0) {
    result = result.filter((n) =>
      selectedTypes.includes((n?.type ?? 'agent_action') as NotificationType)
    )
  }
  if (searchQuery?.trim()) {
    const q = searchQuery.trim().toLowerCase()
    result = result.filter(
      (n) =>
        (n?.title ?? '').toLowerCase().includes(q) ||
        (n?.message ?? '').toLowerCase().includes(q)
    )
  }
  return result
}

export function groupByType(
  notifications: Notification[]
): Record<NotificationType, Notification[]> {
  const safe = Array.isArray(notifications) ? notifications : []
  const groups = NOTIFICATION_ORDER.reduce(
    (acc, t) => ({ ...acc, [t]: [] as Notification[] }),
    {} as Record<NotificationType, Notification[]>
  )
  for (const n of safe) {
    const type = (n?.type ?? 'agent_action') as NotificationType
    if (groups[type]) {
      groups[type].push(n)
    }
  }
  return groups
}

export function formatNotificationTimestamp(ts: string): string {
  if (!ts) return ''
  try {
    const date = new Date(ts)
    if (Number.isNaN(date.getTime())) return ''
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  } catch {
    return ''
  }
}
