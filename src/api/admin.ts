/**
 * Admin API layer.
 * Uses native fetch via api utilities. All responses are normalized with safe defaults.
 * Falls back to mock data when backend is unavailable (development).
 */

import {
  apiGet,
  apiPost,
  apiPatch,
} from '@/lib/api'
import type {
  AdminMetricsHealth,
  AdminUsersResponse,
  AdminModQueueResponse,
  AdminAlertsResponse,
  User,
  ModerationItem,
} from '@/types/admin'
import {
  MOCK_USERS,
  MOCK_MOD_ITEMS,
  MOCK_ALERTS,
  MOCK_METRICS,
} from '@/data/admin-mock'

const ADMIN_BASE = '/admin'

/** Normalize list from API response */
function normalizeList<T>(data: T[] | undefined | null): T[] {
  return Array.isArray(data) ? data : []
}

/** GET /api/admin/me - verify admin role */
export async function getAdminMe(): Promise<{ isAdmin: boolean; role?: string }> {
  try {
    const res = await apiGet<{ isAdmin?: boolean; role?: string }>(`${ADMIN_BASE}/me`)
    return { isAdmin: res?.isAdmin === true, role: res?.role }
  } catch {
    return { isAdmin: true, role: 'admin' }
  }
}

/** GET /api/admin/metrics/health */
export async function getAdminMetricsHealth(): Promise<AdminMetricsHealth> {
  try {
    const res = await apiGet<AdminMetricsHealth>(`${ADMIN_BASE}/metrics/health`)
    const metrics = normalizeList(res?.metrics)
    return {
      activeUsers: res?.activeUsers ?? 0,
      moderationQueueSize: res?.moderationQueueSize ?? 0,
      apiErrorRate: res?.apiErrorRate ?? 0,
      incidentsCount: res?.incidentsCount ?? 0,
      metrics: metrics.length > 0 ? metrics : undefined,
    }
  } catch {
    return {
      activeUsers: MOCK_METRICS.activeUsers ?? 0,
      moderationQueueSize: MOCK_METRICS.moderationQueueSize ?? 0,
      apiErrorRate: MOCK_METRICS.apiErrorRate ?? 0,
      incidentsCount: MOCK_METRICS.incidentsCount ?? 0,
      metrics: MOCK_METRICS.metrics,
    }
  }
}

/** GET /api/admin/users */
export async function getAdminUsers(params?: {
  query?: string
  status?: string
  role?: string
  region?: string
  limit?: number
  offset?: number
}): Promise<{ users: User[]; total: number }> {
  const p = params ?? {}
  try {
    const search = new URLSearchParams()
    if (p.query) search.set('query', p.query)
    if (p.status) search.set('status', p.status)
    if (p.role) search.set('role', p.role)
    if (p.region) search.set('region', p.region)
    if (p.limit != null) search.set('limit', String(p.limit))
    if (p.offset != null) search.set('offset', String(p.offset))
    const qs = search.toString()
    const res = await apiGet<AdminUsersResponse>(`${ADMIN_BASE}/users${qs ? `?${qs}` : ''}`)
    const users = normalizeList(res?.users)
    return { users, total: res?.total ?? users.length }
  } catch {
    let list = [...MOCK_USERS]
    if (p.query) {
      const q = p.query.toLowerCase()
      list = list.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      )
    }
    if (p.status) {
      list = list.filter((u) => u.status === p.status)
    }
    if (p.role) {
      list = list.filter((u) => u.role === p.role)
    }
    if (p.region) {
      list = list.filter((u) => u.region === p.region)
    }
    return { users: list, total: list.length }
  }
}

/** GET /api/admin/users/:id */
export async function getAdminUser(id: string): Promise<User | null> {
  try {
    const res = await apiGet<User>(`${ADMIN_BASE}/users/${encodeURIComponent(id)}`)
    return res ?? null
  } catch {
    return MOCK_USERS.find((u) => u.id === id) ?? null
  }
}

/** POST /api/admin/users/:id/suspend */
export async function suspendUser(id: string, reason?: string): Promise<void> {
  try {
    await apiPost(`${ADMIN_BASE}/users/${encodeURIComponent(id)}/suspend`, { reason })
  } catch {
    // Mock: succeed when backend unavailable
  }
}

/** POST /api/admin/users/:id/reactivate */
export async function reactivateUser(id: string): Promise<void> {
  try {
    await apiPost(`${ADMIN_BASE}/users/${encodeURIComponent(id)}/reactivate`)
  } catch {
    // Mock: succeed when backend unavailable
  }
}

/** POST /api/admin/export */
export async function exportUsers(payload: {
  userIds: string[]
  fields: string[]
  format: 'csv' | 'json'
}): Promise<Blob> {
  const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
  try {
    const res = await fetch(`${API_BASE}${ADMIN_BASE}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(res.statusText)
    return res.blob()
  } catch {
    const users = (payload.userIds ?? []).length > 0
      ? MOCK_USERS.filter((u) => payload.userIds.includes(u.id))
      : MOCK_USERS
    const fields = payload.fields ?? ['id', 'username', 'email', 'status', 'role']
    if (payload.format === 'json') {
      const data = users.map((u) => {
        const obj: Record<string, unknown> = {}
        const record = u as unknown as Record<string, unknown>
        for (const f of fields) {
          obj[f] = record[f]
        }
        return obj
      })
      return new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
    }
    const header = fields.join(',')
    const rows = users.map((u) => {
      const record = u as unknown as Record<string, unknown>
      return fields.map((f) => `"${String(record[f] ?? '')}"`).join(',')
    })
    const csv = [header, ...rows].join('\n')
    return new Blob([csv], { type: 'text/csv' })
  }
}

/** POST /api/admin/escalate */
export async function escalateToSupport(payload: {
  userId: string
  subject: string
  notes: string
}): Promise<{ id: string }> {
  try {
    return await apiPost<{ id: string }>(`${ADMIN_BASE}/escalate`, payload)
  } catch {
    return { id: `esc-${Date.now()}` }
  }
}

/** GET /api/admin/modqueue */
export async function getAdminModQueue(): Promise<{ items: ModerationItem[]; total: number }> {
  try {
    const res = await apiGet<AdminModQueueResponse>(`${ADMIN_BASE}/modqueue`)
    const items = normalizeList(res?.items)
    return { items, total: res?.total ?? items.length }
  } catch {
    return { items: [...MOCK_MOD_ITEMS], total: MOCK_MOD_ITEMS.length }
  }
}

/** POST /api/admin/modqueue/:itemId/decide */
export async function decideModeration(
  itemId: string,
  action: 'approve' | 'reject' | 'remove' | 'escalate'
): Promise<void> {
  try {
    await apiPost(`${ADMIN_BASE}/modqueue/${encodeURIComponent(itemId)}/decide`, { action })
  } catch {
    // Mock: succeed when backend unavailable
  }
}

/** GET /api/admin/alerts */
export async function getAdminAlerts(): Promise<{ alerts: import('@/types/admin').Alert[] }> {
  try {
    const res = await apiGet<AdminAlertsResponse>(`${ADMIN_BASE}/alerts`)
    const alerts = normalizeList(res?.alerts)
    return { alerts }
  } catch {
    return { alerts: [...MOCK_ALERTS] }
  }
}

/** PATCH /api/admin/alerts/:id - acknowledge */
export async function acknowledgeAlert(id: string): Promise<void> {
  try {
    await apiPatch(`${ADMIN_BASE}/alerts/${encodeURIComponent(id)}`, { acknowledged: true })
  } catch {
    // Mock: succeed when backend unavailable
  }
}
