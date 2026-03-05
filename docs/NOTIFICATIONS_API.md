# Notifications Center – API Contract & Data Models

## API Endpoints

### GET /api/notifications

Fetch notifications with optional filters.

**Query parameters:**

| Param    | Type   | Description                          |
|----------|--------|--------------------------------------|
| types    | string | Comma-separated notification types   |
| read     | string | `"false"` for unread only            |
| range    | string | `24h`, `7d`, `30d`                   |
| query    | string | Search in title/message               |
| from     | string | ISO date for custom range start       |
| to       | string | ISO date for custom range end         |

**Response:** `{ success: true, data: Notification[] }` or `Notification[]`

---

### POST /api/notifications/markRead

Mark notifications as read.

**Body:** `{ ids: string[] }`

**Response:** `{ success: true, data: Notification[] }`

---

### POST /api/notifications/snooze

Snooze notifications.

**Body:** `{ ids: string[], durationMs: number }`

**Response:** `{ success: true, data: Notification[] }`

---

### POST /api/notifications/undo

Undo a notification action.

**Body:** `{ id: string }`

**Response:** `{ success: true, data: Notification | null }`

---

### GET /api/notificationPreferences

Fetch notification preferences.

**Response:** `{ success: true, data: NotificationPreference | null }`

---

### PUT /api/notificationPreferences

Update notification preferences.

**Body:** `{ preferences: NotificationPreference }`

**Response:** `{ success: true, data: NotificationPreference | null }`

---

## Data Models

### Notification

```ts
interface Notification {
  id: string
  type: 'agent_action' | 'schedule' | 'finance' | 'health' | 'project'
  title: string
  message: string
  timestamp: string  // ISO
  read: boolean
  data?: Record<string, unknown>
  relatedEventId?: string | null
  canUndo?: boolean
  snoozedUntil?: string | null
  snoozable?: boolean
}
```

### NotificationPreference

```ts
interface NotificationPreference {
  channels: { email: boolean; push: boolean; inApp: boolean }
  perType?: Record<string, { email?: boolean; push?: boolean; inApp?: boolean }>
  doNotDisturb?: { start: string; end: string }  // HH:mm
  subscriptionStatus?: 'active' | 'paused' | 'trial'
}
```

---

## State Flow

1. Page load → `loadNotifications()` with current filters
2. Filter change → `updateFilters()` → `loadNotifications()` (via effect)
3. Mark read → optimistic update → API → rollback on error
4. Snooze → open modal → confirm → optimistic update → API
5. Undo → API → refresh list on success
6. Preferences → load on mount, save on confirm

---

## Testing Plan

- **Unit:** `filterNotifications`, `groupByType`, `formatTimestamp` (null-safety)
- **Unit:** `useNotifications` with mocked API (markRead, snooze, undo)
- **Integration:** Full flow: fetch → filter → mark read → snooze → undo
- **Integration:** Preferences load and save
