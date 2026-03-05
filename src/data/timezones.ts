/**
 * Common timezones for profile preferences
 * Supports partial search matching
 */

export const TIMEZONES = [
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/New_York',
  'America/Phoenix',
  'America/Sao_Paulo',
  'America/Toronto',
  'Asia/Dubai',
  'Asia/Hong_Kong',
  'Asia/Jakarta',
  'Asia/Kolkata',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Melbourne',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Berlin',
  'Europe/London',
  'Europe/Paris',
  'Europe/Rome',
  'Pacific/Auckland',
  'UTC',
] as const

export type Timezone = (typeof TIMEZONES)[number]

export function filterTimezones(query: string): string[] {
  const q = (query ?? '').trim().toLowerCase()
  if (q === '') return [...TIMEZONES]
  return TIMEZONES.filter((tz) => tz.toLowerCase().includes(q))
}
