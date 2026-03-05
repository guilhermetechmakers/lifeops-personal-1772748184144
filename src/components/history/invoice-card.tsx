/**
 * InvoiceCard - Displays invoice metadata with Download PDF action
 */

import { FileText, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Invoice, InvoiceStatus } from '@/types/history'

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  unpaid: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  past_due: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  draft: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-500',
}

export interface InvoiceCardProps {
  invoice: Invoice
  onViewDetails?: (invoice: Invoice) => void
  onDownloadPdf?: (invoice: Invoice) => void
  isDownloading?: boolean
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return Number.isFinite(d.getTime())
      ? d.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : dateStr
  } catch {
    return dateStr
  }
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency ?? 'USD',
  }).format(Number.isFinite(amount) ? amount : 0)
}

export function InvoiceCard({
  invoice,
  onViewDetails,
  onDownloadPdf,
  isDownloading = false,
}: InvoiceCardProps) {
  const status = invoice?.status ?? 'draft'
  const pdfUrl = invoice?.pdfUrl
  const hasPdf = Boolean(pdfUrl?.trim())
  const hasInvoiceId = Boolean(invoice?.invoiceNumber ?? invoice?.id)

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={() => onViewDetails?.(invoice)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewDetails?.(invoice)
        }
      }}
      aria-label={`Invoice ${invoice?.invoiceNumber ?? invoice?.id} - ${formatAmount(invoice?.amount ?? 0, invoice?.currency ?? 'USD')}`}
    >
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">
                {invoice?.invoiceNumber ?? '—'}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatDate(invoice?.date ?? '')}
              </p>
              <span
                className={cn(
                  'mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                  STATUS_STYLES[status] ?? STATUS_STYLES.draft
                )}
              >
                {status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
            <p className="font-semibold text-foreground">
              {formatAmount(invoice?.amount ?? 0, invoice?.currency ?? 'USD')}
            </p>
            {(hasPdf || hasInvoiceId) && onDownloadPdf && (
              <Button
                variant="outline"
                size="sm"
                className="gradient-primary border-primary/30 text-primary-foreground hover:bg-primary/90"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownloadPdf(invoice)
                }}
                disabled={isDownloading}
                aria-label="Download PDF"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            )}
            {!hasPdf && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails?.(invoice)
                }}
                aria-label="View details"
              >
                View details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
