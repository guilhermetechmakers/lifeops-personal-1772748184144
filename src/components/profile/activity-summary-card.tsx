import { FileText, FolderKanban, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ActivitySummary } from '@/types/profile'
export interface ActivitySummaryCardProps {
  activity: ActivitySummary | null
  isLoading?: boolean
}

export function ActivitySummaryCard({
  activity,
  isLoading = false,
}: ActivitySummaryCardProps) {
  const items = [
    {
      label: 'Published items',
      value: activity?.publishedItems ?? 0,
      icon: FileText,
    },
    {
      label: 'Projects',
      value: activity?.projects ?? 0,
      icon: FolderKanban,
    },
    {
      label: 'Activity score',
      value: activity?.activityScore ?? 0,
      icon: TrendingUp,
    },
  ]

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-40 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Your engagement overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4 transition-all duration-200 hover:border-primary/30"
            >
              <item.icon className="h-5 w-5 text-primary" aria-hidden />
              <span className="text-2xl font-bold text-foreground">
                {item.value}
              </span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
