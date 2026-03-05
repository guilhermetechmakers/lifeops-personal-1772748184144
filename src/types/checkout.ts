/**
 * Checkout / Payment types for LifeOps Personal.
 * Runtime-safe with proper defaults and optional chaining.
 */

export type BillingCadence = 'monthly' | 'yearly'

export interface Plan {
  id: string
  name: string
  cadence: BillingCadence
  price: number
  benefits?: string[]
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodStart?: string
  currentPeriodEnd?: string
}

export interface Invoice {
  id: string
  userId: string
  amountDue: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  date: string
  status: 'paid' | 'pending' | 'failed'
}

export interface PaymentMethod {
  id: string
  userId: string
  type: 'card' | 'wallet'
  last4?: string
  brand?: string
  tokenizationRef?: string
}

export interface PromoCode {
  code: string
  discountValue: number
  discountType: 'percent' | 'fixed'
  validUntil?: string
  usageLimit?: number
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface BillingAddress {
  line1?: string
  line2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface User {
  id: string
  email?: string
  name?: string
  subscription?: Subscription | null
}

export interface BillingSummaryLine {
  label: string
  amount: number
  type?: 'subtotal' | 'tax' | 'discount' | 'proration' | 'total'
}

export interface PromoApplyResult {
  valid: boolean
  discountAmount?: number
  discountType?: 'percent' | 'fixed'
  message?: string
}

export interface TokenizeResponse {
  success: boolean
  tokenizationRef?: string
  last4?: string
  brand?: string
  error?: string
}

export interface CheckoutSubscribeResponse {
  success: boolean
  subscriptionId?: string
  invoiceId?: string
  error?: string
}

export interface CheckoutPurchaseResponse {
  success: boolean
  invoiceId?: string
  error?: string
}
