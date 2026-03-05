/**
 * Notifications API
 * LifeOps Personal - Notification Center
 * Uses mock data when backend is not available
 */

import type {
  Notification,
  NotificationPreference,
  NotificationFilters,
} from '@/types/notifications'
import { apiGet, apiPost, apiPut } from '@/lib/api'

export interface NotificationsResponse {
  success: boolean
  data?: Notification[] | null
  error?: string
}

export interface MarkReadResponse {
  success: boolean
  data?: Notification[]
  error?: string
}

export interface SnoozeResponse {
  success: boolean
  data?: Notification[]
  error?: string
}

export interface UndoResponse {
  success: boolean
  data?: Notification | null
  error?: string
}

export interface PreferencesResponse {
  success: boolean
  data?: NotificationPreference | null
  error?: string
}

/** Build query string from filters */
function buildQueryParams(filters: Partial<NotificationFilters>): string {
  const params = new URLSearchParams()
  if (filters.selectedTypes?.length) {
    params.set('types', filters.selectedTypes.join(','))
  }
  if (filters.unreadOnly) {
    params.set('read', 'false')
  }
  if (filters.timeRange) {
    params.set('range', filters.timeRange)
  }
  if (filters.searchQuery?.trim()) {
    params.set('query', filters.searchQuery.trim())
  }
  if (filters.customFrom) {
    params.set('from', filters.customFrom)
  }
  if (filters.customTo) {
    params.set('to', filters.customTo)
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

/** Fetch notifications with filters */
export async function fetchNotifications(
  filters: Partial<NotificationFilters> = {}
): Promise<Notification[]> {
  try {
    const qs = buildQueryParams(filters)
    const response = (await apiGet<NotificationsResponse | Notification[]>(
      `/notifications${qs}`
    )) as NotificationsResponse | Notification[]

    if (Array.isArray(response)) {
      return response
    }
    const data = response?.data ?? null
    return Array.isArray(data) ? data : []
  } catch {
    return getMockNotifications()
  }
}

/** Mark notifications as read */
export async function markNotificationsRead(
  ids: string[]
): Promise<Notification[]> {
  if (!ids?.length) return []
  try {
    const response = (await apiPost<MarkReadResponse>(
      '/notifications/markRead',
      { ids }
    )) as MarkReadResponse
    const data = response?.data ?? null
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/** Snooze notifications */
export async function snoozeNotifications(
  ids: string[],
  durationMs: number
): Promise<Notification[]> {
  if (!ids?.length || durationMs < 0) return []
  try {
    const response = (await apiPost<SnoozeResponse>(
      '/notifications/snooze',
      { ids, durationMs }
    )) as SnoozeResponse
    const data = response?.data ?? null
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/** Dismiss notification (remove from list) */
export async function dismissNotification(id: string): Promise<boolean> {
  if (!id?.trim()) return false
  try {
    await apiPost('/notifications/dismiss', { id })
    return true
  } catch {
    return false
  }
}

/** Dismiss multiple notifications */
export async function dismissNotifications(ids: string[]): Promise<boolean> {
  if (!ids?.length) return false
  try {
    await apiPost('/notifications/dismiss', { ids })
    return true
  } catch {
    return false
  }
}

/** Undo notification action */
export async function undoNotification(id: string): Promise<Notification | null> {
  if (!id?.trim()) return null
  try {
    const response = (await apiPost<UndoResponse>(
      '/notifications/undo',
      { id }
    )) as UndoResponse
    return response?.data ?? null
  } catch {
    return null
  }
}

/** Fetch notification preferences */
export async function fetchNotificationPreferences(): Promise<NotificationPreference | null> {
  try {
    const response = (await apiGet<PreferencesResponse>(
      '/notificationPreferences'
    )) as PreferencesResponse
    return response?.data ?? null
  } catch {
    return getDefaultPreferences()
  }
}

/** Update notification preferences */
export async function updateNotificationPreferences(
  preferences: NotificationPreference
): Promise<NotificationPreference | null> {
  try {
    const response = (await apiPut<PreferencesResponse>(
      '/notificationPreferences',
      { preferences }
    )) as PreferencesResponse
    return response?.data ?? null
  } catch {
    return null
  }
}

/** Mock notifications for development */
function getMockNotifications(): Notification[] {
  const now = new Date()
  return [
    {
      id: 'n1',
      type: 'agent_action',
      title: 'AI suggested 3 tasks for "Q1 Launch"',
      message: 'Based on your project deadlines and availability',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      canUndo: true,
      snoozable: true,
    },
    {
      id: 'n2',
      type: 'finance',
      title: 'Budget anomaly: $120 at Coffee Shop',
      message: 'Unusual amount for this merchant category',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      read: false,
      data: { amount: 120, merchant: 'Coffee Shop' },
      canUndo: true,
      snoozable: true,
    },
    {
      id: 'n3',
      type: 'schedule',
      title: 'Content "Blog Post" scheduled for tomorrow',
      message: 'Publish at 9:00 AM',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      snoozable: true,
    },
    {
      id: 'n4',
      type: 'health',
      title: 'Workout reminder: Upper body today',
      message: 'Based on your training plan',
      timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      read: true,
      snoozable: true,
    },
    {
      id: 'n5',
      type: 'project',
      title: 'Project "Q1 Launch" milestone due in 3 days',
      message: 'Design phase completion',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      read: false,
      data: { projectId: 'p1', milestone: 'Design phase' },
      snoozable: true,
    },
  ]
}

function getDefaultPreferences(): NotificationPreference {
  return {
    channels: {
      email: true,
      push: false,
      inApp: true,
    },
    perType: {},
    doNotDisturb: { start: '22:00', end: '08:00' },
  }
}
