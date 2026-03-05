/**
 * SubscriptionActivityCard - Displays subscription events
 */

import { RefreshCw, TrendingUp, TrendingDown, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SubscriptionEvent, SubscriptionEventType } from '@/types/history'

const TYPE_CONFIG: Record<
  SubscriptionEventType,
  { label: string; icon: typeof RefreshCw; className: string }
> = {
  UPGRADE: {
    label: 'Upgrade',
    icon: TrendingUp,
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  DOWNGRADE: {
    label: 'Downgrade',
    icon: TrendingDown,
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  },
  RENEW: {
    label: 'Renewal',
    icon: RefreshCw,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  CANCEL: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-500',
  },
}

export interface SubscriptionActivityCardProps {
  subscription: SubscriptionEvent
  onViewDetails?: (subscription: SubscriptionEvent) => void
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

function formatAmount(amount: number | undefined, currency: string | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency ?? 'USD',
  }).format(amount)
}

export function SubscriptionActivityCard({
  subscription,
  onViewDetails,
}: SubscriptionActivityCardProps) {
  const type = subscription?.type ?? 'RENEW'
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.RENEW
  const Icon = config.icon

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={() => onViewDetails?.(subscription)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewDetails?.(subscription)
        }
      }}
      aria-label={`Subscription ${config.label} - ${subscription?.planName ?? '—'}`}
    >
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">
                {subscription?.planName ?? '—'}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatDate(subscription?.date ?? '')}
              </p>
              <span
                className={cn(
                  'mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                  config.className
                )}
              >
                {config.label}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            {subscription?.amount != null && Number.isFinite(subscription.amount) && (
              <p className="font-semibold text-foreground">
                {formatAmount(subscription.amount, subscription?.currency)}
              </p>
            )}
            {subscription?.status && (
              <p className="mt-0.5 text-sm text-muted-foreground capitalize">
                {subscription.status}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
