import * as React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { NotificationPreference } from '@/types/notifications'

export interface NotificationPreferencesPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preferences: NotificationPreference | null
  onSave: (preferences: NotificationPreference) => void
  isLoading?: boolean
}

const DEFAULT_PREFERENCES: NotificationPreference = {
  channels: {
    email: true,
    push: false,
    inApp: true,
  },
  perType: {},
  doNotDisturb: { start: '22:00', end: '08:00' },
}

export function NotificationPreferencesPanel({
  open,
  onOpenChange,
  preferences,
  onSave,
  isLoading = false,
}: NotificationPreferencesPanelProps) {
  const prefs = preferences ?? DEFAULT_PREFERENCES
  const [local, setLocal] = React.useState<NotificationPreference>(prefs)

  React.useEffect(() => {
    setLocal(prefs)
  }, [prefs, open])

  const handleChannelChange = (key: keyof NotificationPreference['channels'], value: boolean) => {
    setLocal((prev) => ({
      ...prev,
      channels: {
        ...(prev?.channels ?? DEFAULT_PREFERENCES.channels),
        [key]: value,
      },
    }))
  }

  const handleDndChange = (key: 'start' | 'end', value: string) => {
    setLocal((prev) => ({
      ...prev,
      doNotDisturb: {
        ...(prev?.doNotDisturb ?? { start: '22:00', end: '08:00' }),
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    onSave(local)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Configure how and where you receive notifications
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="channels" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="dnd">Do Not Disturb</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery channels</CardTitle>
                <CardDescription>
                  Choose where to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email</Label>
                  <Switch
                    id="email"
                    checked={local?.channels?.email ?? true}
                    onCheckedChange={(v) => handleChannelChange('email', !!v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push">Push notifications</Label>
                  <Switch
                    id="push"
                    checked={local?.channels?.push ?? false}
                    onCheckedChange={(v) => handleChannelChange('push', !!v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="inApp">In-app</Label>
                  <Switch
                    id="inApp"
                    checked={local?.channels?.inApp ?? true}
                    onCheckedChange={(v) => handleChannelChange('inApp', !!v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dnd" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Do Not Disturb</CardTitle>
                <CardDescription>
                  Quiet hours when notifications are muted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dnd-start">Start (HH:mm)</Label>
                  <Input
                    id="dnd-start"
                    type="time"
                    value={local?.doNotDisturb?.start ?? '22:00'}
                    onChange={(e) =>
                      handleDndChange('start', e.target?.value ?? '22:00')
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dnd-end">End (HH:mm)</Label>
                  <Input
                    id="dnd-end"
                    type="time"
                    value={local?.doNotDisturb?.end ?? '08:00'}
                    onChange={(e) =>
                      handleDndChange('end', e.target?.value ?? '08:00')
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="gradient-primary"
          >
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
