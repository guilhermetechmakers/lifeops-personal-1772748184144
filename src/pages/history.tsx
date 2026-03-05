/**
 * Order & Transaction History Page
 * LifeOps Personal - Invoices, receipts, refunds, subscription activity
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import {
  HistoryHeader,
  SearchAndFilterBar,
  InvoiceCard,
  SubscriptionActivityCard,
  RefundCard,
  EmptyStateCard,
  DetailDrawer,
  TransactionChart,
  PaginationBar,
} from '@/components/history'
import { fetchHistory, downloadInvoicePdf } from '@/api/history'
import type { HistoryItem, HistoryFilters } from '@/types/history'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Skeleton } from '@/components/ui/skeleton'

const DEFAULT_FILTERS: HistoryFilters = {
  types: [],
  search: '',
  sort: 'date_desc',
}

function filterAndSortItems(
  items: HistoryItem[],
  filters: HistoryFilters
): HistoryItem[] {
  const safe = items ?? []
  let result = [...safe]

  const types = filters?.types ?? []
  if (Array.isArray(types) && types.length > 0) {
    result = result.filter((i) => i?.type && types.includes(i.type))
  }

  const search = (filters?.search ?? '').trim().toLowerCase()
  if (search) {
    result = result.filter((item) => {
      const inv = item?.invoice
      const sub = item?.subscription
      const num = inv?.invoiceNumber ?? ''
      const plan = sub?.planName ?? ''
      const note = inv?.customerNote ?? ''
      return (
        num.toLowerCase().includes(search) ||
        plan.toLowerCase().includes(search) ||
        note.toLowerCase().includes(search)
      )
    })
  }

  const sort = filters?.sort ?? 'date_desc'
  result.sort((a, b) => {
    const da = new Date(a?.date ?? 0).getTime()
    const db = new Date(b?.date ?? 0).getTime()
    const amtA = a?.amount ?? 0
    const amtB = b?.amount ?? 0
    if (sort === 'date_desc') return db - da
    if (sort === 'date_asc') return da - db
    if (sort === 'amount_desc') return amtB - amtA
    if (sort === 'amount_asc') return amtA - amtB
    return db - da
  })

  return result
}

export function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<HistoryFilters>(DEFAULT_FILTERS)
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const debouncedSearch = useDebouncedValue(filters?.search ?? '', 300)

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const typesParam =
        Array.isArray(filters?.types) && filters.types.length > 0
          ? filters.types.join(',')
          : 'invoices,receipts,refunds,subscriptions'
      const res = await fetchHistory({
        types: typesParam,
        page,
        limit,
        search: debouncedSearch,
        sort: filters?.sort ?? 'date_desc',
        dateFrom: filters?.dateFrom,
        dateTo: filters?.dateTo,
      })
      const list = Array.isArray(res?.items) ? res.items : []
      setItems(list)
      setTotal(res?.total ?? 0)
      setHasMore(res?.hasMore ?? false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load history'
      toast.error(msg)
      setItems([])
      setTotal(0)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, debouncedSearch, filters?.types, filters?.sort, filters?.dateFrom, filters?.dateTo])

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  const filteredItems = useMemo(
    () => filterAndSortItems(items, filters),
    [items, filters]
  )

  const handleFiltersChange = useCallback((next: Partial<HistoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }))
    setPage(1)
  }, [])

  const handleViewDetails = useCallback((item: HistoryItem) => {
    setSelectedItem(item)
    setDetailOpen(true)
  }, [])

  const handleDownloadPdf = useCallback(async (invoice: { invoiceNumber?: string; id?: string }): Promise<void> => {
    const num = invoice?.invoiceNumber ?? invoice?.id ?? ''
    if (!num) {
      toast.info('No PDF available for this invoice')
      return
    }
    setIsDownloading(true)
    try {
      const blob = await downloadInvoicePdf(num)
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice-${num}.pdf`
        a.click()
        URL.revokeObjectURL(url)
        toast.success('Invoice downloaded')
      } else {
        toast.info('PDF download not available yet')
      }
    } catch {
      toast.error('Download failed')
    } finally {
      setIsDownloading(false)
    }
  }, [])

  const handleSupportClick = useCallback((refund?: { supportLink?: string }) => {
    const link = refund?.supportLink?.trim()
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer')
      setDetailOpen(false)
      toast.success('Opening support')
    } else {
      toast.info('Support link will be available when configured')
    }
  }, [])

  const isEmpty = !isLoading && filteredItems.length === 0

  return (
    <div className="space-y-6 animate-fade-in">
      <HistoryHeader totalCount={total} />
      <SearchAndFilterBar filters={filters} onFiltersChange={handleFiltersChange} />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : isEmpty ? (
        <EmptyStateCard />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {(filteredItems ?? []).map((item) => {
                  if (item?.type === 'invoice' && item?.invoice) {
                    return (
                      <InvoiceCard
                        key={item.id}
                        invoice={item.invoice}
                        onViewDetails={() => handleViewDetails(item)}
                        onDownloadPdf={
                          item.invoice?.invoiceNumber ?? item.invoice?.id
                            ? () => handleDownloadPdf(item.invoice!)
                            : undefined
                        }
                        isDownloading={isDownloading}
                      />
                    )
                  }
                  if (item?.type === 'subscription' && item?.subscription) {
                    return (
                      <SubscriptionActivityCard
                        key={item.id}
                        subscription={item.subscription}
                        onViewDetails={() => handleViewDetails(item)}
                      />
                    )
                  }
                  if (item?.type === 'refund' && item?.refund) {
                    return (
                      <RefundCard
                        key={item.id}
                        refund={item.refund}
                        onViewDetails={() => handleViewDetails(item)}
                        onSupportClick={(r) => handleSupportClick(r)}
                      />
                    )
                  }
                  if (item?.type === 'receipt' && item?.receipt) {
                    return (
                      <div key={item.id} className="rounded-2xl border border-border bg-card p-5">
                        <p className="font-medium">Receipt</p>
                        <p className="text-sm text-muted-foreground">
                          {item.receipt?.date} · {item.receipt?.amount} {item.receipt?.currency}
                        </p>
                        <button
                          type="button"
                          className="mt-2 text-sm text-primary hover:underline"
                          onClick={() => handleViewDetails(item)}
                        >
                          View details
                        </button>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
              {total > limit && (
                <PaginationBar
                  page={page}
                  limit={limit}
                  total={total}
                  hasMore={hasMore}
                  onPageChange={setPage}
                  isLoading={isLoading}
                />
              )}
            </div>
            <div>
              <TransactionChart items={filteredItems} />
            </div>
          </div>
        </>
      )}

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        item={selectedItem}
        onDownloadPdf={
          selectedItem?.type === 'invoice' && selectedItem?.invoice
            ? (inv) => handleDownloadPdf(inv)
            : undefined
        }
        isDownloading={isDownloading}
      />
    </div>
  )
}
