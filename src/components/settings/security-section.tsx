import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Shield,
  Smartphone,
  LogOut,
  Monitor,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  getPasswordStrength,
  isStrongPassword,
  validatePassword,
  validateConfirmPassword,
} from '@/utils/validation'
import { formatRelativeTime } from '@/utils/date'
import {
  fetchSecurity,
  updateSecurity,
  changePassword,
  revokeSession,
  revokeAllSessions,
} from '@/api/settings'
import type { SecurityState, Session } from '@/types/settings'
import { cn } from '@/lib/utils'

function getDeviceIcon(device: string) {
  const d = (device ?? '').toLowerCase()
  if (d.includes('iphone') || d.includes('android')) return Smartphone
  return Monitor
}

export function SecuritySection() {
  const [security, setSecurity] = useState<SecurityState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changing, setChanging] = useState(false)
  const [revoking, setRevoking] = useState<string | 'all' | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loadSecurity = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchSecurity()
      setSecurity(data ?? null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSecurity()
  }, [loadSecurity])

  const sessions = (security?.active_sessions ?? []) as Session[]
  const twoFactorEnabled = security?.two_factor_enabled ?? false

  const strength = getPasswordStrength(newPassword)

  const validatePasswordForm = useCallback((): boolean => {
    const next: Record<string, string> = {}
    if (!currentPassword.trim()) next.currentPassword = 'Current password is required'
    const newErr = validatePassword(newPassword)
    if (newErr) next.newPassword = newErr
    const confirmErr = validateConfirmPassword(newPassword, confirmPassword)
    if (confirmErr) next.confirmPassword = confirmErr
    setErrors(next)
    return Object.keys(next).length === 0
  }, [currentPassword, newPassword, confirmPassword])

  const handleChangePassword = useCallback(async () => {
    if (!validatePasswordForm()) return
    setChanging(true)
    try {
      const result = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      if (result?.success) {
        toast.success('Password updated')
        setPasswordModalOpen(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error('Failed to update password. Check current password.')
      }
    } catch {
      toast.error('Failed to update password')
    } finally {
      setChanging(false)
    }
  }, [currentPassword, newPassword, validatePasswordForm])

  const handle2FAToggle = useCallback(async (checked: boolean) => {
    setSecurity((s) => (s ? { ...s, two_factor_enabled: checked } : null))
    try {
      const updated = await updateSecurity({ two_factor_enabled: checked })
      if (updated) {
        setSecurity(updated)
        toast.success(checked ? '2FA enabled' : '2FA disabled')
      } else {
        setSecurity((s) => (s ? { ...s, two_factor_enabled: !checked } : null))
        toast.error('Failed to update 2FA')
      }
    } catch {
      setSecurity((s) => (s ? { ...s, two_factor_enabled: !checked } : null))
      toast.error('Failed to update 2FA')
    }
  }, [])

  const handleRevokeSession = useCallback(async (id: string) => {
    setRevoking(id)
    try {
      const ok = await revokeSession(id)
      if (ok) {
        setSecurity((s) =>
          s ? { ...s, active_sessions: (s.active_sessions ?? []).filter((se) => se.id !== id) } : null
        )
        toast.success('Session revoked')
      } else {
        toast.error('Failed to revoke session')
      }
    } catch {
      toast.error('Failed to revoke session')
    } finally {
      setRevoking(null)
    }
  }, [])

  const handleRevokeAll = useCallback(async () => {
    if (!confirm('Sign out from all other devices? You will stay logged in on this device.')) return
    setRevoking('all')
    try {
      const ok = await revokeAllSessions()
      if (ok) {
        setSecurity((s) =>
          s ? { ...s, active_sessions: (s.active_sessions ?? []).slice(0, 1) } : null
        )
        toast.success('All other sessions signed out')
      } else {
        toast.error('Failed to sign out other sessions')
      }
    } catch {
      toast.error('Failed to sign out other sessions')
    } finally {
      setRevoking(null)
    }
  }, [])

  const securityHealthLabel = twoFactorEnabled ? 'Strong' : 'Good'

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Password, 2FA, and active sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Security health</p>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled ? '2FA enabled' : 'Consider enabling 2FA'}
                </p>
              </div>
            </div>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium',
                twoFactorEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
              )}
            >
              {securityHealthLabel}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">Two-factor authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handle2FAToggle}
              disabled={isLoading}
              aria-label="Enable two-factor authentication"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">Change your password</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPasswordModalOpen(true)}
              className="transition-transform hover:scale-[1.02]"
            >
              Change password
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Active sessions</h4>
              {sessions.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRevokeAll}
                  disabled={!!revoking}
                  className="text-destructive hover:bg-destructive/10"
                >
                  {revoking === 'all' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Sign out all others
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {(sessions ?? []).map((session) => {
                const Icon = getDeviceIcon(session.device ?? '')
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-card"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{session.device || 'Unknown device'}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.location || 'Unknown'} · {formatRelativeTime(session.last_used_at)}
                        </p>
                      </div>
                    </div>
                    {session.is_active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={!!revoking}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        {revoking === session.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Revoke'
                        )}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(errors.currentPassword && 'border-destructive')}
                aria-invalid={!!errors.currentPassword}
              />
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(errors.newPassword && 'border-destructive')}
                aria-invalid={!!errors.newPassword}
              />
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full',
                      i <= strength.score
                        ? strength.label === 'strong'
                          ? 'bg-green-500'
                          : strength.label === 'good'
                            ? 'bg-primary'
                            : 'bg-amber-500'
                        : 'bg-muted'
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground capitalize">{strength.label}</p>
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(errors.confirmPassword && 'border-destructive')}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={changing || !isStrongPassword(newPassword)}
              className="gradient-primary"
            >
              {changing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
