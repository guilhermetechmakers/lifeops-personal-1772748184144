import { Link } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, Download, Settings, LayoutDashboard } from 'lucide-react'
import type { Invoice } from '@/types/checkout'

export interface ReceiptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
}

export function ReceiptModal({ open, onOpenChange, invoice }: ReceiptModalProps) {
  if (!invoice) return null

  const date = invoice?.date
    ? new Date(invoice.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" aria-describedby="receipt-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" aria-hidden />
            Payment successful
          </DialogTitle>
          <DialogDescription id="receipt-description">
            Your payment has been processed. Invoice #{invoice?.id ?? '—'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span>{date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">${(invoice?.totalAmount ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="capitalize">{invoice?.status ?? 'paid'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => onOpenChange(false)}
              asChild
            >
              <Link to="/dashboard/finance/transactions">
                <FileText className="h-4 w-4" />
                View transaction history
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              asChild
            >
              <a href="#" onClick={(e) => e.preventDefault()} aria-disabled>
                <Download className="h-4 w-4" />
                Download receipt (coming soon)
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link to="/dashboard/settings" onClick={() => onOpenChange(false)}>
                <Settings className="h-4 w-4" />
                Manage subscription
              </Link>
            </Button>
            <Button className="w-full gradient-primary text-primary-foreground gap-2" asChild>
              <Link to="/dashboard" onClick={() => onOpenChange(false)}>
                <LayoutDashboard className="h-4 w-4" />
                Return to dashboard
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
