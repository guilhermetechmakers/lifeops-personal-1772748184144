/**
 * TimelineView - Gantt-like view of milestones and tasks with durations
 */

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { MilestoneDetail, Task } from '@/types/projects'
import { formatDate } from '@/utils/date'

export interface TimelineViewProps {
  milestones: MilestoneDetail[]
  tasks: Task[]
  startDate?: string
  endDate?: string
}

function parseDate(s: string | null | undefined): Date {
  if (!s) return new Date()
  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? new Date() : d
}

export function TimelineView({
  milestones = [],
  tasks = [],
  startDate,
  endDate,
}: TimelineViewProps) {
  const { rangeStart, rangeEnd } = useMemo(() => {
    const allDates: Date[] = []
    ;(milestones ?? []).forEach((m) => m?.dueDate && allDates.push(parseDate(m.dueDate)))
    ;(tasks ?? []).forEach((t) => t?.dueDate && allDates.push(parseDate(t.dueDate)))
    const now = new Date()
    allDates.push(now)

    if (allDates.length === 0) {
      const start = new Date(now)
      start.setDate(start.getDate() - 14)
      const end = new Date(now)
      end.setDate(end.getDate() + 30)
      return { rangeStart: start, rangeEnd: end }
    }

    const min = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const max = new Date(Math.max(...allDates.map((d) => d.getTime())))
    min.setDate(min.getDate() - 7)
    max.setDate(max.getDate() + 14)
    return {
      rangeStart: startDate ? parseDate(startDate) : min,
      rangeEnd: endDate ? parseDate(endDate) : max,
    }
  }, [milestones, tasks, startDate, endDate])

  const toPercent = (d: Date) => {
    const elapsed = d.getTime() - rangeStart.getTime()
    const total = rangeEnd.getTime() - rangeStart.getTime()
    return Math.max(0, Math.min(100, (elapsed / total) * 100))
  }

  const todayPercent = toPercent(new Date())

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold">Timeline</h2>
      <div className="overflow-x-auto rounded-xl border border-border bg-card p-4">
        <div className="relative min-w-[600px]">
          {/* Current date marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
            style={{ left: `${todayPercent}%` }}
            aria-hidden
          >
            <span className="absolute -top-1 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              Today
            </span>
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Milestones</h3>
            {(milestones ?? []).length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No milestones</p>
            ) : (
              (milestones ?? []).map((m) => {
                const pct = toPercent(parseDate(m?.dueDate))
                return (
                  <div key={m?.id} className="flex items-center gap-4">
                    <span className="w-32 truncate text-sm">{m?.title ?? 'Untitled'}</span>
                    <div className="relative h-6 flex-1 rounded bg-muted">
                      <div
                        className="absolute h-full w-2 -translate-x-1/2 rounded-full bg-primary"
                        style={{ left: `${pct}%` }}
                        title={formatDate(m?.dueDate)}
                      />
                    </div>
                    <span className="w-24 text-right text-xs text-muted-foreground">
                      {formatDate(m?.dueDate)}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Tasks */}
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Tasks</h3>
            {(tasks ?? []).length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No tasks</p>
            ) : (
              (tasks ?? [])
                .filter((t) => t?.dueDate)
                .slice(0, 10)
                .map((t) => {
                  const d = parseDate(t?.dueDate)
                  const pct = toPercent(d)
                  return (
                    <div key={t?.id} className="flex items-center gap-4">
                      <span className="w-32 truncate text-sm">{t?.title ?? 'Untitled'}</span>
                      <div className="relative h-6 flex-1 rounded bg-muted">
                        <div
                          className={cn(
                            'absolute h-full min-w-[4px] rounded',
                            t?.status === 'Done' ? 'bg-primary' : 'bg-primary/60'
                          )}
                          style={{
                            left: `${Math.max(0, pct - 2)}%`,
                            width: '4%',
                          }}
                          title={formatDate(t?.dueDate)}
                        />
                      </div>
                      <span className="w-24 text-right text-xs text-muted-foreground">
                        {formatDate(t?.dueDate)}
                      </span>
                    </div>
                  )
                })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
