/**
 * Settings types for LifeOps Personal
 * Runtime-safe with proper defaults and optional chaining.
 */

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url?: string | null
  bio?: string | null
  updated_at?: string | null
}

export interface Session {
  id: string
  device: string
  location: string
  last_used_at: string
  is_active: boolean
}

export interface SecurityState {
  user_id: string
  two_factor_enabled: boolean
  active_sessions: Session[]
}

export interface Integration {
  id: string
  user_id: string
  provider: string
  provider_label?: string
  connected_at: string
  token_status: 'active' | 'expired' | 'revoked'
  scopes?: string[]
  last_sync?: string | null
}

export type PermissionLevel = 'read' | 'write' | 'execute' | 'admin'

export interface AgentPermission {
  agent_id: string
  agent_name: string
  permissions: Record<PermissionLevel, boolean>
}

export interface AgentPermissionAuditEntry {
  id: string
  permission_id: string
  changed_by: string
  changed_at: string
  previous_state: Record<string, boolean>
  new_state: Record<string, boolean>
}

export interface ScheduledReport {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  recipients?: string[]
}

export interface NotificationPreferences {
  channels: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  scheduledReports?: ScheduledReport
  perType?: Record<string, { email?: boolean; push?: boolean; inApp?: boolean }>
}

export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface DataExport {
  id: string
  user_id: string
  status: ExportStatus
  requested_at: string
  completed_at?: string | null
  file_url?: string | null
  eta?: string | null
}

export interface Invoice {
  id: string
  date: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  pdf_url?: string | null
}

export interface Subscription {
  user_id: string
  plan_id: string
  plan_name: string
  status: 'active' | 'trialing' | 'canceled' | 'past_due'
  next_billing_date?: string | null
  payment_method?: string | null
  invoices: Invoice[]
  features?: string[]
}

export interface ApiResponse<T> {
  data?: T | null
  error?: { code?: string; message?: string; details?: unknown }
  meta?: Record<string, unknown>
}
