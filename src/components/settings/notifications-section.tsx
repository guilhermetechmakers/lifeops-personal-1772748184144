import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Mail, Bell, Smartphone, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchNotificationSettings, updateNotificationSettings } from '@/api/settings'
import type { NotificationPreferences, ScheduledReport } from '@/types/settings'

const DEFAULT_SCHEDULED: ScheduledReport = {
  enabled: false,
  frequency: 'weekly',
  time: '09:00',
  recipients: [],
}

const DEFAULT_PREFS: NotificationPreferences = {
  channels: { email: true, push: false, inApp: true },
  scheduledReports: DEFAULT_SCHEDULED,
}

export function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadPrefs = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchNotificationSettings()
      setPrefs(data ?? DEFAULT_PREFS)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPrefs()
  }, [loadPrefs])

  const channels = prefs?.channels ?? { email: true, push: false, inApp: true }
  const scheduled = prefs?.scheduledReports ?? DEFAULT_SCHEDULED

  const updateChannel = useCallback((key: 'email' | 'push' | 'inApp', value: boolean) => {
    setPrefs((p) => ({
      ...(p ?? DEFAULT_PREFS),
      channels: {
        ...(p?.channels ?? { email: true, push: false, inApp: true }),
        [key]: value,
      },
    }))
  }, [])

  const updateScheduledReports = useCallback((updates: Partial<ScheduledReport>) => {
    setPrefs((p) => ({
      ...(p ?? DEFAULT_PREFS),
      channels: p?.channels ?? { email: true, push: false, inApp: true },
      scheduledReports: {
        ...(p?.scheduledReports ?? DEFAULT_SCHEDULED),
        ...updates,
      },
    }))
  }, [])

  const handleSave = useCallback(async () => {
    if (!prefs) return
    setSaving(true)
    try {
      const updated = await updateNotificationSettings(prefs)
      if (updated) {
        setPrefs(updated)
        toast.success('Notification preferences saved')
      } else {
        toast.error('Failed to save preferences')
      }
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }, [prefs])

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="mt-2 h-4 w-32 rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-12 rounded bg-muted" />
            <div className="h-12 rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose how you receive alerts (email, push, in-app)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="ch-email" className="font-medium">
                  Email
                </Label>
                <p className="text-sm text-muted-foreground">
                  AI actions and alerts
                </p>
              </div>
            </div>
            <Switch
              id="ch-email"
              checked={channels.email}
              onCheckedChange={(v) => updateChannel('email', !!v)}
              aria-label="Enable email notifications"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="ch-push" className="font-medium">
                  Push notifications
                </Label>
                <p className="text-sm text-muted-foreground">Mobile alerts</p>
              </div>
            </div>
            <Switch
              id="ch-push"
              checked={channels.push}
              onCheckedChange={(v) => updateChannel('push', !!v)}
              aria-label="Enable push notifications"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="ch-inApp" className="font-medium">
                  In-app
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notifications Center
                </p>
              </div>
            </div>
            <Switch
              id="ch-inApp"
              checked={channels.inApp}
              onCheckedChange={(v) => updateChannel('inApp', !!v)}
              aria-label="Enable in-app notifications"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <Label htmlFor="sched-enabled" className="font-medium">
                Scheduled reports
              </Label>
              <p className="text-sm text-muted-foreground">
                Daily, weekly, or monthly digest
              </p>
            </div>
            <Switch
              id="sched-enabled"
              checked={scheduled.enabled}
              onCheckedChange={(v) => updateScheduledReports({ enabled: !!v })}
              aria-label="Enable scheduled reports"
            />
          </div>
          {scheduled.enabled && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={scheduled.frequency}
                  onValueChange={(v) =>
                    updateScheduledReports({
                      frequency: v as 'daily' | 'weekly' | 'monthly',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sched-time">Delivery time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="sched-time"
                    type="time"
                    value={scheduled.time}
                    onChange={(e) =>
                      updateScheduledReports({ time: e.target.value })
                    }
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/dashboard/notifications">
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="h-4 w-4" />
              Open Notifications Center
            </Button>
          </Link>
          <Button
            onClick={() => void handleSave()}
            disabled={saving}
            className="gradient-primary"
          >
            {saving ? 'Saving...' : 'Save preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
