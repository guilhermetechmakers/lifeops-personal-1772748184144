import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'

export function VerifyEmailPage() {
  const [cooldown, setCooldown] = useState(0)

  const handleResend = async () => {
    if (cooldown > 0) return
    try {
      await new Promise((r) => setTimeout(r, 500))
      toast.success('Verification email sent!')
      setCooldown(60)
      const interval = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(interval)
            return 0
          }
          return c - 1
        })
      }, 1000)
    } catch {
      toast.error('Failed to send. Try again later.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center font-bold text-xl gradient-text">
          LifeOps
        </Link>
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email. Click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
            </Button>
            <Link to="/onboarding">
              <Button className="w-full gradient-primary text-primary-foreground">
                Continue to onboarding
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
