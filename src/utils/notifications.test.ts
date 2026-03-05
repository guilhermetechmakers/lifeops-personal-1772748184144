import { describe, it, expect } from 'vitest'
import type { Notification } from '@/types/notifications'
import { filterNotifications, groupByType, formatNotificationTimestamp } from './notifications'

describe('filterNotifications', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'agent_action',
      title: 'AI suggested tasks',
      message: 'Tasks for project',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'finance',
      title: 'Budget alert',
      message: 'Unusual spending',
      timestamp: new Date().toISOString(),
      read: true,
    },
  ]

  it('returns empty array when notifications is null', () => {
    const result = filterNotifications(null as unknown as Notification[], {})
    expect(result).toEqual([])
  })

  it('returns empty array when notifications is undefined', () => {
    const result = filterNotifications(undefined as unknown as Notification[], {})
    expect(result).toEqual([])
  })

  it('filters by unreadOnly', () => {
    const result = filterNotifications(mockNotifications, { unreadOnly: true })
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('1')
  })

  it('filters by selectedTypes', () => {
    const result = filterNotifications(mockNotifications, {
      selectedTypes: ['finance'],
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.type).toBe('finance')
  })

  it('filters by searchQuery', () => {
    const result = filterNotifications(mockNotifications, {
      searchQuery: 'Budget',
    })
    expect(result).toHaveLength(1)
    expect(result[0]?.title).toBe('Budget alert')
  })

  it('handles empty filters', () => {
    const result = filterNotifications(mockNotifications, {})
    expect(result).toHaveLength(2)
  })
})

describe('groupByType', () => {
  it('returns empty groups when notifications is null', () => {
    const result = groupByType(null as unknown as Notification[])
    expect(result.agent_action).toEqual([])
    expect(result.finance).toEqual([])
  })

  it('handles undefined notifications', () => {
    const result = groupByType(undefined as unknown as Notification[])
    expect(result.agent_action).toEqual([])
  })

  it('groups notifications by type', () => {
    const notifications: Notification[] = [
      {
        id: '1',
        type: 'agent_action',
        title: 'A',
        message: 'M',
        timestamp: '',
        read: false,
      },
      {
        id: '2',
        type: 'agent_action',
        title: 'B',
        message: 'M',
        timestamp: '',
        read: false,
      },
      {
        id: '3',
        type: 'finance',
        title: 'C',
        message: 'M',
        timestamp: '',
        read: false,
      },
    ]
    const result = groupByType(notifications)
    expect(result.agent_action).toHaveLength(2)
    expect(result.finance).toHaveLength(1)
    expect(result.health).toHaveLength(0)
  })
})

describe('formatNotificationTimestamp', () => {
  it('returns empty string for empty input', () => {
    expect(formatNotificationTimestamp('')).toBe('')
  })

  it('returns empty string for invalid date', () => {
    expect(formatNotificationTimestamp('invalid')).toBe('')
  })

  it('returns formatted string for valid ISO date', () => {
    const result = formatNotificationTimestamp(new Date().toISOString())
    expect(result).toBe('Just now')
  })
})
