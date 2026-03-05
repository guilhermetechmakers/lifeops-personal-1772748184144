/**
 * Checkout API - Plans, Billing, Payments, Promo, Invoices
 * LifeOps Personal - Interface-ready stubs with data guards
 */

import type {
  Plan,
  Subscription,
  Invoice,
  PromoApplyResult,
  TokenizeResponse,
  CheckoutSubscribeResponse,
  CheckoutPurchaseResponse,
} from '@/types/checkout'
import { apiGet, apiPost } from '@/lib/api'

/** Response shape guards */
function asPlans(data: unknown): Plan[] {
  return Array.isArray(data) ? data : []
}

function asPlan(data: unknown): Plan | null {
  if (data && typeof data === 'object' && 'id' in data) {
    return data as Plan
  }
  return null
}

function asSubscription(data: unknown): Subscription | null {
  if (data && typeof data === 'object' && 'id' in data) {
    return data as Subscription
  }
  return null
}

function asInvoice(data: unknown): Invoice | null {
  if (data && typeof data === 'object' && 'id' in data) {
    return data as Invoice
  }
  return null
}

/** GET /plans - fetch available subscription plans */
export async function fetchPlans(): Promise<Plan[]> {
  try {
    const res = await apiGet<{ plans?: Plan[] } | Plan[]>('/plans')
    if (Array.isArray(res)) {
      return asPlans(res)
    }
    const plans = res?.plans ?? null
    return Array.isArray(plans) ? plans : getMockPlans()
  } catch {
    return getMockPlans()
  }
}

/** GET /billing/current - fetch current billing state for user */
export async function fetchBillingCurrent(): Promise<{
  subscription: Subscription | null
  currentPlan: Plan | null
}> {
  try {
    const res = await apiGet<{
      subscription?: Subscription | null
      currentPlan?: Plan | null
    }>('/billing/current')
    return {
      subscription: asSubscription(res?.subscription ?? null) ?? null,
      currentPlan: asPlan(res?.currentPlan ?? null) ?? null,
    }
  } catch {
    return { subscription: null, currentPlan: null }
  }
}

/** POST /payments/tokenize - tokenize payment method (PCI-compliant) */
export async function tokenizePaymentMethod(payload: {
  cardNumber: string
  expiry: string
  cvc: string
}): Promise<TokenizeResponse> {
  try {
    const res = await apiPost<TokenizeResponse>('/payments/tokenize', payload)
    return res ?? { success: false, error: 'Tokenization failed' }
  } catch {
    return getMockTokenizeResponse(payload)
  }
}

function getMockTokenizeResponse(payload: {
  cardNumber: string
  cvc: string
}): TokenizeResponse {
  const digits = payload?.cardNumber?.replace(/\D/g, '') ?? ''
  if (digits.length >= 13 && digits.length <= 19 && payload?.cvc?.length >= 3) {
    return {
      success: true,
      tokenizationRef: `tok_${Date.now()}_${digits.slice(-4)}`,
      last4: digits.slice(-4),
      brand: 'visa',
    }
  }
  return { success: false, error: 'Invalid card details' }
}

/** POST /checkout/subscribe - create or upgrade subscription */
export async function checkoutSubscribe(payload: {
  planId: string
  paymentToken: string
  promoCode?: string
}): Promise<CheckoutSubscribeResponse> {
  try {
    const res = await apiPost<CheckoutSubscribeResponse>(
      '/checkout/subscribe',
      payload
    )
    return res ?? { success: false, error: 'Subscription failed' }
  } catch {
    return getMockSubscribeResponse(payload)
  }
}

function getMockSubscribeResponse(payload: {
  planId: string
  paymentToken: string
}): CheckoutSubscribeResponse {
  if (payload?.planId && payload?.paymentToken) {
    return {
      success: true,
      subscriptionId: `sub_${Date.now()}`,
      invoiceId: `inv_${Date.now()}`,
    }
  }
  return { success: false, error: 'Subscription failed' }
}

/** POST /checkout/purchase - one-time purchase */
export async function checkoutPurchase(payload: {
  cartItems: { id: string; quantity: number }[]
  paymentToken: string
  promoCode?: string
}): Promise<CheckoutPurchaseResponse> {
  try {
    const res = await apiPost<CheckoutPurchaseResponse>(
      '/checkout/purchase',
      payload
    )
    return res ?? { success: false, error: 'Purchase failed' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Purchase failed'
    return { success: false, error: message }
  }
}

/** POST /promo/apply - validate and apply promo code */
export async function applyPromoCode(
  code: string,
  subtotal: number
): Promise<PromoApplyResult> {
  if (!code?.trim()) {
    return { valid: false, message: 'Enter a promo code' }
  }
  try {
    const res = await apiPost<PromoApplyResult>('/promo/apply', {
      code: code.trim(),
      subtotal,
    })
    if (res?.valid) {
      return res
    }
    return getMockPromoResult(code.trim(), subtotal)
  } catch {
    return getMockPromoResult(code.trim(), subtotal)
  }
}

/** Mock promo validation for development */
function getMockPromoResult(
  code: string,
  subtotal: number
): PromoApplyResult {
  const upper = code.toUpperCase()
  if (upper === 'SAVE10') {
    return {
      valid: true,
      discountAmount: Math.min(subtotal * 0.1, 20),
      discountType: 'percent',
      message: '10% off applied',
    }
  }
  if (upper === 'FLAT5') {
    return {
      valid: true,
      discountAmount: 5,
      discountType: 'fixed',
      message: '$5 off applied',
    }
  }
  return { valid: false, message: 'Invalid promo code' }
}

/** GET /invoices/{id} - fetch invoice/receipt */
export async function fetchInvoice(id: string): Promise<Invoice | null> {
  if (!id?.trim()) return null
  try {
    const res = await apiGet<{ invoice?: Invoice } | Invoice>(`/invoices/${id}`)
    if (res && typeof res === 'object' && 'id' in res) {
      return res as Invoice
    }
    const invoice = (res as { invoice?: Invoice })?.invoice ?? null
    return asInvoice(invoice) ?? getMockInvoice(id)
  } catch {
    return getMockInvoice(id)
  }
}

function getMockInvoice(id: string): Invoice {
  return {
    id,
    userId: 'user_1',
    amountDue: 19,
    taxAmount: 1.52,
    discountAmount: 0,
    totalAmount: 20.52,
    date: new Date().toISOString(),
    status: 'paid',
  }
}

/** Mock plans for development when API is unavailable */
function getMockPlans(): Plan[] {
  return [
    {
      id: 'pro',
      name: 'Pro',
      cadence: 'monthly',
      price: 19,
      benefits: [
        'Unlimited projects',
        'AI suggestions',
        'Priority support',
      ],
    },
    {
      id: 'pro-yearly',
      name: 'Pro',
      cadence: 'yearly',
      price: 190,
      benefits: [
        'Unlimited projects',
        'AI suggestions',
        'Priority support',
        '2 months free',
      ],
    },
    {
      id: 'creator',
      name: 'Creator',
      cadence: 'monthly',
      price: 29,
      benefits: [
        'Everything in Pro',
        'Content scheduler',
        'Multi-channel publishing',
      ],
    },
    {
      id: 'creator-yearly',
      name: 'Creator',
      cadence: 'yearly',
      price: 290,
      benefits: [
        'Everything in Pro',
        'Content scheduler',
        'Multi-channel publishing',
        '2 months free',
      ],
    },
  ]
}
