/**
 * CalendarView - Integrated calendar showing milestones and tasks
 */

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { PlannerMilestone, PlannerTask } from '@/types/project-planner'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'milestone' | 'task'
  status?: string
}

export interface CalendarViewProps {
  milestones: PlannerMilestone[]
  tasks: PlannerTask[]
  onDateClick?: (date: string) => void
  onEventClick?: (event: CalendarEvent) => void
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function CalendarView({
  milestones = [],
  tasks = [],
  onDateClick,
  onEventClick,
}: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(() => new Date())

  const events = useMemo((): CalendarEvent[] => {
    const list: CalendarEvent[] = []
    ;(milestones ?? []).forEach((m) => {
      if (m?.dueDate) {
        list.push({
          id: m.id,
          title: m.title ?? 'Untitled',
          date: m.dueDate,
          type: 'milestone',
          status: m.status,
        })
      }
    })
    ;(tasks ?? []).forEach((t) => {
      if (t?.dueDate) {
        list.push({
          id: t.id,
          title: t.title ?? 'Untitled',
          date: t.dueDate,
          type: 'task',
          status: t.status,
        })
      }
    })
    return list
  }, [milestones, tasks])

  const { days, monthLabel } = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    const startPad = first.getDay()
    const totalDays = last.getDate()
    const days: { date: Date; isCurrentMonth: boolean; dateStr: string; dayEvents: CalendarEvent[] }[] = []

    for (let i = 0; i < startPad; i++) {
      const d = new Date(year, month, -startPad + i + 1)
      days.push({
        date: d,
        isCurrentMonth: false,
        dateStr: d.toISOString().slice(0, 10),
        dayEvents: events.filter((e) => e.date === d.toISOString().slice(0, 10)),
      })
    }
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d)
      const dateStr = date.toISOString().slice(0, 10)
      days.push({
        date,
        isCurrentMonth: true,
        dateStr,
        dayEvents: events.filter((e) => e.date === dateStr),
      })
    }
    const remaining = 42 - days.length
    for (let i = 0; i < remaining; i++) {
      const d = new Date(year, month + 1, i + 1)
      days.push({
        date: d,
        isCurrentMonth: false,
        dateStr: d.toISOString().slice(0, 10),
        dayEvents: events.filter((e) => e.date === d.toISOString().slice(0, 10)),
      })
    }

    return {
      days,
      monthLabel: `${MONTHS[month]} ${year}`,
    }
  }, [viewDate, events])

  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarIcon className="h-5 w-5" />
          Calendar
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[140px] text-center text-sm font-medium">{monthLabel}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
          {days.map((cell) => (
            <div
              key={cell.dateStr}
              className={cn(
                'min-h-[80px] rounded-lg border p-1 transition-colors',
                cell.isCurrentMonth ? 'bg-card' : 'bg-muted/30',
                cell.dateStr === todayStr && 'ring-2 ring-primary'
              )}
            >
              <button
                type="button"
                onClick={() => onDateClick?.(cell.dateStr)}
                className={cn(
                  'mb-1 flex h-6 w-6 items-center justify-center rounded-full text-sm',
                  cell.dateStr === todayStr && 'bg-primary text-primary-foreground font-semibold',
                  cell.isCurrentMonth ? 'text-foreground hover:bg-muted' : 'text-muted-foreground'
                )}
              >
                {cell.date.getDate()}
              </button>
              <div className="space-y-0.5">
                {cell.dayEvents.slice(0, 2).map((ev) => (
                  <Tooltip key={ev.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => onEventClick?.(ev)}
                        className={cn(
                          'block w-full truncate rounded px-1 py-0.5 text-left text-xs',
                          ev.type === 'milestone'
                            ? 'bg-primary/20 text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {ev.title}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{ev.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {ev.type} · {ev.date}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {cell.dayEvents.length > 2 && (
                  <span className="block px-1 text-xs text-muted-foreground">
                    +{cell.dayEvents.length - 2} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
