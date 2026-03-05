/**
 * RefundCard - Displays refund requests with status and support link
 */

import { RotateCcw, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Refund, RefundStatus } from '@/types/history'

const STATUS_STYLES: Record<RefundStatus, string> = {
  requested: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
}

export interface RefundCardProps {
  refund: Refund
  onViewDetails?: (refund: Refund) => void
  onSupportClick?: (refund: Refund) => void
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

export function RefundCard({
  refund,
  onViewDetails,
  onSupportClick,
}: RefundCardProps) {
  const status = refund?.status ?? 'requested'
  const hasSupportLink = Boolean(refund?.supportLink?.trim())

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={() => onViewDetails?.(refund)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewDetails?.(refund)
        }
      }}
      aria-label={`Refund ${formatAmount(refund?.amount ?? 0, refund?.currency ?? 'USD')} - ${status}`}
    >
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <RotateCcw className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">
                {formatAmount(refund?.amount ?? 0, refund?.currency ?? 'USD')}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Requested {formatDate(refund?.dateRequested ?? '')}
              </p>
              {refund?.resolutionDate && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Resolved {formatDate(refund.resolutionDate)}
                </p>
              )}
              <span
                className={cn(
                  'mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                  STATUS_STYLES[status] ?? STATUS_STYLES.requested
                )}
              >
                {status}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
            {hasSupportLink && onSupportClick && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={(e) => {
                  e.stopPropagation()
                  onSupportClick(refund)
                }}
                aria-label="Contact support"
              >
                <ExternalLink className="h-4 w-4" />
                Support
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails?.(refund)
              }}
              aria-label="View details"
            >
              View details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
