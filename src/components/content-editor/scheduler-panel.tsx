/**
 * SchedulerPanel - Date/time picker, timezone, channels, pre-publish checklist
 */

import { useState, useEffect } from 'react'
import { Calendar, Clock, Globe, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useContentEditor } from '@/context/content-editor-context'
import { fetchChannels } from '@/api/content'
import type { Channel } from '@/types/content'
import { cn } from '@/lib/utils'

const PRESETS = [
  { label: 'Soon (1h)', offset: 60 },
  { label: 'Tomorrow 9am', offset: 24 * 60 - (new Date().getHours() - 9) * 60 },
  { label: 'Next week', offset: 7 * 24 * 60 },
] as const

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
] as const

export interface SchedulerPanelProps {
  onScheduleChange?: (date: string | null, channelIds: string[]) => void
  onAutoScheduleChange?: (enabled: boolean) => void
}

export function SchedulerPanel({
  onScheduleChange,
  onAutoScheduleChange,
}: SchedulerPanelProps) {
  const { draft } = useContentEditor()
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([])
  const [scheduledAt, setScheduledAt] = useState<string | null>(null)
  const [dateInput, setDateInput] = useState('')
  const [timeInput, setTimeInput] = useState('09:00')
  const [timezone, setTimezone] = useState('America/New_York')
  const [autoSchedule, setAutoSchedule] = useState(false)

  useEffect(() => {
    fetchChannels().then((list) => setChannels(Array.isArray(list) ? list : []))
  }, [])

  useEffect(() => {
    const ids = draft?.channel_ids ?? []
    setSelectedChannelIds(Array.isArray(ids) ? ids : [])
    setScheduledAt(draft?.scheduled_at ?? draft?.scheduledDate ?? null)
  }, [draft?.channel_ids, draft?.scheduled_at, draft?.scheduledDate])

  useEffect(() => {
    onScheduleChange?.(scheduledAt, selectedChannelIds)
  }, [scheduledAt, selectedChannelIds, onScheduleChange])

  useEffect(() => {
    onAutoScheduleChange?.(autoSchedule)
  }, [autoSchedule, onAutoScheduleChange])

  const applyPreset = (offsetMinutes: number) => {
    const d = new Date()
    d.setMinutes(d.getMinutes() + offsetMinutes)
    setDateInput(d.toISOString().slice(0, 10))
    setTimeInput(d.toTimeString().slice(0, 5))
    setScheduledAt(d.toISOString())
  }

  const applyDateTime = () => {
    const combined = `${dateInput}T${timeInput}:00`
    const d = new Date(combined)
    if (!isNaN(d.getTime())) setScheduledAt(d.toISOString())
  }

  const toggleChannel = (id: string) => {
    setSelectedChannelIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const checklist = [
    {
      id: 'title',
      label: 'Title (6-120 chars)',
      pass: (draft?.title?.length ?? 0) >= 6 && (draft?.title?.length ?? 0) <= 120,
    },
    {
      id: 'content',
      label: 'Content (20+ chars)',
      pass: (draft?.content?.length ?? 0) >= 20,
    },
    {
      id: 'channels',
      label: 'At least one channel',
      pass: selectedChannelIds.length > 0,
    },
    {
      id: 'schedule',
      label: 'Schedule date (if scheduling)',
      pass: !scheduledAt || new Date(scheduledAt) > new Date(),
    },
  ]

  const safeChannels = Array.isArray(channels) ? channels : []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Calendar className="h-5 w-5 text-primary" aria-hidden />
        <CardTitle className="text-base">Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-schedule">Auto-schedule</Label>
          <Switch
            id="auto-schedule"
            checked={autoSchedule}
            onCheckedChange={setAutoSchedule}
          />
        </div>

        <div className="space-y-2">
          <Label>Presets</Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p.label}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(p.offset)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="sched-date">Date</Label>
            <input
              id="sched-date"
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="sched-time">Time</Label>
            <input
              id="sched-time"
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
            />
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={applyDateTime}>
          <Clock className="h-4 w-4 mr-2" />
          Apply date & time
        </Button>

        <div className="space-y-1">
          <Label className="flex items-center gap-1.5">
            <Globe className="h-4 w-4" />
            Timezone
          </Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Channels</Label>
          <div className="flex flex-wrap gap-2">
            {safeChannels.map((ch) => (
              <Button
                key={ch.id}
                variant={selectedChannelIds.includes(ch.id) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleChannel(ch.id)}
              >
                {ch.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Pre-publish checklist</Label>
          <ul className="space-y-1.5">
            {checklist.map((c) => (
              <li
                key={c.id}
                className={cn(
                  'flex items-center gap-2 text-sm',
                  c.pass ? 'text-green-600' : 'text-muted-foreground'
                )}
              >
                {c.pass ? (
                  <CheckCircle className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
