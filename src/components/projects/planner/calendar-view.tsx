/**
 * CalendarView - Integrated calendar showing milestones and tasks as events
 */

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { MilestoneDetail, Task, CalendarViewMode } from '@/types/projects'

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'milestone' | 'task'
  status?: string
}

export interface CalendarViewProps {
  milestones: MilestoneDetail[]
  tasks: Task[]
  onEventClick?: (event: CalendarEvent) => void
  onQuickAdd?: (date: string) => void
}

function getEvents(milestones: MilestoneDetail[], tasks: Task[]): CalendarEvent[] {
  const events: CalendarEvent[] = []
  ;(milestones ?? []).forEach((m) => {
    if (m.dueDate) {
      events.push({
        id: m.id,
        title: m.title ?? 'Milestone',
        date: m.dueDate,
        type: 'milestone',
        status: m.status,
      })
    }
  })
  ;(tasks ?? []).forEach((t) => {
    if (t.dueDate) {
      events.push({
        id: t.id,
        title: t.title ?? 'Task',
        date: t.dueDate,
        type: 'task',
        status: t.status,
      })
    }
  })
  return events
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const start = first.getDay()
  const days: (Date | null)[] = []
  for (let i = 0; i < start; i++) days.push(null)
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  return days
}

function formatDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function CalendarView({
  milestones = [],
  tasks = [],
  onEventClick,
  onQuickAdd,
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month')
  const [current, setCurrent] = useState(() => new Date())

  const events = useMemo(() => getEvents(milestones, tasks), [milestones, tasks])
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach((e) => {
      const key = e.date.slice(0, 10)
      const list = map.get(key) ?? []
      list.push(e)
      map.set(key, list)
    })
    return map
  }, [events])

  const monthDays = useMemo(() => {
    return getMonthDays(current.getFullYear(), current.getMonth())
  }, [current])

  const monthName = current.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const prevMonth = () => {
    setCurrent((c) => new Date(c.getFullYear(), c.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrent((c) => new Date(c.getFullYear(), c.getMonth() + 1))
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarIcon className="h-5 w-5" />
          Calendar
        </CardTitle>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as CalendarViewMode)}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold">{monthName}</span>
          <Button variant="ghost" size="icon" onClick={nextMonth} aria-label="Next month">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {weekDays.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((d, i) => {
            if (!d) return <div key={`empty-${i}`} className="min-h-[60px]" />
            const key = formatDateKey(d)
            const dayEvents = eventsByDate.get(key) ?? []
            const isToday =
              d.getDate() === new Date().getDate() &&
              d.getMonth() === new Date().getMonth() &&
              d.getFullYear() === new Date().getFullYear()
            return (
              <div
                key={key}
                className={cn(
                  'min-h-[60px] rounded-lg border p-1 transition-colors',
                  isToday && 'border-primary bg-primary/10',
                  dayEvents.length > 0 && 'cursor-pointer hover:bg-accent/50'
                )}
                onClick={() => onQuickAdd?.(key)}
              >
                <span className={cn('text-sm', isToday && 'font-bold text-primary')}>{d.getDate()}</span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      className={cn(
                        'truncate rounded px-1 py-0.5 text-xs',
                        e.type === 'milestone' && 'bg-primary/20 text-primary-foreground',
                        e.type === 'task' && 'bg-muted text-muted-foreground'
                      )}
                      title={`${e.title} (${e.type})`}
                      onClick={(ev) => {
                        ev.stopPropagation()
                        onEventClick?.(e)
                      }}
                    >
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{dayEvents.length - 2}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
