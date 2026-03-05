/**
 * ActivityFeed - Agent actions, content publications, transactions, workouts
 * LifeOps Personal Dashboard
 */

import { Link } from 'react-router-dom'
import { Activity, FileText, Wallet, Heart, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { DashboardSummary } from '@/types/dashboard'
import type { ActivityItem } from '@/types/dashboard'

export interface ActivityFeedProps {
  summary?: DashboardSummary | null
  isLoading?: boolean
}

function buildActivityItems(summary: DashboardSummary | null | undefined): ActivityItem[] {
  const items: ActivityItem[] = []
  if (!summary) return items

  const aiAudits = summary.aiAudits ?? []
  aiAudits.slice(0, 2).forEach((a) => {
    const actionType = a?.actionType ?? ''
    const label =
      actionType.length > 40
        ? actionType
        : actionType.includes('calendar')
          ? 'AI suggested tasks for your project'
          : actionType.includes('transaction') || actionType.includes('Flagged')
            ? 'Budget anomaly flagged for review'
            : actionType.includes('content') || actionType.includes('schedule')
              ? 'Content scheduled for publication'
              : `AI action: ${actionType}`
    items.push({
      id: `ai-${a.id}`,
      type: 'agent_action',
      text: label,
      timestamp: formatRelativeTime(a.timestamp),
      actionId: a.id,
    })
  })

  const content = summary.contentDrafts ?? []
  const published = content.filter((c) => c.status === 'published').slice(0, 1)
  published.forEach((c) => {
    items.push({
      id: `content-${c.id}`,
      type: 'content_published',
      text: `"${c.title}" published`,
      timestamp: c.scheduleDate ? formatRelativeTime(c.scheduleDate) : 'Recently',
      href: `/dashboard/content/${c.id}`,
    })
  })

  const finance = summary.finance ?? []
  if (finance.length > 0) {
    items.push({
      id: 'finance-flag',
      type: 'transaction_flagged',
      text: 'Transaction flagged: $120 at Coffee Shop',
      timestamp: '5h ago',
      href: '/dashboard/finance',
    })
  }

  const health = summary.health ?? []
  if (health.length > 0) {
    const workouts = health.find((h) => h.metricName === 'Workouts')
    if (workouts) {
      items.push({
        id: 'workout-done',
        type: 'workout_completed',
        text: `${workouts.value} workouts completed this week`,
        timestamp: 'Today',
        href: '/dashboard/health',
      })
    }
  }

  return items
    .sort((a, b) => {
      const order = ['agent_action', 'content_published', 'transaction_flagged', 'workout_completed']
      return order.indexOf(a.type) - order.indexOf(b.type)
    })
    .slice(0, 6)
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString()
}

const typeIcons: Record<ActivityItem['type'], typeof Activity> = {
  agent_action: Sparkles,
  content_published: FileText,
  transaction_flagged: Wallet,
  workout_completed: Heart,
}

export function ActivityFeed({ summary, isLoading }: ActivityFeedProps) {
  const items = buildActivityItems(summary)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
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
          <Activity className="h-5 w-5 text-primary" />
          Recent activity
        </CardTitle>
        <Link to="/dashboard/notifications">
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No recent activity. Complete tasks to see updates here.
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => {
              const Icon = typeIcons[item.type]
              const content = (
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      item.type === 'agent_action' && 'bg-primary/20 text-primary',
                      item.type === 'content_published' && 'bg-blue-100 text-blue-700',
                      item.type === 'transaction_flagged' && 'bg-amber-100 text-amber-700',
                      item.type === 'workout_completed' && 'bg-green-100 text-green-700'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.text}</p>
                    <p className="text-sm text-muted-foreground">{item.timestamp}</p>
                  </div>
                  {(item.href ?? item.actionId) && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={item.href ?? '#'}>View</Link>
                    </Button>
                  )}
                </div>
              )
              return (
                <li
                  key={item.id}
                  className={cn(
                    'border-b border-border pb-4 last:border-0 last:pb-0',
                    (item.href || item.actionId) && 'cursor-pointer'
                  )}
                >
                  {item.href ? (
                    <Link to={item.href} className="block">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
