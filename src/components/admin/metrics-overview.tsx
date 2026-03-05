/**
 * MetricsOverview - KPI cards for Active Users, Moderation Queue, API Error Rate, Incidents.
 * Each card shows value, delta trend, and mini sparkline. Uses Recharts.
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, ShieldAlert, AlertTriangle, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdminMetricsHealth, Metric } from '@/types/admin'

const METRIC_CONFIG: Record<
  string,
  { title: string; icon: typeof Users; format?: (v: number) => string }
> = {
  activeUsers: {
    title: 'Active Users',
    icon: Users,
    format: (v) => v.toLocaleString(),
  },
  modQueue: {
    title: 'Moderation Queue',
    icon: ShieldAlert,
  },
  apiErrorRate: {
    title: 'API Error Rate',
    icon: AlertTriangle,
    format: (v) => `${(v * 100).toFixed(2)}%`,
  },
  incidents: {
    title: 'Incidents',
    icon: Activity,
  },
}

function MiniSparkline({
  data,
  color = 'rgb(255 212 0)',
}: {
  data: number[]
  color?: string
}) {
  const chartData = (data ?? []).map((v, i) => ({ name: `d${i}`, value: v }))
  if (chartData.length === 0) return null
  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" hide />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip contentStyle={{ display: 'none' }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill="url(#spark)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export interface MetricsOverviewProps {
  data?: AdminMetricsHealth | null
  isLoading?: boolean
  className?: string
}

export function MetricsOverview({ data, isLoading, className }: MetricsOverviewProps) {
  const metrics = (data?.metrics ?? []) as Metric[]
  const activeUsers = data?.activeUsers ?? 0
  const modQueue = data?.moderationQueueSize ?? 0
  const errorRate = data?.apiErrorRate ?? 0
  const incidents = data?.incidentsCount ?? 0

  const cards = [
    {
      key: 'activeUsers',
      value: activeUsers,
      delta: metrics.find((m) => m.name === 'activeUsers')?.delta,
      sparkline: metrics.find((m) => m.name === 'activeUsers')?.sparklineData,
      config: METRIC_CONFIG.activeUsers,
    },
    {
      key: 'modQueue',
      value: modQueue,
      delta: metrics.find((m) => m.name === 'modQueue')?.delta,
      sparkline: metrics.find((m) => m.name === 'modQueue')?.sparklineData,
      config: METRIC_CONFIG.modQueue,
    },
    {
      key: 'apiErrorRate',
      value: errorRate,
      delta: metrics.find((m) => m.name === 'apiErrorRate')?.delta,
      sparkline: metrics.find((m) => m.name === 'apiErrorRate')?.sparklineData,
      config: METRIC_CONFIG.apiErrorRate,
    },
    {
      key: 'incidents',
      value: incidents,
      delta: metrics.find((m) => m.name === 'incidents')?.delta,
      sparkline: metrics.find((m) => m.name === 'incidents')?.sparklineData,
      config: METRIC_CONFIG.incidents,
    },
  ]

  if (isLoading) {
    return (
      <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
        {(cards ?? []).map((c) => (
          <Card key={c.key} className="transition-all duration-200">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-4" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {(cards ?? []).map((card) => {
        const Icon = card.config.icon
        const formatted =
          card.config.format != null
            ? card.config.format(card.value)
            : String(card.value)
        const deltaUp = (card.delta ?? 0) >= 0
        return (
          <Card
            key={card.key}
            className="transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01]"
          >
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground truncate">
                {card.config.title}
              </CardTitle>
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatted}</div>
              {card.delta != null && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    deltaUp ? 'text-emerald-600' : 'text-destructive'
                  )}
                >
                  {deltaUp ? '↑' : '↓'} {Math.abs(card.delta)}%
                </span>
              )}
              {Array.isArray(card.sparkline) && card.sparkline.length > 0 && (
                <div className="mt-2">
                  <MiniSparkline data={card.sparkline} />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
