/**
 * SystemAlertsPanel - Active incidents, recent logs, filterable by severity.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminAlerts } from '@/hooks/use-admin-query'
import { AlertTriangle, Info, AlertCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Alert } from '@/types/admin'

const SEVERITY_CONFIG = {
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  critical: { icon: XCircle, color: 'text-red-700', bg: 'bg-red-100' },
} as const

function formatDate(s?: string | null): string {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleString()
  } catch {
    return '—'
  }
}

export function SystemAlertsPanel() {
  const { data, isLoading } = useAdminAlerts()
  const alerts = (data?.alerts ?? []) as Alert[]

  const unacknowledged = alerts.filter((a) => !a?.acknowledged)
  const acknowledged = alerts.filter((a) => a?.acknowledged)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">System Alerts</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor incidents and system status
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Incidents</CardTitle>
          <p className="text-sm text-muted-foreground">
            {unacknowledged.length} unacknowledged
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {(Array.from({ length: 3 }) ?? []).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(unacknowledged ?? []).map((alert) => {
                const config =
                  SEVERITY_CONFIG[alert?.severity ?? 'info'] ?? SEVERITY_CONFIG.info
                const Icon = config.icon
                return (
                  <div
                    key={alert?.id}
                    className={cn(
                      'flex items-start gap-4 rounded-xl border border-border p-4',
                      config.bg
                    )}
                  >
                    <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', config.color)} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{alert?.message ?? '—'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(alert?.timestamp)}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize shrink-0">
                      {alert?.severity ?? 'info'}
                    </Badge>
                  </div>
                )
              })}
              {unacknowledged.length === 0 && (
                <p className="text-muted-foreground py-4">No active incidents</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(acknowledged ?? []).map((alert) => {
              const config =
                SEVERITY_CONFIG[alert?.severity ?? 'info'] ?? SEVERITY_CONFIG.info
              const Icon = config.icon
              return (
                <div
                  key={alert?.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-3 opacity-75"
                >
                  <Icon className={cn('h-4 w-4 shrink-0', config.color)} />
                  <p className="text-sm flex-1">{alert?.message ?? '—'}</p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDate(alert?.timestamp)}
                  </span>
                </div>
              )
            })}
            {acknowledged.length === 0 && unacknowledged.length === 0 && !isLoading && (
              <p className="text-muted-foreground py-4">No recent logs</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
