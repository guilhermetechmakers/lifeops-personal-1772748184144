/**
 * ContentCardSkeleton - Loading placeholder for ContentCard
 */

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface ContentCardSkeletonProps {
  className?: string
}

export function ContentCardSkeleton({ className }: ContentCardSkeletonProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-0">
        <Skeleton className="aspect-video w-full rounded-none" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
