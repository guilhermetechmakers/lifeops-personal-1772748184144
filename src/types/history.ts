/**
 * Order & Transaction History types for LifeOps Personal.
 * Runtime-safe with proper defaults and optional chaining.
 */

export type InvoiceStatus =
  | 'paid'
  | 'unpaid'
  | 'past_due'
  | 'draft'
  | 'cancelled'

export type RefundStatus =
  | 'requested'
  | 'processing'
  | 'approved'
  | 'rejected'
  | 'completed'

export type SubscriptionEventType =
  | 'UPGRADE'
  | 'DOWNGRADE'
  | 'RENEW'
  | 'CANCEL'

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  amount: number
  currency: string
  status: InvoiceStatus
  pdfUrl?: string | null
  items?: InvoiceLineItem[]
  customerNote?: string
}

export interface Receipt {
  id: string
  date: string
  amount: number
  currency: string
  paymentMethod: string
  status: string
}

export interface Refund {
  id: string
  dateRequested: string
  amount: number
  currency: string
  status: RefundStatus
  supportLink?: string
  resolutionDate?: string
  reason?: string
}

export interface SubscriptionEvent {
  id: string
  type: SubscriptionEventType
  date: string
  planName: string
  amount?: number
  currency?: string
  status?: string
}

export type HistoryItemType =
  | 'invoice'
  | 'receipt'
  | 'refund'
  | 'subscription'

export interface HistoryItem {
  id: string
  type: HistoryItemType
  date: string
  amount?: number
  currency?: string
  status?: string
  invoice?: Invoice
  receipt?: Receipt
  refund?: Refund
  subscription?: SubscriptionEvent
}

export interface HistoryFilters {
  types: HistoryItemType[]
  search: string
  dateFrom?: string
  dateTo?: string
  sort: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'
}

export interface HistoryResponse {
  items: HistoryItem[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
