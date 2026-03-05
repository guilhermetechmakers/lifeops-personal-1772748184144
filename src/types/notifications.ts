/**
 * Notification types and data models for the Notifications Center.
 * Runtime-safe with proper defaults and optional chaining.
 */

export type NotificationType =
  | 'agent_action'
  | 'schedule'
  | 'finance'
  | 'health'
  | 'project'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  data?: Record<string, unknown>
  relatedEventId?: string | null
  canUndo?: boolean
  snoozedUntil?: string | null
  snoozable?: boolean
}

export interface NotificationTypeMeta {
  type: NotificationType
  label: string
  icon: string
  color: string
}

export interface NotificationPreference {
  channels: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  perType?: Record<
    string,
    { email?: boolean; push?: boolean; inApp?: boolean }
  >
  doNotDisturb?: { start: string; end: string }
  subscriptionStatus?: 'active' | 'paused' | 'trial'
}

export interface NotificationFilters {
  selectedTypes: NotificationType[]
  timeRange: '24h' | '7d' | '30d' | 'custom'
  searchQuery: string
  unreadOnly: boolean
  customFrom?: string
  customTo?: string
}

export interface ApiNotificationResponse {
  success: boolean
  data?: Notification[] | null
  error?: string
}

export interface ApiPreferenceResponse {
  success: boolean
  data?: NotificationPreference | null
  error?: string
}

export const NOTIFICATION_TYPE_META: Record<NotificationType, NotificationTypeMeta> = {
  agent_action: {
    type: 'agent_action',
    label: 'Agent Action',
    icon: 'Bot',
    color: 'rgb(255 212 0)',
  },
  schedule: {
    type: 'schedule',
    label: 'Schedule',
    icon: 'Calendar',
    color: 'rgb(59 130 246)',
  },
  finance: {
    type: 'finance',
    label: 'Finance',
    icon: 'Wallet',
    color: 'rgb(34 197 94)',
  },
  health: {
    type: 'health',
    label: 'Health',
    icon: 'Heart',
    color: 'rgb(239 68 68)',
  },
  project: {
    type: 'project',
    label: 'Projects',
    icon: 'FolderKanban',
    color: 'rgb(168 85 247)',
  },
}

export const SNOOZE_PRESETS = [
  { label: '5 min', durationMs: 5 * 60 * 1000 },
  { label: '15 min', durationMs: 15 * 60 * 1000 },
  { label: '30 min', durationMs: 30 * 60 * 1000 },
  { label: '1 hour', durationMs: 60 * 60 * 1000 },
  { label: '4 hours', durationMs: 4 * 60 * 60 * 1000 },
  { label: '1 day', durationMs: 24 * 60 * 60 * 1000 },
] as const
