import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { HistoryItem } from '@/types/history'

export interface TransactionChartProps {
  items?: HistoryItem[]
  className?: string
}

function aggregateByMonth(
  items: HistoryItem[]
): { month: string; amount: number; count: number }[] {
  const byMonth = new Map<string, { amount: number; count: number }>()
  const safe = items ?? []

  for (const item of safe) {
    const date = item?.date
    if (!date) continue
    const d = new Date(date)
    if (!Number.isFinite(d.getTime())) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const amt = item?.amount ?? 0
    const existing = byMonth.get(key) ?? { amount: 0, count: 0 }
    byMonth.set(key, {
      amount: existing.amount + (Number.isFinite(amt) ? amt : 0),
      count: existing.count + 1,
    })
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { amount, count }]) => ({
      month,
      amount: Math.round(amount * 100) / 100,
      count,
    }))
}

const CHART_COLORS = {
  fill: 'rgba(255, 212, 0, 0.2)',
  stroke: 'rgb(255, 212, 0)',
}

export function TransactionChart({ items = [], className }: TransactionChartProps) {
  const data = aggregateByMonth(items ?? [])

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">Spending over time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            No data to display yet
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Spending over time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.stroke} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={CHART_COLORS.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => {
                  const [y, m] = String(v).split('-')
                  return `${m}/${y?.slice(-2) ?? ''}`
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={CHART_COLORS.stroke}
                fill="url(#chartGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
