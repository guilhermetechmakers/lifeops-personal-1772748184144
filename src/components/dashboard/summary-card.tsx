import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface SummaryCardProps {
  title: string
  value: string | number
  trend?: string
  trendUp?: boolean
  href?: string
  icon?: LucideIcon
  className?: string
}

export function SummaryCard({
  title,
  value,
  trend,
  trendUp,
  href,
  icon: Icon,
  className,
}: SummaryCardProps) {
  const content = (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01]',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground truncate">
          {title}
        </CardTitle>
        <div className="flex shrink-0 items-center gap-2">
          {trend != null && (
            <span
              className={cn(
                'text-xs font-medium',
                trendUp === true && 'text-emerald-600',
                trendUp === false && 'text-destructive',
                trendUp == null && 'text-primary'
              )}
            >
              {trend}
            </span>
          )}
          {Icon && (
            <Icon
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link to={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}
