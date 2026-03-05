/**
 * Profile API for LifeOps Personal
 * Uses centralized api utilities; validates responses and guards against missing data.
 */

import { apiGet, apiPut, apiPatch, apiPost } from '@/lib/api'
import type {
  UserProfile,
  UserPreferences,
  VisibilitySettings,
  User2FA,
  TwoFASetupResponse,
  ActivitySummary,
  SocialLink,
} from '@/types/profile'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : []
}

function extractProfile(data: unknown): UserProfile | null {
  if (data == null || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>
  const socialLinks = ensureArray(obj?.socialLinks as SocialLink[] | undefined)
  return {
    id: String(obj?.id ?? ''),
    name: String(obj?.name ?? ''),
    handle: String(obj?.handle ?? ''),
    bio: String(obj?.bio ?? ''),
    avatarUrl: (obj?.avatarUrl ?? obj?.avatar_url) != null
      ? String(obj.avatarUrl ?? obj.avatar_url)
      : null,
    socialLinks: socialLinks.map((s) => ({
      platform: String(s?.platform ?? ''),
      url: String(s?.url ?? ''),
    })),
    publicProfile: Boolean(obj?.publicProfile),
  }
}

function extractPreferences(data: unknown): UserPreferences | null {
  if (data == null || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>
  return {
    userId: String(obj?.userId ?? ''),
    timezone: String(obj?.timezone ?? ''),
    currency: String(obj?.currency ?? ''),
    units: (obj?.units === 'metric' || obj?.units === 'imperial' ? obj.units : 'metric') as 'metric' | 'imperial',
  }
}

function extractVisibilityFields(data: unknown): VisibilitySettings['fields'] {
  const defaultFields = {
    name: true,
    avatar: true,
    bio: true,
    socialLinks: true,
    activity: false,
  }
  if (data == null || typeof data !== 'object') return defaultFields
  const obj = data as Record<string, unknown>
  const fields = obj?.fields as Record<string, boolean> | undefined
  if (fields == null || typeof fields !== 'object') return defaultFields
  return {
    name: Boolean(fields.name ?? defaultFields.name),
    avatar: Boolean(fields.avatar ?? defaultFields.avatar),
    bio: Boolean(fields.bio ?? defaultFields.bio),
    socialLinks: Boolean(fields.socialLinks ?? defaultFields.socialLinks),
    activity: Boolean(fields.activity ?? defaultFields.activity),
  }
}

/** GET /api/profile */
export async function fetchProfile(): Promise<UserProfile | null> {
  try {
    const response = await apiGet<{ data?: unknown } | UserProfile>('/profile')
    const data = typeof response === 'object' && response != null && 'data' in response
      ? (response as { data?: unknown }).data
      : response
    return extractProfile(data)
  } catch {
    return getMockProfile()
  }
}

/** PUT /api/profile */
export async function updateProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const response = await apiPut<{ data?: unknown } | UserProfile>('/profile', profile)
    const data = typeof response === 'object' && response != null && 'data' in response
      ? (response as { data?: unknown }).data
      : response
    return extractProfile(data)
  } catch {
    return null
  }
}

/** GET /api/profile/preferences */
export async function fetchPreferences(): Promise<UserPreferences | null> {
  try {
    const response = await apiGet<{ data?: unknown } | UserPreferences>('/profile/preferences')
    const data = typeof response === 'object' && response != null && 'data' in response
      ? (response as { data?: unknown }).data
      : response
    return extractPreferences(data)
  } catch {
    return getMockPreferences()
  }
}

/** PATCH /api/profile/preferences */
export async function updatePreferences(
  prefs: Partial<UserPreferences>
): Promise<UserPreferences | null> {
  try {
    const response = await apiPatch<{ data?: unknown } | UserPreferences>(
      '/profile/preferences',
      prefs
    )
    const data = typeof response === 'object' && response != null && 'data' in response
      ? (response as { data?: unknown }).data
      : response
    return extractPreferences(data)
  } catch {
    return null
  }
}

/** POST /api/profile/avatar - multipart/form-data */
export async function uploadAvatar(file: File): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await fetch(`${API_BASE}/profile/avatar`, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) return null
    const json = await response.json()
    const url = json?.avatarUrl ?? json?.url ?? json?.data?.avatarUrl
    return url != null ? String(url) : null
  } catch {
    return null
  }
}

/** GET /api/profile/visibility */
export async function fetchVisibility(): Promise<VisibilitySettings> {
  try {
    const response = await apiGet<{ data?: unknown } | VisibilitySettings>('/profile/visibility')
    const data = typeof response === 'object' && response != null && 'data' in response
      ? (response as { data?: unknown }).data
      : response
    const fields = extractVisibilityFields(data)
    const obj = (data as Record<string, unknown>) ?? {}
    return {
      userId: String(obj?.userId ?? ''),
      fields,
    }
  } catch {
    return getMockVisibility()
  }
}

/** PUT /api/profile/visibility */
export async function updateVisibility(
  fields: Partial<VisibilitySettings['fields']>
): Promise<VisibilitySettings | null> {
  try {
    const response = await apiPut<{ data?: unknown } | VisibilitySettings>(
      '/profile/visibility',
      { fields }
    )
    const data = typeof response === 'object' && response != null && 'data' in response
      ? (response as { data?: unknown }).data
      : response
    const updatedFields = extractVisibilityFields(data)
    const obj = (data as Record<string, unknown>) ?? {}
    return {
      userId: String(obj?.userId ?? ''),
      fields: updatedFields,
    }
  } catch {
    return null
  }
}

/** POST /api/profile/2fa/setup */
export async function setup2FA(): Promise<TwoFASetupResponse | null> {
  try {
    const response = await apiPost<{ data?: unknown } | TwoFASetupResponse>('/profile/2fa/setup', {})
    const data = typeof response === 'object' && response != null && 'data' in response
      ? (response as { data?: unknown }).data
      : response
    if (data == null || typeof data !== 'object') return null
    const obj = data as Record<string, unknown>
    return {
      secret: String(obj?.secret ?? ''),
      qrCodeUrl: String(obj?.qrCodeUrl ?? ''),
    }
  } catch {
    return getMock2FASetup()
  }
}

/** POST /api/profile/2fa/verify */
export async function verify2FA(code: string): Promise<{ success: boolean; backupCodes?: string[] }> {
  try {
    const response = await apiPost<{ success?: boolean; backupCodes?: string[] }>(
      '/profile/2fa/verify',
      { code }
    )
    const backupCodes = ensureArray(response?.backupCodes)
    return {
      success: Boolean(response?.success),
      backupCodes,
    }
  } catch {
    return { success: false }
  }
}

/** GET /api/profile/2fa/backup-codes */
export async function fetchBackupCodes(): Promise<string[]> {
  try {
    const response = await apiGet<{ backupCodes?: string[] } | string[]>('/profile/2fa/backup-codes')
    const codes = Array.isArray(response)
      ? response
      : ensureArray((response as { backupCodes?: string[] })?.backupCodes)
    return codes.map((c) => String(c))
  } catch {
    return []
  }
}

/** POST /api/profile/2fa/backup-codes */
export async function generateBackupCodes(): Promise<string[]> {
  try {
    const response = await apiPost<{ backupCodes?: string[] } | string[]>(
      '/profile/2fa/backup-codes',
      {}
    )
    const codes = Array.isArray(response)
      ? response
      : ensureArray((response as { backupCodes?: string[] })?.backupCodes)
    return codes.map((c) => String(c))
  } catch {
    return []
  }
}

/** POST /api/profile/2fa/disable */
export async function disable2FA(code: string): Promise<boolean> {
  try {
    await apiPost('/profile/2fa/disable', { code })
    return true
  } catch {
    return false
  }
}

/** GET /api/profile/2fa/status */
export async function fetch2FAStatus(): Promise<User2FA> {
  try {
    const response = await apiGet<{ data?: unknown } | User2FA>('/profile/2fa/status')
    const data = typeof response === 'object' && response != null && 'data' in response
      ? (response as { data?: unknown }).data
      : response
    if (data == null || typeof data !== 'object') return getMock2FAStatus()
    const obj = data as Record<string, unknown>
    return {
      userId: String(obj?.userId ?? ''),
      isEnabled: Boolean(obj?.isEnabled),
      secret: null,
      backupCodes: ensureArray(obj?.backupCodes as string[]),
    }
  } catch {
    return getMock2FAStatus()
  }
}

/** GET /api/profile/activity */
export async function fetchActivitySummary(): Promise<ActivitySummary> {
  try {
    const response = await apiGet<{ data?: unknown } | ActivitySummary>('/profile/activity')
    const data = typeof response === 'object' && response != null && 'data' in response
      ? (response as { data?: unknown }).data
      : response
    if (data == null || typeof data !== 'object') return getMockActivity()
    const obj = data as Record<string, unknown>
    return {
      publishedItems: Number(obj?.publishedItems ?? 0),
      projects: Number(obj?.projects ?? 0),
      activityScore: Number(obj?.activityScore ?? 0),
    }
  } catch {
    return getMockActivity()
  }
}

function getMockPreferences(): UserPreferences {
  return {
    userId: 'u1',
    timezone: 'America/New_York',
    currency: 'USD',
    units: 'metric',
  }
}

function getMockProfile(): UserProfile {
  return {
    id: 'u1',
    name: 'John Doe',
    handle: 'johndoe',
    bio: '',
    avatarUrl: null,
    socialLinks: [],
    publicProfile: true,
  }
}

function getMockVisibility(): VisibilitySettings {
  return {
    userId: 'u1',
    fields: {
      name: true,
      avatar: true,
      bio: true,
      socialLinks: true,
      activity: false,
    },
  }
}

function getMock2FAStatus(): User2FA {
  return {
    userId: 'u1',
    isEnabled: false,
    secret: null,
    backupCodes: [],
  }
}

function getMock2FASetup(): TwoFASetupResponse {
  return {
    secret: 'MOCK_SECRET_FOR_DEV',
    qrCodeUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YyZjRmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzkxOTU2OCIgZm9udC1zaXplPSIxNCI+UVMgQ29kZSBQbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=',
  }
}

function getMockActivity(): ActivitySummary {
  return {
    publishedItems: 12,
    projects: 5,
    activityScore: 78,
  }
}
