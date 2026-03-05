/**
 * CheckoutPage - Subscription & one-time purchase checkout
 * LifeOps Personal - Secure payment, billing summary, promo codes
 */

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { Plan, CartItem, Invoice } from '@/types/checkout'
import {
  PlanCard,
  PaymentMethodForm,
  BillingSummary,
  PromoCodeBar,
  ConfirmationSection,
  ReceiptModal,
  type CardFormData,
} from '@/components/checkout'
import {
  fetchPlans,
  fetchBillingCurrent,
  tokenizePaymentMethod,
  checkoutSubscribe,
  applyPromoCode,
  fetchInvoice,
} from '@/api/checkout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CheckoutPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [cadence, setCadence] = useState<'monthly' | 'yearly'>('monthly')
  const [cartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentToken, setPaymentToken] = useState<string | null>(null)
  const [paymentLast4, setPaymentLast4] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoValid, setPromoValid] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)

  const plansList = Array.isArray(plans) ? plans : []
  const selectedPlan =
    plansList.find((p) => p?.id === selectedPlanId) ?? plansList[0] ?? null

  const cartTotal = (cartItems ?? []).reduce(
    (sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 1),
    0
  )

  const basePrice = selectedPlan?.price ?? 0
  const subtotal = basePrice + cartTotal
  const taxAmount = Math.round(subtotal * 0.08 * 100) / 100
  const totalDue = Math.max(0, subtotal + taxAmount - promoDiscount)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [plansRes, billingRes] = await Promise.all([
        fetchPlans(),
        fetchBillingCurrent(),
      ])
      const plansData = Array.isArray(plansRes) ? plansRes : []
      setPlans(plansData)
      setCurrentPlanId(
        billingRes?.subscription?.planId ?? billingRes?.currentPlan?.id ?? null
      )
      if (!selectedPlanId && plansData.length > 0) {
        const firstMatch =
          plansData.find((p) => p?.cadence === cadence) ??
          plansData.find((p) => p?.cadence === 'monthly') ??
          plansData[0]
        setSelectedPlanId(firstMatch?.id ?? null)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load plans'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [selectedPlanId, cadence])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handlePromoApply = useCallback(
    async (code: string) => {
      if (!code?.trim()) return
      setIsApplyingPromo(true)
      setPromoError(null)
      try {
        const result = await applyPromoCode(code.trim(), subtotal)
        if (result?.valid && result.discountAmount != null) {
          setPromoCode(code.trim())
          setPromoDiscount(result.discountAmount)
          setPromoValid(true)
          toast.success(result.message ?? 'Promo applied')
        } else {
          setPromoCode(null)
          setPromoDiscount(0)
          setPromoValid(false)
          setPromoError(result?.message ?? 'Invalid promo code')
          toast.error(result?.message ?? 'Invalid promo code')
        }
      } catch {
        setPromoError('Failed to validate promo')
        toast.error('Failed to validate promo')
      } finally {
        setIsApplyingPromo(false)
      }
    },
    [subtotal]
  )

  const handlePaymentSubmit = useCallback(async (data: CardFormData) => {
    setError(null)
    try {
      const res = await tokenizePaymentMethod({
        cardNumber: data.cardNumber,
        expiry: data.expiry,
        cvc: data.cvc,
      })
      if (res?.success && res.tokenizationRef) {
        setPaymentToken(res.tokenizationRef)
        setPaymentLast4(res?.last4 ?? null)
        toast.success('Payment method added')
      } else {
        setPaymentToken(null)
        setPaymentLast4(null)
        toast.error(res?.error ?? 'Could not add payment method')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Tokenization failed'
      toast.error(msg)
    }
  }, [])

  const handleConfirmPay = useCallback(async () => {
    if (!paymentToken) {
      toast.error('Please enter your payment method first')
      return
    }
    if (!selectedPlanId) {
      toast.error('Please select a plan')
      return
    }
    setIsProcessing(true)
    setError(null)
    try {
      const res = await checkoutSubscribe({
        planId: selectedPlanId,
        paymentToken,
        promoCode: promoCode ?? undefined,
      })
      if (res?.success && res.invoiceId) {
        const inv = await fetchInvoice(res.invoiceId)
        setInvoice(inv ?? null)
        setReceiptModalOpen(true)
        toast.success('Payment successful!')
      } else {
        setError(res?.error ?? 'Payment failed')
        toast.error(res?.error ?? 'Payment failed')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsProcessing(false)
    }
  }, [paymentToken, selectedPlanId, promoCode])

  const displayPlans = plansList.filter((p) => p?.cadence === cadence)
  const fallbackPlans =
    displayPlans.length > 0 ? displayPlans : plansList

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
          <p className="mt-1 text-muted-foreground">
            Subscription and payment
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            <div className="h-80 animate-pulse rounded-2xl bg-muted" />
          </div>
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
        <p className="mt-1 text-muted-foreground">
          Subscription and payment
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select plan</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose your subscription plan
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2 rounded-xl bg-muted/50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setCadence('monthly')
                    const first = plansList.find((p) => p?.cadence === 'monthly')
                    if (first) setSelectedPlanId(first.id)
                  }}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    cadence === 'monthly'
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-pressed={cadence === 'monthly'}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCadence('yearly')
                    const first = plansList.find((p) => p?.cadence === 'yearly')
                    if (first) setSelectedPlanId(first.id)
                  }}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    cadence === 'yearly'
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-pressed={cadence === 'yearly'}
                >
                  Yearly (save 17%)
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(fallbackPlans ?? []).map((plan) => (
                  <PlanCard
                    key={plan?.id ?? ''}
                    plan={plan}
                    isSelected={selectedPlanId === plan?.id}
                    onSelect={() => setSelectedPlanId(plan?.id ?? null)}
                    currentPlanId={currentPlanId}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment method</CardTitle>
              <p className="text-sm text-muted-foreground">
                Secure card entry — we never store your full card number
              </p>
            </CardHeader>
            <CardContent>
              {paymentToken ? (
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    Card ending in •••• {paymentLast4 ?? '****'}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPaymentToken(null)
                      setPaymentLast4(null)
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <PaymentMethodForm
                  onSubmit={handlePaymentSubmit}
                  isLoading={isProcessing}
                  disabled={isProcessing}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <BillingSummary
            plan={selectedPlan}
            cartItemsTotal={cartTotal}
            taxAmount={taxAmount}
            discountAmount={promoDiscount}
            nextBillingDate={
              selectedPlan?.cadence === 'monthly'
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                : selectedPlan?.cadence === 'yearly'
                  ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                  : null
            }
          />

          <Card>
            <CardHeader>
              <CardTitle>Promo code</CardTitle>
            </CardHeader>
            <CardContent>
              <PromoCodeBar
                onApply={handlePromoApply}
                appliedCode={promoCode}
                discountAmount={promoDiscount}
                isValid={promoValid}
                isApplying={isApplyingPromo}
                errorMessage={promoError}
                disabled={isProcessing}
              />
            </CardContent>
          </Card>

          <ConfirmationSection
            totalAmount={totalDue}
            onConfirm={handleConfirmPay}
            isProcessing={isProcessing}
            disabled={!paymentToken || !selectedPlanId}
            error={error}
          />
        </div>
      </div>

      <ReceiptModal
        open={receiptModalOpen}
        onOpenChange={setReceiptModalOpen}
        invoice={invoice}
        onDownloadReceipt={() => {
          toast.info('Receipt download coming soon')
        }}
      />
    </div>
  )
}
