/**
 * Profile page types for LifeOps Personal
 * Runtime-safe with proper defaults and optional chaining.
 */

export interface SocialLink {
  platform: string
  url: string
}

export interface UserProfile {
  id: string
  name: string
  handle: string
  bio: string
  avatarUrl: string | null
  socialLinks: SocialLink[]
  publicProfile: boolean
}

export interface UserPreferences {
  userId: string
  timezone: string
  currency: string
  units: 'metric' | 'imperial'
}

export interface VisibilityFields {
  name: boolean
  avatar: boolean
  bio: boolean
  socialLinks: boolean
  activity: boolean
}

export interface VisibilitySettings {
  userId: string
  fields: VisibilityFields
}

export interface User2FA {
  userId: string
  isEnabled: boolean
  secret: string | null
  backupCodes: string[]
}

export interface TwoFASetupResponse {
  secret: string
  qrCodeUrl: string
}

export interface ActivitySummary {
  publishedItems: number
  projects: number
  activityScore: number
}
