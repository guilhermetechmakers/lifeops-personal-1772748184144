/**
 * ActivityAuditLog - Chronological record of user and AI actions
 */

import { useState, useMemo } from 'react'
import { Activity, Filter, User, Bot } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { AuditLog } from '@/types/projects'
import { formatDateTime } from '@/utils/date'

export interface ActivityAuditLogProps {
  events: AuditLog[]
  onFilterChange?: (actor: string, actionType: string) => void
}

const ACTOR_OPTIONS = [
  { value: 'all', label: 'All actors' },
  { value: 'user', label: 'User' },
  { value: 'ai', label: 'AI' },
]

const ACTION_OPTIONS = [
  { value: 'all', label: 'All actions' },
  { value: 'task_status', label: 'Task status' },
  { value: 'milestone_created', label: 'Milestone created' },
  { value: 'ai_apply', label: 'AI applied' },
  { value: 'task_created', label: 'Task created' },
]

export function ActivityAuditLog({
  events = [],
  onFilterChange,
}: ActivityAuditLogProps) {
  const [actorFilter, setActorFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')

  const filteredEvents = useMemo(() => {
    let list = Array.isArray(events) ? [...events] : []
    if (actorFilter !== 'all') {
      list = list.filter((e) => (e?.actor ?? '').toLowerCase() === actorFilter)
    }
    if (actionFilter !== 'all') {
      list = list.filter((e) => (e?.actionType ?? '') === actionFilter)
    }
    return list.sort(
      (a, b) => new Date(b?.timestamp ?? 0).getTime() - new Date(a?.timestamp ?? 0).getTime()
    )
  }, [events, actorFilter, actionFilter])

  const handleActorChange = (v: string) => {
    setActorFilter(v)
    onFilterChange?.(v, actionFilter)
  }

  const handleActionChange = (v: string) => {
    setActionFilter(v)
    onFilterChange?.(actorFilter, v)
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          Activity & Audit Log
        </CardTitle>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={actorFilter} onValueChange={handleActorChange}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTOR_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={handleActionChange}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEvents.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No activity yet
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredEvents.map((e) => {
              const isAi = (e?.actor ?? '').toLowerCase() === 'ai'
              return (
                <li
                  key={e?.id}
                  className="flex gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      isAi ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {e?.actionType?.replace(/_/g, ' ') ?? 'Action'}
                    </p>
                    {e?.details && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{e.details}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(e?.timestamp)} · {e?.actor ?? 'Unknown'}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
