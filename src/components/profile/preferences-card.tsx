import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TimezoneSelector } from '@/components/profile/timezone-selector'
import { CurrencySelector } from '@/components/profile/currency-selector'
import type { UserPreferences } from '@/types/profile'
export interface PreferencesCardProps {
  preferences: UserPreferences | null
  onChange: (prefs: Partial<UserPreferences>) => void
  onSave: () => Promise<void>
  isSaving?: boolean
  isLoading?: boolean
}

export function PreferencesCard({
  preferences,
  onChange,
  onSave,
  isSaving = false,
  isLoading = false,
}: PreferencesCardProps) {
  const prefs = preferences ?? {
    userId: '',
    timezone: '',
    currency: 'USD',
    units: 'metric',
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="h-6 w-36 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 animate-pulse rounded-xl bg-muted" />
          <div className="h-10 animate-pulse rounded-xl bg-muted" />
          <div className="h-10 animate-pulse rounded-xl bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Timezone, currency, and unit preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <TimezoneSelector
            value={prefs.timezone ?? ''}
            onChange={(v) => onChange({ timezone: v })}
            placeholder="Select timezone"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <CurrencySelector
            value={prefs.currency ?? 'USD'}
            onChange={(v) => onChange({ currency: v })}
            placeholder="Select currency"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="units">Units</Label>
          <Select
            value={prefs.units ?? 'metric'}
            onValueChange={(v) =>
              onChange({ units: v === 'imperial' ? 'imperial' : 'metric' })
            }
          >
            <SelectTrigger id="units" className="rounded-xl">
              <SelectValue placeholder="Select units" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric" className="rounded-lg">
                Metric
              </SelectItem>
              <SelectItem value="imperial" className="rounded-lg">
                Imperial
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => void onSave()}
          disabled={isSaving}
          className="gradient-primary transition-transform hover:scale-[1.02]"
        >
          {isSaving ? 'Saving...' : 'Save preferences'}
        </Button>
      </CardContent>
    </Card>
  )
}
