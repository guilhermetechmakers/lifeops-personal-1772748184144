import { useEffect, useMemo, useState } from 'react'
import { Bell, Inbox } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/hooks/use-notifications'
import {
  NotificationListGroup,
  NotificationFiltersBar,
  NotificationSettingsShortcut,
  NotificationPreferencesPanel,
  SnoozeModal,
} from '@/components/notifications'
import type { NotificationType } from '@/types/notifications'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { filterNotifications, groupByType } from '@/utils/notifications'

const NOTIFICATION_ORDER: NotificationType[] = [
  'agent_action',
  'schedule',
  'finance',
  'health',
  'project',
]

export function NotificationsPage() {
  const {
    notifications,
    preferences,
    isLoading,
    preferencesLoading,
    filters,
    loadNotifications,
    refresh,
    updateFilters,
    markRead,
    markAllRead,
    snooze,
    dismiss,
    undo,
    loadPreferences,
    savePreferences,
  } = useNotifications()

  const [expandedGroups, setExpandedGroups] = useState<Set<NotificationType>>(
    () => new Set(NOTIFICATION_ORDER)
  )
  const [snoozeModalOpen, setSnoozeModalOpen] = useState(false)
  const [snoozeTargetId, setSnoozeTargetId] = useState<string | null>(null)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  const debouncedSearch = useDebouncedValue(filters?.searchQuery ?? '', 300)

  useEffect(() => {
    void loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    void loadPreferences()
  }, [loadPreferences])

  const filtered = useMemo(
    () =>
      filterNotifications(notifications, {
        searchQuery: debouncedSearch,
        unreadOnly: filters?.unreadOnly ?? false,
        selectedTypes: filters?.selectedTypes ?? [],
      }),
    [notifications, debouncedSearch, filters?.unreadOnly, filters?.selectedTypes]
  )

  const grouped = useMemo(() => groupByType(filtered), [filtered])

  const toggleGroup = (type: NotificationType) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  const handleSnooze = (id: string) => {
    setSnoozeTargetId(id)
    setSnoozeModalOpen(true)
  }

  const handleSnoozeConfirm = (durationMs: number) => {
    if (snoozeTargetId && durationMs >= 60000) {
      void snooze([snoozeTargetId], durationMs)
    }
    setSnoozeTargetId(null)
    setSnoozeModalOpen(false)
  }

  const handleMarkRead = (id: string) => {
    if (id) void markRead([id])
  }

  const handleDismissAll = () => {
    const ids = filtered.map((n) => n.id).filter(Boolean)
    if (ids.length) void dismiss(ids)
    if (ids.length) toast.success('All notifications cleared')
  }

  const handleFiltersChange = (next: Partial<typeof filters>) => {
    updateFilters(next)
  }

  const isEmpty = filtered.length === 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Bell className="h-8 w-8 text-primary" />
            Notifications Center
          </h1>
          <p className="mt-1 text-muted-foreground">
            Agent actions, schedules, finance, health, and project alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationSettingsShortcut
            onClick={() => setPreferencesOpen(true)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refresh()}
            disabled={isLoading}
            aria-label="Refresh notifications"
          >
            Refresh
          </Button>
        </div>
      </div>

      <NotificationFiltersBar
        filters={filters ?? { selectedTypes: [], timeRange: '7d', searchQuery: '', unreadOnly: false }}
        onFiltersChange={handleFiltersChange}
        onMarkAllRead={markAllRead}
        onDismissAll={handleDismissAll}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : isEmpty ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Inbox className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 font-semibold text-lg">No notifications</h3>
            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
              You're all caught up. Adjust your notification preferences to control what you receive.
            </p>
            <Button
              variant="default"
              className="mt-6 gradient-primary"
              onClick={() => setPreferencesOpen(true)}
            >
              Notification preferences
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {NOTIFICATION_ORDER.map((type) => (
            <NotificationListGroup
              key={type}
              groupType={type}
              notifications={grouped[type] ?? []}
              isExpanded={expandedGroups.has(type)}
              onToggleExpand={() => toggleGroup(type)}
              onView={(id) => {
                handleMarkRead(id)
              }}
              onSnooze={handleSnooze}
              onMarkRead={handleMarkRead}
              onDismiss={(id) => void dismiss([id])}
              onUndo={(id) => void undo(id)}
            />
          ))}
        </div>
      )}

      <SnoozeModal
        open={snoozeModalOpen}
        onOpenChange={setSnoozeModalOpen}
        onConfirm={handleSnoozeConfirm}
        onCancel={() => setSnoozeTargetId(null)}
      />

      <NotificationPreferencesPanel
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
        preferences={preferences}
        onSave={(prefs) => void savePreferences(prefs)}
        isLoading={preferencesLoading}
      />
    </div>
  )
}
