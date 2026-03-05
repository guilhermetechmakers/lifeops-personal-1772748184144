/**
 * ActivityAuditLog - Chronological record of user and AI agent actions
 */

import { useState, useMemo } from 'react'
import { Activity } from 'lucide-react'
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

export interface ActivityAuditLogProps {
  events: AuditLog[]
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ts
  }
}

export function ActivityAuditLog({ events = [] }: ActivityAuditLogProps) {
  const [filterType, setFilterType] = useState<string>('all')
  const [filterActor, setFilterActor] = useState<string>('all')

  const list = Array.isArray(events) ? events : []

  const filtered = useMemo(() => {
    let result = list
    if (filterType !== 'all') {
      result = result.filter((e) => e?.actionType === filterType)
    }
    if (filterActor !== 'all') {
      result = result.filter((e) => e?.actor?.toLowerCase() === filterActor.toLowerCase())
    }
    return result.sort((a, b) => {
      const ta = new Date(a?.timestamp ?? 0).getTime()
      const tb = new Date(b?.timestamp ?? 0).getTime()
      return tb - ta
    })
  }, [list, filterType, filterActor])

  const actionTypes = useMemo(() => {
    const set = new Set<string>()
    list.forEach((e) => e?.actionType && set.add(e.actionType))
    return Array.from(set)
  }, [list])

  const actors = useMemo(() => {
    const set = new Set<string>()
    list.forEach((e) => e?.actor && set.add(e.actor))
    return Array.from(set)
  }, [list])

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          Activity & Audit Log
        </CardTitle>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px]" aria-label="Filter by type">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {actionTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterActor} onValueChange={setFilterActor}>
            <SelectTrigger className="w-[100px]" aria-label="Filter by actor">
              <SelectValue placeholder="Actor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {actors.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ul className="space-y-3 max-h-[300px] overflow-y-auto">
            {filtered.map((e) => (
              <li
                key={e.id}
                className={cn(
                  'flex flex-col gap-1 rounded-lg border-l-2 py-2 pl-4',
                  e.actor?.toLowerCase() === 'ai' ? 'border-l-primary' : 'border-l-muted-foreground/50'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{e.actionType ?? 'Action'}</span>
                  <span className="text-xs text-muted-foreground">{formatTimestamp(e.timestamp ?? '')}</span>
                </div>
                <span className="text-xs text-muted-foreground">by {e.actor ?? 'Unknown'}</span>
                {e.details?.trim() && (
                  <p className="text-sm text-muted-foreground">{e.details}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
