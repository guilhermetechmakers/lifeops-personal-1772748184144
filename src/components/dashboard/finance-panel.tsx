/**
 * FinancePanel - Net cashflow, expenses, forecasted spending
 * LifeOps Personal Dashboard
 */

import { Link } from 'react-router-dom'
import { Wallet, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { FinanceRecord } from '@/types/dashboard'

export interface FinancePanelProps {
  finance?: FinanceRecord[] | null
  isLoading?: boolean
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function FinancePanel({ finance, isLoading }: FinancePanelProps) {
  const items = (finance ?? []).slice(0, 3)
  const latest = items[0]
  const netCashflow = latest?.netCashflow ?? 0
  const isPositive = netCashflow >= 0

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Finance
        </CardTitle>
        <Link to="/dashboard/finance">
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No finance data. Connect your accounts to get started.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net cashflow</p>
                <p
                  className={cn(
                    'text-xl font-bold',
                    isPositive ? 'text-green-700' : 'text-red-700'
                  )}
                >
                  {formatCurrency(netCashflow)}
                </p>
                {latest?.month && (
                  <p className="text-xs text-muted-foreground">{latest.month}</p>
                )}
              </div>
            </div>
            <ul className="space-y-2">
              {items.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="text-muted-foreground">{f.month}</span>
                  <span className={cn(f.netCashflow >= 0 ? 'text-green-600' : 'text-red-600')}>
                    {formatCurrency(f.netCashflow)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
