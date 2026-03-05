import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { NotificationFilters, NotificationType } from '@/types/notifications'
import { NOTIFICATION_TYPE_META } from '@/types/notifications'

const TIME_RANGES = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' },
] as const

const NOTIFICATION_TYPES: NotificationType[] = [
  'agent_action',
  'schedule',
  'finance',
  'health',
  'project',
]

export interface NotificationFiltersBarProps {
  filters: NotificationFilters
  onFiltersChange: (filters: Partial<NotificationFilters>) => void
  onMarkAllRead?: () => void
}

export function NotificationFiltersBar({
  filters,
  onFiltersChange,
  onMarkAllRead,
}: NotificationFiltersBarProps) {
  const {
    selectedTypes = [],
    timeRange = '7d',
    searchQuery = '',
    unreadOnly = false,
  } = filters ?? {}

  const safeSelectedTypes = Array.isArray(selectedTypes) ? selectedTypes : []

  const toggleType = (type: NotificationType) => {
    const next = safeSelectedTypes.includes(type)
      ? safeSelectedTypes.filter((t) => t !== type)
      : [...safeSelectedTypes, type]
    onFiltersChange({ selectedTypes: next })
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4"
      role="search"
      aria-label="Filter notifications"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) =>
              onFiltersChange({ searchQuery: e.target?.value ?? '' })
            }
            className="pl-9"
            aria-label="Search notifications"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={(v) =>
              onFiltersChange({
                timeRange: v as NotificationFilters['timeRange'],
              })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {onMarkAllRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllRead}
              aria-label="Mark all as read"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            checked={unreadOnly}
            onCheckedChange={(checked) =>
              onFiltersChange({ unreadOnly: !!(checked === true) })
            }
            aria-label="Show only unread"
          />
          <span className="text-sm font-medium">Unread only</span>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Type:</span>
          {NOTIFICATION_TYPES.map((type) => {
            const meta = NOTIFICATION_TYPE_META[type]
            const isActive = safeSelectedTypes.length === 0 || safeSelectedTypes.includes(type)
            return (
              <Button
                key={type}
                variant={safeSelectedTypes.includes(type) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleType(type)}
                className={cn(
                  'transition-transform hover:scale-[1.02]',
                  !isActive && 'opacity-50'
                )}
              >
                {meta.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
