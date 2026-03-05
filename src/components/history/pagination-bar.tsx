import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PaginationBarProps {
  page: number
  total: number
  limit: number
  hasMore: boolean
  onPageChange: (page: number) => void
  onLoadMore?: () => void
  isLoading?: boolean
  className?: string
}

export function PaginationBar({
  page,
  total,
  limit,
  hasMore,
  onPageChange,
  onLoadMore,
  isLoading = false,
  className,
}: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canGoPrev = page > 1
  const canGoNext = hasMore || page < totalPages

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 sm:flex-row',
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
        {total > 0 && ` • ${total} total`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrev || isLoading}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext || isLoading}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
        {hasMore && onLoadMore && (
          <Button
            variant="default"
            size="sm"
            className="gradient-primary"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load more'}
          </Button>
        )}
      </div>
    </div>
  )
}
