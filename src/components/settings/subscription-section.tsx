import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { CreditCard, Download, ChevronUp, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  fetchSubscription,
  upgradeSubscription,
  downgradeSubscription,
} from '@/api/settings'
import { formatDate } from '@/utils/date-format'
import type { Subscription, Invoice } from '@/types/settings'
import { cn } from '@/lib/utils'

const PLANS = [
  { id: 'free', name: 'Free', price: 0, features: ['3 projects', 'Basic AI'] },
  { id: 'pro', name: 'Pro', price: 29, features: ['Unlimited projects', 'AI agents', 'Priority support'] },
  { id: 'enterprise', name: 'Enterprise', price: 99, features: ['Everything in Pro', 'Custom integrations', 'Dedicated support'] },
]

export function SubscriptionSection() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [targetPlanId, setTargetPlanId] = useState<string | null>(null)
  const [upgrading, setUpgrading] = useState(false)

  const loadSubscription = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchSubscription()
      setSubscription(data ?? null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSubscription()
  }, [loadSubscription])

  const handlePlanChange = async (planId: string) => {
    const currentPlanId = subscription?.plan_id ?? 'free'
    if (planId === currentPlanId) {
      setPlanModalOpen(false)
      return
    }
    setUpgrading(true)
    setTargetPlanId(planId)
    try {
      const isUpgrade = PLANS.findIndex((p) => p.id === planId) > PLANS.findIndex((p) => p.id === currentPlanId)
      const ok = isUpgrade
        ? await upgradeSubscription(planId)
        : await downgradeSubscription(planId)
      if (ok) {
        toast.success(`Plan updated to ${PLANS.find((p) => p.id === planId)?.name ?? planId}`)
        setPlanModalOpen(false)
        void loadSubscription()
      } else {
        toast.error('Failed to update plan')
      }
    } catch {
      toast.error('Failed to update plan')
    } finally {
      setUpgrading(false)
      setTargetPlanId(null)
    }
  }

  const invoices = (subscription?.invoices ?? []) as Invoice[]
  const currentPlan = PLANS.find((p) => p.id === (subscription?.plan_id ?? 'free'))

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="mt-2 h-4 w-32 rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-32 rounded-xl bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Current plan, billing, and invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">
                  {subscription?.plan_name ?? 'Free'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscription?.next_billing_date
                    ? `Next billing: ${formatDate(subscription.next_billing_date)}`
                    : 'No upcoming charges'}
                </p>
              </div>
              <Badge variant="secondary">{subscription?.status ?? 'active'}</Badge>
            </div>
            {currentPlan?.features && currentPlan.features.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {currentPlan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            )}
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setPlanModalOpen(true)}
            >
              Change plan
            </Button>
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Payment method</p>
                <p className="text-sm text-muted-foreground">
                  {subscription?.payment_method ?? 'No payment method on file'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="font-medium">Billing history</p>
            <p className="text-sm text-muted-foreground">
              Invoices and payment history
            </p>
            {(invoices ?? []).length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No invoices yet
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {(invoices ?? []).map((inv) => (
                  <li
                    key={inv.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">
                        {formatDate(inv.date)} · ${inv.amount} {inv.currency}
                      </p>
                      <Badge
                        variant={
                          inv.status === 'paid'
                            ? 'success'
                            : inv.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="mt-1"
                      >
                        {inv.status}
                      </Badge>
                    </div>
                    {inv.pdf_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={inv.pdf_url} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === (subscription?.plan_id ?? 'free')
              const isTarget = targetPlanId === plan.id
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => void handlePlanChange(plan.id)}
                  disabled={upgrading && isTarget}
                  className={cn(
                    'flex items-center justify-between rounded-xl border border-border p-4 text-left transition-all hover:border-primary hover:shadow-card',
                    isCurrent && 'border-primary bg-primary/5'
                  )}
                >
                  <div>
                    <p className="font-semibold">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${plan.price}/mo · {plan.features.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCurrent ? (
                      <Badge variant="secondary">Current</Badge>
                    ) : (
                      plan.price > (PLANS.find((p) => p.id === (subscription?.plan_id ?? 'free'))?.price ?? 0) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
