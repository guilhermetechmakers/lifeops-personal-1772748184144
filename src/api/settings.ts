/**
 * Settings API for LifeOps Personal
 * Uses centralized apiClient; validates responses and guards against missing data.
 */

import {
  apiGet,
  apiPut,
  apiPatch,
  apiPost,
} from '@/lib/api'
import type {
  UserProfile,
  SecurityState,
  Integration,
  AgentPermission,
  AgentPermissionAuditEntry,
  NotificationPreferences,
  DataExport,
  Subscription,
  ApiResponse,
} from '@/types/settings'

/** Standard API response shape */
type SettingsResponse<T> = ApiResponse<T> | T

function extractData<T>(response: SettingsResponse<T> | null | undefined): T | null {
  if (response == null) return null
  if (typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data ?? null
  }
  return response as T
}

function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : []
}

/** GET /settings/profile */
export async function fetchProfile(): Promise<UserProfile | null> {
  try {
    const response = await apiGet<SettingsResponse<UserProfile>>('/settings/profile')
    return extractData(response)
  } catch {
    return getMockProfile()
  }
}

/** PUT /settings/profile */
export async function updateProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const response = await apiPut<SettingsResponse<UserProfile>>('/settings/profile', profile)
    return extractData(response)
  } catch {
    return null
  }
}

/** GET /settings/security */
export async function fetchSecurity(): Promise<SecurityState | null> {
  try {
    const response = await apiGet<SettingsResponse<SecurityState>>('/settings/security')
    return extractData(response)
  } catch {
    return getMockSecurity()
  }
}

/** PUT /settings/security */
export async function updateSecurity(security: Partial<SecurityState>): Promise<SecurityState | null> {
  try {
    const response = await apiPut<SettingsResponse<SecurityState>>('/settings/security', security)
    return extractData(response)
  } catch {
    return null
  }
}

/** POST /settings/security/change-password */
export async function changePassword(payload: {
  current_password: string
  new_password: string
}): Promise<{ success: boolean }> {
  try {
    const response = await apiPost<{ success?: boolean }>('/settings/security/change-password', payload)
    return { success: (response as { success?: boolean })?.success ?? false }
  } catch {
    return { success: false }
  }
}

/** POST /settings/security/revoke-session */
export async function revokeSession(sessionId: string): Promise<boolean> {
  try {
    await apiPost('/settings/security/revoke-session', { session_id: sessionId })
    return true
  } catch {
    return false
  }
}

/** POST /settings/security/revoke-all-sessions */
export async function revokeAllSessions(): Promise<boolean> {
  try {
    await apiPost('/settings/security/revoke-all-sessions', {})
    return true
  } catch {
    return false
  }
}

/** GET /settings/integrations */
export async function fetchIntegrations(): Promise<Integration[]> {
  try {
    const response = await apiGet<SettingsResponse<Integration[]>>('/settings/integrations')
    const data = extractData(response)
    return ensureArray(data)
  } catch {
    return getMockIntegrations()
  }
}

/** POST /settings/integrations/connect */
export async function connectIntegration(provider: string): Promise<Integration | null> {
  try {
    const response = await apiPost<SettingsResponse<Integration>>('/settings/integrations/connect', {
      provider,
    })
    return extractData(response)
  } catch {
    return null
  }
}

/** POST /settings/integrations/:id/disconnect */
export async function disconnectIntegration(id: string): Promise<boolean> {
  try {
    await apiPost(`/settings/integrations/${id}/disconnect`, {})
    return true
  } catch {
    return false
  }
}

/** GET /settings/agent-permissions */
export async function fetchAgentPermissions(): Promise<{
  agents: AgentPermission[]
  audit: AgentPermissionAuditEntry[]
}> {
  try {
    const response = await apiGet<
      SettingsResponse<{ agents: AgentPermission[]; audit: AgentPermissionAuditEntry[] }>
    >('/settings/agent-permissions')
    const data = extractData(response)
    return {
      agents: ensureArray(data?.agents),
      audit: ensureArray(data?.audit),
    }
  } catch {
    return getMockAgentPermissions()
  }
}

/** PATCH /settings/agent-permissions */
export async function updateAgentPermissions(
  updates: Record<string, Record<string, boolean>>
): Promise<boolean> {
  try {
    await apiPatch('/settings/agent-permissions', { updates })
    return true
  } catch {
    return false
  }
}

/** GET /settings/notifications */
export async function fetchNotificationSettings(): Promise<NotificationPreferences | null> {
  try {
    const response = await apiGet<SettingsResponse<NotificationPreferences>>('/settings/notifications')
    return extractData(response)
  } catch {
    return getDefaultNotificationPreferences()
  }
}

/** PATCH /settings/notifications */
export async function updateNotificationSettings(
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences | null> {
  try {
    const response = await apiPatch<SettingsResponse<NotificationPreferences>>(
      '/settings/notifications',
      preferences
    )
    return extractData(response)
  } catch {
    return null
  }
}

/** GET /settings/export */
export async function fetchExports(): Promise<DataExport[]> {
  try {
    const response = await apiGet<SettingsResponse<DataExport[]>>('/settings/export')
    const data = extractData(response)
    return ensureArray(data)
  } catch {
    return []
  }
}

/** POST /settings/export */
export async function requestExport(): Promise<DataExport | null> {
  try {
    const response = await apiPost<SettingsResponse<DataExport>>('/settings/export', {})
    return extractData(response)
  } catch {
    return null
  }
}

/** GET /settings/export/:id */
export async function fetchExportById(id: string): Promise<DataExport | null> {
  try {
    const response = await apiGet<SettingsResponse<DataExport>>(`/settings/export/${id}`)
    return extractData(response)
  } catch {
    return null
  }
}

/** GET /settings/subscription */
export async function fetchSubscription(): Promise<Subscription | null> {
  try {
    const response = await apiGet<SettingsResponse<Subscription>>('/settings/subscription')
    return extractData(response)
  } catch {
    return getMockSubscription()
  }
}

/** POST /settings/subscription/upgrade */
export async function upgradeSubscription(planId: string): Promise<boolean> {
  try {
    await apiPost('/settings/subscription/upgrade', { plan_id: planId })
    return true
  } catch {
    return false
  }
}

/** POST /settings/subscription/downgrade */
export async function downgradeSubscription(planId: string): Promise<boolean> {
  try {
    await apiPost('/settings/subscription/downgrade', { plan_id: planId })
    return true
  } catch {
    return false
  }
}

function getMockProfile(): UserProfile {
  return {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar_url: null,
    bio: '',
    updated_at: new Date().toISOString(),
  }
}

function getMockSecurity(): SecurityState {
  const now = new Date()
  return {
    user_id: 'u1',
    two_factor_enabled: false,
    active_sessions: [
      {
        id: 's1',
        device: 'Chrome on macOS',
        location: 'San Francisco, CA',
        last_used_at: now.toISOString(),
        is_active: true,
      },
      {
        id: 's2',
        device: 'Safari on iPhone',
        location: 'San Francisco, CA',
        last_used_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
      },
    ],
  }
}

const PROVIDER_LABELS: Record<string, string> = {
  bank_plaid: 'Bank (Plaid)',
  google_calendar: 'Google Calendar',
  health_apple: 'Health App',
  social: 'Social',
}

function getMockIntegrations(): Integration[] {
  return [
    {
      id: 'i1',
      user_id: 'u1',
      provider: 'bank_plaid',
      provider_label: PROVIDER_LABELS.bank_plaid ?? 'Bank',
      connected_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      token_status: 'active',
      last_sync: new Date().toISOString(),
    },
    {
      id: 'i2',
      user_id: 'u1',
      provider: 'google_calendar',
      provider_label: PROVIDER_LABELS.google_calendar ?? 'Calendar',
      connected_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      token_status: 'active',
      last_sync: new Date().toISOString(),
    },
    {
      id: 'i3',
      user_id: 'u1',
      provider: 'health_apple',
      provider_label: PROVIDER_LABELS.health_apple ?? 'Health',
      connected_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      token_status: 'expired',
      last_sync: null,
    },
  ]
}

function getMockAgentPermissions(): {
  agents: AgentPermission[]
  audit: AgentPermissionAuditEntry[]
} {
  return {
    agents: [
      {
        agent_id: 'scheduler-agent',
        agent_name: 'Scheduler Agent',
        permissions: { read: true, write: true, execute: false, admin: false },
      },
      {
        agent_id: 'finance-agent',
        agent_name: 'Finance Agent',
        permissions: { read: true, write: true, execute: false, admin: false },
      },
      {
        agent_id: 'content-agent',
        agent_name: 'Content Agent',
        permissions: { read: true, write: true, execute: false, admin: false },
      },
    ],
    audit: [
      {
        id: 'a1',
        permission_id: 'scheduler-agent',
        changed_by: 'John Doe',
        changed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        previous_state: { execute: true },
        new_state: { execute: false },
      },
    ],
  }
}

function getDefaultNotificationPreferences(): NotificationPreferences {
  return {
    channels: { email: true, push: false, inApp: true },
    scheduledReports: {
      enabled: false,
      frequency: 'weekly',
      time: '09:00',
      recipients: [],
    },
  }
}

function getMockSubscription(): Subscription {
  return {
    user_id: 'u1',
    plan_id: 'pro',
    plan_name: 'Pro',
    status: 'active',
    next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    payment_method: '•••• 4242',
    features: ['Unlimited projects', 'AI agents', 'Priority support'],
    invoices: [
      {
        id: 'inv1',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 29,
        currency: 'USD',
        status: 'paid',
        pdf_url: null,
      },
    ],
  }
}
