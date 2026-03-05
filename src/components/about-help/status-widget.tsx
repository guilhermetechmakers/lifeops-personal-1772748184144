import { Activity, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StatusItem, StatusValue } from '@/types/about-help'

export interface StatusWidgetProps {
  statusData?: StatusItem[] | null
  className?: string
}

function StatusIcon({ status }: { status: StatusValue }) {
  switch (status) {
    case 'operational':
      return <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden />
    case 'degraded':
      return <AlertCircle className="h-5 w-5 text-amber-600" aria-hidden />
    case 'down':
      return <XCircle className="h-5 w-5 text-destructive" aria-hidden />
    default:
      return <Activity className="h-5 w-5 text-muted-foreground" aria-hidden />
  }
}

function StatusLabel({ status }: { status: StatusValue }) {
  const labels: Record<StatusValue, string> = {
    operational: 'Operational',
    degraded: 'Degraded',
    down: 'Down',
  }
  return (
    <span
      className={cn(
        'text-xs font-medium capitalize',
        status === 'operational' && 'text-green-600',
        status === 'degraded' && 'text-amber-600',
        status === 'down' && 'text-destructive'
      )}
    >
      {labels[status] ?? status}
    </span>
  )
}

export function StatusWidget({ statusData = [], className }: StatusWidgetProps) {
  const items = Array.isArray(statusData) ? statusData : []

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" aria-hidden />
          <h3 className="font-semibold text-base">Status & Updates</h3>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Status information is currently unavailable. All systems are assumed
            operational.
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {items.map((item) => (
              <li
                key={item?.id ?? ''}
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StatusIcon status={item?.status ?? 'operational'} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item?.service ?? 'Unknown'}
                    </p>
                    {item?.message && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.message}
                      </p>
                    )}
                  </div>
                </div>
                <StatusLabel status={item?.status ?? 'operational'} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
