/**
 * Mock data for Admin Dashboard when backend is unavailable.
 * Used for development and demo. Replace with real API responses in production.
 */

import type { User, ModerationItem, Alert, AdminMetricsHealth } from '@/types/admin'

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'alice_dev',
    email: 'alice@example.com',
    status: 'active',
    role: 'user',
    region: 'US',
    avatarUrl: undefined,
    lastActiveAt: '2025-03-05T10:30:00Z',
    profile: { bio: 'Product designer' },
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'u2',
    username: 'bob_ops',
    email: 'bob@example.com',
    status: 'active',
    role: 'user',
    region: 'EU',
    lastActiveAt: '2025-03-04T18:00:00Z',
    createdAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 'u3',
    username: 'carol_suspended',
    email: 'carol@example.com',
    status: 'suspended',
    role: 'user',
    region: 'US',
    lastActiveAt: '2025-02-28T12:00:00Z',
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'u4',
    username: 'dave_premium',
    email: 'dave@example.com',
    status: 'active',
    role: 'premium',
    region: 'APAC',
    lastActiveAt: '2025-03-05T08:00:00Z',
    profile: { bio: 'Enterprise customer' },
    createdAt: '2024-04-01T00:00:00Z',
  },
]

export const MOCK_MOD_ITEMS: ModerationItem[] = [
  {
    id: 'm1',
    type: 'post',
    contentPreview: 'Sample flagged post content...',
    reportedCount: 3,
    status: 'pending',
    createdAt: '2025-03-05T09:00:00Z',
    flaggedBy: ['u1', 'u2'],
  },
  {
    id: 'm2',
    type: 'comment',
    contentPreview: 'Inappropriate comment text...',
    reportedCount: 5,
    status: 'pending',
    createdAt: '2025-03-04T14:00:00Z',
    flaggedBy: ['u3'],
  },
]

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    severity: 'warning',
    message: 'API latency above threshold',
    timestamp: '2025-03-05T10:00:00Z',
    acknowledged: false,
  },
  {
    id: 'a2',
    severity: 'info',
    message: 'Scheduled maintenance completed',
    timestamp: '2025-03-05T08:00:00Z',
    acknowledged: true,
  },
]

export const MOCK_METRICS: AdminMetricsHealth = {
  activeUsers: 1247,
  moderationQueueSize: 12,
  apiErrorRate: 0.02,
  incidentsCount: 2,
  metrics: [
    {
      name: 'activeUsers',
      value: 1247,
      delta: 5.2,
      sparklineData: [1100, 1150, 1180, 1200, 1220, 1235, 1247],
    },
    {
      name: 'modQueue',
      value: 12,
      delta: -2,
      sparklineData: [15, 14, 16, 12, 13, 12, 12],
    },
    {
      name: 'apiErrorRate',
      value: 0.02,
      delta: -0.01,
      sparklineData: [0.03, 0.025, 0.02, 0.022, 0.02, 0.018, 0.02],
    },
    {
      name: 'incidents',
      value: 2,
      delta: 1,
      sparklineData: [0, 1, 1, 2, 2, 2, 2],
    },
  ],
}
