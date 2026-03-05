/**
 * ReceiptModal - Post-checkout: view invoice/receipt
 * LifeOps Personal Checkout
 */

import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Invoice } from '@/types/checkout'
import { FileText, Download, Settings, LayoutDashboard } from 'lucide-react'

export interface ReceiptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onDownloadReceipt?: () => void | Promise<void>
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function ReceiptModal({
  open,
  onOpenChange,
  invoice,
  onDownloadReceipt,
}: ReceiptModalProps) {
  const inv = invoice ?? null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        aria-labelledby="receipt-title"
        aria-describedby="receipt-description"
      >
        <DialogHeader>
          <DialogTitle id="receipt-title" className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" aria-hidden />
            Payment successful
          </DialogTitle>
          <DialogDescription id="receipt-description">
            Your payment has been processed. View your receipt below.
          </DialogDescription>
        </DialogHeader>

        {inv && (
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Invoice #</span>
              <span className="font-mono font-medium">{inv.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span>{formatDate(inv.date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize text-green-600 dark:text-green-400">
                {inv.status}
              </span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(inv.amountDue)}</span>
              </div>
              {inv.taxAmount > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(inv.taxAmount)}</span>
                </div>
              )}
              {inv.discountAmount > 0 && (
                <div className="flex justify-between text-sm mt-1 text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatPrice(inv.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold mt-2 text-foreground">
                <span>Total</span>
                <span>{formatPrice(inv.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          {onDownloadReceipt && (
            <Button
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={onDownloadReceipt}
            >
              <Download className="h-4 w-4" aria-hidden />
              Download receipt
            </Button>
          )}
          <Link to="/dashboard/history">
            <Button
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={() => onOpenChange(false)}
            >
              <FileText className="h-4 w-4" aria-hidden />
              View order & transaction history
            </Button>
          </Link>
          <Link to="/dashboard/settings">
            <Button
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={() => onOpenChange(false)}
            >
              <Settings className="h-4 w-4" aria-hidden />
              Manage subscription
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              className="w-full gradient-primary text-primary-foreground justify-center gap-2"
              onClick={() => onOpenChange(false)}
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              Return to dashboard
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
