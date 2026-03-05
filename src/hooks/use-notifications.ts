import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type {
  Notification,
  NotificationPreference,
  NotificationFilters,
} from '@/types/notifications'
import {
  fetchNotifications as apiFetchNotifications,
  markNotificationsRead,
  snoozeNotifications,
  undoNotification,
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from '@/api/notifications'
import { useIsMounted } from './use-is-mounted'

const DEFAULT_FILTERS: NotificationFilters = {
  selectedTypes: [],
  timeRange: '7d',
  searchQuery: '',
  unreadOnly: false,
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreference | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [preferencesLoading, setPreferencesLoading] = useState(false)
  const [filters, setFilters] = useState<NotificationFilters>(DEFAULT_FILTERS)
  const isMounted = useIsMounted()

  const loadNotifications = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await apiFetchNotifications(filters)
      if (isMounted()) {
        setNotifications(Array.isArray(data) ? data : [])
      }
    } catch {
      if (isMounted()) {
        setNotifications([])
        toast.error('Failed to load notifications')
      }
    } finally {
      if (isMounted()) {
        setIsLoading(false)
      }
    }
  }, [filters, isMounted])

  const refresh = useCallback(() => {
    void loadNotifications()
  }, [loadNotifications])

  const updateFilters = useCallback((next: Partial<NotificationFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }))
  }, [])

  const markRead = useCallback(
    async (ids: string[]) => {
      const safeIds = Array.isArray(ids) ? ids.filter(Boolean) : []
      if (!safeIds.length) return
      const prev = [...notifications]
      setNotifications((list) =>
        (list ?? []).map((n) =>
          safeIds.includes(n.id) ? { ...n, read: true } : n
        )
      )
      try {
        const updated = await markNotificationsRead(safeIds)
        if (isMounted() && Array.isArray(updated) && updated.length > 0) {
          setNotifications((list) =>
            (list ?? []).map((n) => {
              const u = updated.find((x) => x.id === n.id)
              return u ?? n
            })
          )
        }
      } catch {
        if (isMounted()) {
          setNotifications(prev)
          toast.error('Failed to mark as read')
        }
      }
    },
    [notifications, isMounted]
  )

  const markAllRead = useCallback(() => {
    const unread = (notifications ?? []).filter((n) => !n.read)
    const ids = unread.map((n) => n.id)
    if (ids.length) void markRead(ids)
    if (ids.length) toast.success('All marked as read')
  }, [notifications, markRead])

  const snooze = useCallback(
    async (ids: string[], durationMs: number) => {
      const safeIds = Array.isArray(ids) ? ids.filter(Boolean) : []
      if (!safeIds.length || durationMs < 60000) return
      const snoozedUntil = new Date(Date.now() + durationMs).toISOString()
      const prev = [...(notifications ?? [])]
      setNotifications((list) =>
        (list ?? []).map((n) =>
          safeIds.includes(n.id) ? { ...n, snoozedUntil } : n
        )
      )
      try {
        const updated = await snoozeNotifications(safeIds, durationMs)
        if (isMounted() && Array.isArray(updated) && updated.length > 0) {
          setNotifications((list) =>
            (list ?? []).map((n) => {
              const u = updated.find((x) => x.id === n.id)
              return u ?? n
            })
          )
        }
        toast.success('Notification snoozed')
      } catch {
        if (isMounted()) {
          setNotifications(prev)
          toast.error('Failed to snooze')
        }
      }
    },
    [notifications, isMounted]
  )

  const undo = useCallback(
    async (id: string) => {
      if (!id?.trim()) return
      try {
        const updated = await undoNotification(id)
        if (isMounted() && updated) {
          setNotifications((list) =>
            (list ?? []).map((n) => (n.id === id ? { ...n, ...updated } : n))
          )
          toast.success('Action undone')
        }
      } catch {
        toast.error('Failed to undo')
      }
    },
    [isMounted]
  )

  const loadPreferences = useCallback(async () => {
    setPreferencesLoading(true)
    try {
      const data = await fetchNotificationPreferences()
      if (isMounted()) {
        setPreferences(data ?? null)
      }
    } catch {
      if (isMounted()) {
        setPreferences(null)
      }
    } finally {
      if (isMounted()) {
        setPreferencesLoading(false)
      }
    }
  }, [isMounted])

  const savePreferences = useCallback(
    async (prefs: NotificationPreference) => {
      try {
        const updated = await updateNotificationPreferences(prefs)
        if (isMounted() && updated) {
          setPreferences(updated)
          toast.success('Preferences saved')
          return true
        }
      } catch {
        toast.error('Failed to save preferences')
      }
      return false
    },
    [isMounted]
  )

  return {
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
    undo,
    loadPreferences,
    savePreferences,
  }
}
