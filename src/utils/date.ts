/**
 * Date/time formatting utilities for LifeOps Personal
 */

export function formatRelativeTime(isoString: string | null | undefined): string {
  if (!isoString) return 'Unknown'
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return formatDate(isoString)
}

export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(isoString: string | null | undefined): string {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export type DueDatePreset = 'all' | 'overdue' | 'this_week' | 'this_month'

export function matchesDueDatePreset(
  isoString: string | null | undefined,
  preset: DueDatePreset
): boolean {
  if (!isoString || preset === 'all') return true
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return false
  const now = new Date()

  if (preset === 'overdue') {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    return dueDate < today
  }

  if (preset === 'this_week') {
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)
    return date >= startOfWeek && date <= endOfWeek
  }

  if (preset === 'this_month') {
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  }

  return true
}
