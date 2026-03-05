/**
 * BulkActionsBar - Schedule, Publish, Export, Delete for selected items
 */

import { useState } from 'react'
import { Calendar, Send, Download, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface BulkActionsBarProps {
  selectedCount: number
  onDeselectAll: () => void
  onSchedule: () => void
  onPublish: () => void
  onExport: () => void
  onDelete: () => void
  isProcessing?: boolean
  className?: string
}

export function BulkActionsBar({
  selectedCount,
  onDeselectAll,
  onSchedule,
  onPublish,
  onExport,
  onDelete,
  isProcessing = false,
  className,
}: BulkActionsBarProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (selectedCount === 0) return null

  const handleDelete = () => {
    onDelete()
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div
        className={cn(
          'flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3',
          className
        )}
        role="toolbar"
        aria-label="Bulk actions"
      >
        <span className="text-sm font-medium text-muted-foreground">
          {selectedCount} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDeselectAll}
          disabled={isProcessing}
          aria-label="Deselect all"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
        <div className="h-4 w-px bg-border" />
        <Button
          variant="outline"
          size="sm"
          onClick={onSchedule}
          disabled={isProcessing}
          aria-label="Schedule selected"
        >
          <Calendar className="h-4 w-4" />
          Schedule
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPublish}
          disabled={isProcessing}
          className="gradient-primary text-primary-foreground"
          aria-label="Publish selected"
        >
          <Send className="h-4 w-4" />
          Publish
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isProcessing}
          aria-label="Export selected"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isProcessing}
          className="text-destructive hover:text-destructive"
          aria-label="Delete selected"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
        {isProcessing && (
          <Progress value={undefined} className="ml-2 h-2 w-24 animate-pulse" />
        )}
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete content</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} item{selectedCount !== 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
