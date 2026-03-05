/**
 * Admin Dashboard data models.
 * All types support null-safe access patterns.
 */

export interface UserProfile {
  bio?: string
  metadata?: Record<string, unknown>
}

export interface User {
  id: string
  username: string
  email: string
  status: 'active' | 'suspended'
  role: string
  region?: string
  avatarUrl?: string
  lastActiveAt?: string
  profile?: UserProfile
  createdAt: string
}

export type ModerationItemType = 'post' | 'comment' | 'media'

export interface ModerationItem {
  id: string
  type: ModerationItemType
  contentPreview: string
  reportedCount: number
  status: string
  createdAt: string
  flaggedBy?: string[]
}

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical'

export interface Alert {
  id: string
  severity: AlertSeverity
  message: string
  timestamp: string
  acknowledged: boolean
}

export interface Metric {
  name: string
  value: number
  delta?: number
  timestamp?: string
  sparklineData?: number[]
}

export interface ExportJob {
  id: string
  type: string
  status: string
  createdAt: string
  userIds: string[]
  fields: string[]
}

export interface EscalationTicket {
  id: string
  userId: string
  subject: string
  notes: string
  status: string
  createdAt: string
}

export interface AdminMetricsHealth {
  activeUsers?: number
  moderationQueueSize?: number
  apiErrorRate?: number
  incidentsCount?: number
  metrics?: Metric[]
}

export interface AdminUsersResponse {
  users?: User[]
  total?: number
}

export interface AdminModQueueResponse {
  items?: ModerationItem[]
  total?: number
}

export interface AdminAlertsResponse {
  alerts?: Alert[]
}
