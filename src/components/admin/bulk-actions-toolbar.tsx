/**
 * BulkActionsToolbar - Select all, export selected, export all, bulk suspend/reactivate.
 */

import { Button } from '@/components/ui/button'
import { Download, Ban, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BulkActionsToolbarProps {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onExportSelected: () => void
  onExportAll: () => void
  onBulkSuspend: () => void
  onBulkReactivate: () => void
  hasSuspendedInSelection?: boolean
  className?: string
}

export function BulkActionsToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onExportSelected,
  onExportAll,
  onBulkSuspend,
  onBulkReactivate,
  hasSuspendedInSelection,
  className,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null

  const allSelected = selectedCount === totalCount && totalCount > 0

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3',
        className
      )}
    >
      <span className="text-sm font-medium text-muted-foreground">
        {selectedCount} selected
      </span>
      <Button variant="outline" size="sm" onClick={onSelectAll}>
        {allSelected ? 'Deselect all' : 'Select all'}
      </Button>
      <Button variant="outline" size="sm" onClick={onExportSelected}>
        <Download className="h-4 w-4" />
        Export selected
      </Button>
      <Button variant="outline" size="sm" onClick={onExportAll}>
        <Download className="h-4 w-4" />
        Export all
      </Button>
      {hasSuspendedInSelection ? (
        <Button variant="outline" size="sm" onClick={onBulkReactivate}>
          <CheckCircle className="h-4 w-4" />
          Bulk reactivate
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={onBulkSuspend} className="text-amber-600">
          <Ban className="h-4 w-4" />
          Bulk suspend
        </Button>
      )}
    </div>
  )
}
