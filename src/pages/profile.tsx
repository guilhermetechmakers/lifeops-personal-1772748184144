import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { Save } from 'lucide-react'
import {
  ProfileOverviewCard,
  BioEditorCard,
  VisibilityCard,
  PreferencesCard,
  TwoFactorCard,
  ActivitySummaryCard,
} from '@/components/profile'
import {
  fetchProfile,
  updateProfile,
  uploadAvatar,
  fetchVisibility,
  updateVisibility,
  fetchPreferences,
  updatePreferences,
  fetch2FAStatus,
  fetchActivitySummary,
} from '@/api/profile'
import type {
  UserProfile,
  UserPreferences,
  VisibilitySettings,
  VisibilityFields,
} from '@/types/profile'
import { cn } from '@/lib/utils'

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [visibility, setVisibility] = useState<VisibilitySettings | null>(null)
  const [activity, setActivity] = useState<{ publishedItems: number; projects: number; activityScore: number } | null>(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [bioSaving, setBioSaving] = useState(false)
  const [prefsSaving, setPrefsSaving] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [profileRes, visibilityRes, twoFaRes, activityRes, prefsRes] = await Promise.all([
        fetchProfile(),
        fetchVisibility(),
        fetch2FAStatus(),
        fetchActivitySummary(),
        fetchPreferences(),
      ])
      setProfile(profileRes ?? null)
      setVisibility(visibilityRes ?? null)
      setTwoFactorEnabled(twoFaRes?.isEnabled ?? false)
      setActivity(activityRes ?? null)
      setPreferences(prefsRes ?? null)
    } catch {
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleAvatarUpload = useCallback(
    async (file: File): Promise<string | null> => {
      const url = await uploadAvatar(file)
      if (url && profile) {
        setProfile({ ...profile, avatarUrl: url })
        toast.success('Avatar updated')
      } else if (!url) {
        toast.error('Avatar upload failed')
      }
      return url
    },
    [profile]
  )

  const handleBioSave = useCallback(async (bio: string) => {
    setBioSaving(true)
    const prev = profile
    if (profile) setProfile({ ...profile, bio })
    try {
      const updated = await updateProfile({ bio })
      if (updated) {
        setProfile(updated)
        toast.success('Bio saved')
      } else {
        setProfile(prev)
        toast.error('Failed to save bio')
      }
    } catch {
      setProfile(prev ?? null)
      toast.error('Failed to save bio')
    } finally {
      setBioSaving(false)
    }
  }, [profile])

  const handleVisibilityChange = useCallback(
    async (fields: Partial<VisibilityFields>) => {
      if (!visibility) return
      const nextFields = { ...visibility.fields, ...fields }
      const prev = visibility
      setVisibility({ ...visibility, fields: nextFields })
      try {
        const updated = await updateVisibility(nextFields)
        if (updated) {
          setVisibility(updated)
          toast.success('Visibility updated')
        } else {
          setVisibility(prev)
          toast.error('Failed to update visibility')
        }
      } catch {
        setVisibility(prev)
        toast.error('Failed to update visibility')
      }
    },
    [visibility]
  )

  const handlePreferencesChange = useCallback((prefs: Partial<UserPreferences>) => {
    setPreferences((p) => (p ? { ...p, ...prefs } : null))
  }, [])

  const handlePreferencesSave = useCallback(async () => {
    if (!preferences) return
    setPrefsSaving(true)
    const prev = preferences
    try {
      const updated = await updatePreferences(preferences)
      if (updated) {
        setPreferences(updated)
        toast.success('Preferences saved')
      } else {
        setPreferences(prev)
        toast.error('Failed to save preferences')
      }
    } catch {
      setPreferences(prev)
      toast.error('Failed to save preferences')
    } finally {
      setPrefsSaving(false)
    }
  }, [preferences])

  const handleSaveAll = useCallback(async () => {
    setIsSaving(true)
    try {
      const updates: Promise<unknown>[] = []
      if (profile) {
        updates.push(
          updateProfile({
            name: profile.name,
            bio: profile.bio,
            socialLinks: profile.socialLinks,
          }).then((r) => {
            if (r) setProfile(r)
          })
        )
      }
      if (preferences) {
        updates.push(
          updatePreferences(preferences).then((r) => {
            if (r) setPreferences(r)
          })
        )
      }
      if (visibility) {
        updates.push(
          updateVisibility(visibility.fields).then((r) => {
            if (r) setVisibility(r)
          })
        )
      }
      await Promise.all(updates)
      toast.success('All changes saved')
    } catch {
      toast.error('Failed to save some changes')
    } finally {
      setIsSaving(false)
    }
  }, [profile, preferences, visibility])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your personal presence, preferences, and security
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-span-1">
          <ProfileOverviewCard
            profile={profile}
            onAvatarUpload={handleAvatarUpload}
            isLoading={isLoading}
          />
        </div>

        <div>
          <BioEditorCard
            bio={profile?.bio ?? ''}
            onSave={handleBioSave}
            isSaving={bioSaving}
          />
        </div>

        <div>
          <ActivitySummaryCard activity={activity} isLoading={isLoading} />
        </div>

        <div>
          <VisibilityCard
            fields={
              visibility?.fields ?? {
                name: true,
                avatar: true,
                bio: true,
                socialLinks: true,
                activity: false,
              }
            }
            onChange={handleVisibilityChange}
            isLoading={isLoading}
          />
        </div>

        <div>
          <PreferencesCard
            preferences={preferences}
            onChange={handlePreferencesChange}
            onSave={handlePreferencesSave}
            isSaving={prefsSaving}
            isLoading={isLoading}
          />
        </div>

        <div>
          <TwoFactorCard
            isEnabled={twoFactorEnabled}
            onStatusChange={setTwoFactorEnabled}
          />
        </div>
      </div>

      {/* FAB - Save All */}
      <button
        onClick={() => void handleSaveAll()}
        disabled={isSaving}
        className={cn(
          'fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200',
          'gradient-primary text-primary-foreground',
          'hover:scale-105 hover:shadow-xl active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'md:bottom-8'
        )}
        aria-label="Save all changes"
      >
        <Save className="h-6 w-6" />
      </button>
    </div>
  )
}
