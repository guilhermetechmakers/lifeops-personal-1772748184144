/**
 * Order & Transaction History API
 * LifeOps Personal - Interface-ready with data guards and mock fallbacks
 */

import type {
  Invoice,
  Refund,
  SubscriptionEvent,
  HistoryItem,
  HistoryResponse,
} from '@/types/history'
import { apiGet } from '@/lib/api'

/** Response shape guards */
function asHistoryItems(data: unknown): HistoryItem[] {
  return Array.isArray(data) ? (data as HistoryItem[]) : []
}

function asHistoryResponse(data: unknown): HistoryResponse {
  if (data && typeof data === 'object' && 'items' in data) {
    const obj = data as Record<string, unknown>
    return {
      items: asHistoryItems(obj.items),
      total: typeof obj.total === 'number' ? obj.total : 0,
      page: typeof obj.page === 'number' ? obj.page : 1,
      limit: typeof obj.limit === 'number' ? obj.limit : 20,
      hasMore: typeof obj.hasMore === 'boolean' ? obj.hasMore : false,
    }
  }
  return { items: [], total: 0, page: 1, limit: 20, hasMore: false }
}

export interface FetchHistoryParams {
  types?: string
  page?: number
  limit?: number
  search?: string
  sort?: string
  dateFrom?: string
  dateTo?: string
}

/** GET /api/history - fetch consolidated history */
export async function fetchHistory(
  params: FetchHistoryParams = {}
): Promise<HistoryResponse> {
  const {
    types = 'invoices,receipts,refunds,subscriptions',
    page = 1,
    limit = 20,
    search = '',
    sort = 'date_desc',
    dateFrom,
    dateTo,
  } = params

  try {
    const searchParams = new URLSearchParams()
    searchParams.set('types', types)
    searchParams.set('page', String(page))
    searchParams.set('limit', String(limit))
    if (search) searchParams.set('search', search)
    searchParams.set('sort', sort)
    if (dateFrom) searchParams.set('dateFrom', dateFrom)
    if (dateTo) searchParams.set('dateTo', dateTo)

    const res = await apiGet<HistoryResponse | { data?: HistoryResponse }>(
      `/history?${searchParams.toString()}`
    )
    if (res && typeof res === 'object' && 'items' in res) {
      return asHistoryResponse(res)
    }
    const data = (res as { data?: HistoryResponse })?.data
    return data ? asHistoryResponse(data) : getMockHistoryResponse(params)
  } catch {
    return getMockHistoryResponse(params)
  }
}

/** GET /api/history/:id - fetch item detail */
export async function fetchHistoryItem(
  id: string
): Promise<HistoryItem | null> {
  if (!id?.trim()) return null
  try {
    const res = await apiGet<HistoryItem | { item?: HistoryItem }>(
      `/history/${encodeURIComponent(id)}`
    )
    if (res && typeof res === 'object' && 'id' in res) {
      return res as HistoryItem
    }
    const item = (res as { item?: HistoryItem })?.item ?? null
    return item ?? getMockHistoryItem(id)
  } catch {
    return getMockHistoryItem(id)
  }
}

/** GET /api/history/invoice/:invoiceNumber/pdf - download PDF */
export async function downloadInvoicePdf(
  invoiceNumber: string
): Promise<Blob | null> {
  if (!invoiceNumber?.trim()) return null
  try {
    const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
    const response = await fetch(
      `${API_BASE}/history/invoice/${encodeURIComponent(invoiceNumber)}/pdf`
    )
    if (!response.ok) return null
    return response.blob()
  } catch {
    return null
  }
}

/** Mock data for development when API is unavailable */
function getMockHistoryResponse(
  params: FetchHistoryParams
): HistoryResponse {
  const page = params?.page ?? 1
  const limit = params?.limit ?? 20
  const items = getMockHistoryItems()
  const start = (page - 1) * limit
  const paginated = items.slice(start, start + limit)
  return {
    items: paginated,
    total: items.length,
    page,
    limit,
    hasMore: start + paginated.length < items.length,
  }
}

function getMockHistoryItem(id: string): HistoryItem | null {
  const items = getMockHistoryItems()
  return items.find((i) => i?.id === id) ?? null
}

function getMockHistoryItems(): HistoryItem[] {
  const now = new Date()
  const invoices: Invoice[] = [
    {
      id: 'inv_1',
      invoiceNumber: 'INV-2024-001',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 19,
      currency: 'USD',
      status: 'paid',
      pdfUrl: null,
      items: [
        { description: 'Pro Monthly', quantity: 1, unitPrice: 19, total: 19 },
      ],
    },
    {
      id: 'inv_2',
      invoiceNumber: 'INV-2024-002',
      date: new Date(now.getTime() - 37 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 19,
      currency: 'USD',
      status: 'paid',
      pdfUrl: null,
      items: [
        { description: 'Pro Monthly', quantity: 1, unitPrice: 19, total: 19 },
      ],
    },
  ]

  const refunds: Refund[] = [
    {
      id: 'ref_1',
      dateRequested: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 19,
      currency: 'USD',
      status: 'completed',
      supportLink: '/dashboard/settings',
    },
  ]

  const subscriptions: SubscriptionEvent[] = [
    {
      id: 'sub_1',
      type: 'RENEW',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      planName: 'Pro',
      amount: 19,
      currency: 'USD',
      status: 'active',
    },
    {
      id: 'sub_2',
      type: 'UPGRADE',
      date: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      planName: 'Pro',
      amount: 19,
      currency: 'USD',
      status: 'active',
    },
  ]

  const items: HistoryItem[] = [
    ...invoices.map((inv) => ({
      id: inv.id,
      type: 'invoice' as const,
      date: inv.date,
      amount: inv.amount,
      currency: inv.currency,
      status: inv.status,
      invoice: inv,
    })),
    ...refunds.map((ref) => ({
      id: ref.id,
      type: 'refund' as const,
      date: ref.dateRequested,
      amount: ref.amount,
      currency: ref.currency,
      status: ref.status,
      refund: ref,
    })),
    ...subscriptions.map((sub) => ({
      id: sub.id,
      type: 'subscription' as const,
      date: sub.date,
      amount: sub.amount,
      currency: sub.currency,
      status: sub.status,
      subscription: sub,
    })),
  ]

  return items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
