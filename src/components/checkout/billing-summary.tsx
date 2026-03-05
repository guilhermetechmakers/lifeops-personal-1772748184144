/**
 * BillingSummary - Line items: base price, taxes, discounts, proration, total
 * LifeOps Personal Checkout - Recalculates on plan/promo/cart changes
 */

import type { Plan, BillingSummaryLine } from '@/types/checkout'
import { cn } from '@/lib/utils'

export interface BillingSummaryProps {
  plan: Plan | null
  cartItemsTotal?: number
  taxAmount?: number
  discountAmount?: number
  prorationAmount?: number
  prorationNote?: string
  nextBillingDate?: string | null
  lines?: BillingSummaryLine[]
  className?: string
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function BillingSummary({
  plan,
  cartItemsTotal = 0,
  taxAmount = 0,
  discountAmount = 0,
  prorationAmount = 0,
  prorationNote,
  nextBillingDate,
  lines,
  className,
}: BillingSummaryProps) {
  const basePrice = plan?.price ?? 0
  const cadenceLabel =
    plan?.cadence === 'yearly' ? '/year' : '/month'
  const subtotal = basePrice + cartItemsTotal
  const total = Math.max(0, subtotal + taxAmount - discountAmount + prorationAmount)

  const displayLines: BillingSummaryLine[] =
    Array.isArray(lines) && lines.length > 0
      ? lines
      : [
          ...(basePrice > 0
            ? [
                {
                  label: `${plan?.name ?? 'Plan'} ${cadenceLabel}`,
                  amount: basePrice,
                  type: 'subtotal' as const,
                },
              ]
            : []),
          ...(cartItemsTotal > 0
            ? [{ label: 'One-time items', amount: cartItemsTotal, type: 'subtotal' as const }]
            : []),
          ...(taxAmount > 0
            ? [{ label: 'Tax', amount: taxAmount, type: 'tax' as const }]
            : []),
          ...(discountAmount > 0
            ? [
                {
                  label: 'Discount',
                  amount: -discountAmount,
                  type: 'discount' as const,
                },
              ]
            : []),
          ...(prorationAmount !== 0
            ? [
                {
                  label: prorationNote ?? 'Proration',
                  amount: prorationAmount,
                  type: 'proration' as const,
                },
              ]
            : []),
        ]

  return (
    <div
      className={cn('rounded-2xl border border-border bg-card p-5 shadow-card', className)}
      role="region"
      aria-label="Billing summary"
    >
      <h3 className="font-bold text-lg text-foreground">Billing summary</h3>
      <dl className="mt-4 space-y-3">
        {(displayLines ?? []).map((line, idx) => (
          <div
            key={idx}
            className="flex justify-between text-sm"
          >
            <dt className="text-muted-foreground">{line.label}</dt>
            <dd
              className={cn(
                'font-medium',
                line.amount < 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'
              )}
            >
              {line.amount < 0 ? '-' : ''}
              {formatPrice(Math.abs(line.amount))}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 border-t border-border pt-4">
        <div className="flex justify-between font-bold text-foreground">
          <span>Total due</span>
          <span>{formatPrice(total)}</span>
        </div>
        {nextBillingDate && (
          <p className="mt-2 text-sm text-muted-foreground">
            Next billing: {formatDate(nextBillingDate)}
          </p>
        )}
      </div>
    </div>
  )
}
