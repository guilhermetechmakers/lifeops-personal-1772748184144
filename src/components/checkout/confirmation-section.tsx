/**
 * ConfirmationSection - Final confirmation summary, Confirm & Pay button
 * LifeOps Personal Checkout
 */

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ConfirmationSectionProps {
  totalAmount: number
  onConfirm: () => void | Promise<void>
  isProcessing?: boolean
  disabled?: boolean
  error?: string | null
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function ConfirmationSection({
  totalAmount,
  onConfirm,
  isProcessing = false,
  disabled = false,
  error,
}: ConfirmationSectionProps) {
  return (
    <div
      className="space-y-4"
      role="region"
      aria-label="Payment confirmation"
    >
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
        <span className="font-semibold text-foreground">Total due</span>
        <span className="font-bold text-xl text-foreground">
          {formatPrice(totalAmount)}
        </span>
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button
        type="button"
        onClick={onConfirm}
        disabled={disabled || isProcessing}
        className={cn(
          'w-full gradient-primary text-primary-foreground font-semibold',
          'h-12 text-base transition-all duration-200',
          'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
          'disabled:hover:scale-100'
        )}
        aria-busy={isProcessing}
        aria-live="polite"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Processing...
          </>
        ) : (
          'Confirm & Pay'
        )}
      </Button>
    </div>
  )
}
