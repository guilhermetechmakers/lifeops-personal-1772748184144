import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { FinanceRecord } from '@/types/dashboard'
import { cn } from '@/lib/utils'

export interface ChartContainerProps {
  title?: string
  description?: string
  financeData?: FinanceRecord[] | null
  weeklyData?: { name: string; value: number }[]
  variant?: 'area' | 'bar'
  className?: string
}

export function ChartContainer({
  title = 'Weekly activity',
  description = 'Tasks completed across modules',
  financeData = [],
  weeklyData,
  variant = 'area',
  className,
}: ChartContainerProps) {
  const finance = Array.isArray(financeData) ? financeData : []
  const chartData =
    weeklyData ??
    finance.map((f) => ({
      name: f?.month ?? '',
      value: f?.netCashflow ?? 0,
    }))

  const defaultWeekly =
    chartData.length > 0
      ? chartData
      : [
          { name: 'Mon', value: 4 },
          { name: 'Tue', value: 3 },
          { name: 'Wed', value: 6 },
          { name: 'Thu', value: 5 },
          { name: 'Fri', value: 7 },
          { name: 'Sat', value: 2 },
          { name: 'Sun', value: 4 },
        ]

  const data = weeklyData ?? defaultWeekly

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            {variant === 'bar' ? (
              <BarChart data={data}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(255 212 0)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="rgb(255 212 0)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid rgb(230 232 236)',
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(255 212 0)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(255 212 0)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid rgb(230 232 236)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgb(255 212 0)"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
