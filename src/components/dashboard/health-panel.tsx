/**
 * HealthPanel - Wellness metrics, training plans, dietary suggestions
 * LifeOps Personal Dashboard
 */

import { Link } from 'react-router-dom'
import { Heart, ArrowRight, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { HealthMetric } from '@/types/dashboard'

export interface HealthPanelProps {
  health?: HealthMetric[] | null
  isLoading?: boolean
}

export function HealthPanel({ health, isLoading }: HealthPanelProps) {
  const items = (health ?? []).slice(0, 4)
  const todayMetric = items.find((h) => h.metricName === 'Steps') ?? items[0]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Health
        </CardTitle>
        <Link to="/dashboard/health">
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No health data. Log a workout to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {todayMetric && (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-primary/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today&apos;s focus</p>
                  <p className="text-xl font-bold">
                    {todayMetric.value} {todayMetric.unit}
                  </p>
                  <p className="text-xs text-muted-foreground">{todayMetric.metricName}</p>
                </div>
              </div>
            )}
            <ul className="space-y-2">
              {items.map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span className="text-muted-foreground">{h.metricName}</span>
                  <span className="font-medium">
                    {h.value} {h.unit}
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
