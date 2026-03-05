import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VisibilityToggle } from '@/components/profile/visibility-toggle'
import type { VisibilityFields } from '@/types/profile'

export interface VisibilityCardProps {
  fields: VisibilityFields
  onChange: (fields: Partial<VisibilityFields>) => void
  isLoading?: boolean
}

export function VisibilityCard({
  fields,
  onChange,
  isLoading = false,
}: VisibilityCardProps) {
  const safeFields = fields ?? {
    name: true,
    avatar: true,
    bio: true,
    socialLinks: true,
    activity: false,
  }

  const handleToggle = (key: keyof VisibilityFields) => (checked: boolean) => {
    onChange({ [key]: checked })
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle>Visibility</CardTitle>
        <CardDescription>
          Control which profile fields are visible to others
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <VisibilityToggle
          id="visibility-name"
          label="Display name"
          description="Show your name on your public profile"
          checked={Boolean(safeFields.name)}
          onCheckedChange={handleToggle('name')}
        />
        <VisibilityToggle
          id="visibility-avatar"
          label="Profile photo"
          description="Show your avatar to others"
          checked={Boolean(safeFields.avatar)}
          onCheckedChange={handleToggle('avatar')}
        />
        <VisibilityToggle
          id="visibility-bio"
          label="Bio"
          description="Show your short bio"
          checked={Boolean(safeFields.bio)}
          onCheckedChange={handleToggle('bio')}
        />
        <VisibilityToggle
          id="visibility-social"
          label="Social links"
          description="Show links to your social profiles"
          checked={Boolean(safeFields.socialLinks)}
          onCheckedChange={handleToggle('socialLinks')}
        />
        <VisibilityToggle
          id="visibility-activity"
          label="Activity status"
          description="Show your recent activity"
          checked={Boolean(safeFields.activity)}
          onCheckedChange={handleToggle('activity')}
        />
      </CardContent>
    </Card>
  )
}
