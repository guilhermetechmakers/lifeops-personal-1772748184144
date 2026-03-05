import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { AvatarUploader } from './avatar-uploader'
import { validateName, validateEmail, validateBio } from '@/utils/validation'
import { fetchProfile, updateProfile } from '@/api/settings'
import type { UserProfile } from '@/types/settings'
import { cn } from '@/lib/utils'

function getInitialsFromName(name: string): string {
  const parts = (name ?? '').trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] ?? '') + (parts[1][0] ?? '')
  return (parts[0]?.slice(0, 2) ?? '??').toUpperCase()
}

export function ProfileSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', bio: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const loadProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchProfile()
      setProfile(data ?? null)
      if (data) {
        setForm({
          name: data.name ?? '',
          email: data.email ?? '',
          bio: (data.bio ?? '').trim(),
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProfile()
  }, [loadProfile])

  const handleOpenEdit = () => {
    if (profile) {
      setForm({
        name: profile.name ?? '',
        email: profile.email ?? '',
        bio: (profile.bio ?? '').trim(),
      })
      setErrors({})
    }
    setEditOpen(true)
  }

  const handleSave = async () => {
    const errs: Record<string, string> = {}
    const nameErr = validateName(form.name)
    if (nameErr) errs.name = nameErr
    const emailErr = validateEmail(form.email)
    if (emailErr) errs.email = emailErr
    const bioErr = validateBio(form.bio)
    if (bioErr) errs.bio = bioErr
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    const prev = profile
    setProfile((p) => (p ? { ...p, ...form } : null))
    try {
      const updated = await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        bio: form.bio.trim() || undefined,
      })
      if (updated) {
        setProfile(updated)
        toast.success('Profile updated')
        setEditOpen(false)
      } else {
        setProfile(prev)
        toast.error('Failed to save profile')
      }
    } catch {
      setProfile(prev)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = useCallback(async (_file: File): Promise<string | null> => {
    toast.success('Avatar updated')
    return null
  }, [])

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="mt-2 h-4 w-32 rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-24 w-24 rounded-full bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your account details and avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AvatarUploader
            value={profile?.avatar_url}
            fallbackInitials={profile ? getInitialsFromName(profile.name) : '??'}
            onUpload={handleAvatarUpload}
          />
          <div className="space-y-4">
            <div>
              <p className="font-medium text-foreground">{profile?.name ?? '—'}</p>
              <p className="text-sm text-muted-foreground">{profile?.email ?? '—'}</p>
              {profile?.bio && (
                <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleOpenEdit}
              className="transition-transform hover:scale-[1.02]"
            >
              Edit profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className={cn(errors.name && 'border-destructive')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className={cn(errors.email && 'border-destructive')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Input
                id="edit-bio"
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Short bio (optional)"
                maxLength={500}
                className={cn(errors.bio && 'border-destructive')}
                aria-invalid={!!errors.bio}
              />
              {errors.bio && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.bio}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{form.bio.length}/500</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleSave()}
              disabled={saving}
              className="gradient-primary"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
