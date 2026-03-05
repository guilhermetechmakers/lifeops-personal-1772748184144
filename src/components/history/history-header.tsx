import { History } from 'lucide-react'

export interface HistoryHeaderProps {
  title?: string
  description?: string
  totalCount?: number
  className?: string
}

export function HistoryHeader({
  title = 'Order & Transaction History',
  description = 'Invoices, receipts, refunds, and subscription activity',
  totalCount,
  className,
}: HistoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className={className}>
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <History className="h-8 w-8 text-primary" />
          {title}
        </h1>
        <p className="mt-1 text-muted-foreground">{description}</p>
      </div>
      {totalCount != null && totalCount > 0 && (
        <p className="text-sm text-muted-foreground">
          {totalCount} record{totalCount === 1 ? '' : 's'} total
        </p>
      )}
    </div>
  )
}
