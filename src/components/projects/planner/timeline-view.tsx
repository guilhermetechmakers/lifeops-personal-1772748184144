/**
 * TimelineView - Gantt-like bars for milestones and tasks with durations, dependencies, current date
 */

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { MilestoneDetail, Task } from '@/types/projects'

export interface TimelineViewProps {
  milestones: MilestoneDetail[]
  tasks: Task[]
  startDate?: string
  endDate?: string
}

function parseDate(s: string | null | undefined): number {
  if (!s) return NaN
  const d = new Date(s)
  return d.getTime()
}

function getRange(
  milestones: MilestoneDetail[],
  tasks: Task[]
): { start: Date; end: Date; totalDays: number } {
  const allDates: number[] = []
  ;(milestones ?? []).forEach((m) => {
    const t = parseDate(m.dueDate)
    if (!Number.isNaN(t)) allDates.push(t)
  })
  ;(tasks ?? []).forEach((t) => {
    const d = parseDate(t.dueDate)
    if (!Number.isNaN(d)) allDates.push(d)
  })
  const now = Date.now()
  allDates.push(now)
  if (allDates.length === 0) {
    const start = new Date(now)
    start.setDate(start.getDate() - 7)
    const end = new Date(now)
    end.setDate(end.getDate() + 30)
    return { start, end, totalDays: 37 }
  }
  const min = Math.min(...allDates)
  const max = Math.max(...allDates)
  const start = new Date(min)
  start.setHours(0, 0, 0, 0)
  const end = new Date(max)
  end.setDate(end.getDate() + 7)
  end.setHours(0, 0, 0, 0)
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
  return { start, end, totalDays }
}

function getLeftPercent(date: Date, start: Date, totalDays: number): number {
  const elapsed = (date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
  return Math.max(0, Math.min(100, (elapsed / totalDays) * 100))
}

export function TimelineView({
  milestones = [],
  tasks = [],
  startDate,
  endDate,
}: TimelineViewProps) {
  const { start, totalDays } = useMemo((): { start: Date; end: Date; totalDays: number } => {
    if (startDate && endDate) {
      const s = new Date(startDate)
      const e = new Date(endDate)
      const days = Math.ceil((e.getTime() - s.getTime()) / (24 * 60 * 60 * 1000))
      return { start: s, end: e, totalDays: days }
    }
    return getRange(milestones, tasks)
  }, [milestones, tasks, startDate, endDate])

  const now = Date.now()
  const todayLeft = getLeftPercent(new Date(now), start, totalDays)

  const milestoneItems = (milestones ?? []).map((m) => {
    const d = parseDate(m.dueDate)
    const left = Number.isNaN(d) ? 0 : getLeftPercent(new Date(d), start, totalDays)
    return { ...m, left }
  })

  const taskItems = (tasks ?? []).map((t) => {
    const d = parseDate(t.dueDate)
    const left = Number.isNaN(d) ? 0 : getLeftPercent(new Date(d), start, totalDays)
    const width = 8
    return { ...t, left, width }
  })

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4">
      <h3 className="mb-4 font-semibold">Timeline</h3>
      <div className="relative min-w-[600px]">
        <div className="relative h-24">
          {/* Today marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary"
            style={{ left: `${todayLeft}%` }}
            aria-hidden
          >
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              Today
            </span>
          </div>

          {/* Milestone bars */}
          <div className="space-y-2">
            {milestoneItems.map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <span className="w-32 truncate text-sm font-medium">{m.title ?? 'Milestone'}</span>
                <div className="relative flex-1 h-6 rounded bg-muted">
                  <div
                    className="absolute h-full w-2 rounded-full bg-primary"
                    style={{ left: `${m.left}%`, transform: 'translateX(-50%)' }}
                    title={m.dueDate ?? ''}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Task bars */}
          <div className="mt-4 space-y-2">
            {taskItems.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span className="w-32 truncate text-sm text-muted-foreground">{t.title ?? 'Task'}</span>
                <div className="relative flex-1 h-5 rounded bg-muted/50">
                  <div
                    className={cn(
                      'absolute h-full rounded',
                      t.status === 'Done' && 'bg-green-500/70',
                      t.status === 'In Progress' && 'bg-primary',
                      t.status === 'Review' && 'bg-amber-500/70',
                      t.status === 'Backlog' && 'bg-muted-foreground/30'
                    )}
                    style={{
                      left: `${Math.max(0, t.left - 2)}%`,
                      width: `${t.width}%`,
                    }}
                    title={`${t.title ?? 'Task'} - ${t.dueDate ?? 'No date'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
