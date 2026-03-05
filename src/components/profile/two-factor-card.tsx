import { useState, useCallback } from 'react'
import { Shield, ShieldCheck, Copy, Check } from 'lucide-react'
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
} from '@/components/ui/dialog'
import { TwoFactorSetupWizard } from '@/components/profile/two-factor-setup-wizard'
import {
  setup2FA,
  verify2FA,
  disable2FA,
  fetchBackupCodes,
  generateBackupCodes,
} from '@/api/profile'
import { cn } from '@/lib/utils'

export interface TwoFactorCardProps {
  isEnabled: boolean
  onStatusChange: (enabled: boolean) => void
}

export function TwoFactorCard({ isEnabled, onStatusChange }: TwoFactorCardProps) {
  const [setupOpen, setSetupOpen] = useState(false)
  const [disableOpen, setDisableOpen] = useState(false)
  const [backupOpen, setBackupOpen] = useState(false)
  const [setupData, setSetupData] = useState<{ secret: string; qrCodeUrl: string } | null>(null)
  const [disableCode, setDisableCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleEnableClick = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await setup2FA()
      if (data) {
        setSetupData({ secret: data.secret, qrCodeUrl: data.qrCodeUrl })
        setSetupOpen(true)
      } else {
        toast.error('Failed to start 2FA setup')
      }
    } catch {
      toast.error('Failed to start 2FA setup')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleVerify = useCallback(async (code: string) => {
    const result = await verify2FA(code)
    if (result.success) {
      setSetupOpen(false)
      setSetupData(null)
      onStatusChange(true)
      toast.success('Two-factor authentication enabled')
      return { success: true, backupCodes: result.backupCodes }
    }
    return { success: false }
  }, [onStatusChange])

  const handleDisable = useCallback(async () => {
    const trimmed = disableCode.trim()
    if (!trimmed) {
      setError('Please enter your verification code')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const ok = await disable2FA(trimmed)
      if (ok) {
        setDisableOpen(false)
        setDisableCode('')
        onStatusChange(false)
        toast.success('Two-factor authentication disabled')
      } else {
        setError('Invalid code. Please try again.')
      }
    } catch {
      setError('Failed to disable 2FA')
    } finally {
      setIsLoading(false)
    }
  }, [disableCode, onStatusChange])

  const handleShowBackupCodes = useCallback(async () => {
    setIsLoading(true)
    try {
      const codes = await fetchBackupCodes()
      setBackupCodes(codes ?? [])
      setBackupOpen(true)
    } catch {
      toast.error('Failed to load backup codes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRegenerateBackupCodes = useCallback(async () => {
    setIsLoading(true)
    try {
      const codes = await generateBackupCodes()
      setBackupCodes(codes ?? [])
      toast.success('New backup codes generated')
    } catch {
      toast.error('Failed to generate backup codes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleCopyCode = useCallback(async (index: number) => {
    const codes = backupCodes ?? []
    const c = codes[index]
    if (!c) return
    try {
      await navigator.clipboard.writeText(c)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
      toast.success('Code copied to clipboard')
    } catch {
      toast.error('Failed to copy')
    }
  }, [backupCodes])

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security with your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEnabled ? (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50/50 px-4 py-3 dark:border-green-900 dark:bg-green-950/30">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  2FA is enabled
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowBackupCodes}
                  disabled={isLoading}
                >
                  View backup codes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDisableOpen(true)}
                  disabled={isLoading}
                >
                  Disable 2FA
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={() => void handleEnableClick()}
              disabled={isLoading}
              className="gradient-primary"
            >
              Enable 2FA
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={setupOpen} onOpenChange={setSetupOpen}>
        <DialogContent className="sm:max-w-md">
          {setupData && (
            <TwoFactorSetupWizard
              qrCodeUrl={setupData.qrCodeUrl}
              secret={setupData.secret}
              onVerify={handleVerify}
              onCancel={() => {
                setSetupOpen(false)
                setSetupData(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={disableOpen} onOpenChange={setDisableOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disable 2FA</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Enter your current authenticator code to disable two-factor authentication.
          </p>
          <div className="space-y-2">
            <Label htmlFor="disable-code">Verification code</Label>
            <Input
              id="disable-code"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              value={disableCode}
              onChange={(e) => {
                setDisableCode(e.target.value.replace(/\D/g, ''))
                setError(null)
              }}
              className={cn(error && 'border-destructive')}
            />
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDisableOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => void handleDisable()}
              disabled={isLoading}
              className="gradient-primary flex-1"
            >
              {isLoading ? 'Disabling...' : 'Disable'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={backupOpen} onOpenChange={setBackupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Backup codes</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Use these codes to access your account if you lose your authenticator device.
          </p>
          <div className="grid gap-2 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
            {(backupCodes ?? []).map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 rounded-lg bg-card px-3 py-2 font-mono text-sm"
              >
                <span>{c}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => void handleCopyCode(i)}
                  aria-label={`Copy code ${i + 1}`}
                >
                  {copiedIndex === i ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => void handleRegenerateBackupCodes()}
            disabled={isLoading}
          >
            Generate new codes
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
