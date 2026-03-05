import { Globe, Linkedin, Twitter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarUploader } from '@/components/profile/avatar-uploader'
import type { UserProfile, SocialLink } from '@/types/profile'

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  website: Globe,
}

function getInitialsFromName(name: string): string {
  const parts = (name ?? '').trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] ?? '') + (parts[1][0] ?? '')
  return (parts[0]?.slice(0, 2) ?? '??').toUpperCase()
}

export interface ProfileOverviewCardProps {
  profile: UserProfile | null
  onAvatarUpload: (file: File) => Promise<string | null>
  isLoading?: boolean
}

export function ProfileOverviewCard({
  profile,
  onAvatarUpload,
  isLoading = false,
}: ProfileOverviewCardProps) {
  const socialLinks = (profile?.socialLinks ?? []) as SocialLink[]
  const safeLinks = Array.isArray(socialLinks) ? socialLinks : []

  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-all duration-200">
        <CardHeader>
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your public presence and identity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <AvatarUploader
            value={profile?.avatarUrl ?? null}
            fallbackInitials={profile ? getInitialsFromName(profile.name) : '??'}
            onUpload={onAvatarUpload}
          />
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-semibold text-foreground">
              {profile?.name ?? '—'}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{profile?.handle ?? 'handle'}
            </p>
            {safeLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 pt-2 sm:justify-start">
                {(safeLinks ?? []).map((link, i) => {
                  const Icon = SOCIAL_ICONS[link.platform?.toLowerCase() ?? ''] ?? Globe
                  return (
                    <a
                      key={`${link.platform}-${i}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:scale-105 hover:border-primary hover:text-primary"
                      aria-label={`${link.platform} profile`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
