import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'
import type { HistoryItem, Invoice, Receipt, Refund, SubscriptionEvent } from '@/types/history'

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ?? 'USD',
  }).format(amount ?? 0)
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return isFinite(d.getTime())
      ? d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : dateStr
  } catch {
    return dateStr ?? ''
  }
}

function InvoiceDetail({
  invoice,
  onDownloadPdf,
  isDownloading,
}: {
  invoice: Invoice
  onDownloadPdf?: (inv: Invoice) => void
  isDownloading?: boolean
}) {
  const items = invoice?.items ?? []
  const hasPdf = Boolean(invoice?.pdfUrl?.trim())
  const hasInvoiceId = Boolean(invoice?.invoiceNumber ?? invoice?.id)

  return (
    <div className="space-y-4">
      <div className="grid gap-2 text-sm">
        <p>
          <span className="text-muted-foreground">Invoice #:</span>{' '}
          {invoice?.invoiceNumber ?? invoice?.id}
        </p>
        <p>
          <span className="text-muted-foreground">Date:</span>{' '}
          {formatDate(invoice?.date ?? '')}
        </p>
        <p>
          <span className="text-muted-foreground">Status:</span>{' '}
          {invoice?.status ?? '—'}
        </p>
      </div>
      {items.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="mb-2 font-medium">Line items</p>
            <ul className="space-y-2">
              {(items ?? []).map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item?.description ?? '—'} × {item?.quantity ?? 0}
                  </span>
                  <span>
                    {formatAmount(item?.total ?? 0, invoice?.currency ?? 'USD')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <Separator />
      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>
          {formatAmount(invoice?.amount ?? 0, invoice?.currency ?? 'USD')}
        </span>
      </div>
      {(hasPdf || hasInvoiceId) && onDownloadPdf && (
        <Button
          className="w-full gradient-primary text-primary-foreground"
          onClick={() => onDownloadPdf(invoice)}
          disabled={isDownloading}
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      )}
    </div>
  )
}

function ReceiptDetail({ receipt }: { receipt: Receipt }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 text-sm">
        <p>
          <span className="text-muted-foreground">Date:</span>{' '}
          {formatDate(receipt?.date ?? '')}
        </p>
        <p>
          <span className="text-muted-foreground">Payment method:</span>{' '}
          {receipt?.paymentMethod ?? '—'}
        </p>
        <p>
          <span className="text-muted-foreground">Status:</span>{' '}
          {receipt?.status ?? '—'}
        </p>
      </div>
      <Separator />
      <div className="flex justify-between font-bold">
        <span>Amount</span>
        <span>
          {formatAmount(receipt?.amount ?? 0, receipt?.currency ?? 'USD')}
        </span>
      </div>
    </div>
  )
}

function RefundDetail({ refund }: { refund: Refund }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 text-sm">
        <p>
          <span className="text-muted-foreground">Requested:</span>{' '}
          {formatDate(refund?.dateRequested ?? '')}
        </p>
        {refund?.resolutionDate && (
          <p>
            <span className="text-muted-foreground">Resolved:</span>{' '}
            {formatDate(refund.resolutionDate)}
          </p>
        )}
        <p>
          <span className="text-muted-foreground">Status:</span>{' '}
          {refund?.status ?? '—'}
        </p>
        {refund?.reason && (
          <p>
            <span className="text-muted-foreground">Reason:</span>{' '}
            {refund.reason}
          </p>
        )}
      </div>
      <Separator />
      <div className="flex justify-between font-bold">
        <span>Amount</span>
        <span>
          {formatAmount(refund?.amount ?? 0, refund?.currency ?? 'USD')}
        </span>
      </div>
    </div>
  )
}

function SubscriptionDetail({ subscription }: { subscription: SubscriptionEvent }) {
  const typeLabels: Record<string, string> = {
    UPGRADE: 'Upgrade',
    DOWNGRADE: 'Downgrade',
    RENEW: 'Renewal',
    CANCEL: 'Cancellation',
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-2 text-sm">
        <p>
          <span className="text-muted-foreground">Type:</span>{' '}
          {typeLabels[subscription?.type ?? ''] ?? subscription?.type ?? '—'}
        </p>
        <p>
          <span className="text-muted-foreground">Plan:</span>{' '}
          {subscription?.planName ?? '—'}
        </p>
        <p>
          <span className="text-muted-foreground">Date:</span>{' '}
          {formatDate(subscription?.date ?? '')}
        </p>
        {subscription?.status && (
          <p>
            <span className="text-muted-foreground">Status:</span>{' '}
            {subscription.status}
          </p>
        )}
      </div>
      {subscription?.amount != null && (
        <>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Amount</span>
            <span>
              {formatAmount(
                subscription.amount,
                subscription?.currency ?? 'USD'
              )}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export interface DetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: HistoryItem | null
  onDownloadPdf?: (invoice: Invoice) => void
  isDownloading?: boolean
}

export function DetailDrawer({
  open,
  onOpenChange,
  item,
  onDownloadPdf,
  isDownloading = false,
}: DetailDrawerProps) {
  if (!item) return null

  const typeLabels: Record<string, string> = {
    invoice: 'Invoice',
    receipt: 'Receipt',
    refund: 'Refund',
    subscription: 'Subscription',
  }
  const title = typeLabels[item?.type ?? ''] ?? 'Transaction details'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {item?.date
              ? formatDate(item.date)
              : 'Transaction details'}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          {item?.type === 'invoice' && item?.invoice && (
            <InvoiceDetail
              invoice={item.invoice}
              onDownloadPdf={onDownloadPdf}
              isDownloading={isDownloading}
            />
          )}
          {item?.type === 'receipt' && item?.receipt && (
            <ReceiptDetail receipt={item.receipt} />
          )}
          {item?.type === 'refund' && item?.refund && (
            <RefundDetail refund={item.refund} />
          )}
          {item?.type === 'subscription' && item?.subscription && (
            <SubscriptionDetail subscription={item.subscription} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
