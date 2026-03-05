import { useState, useCallback } from 'react'
import { Shield, QrCode, Copy, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface TwoFactorSetupWizardProps {
  qrCodeUrl: string
  secret: string
  onVerify: (code: string) => Promise<{ success: boolean; backupCodes?: string[] }>
  onCancel: () => void
}

type Step = 'scan' | 'verify' | 'backup'

export function TwoFactorSetupWizard({
  qrCodeUrl,
  secret,
  onVerify,
  onCancel,
}: TwoFactorSetupWizardProps) {
  const [step, setStep] = useState<Step>('scan')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleVerify = useCallback(async () => {
    const trimmed = code.trim()
    if (!trimmed || trimmed.length < 6) {
      setError('Please enter the 6-digit code from your authenticator app')
      return
    }
    setError(null)
    setIsVerifying(true)
    try {
      const result = await onVerify(trimmed)
      if (result.success) {
        setBackupCodes(result.backupCodes ?? [])
        setStep('backup')
      } else {
        setError('Invalid code. Please try again.')
      }
    } catch {
      setError('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }, [code, onVerify])

  const handleCopyCode = useCallback(async (index: number) => {
    const codes = backupCodes ?? []
    const c = codes[index]
    if (!c) return
    try {
      await navigator.clipboard.writeText(c)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      // ignore
    }
  }, [backupCodes])

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          {step === 'scan' && 'Scan the QR code with your authenticator app'}
          {step === 'verify' && 'Enter the 6-digit code to verify'}
          {step === 'backup' && 'Save your backup codes in a secure place'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 'scan' && (
          <>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR code for authenticator app"
                    className="h-48 w-48"
                  />
                ) : (
                  <div className="flex h-48 w-48 items-center justify-center rounded bg-muted">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Or enter this code manually: {secret}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => setStep('verify')}
                className="gradient-primary flex-1"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="totp-code">Verification code</Label>
              <Input
                id="totp-code"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className={cn(
                  'rounded-xl font-mono text-lg tracking-widest',
                  error && 'border-destructive'
                )}
                aria-invalid={!!error}
            />
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('scan')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => void handleVerify()}
                disabled={isVerifying}
                className="gradient-primary flex-1"
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </>
        )}

        {step === 'backup' && (
          <>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Store these codes in a secure place. Each can be used once to restore access.
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
            </div>
            <Button
              onClick={() => {
                setStep('scan')
                setCode('')
                setBackupCodes([])
                onCancel()
              }}
              className="gradient-primary w-full"
            >
              Done
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
