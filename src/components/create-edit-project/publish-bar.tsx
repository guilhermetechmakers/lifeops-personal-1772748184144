/**
 * PublishBar - Save Draft, Publish, Cancel with validation messages
 */

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PublishBarProps {
  onSaveDraft: () => void
  onPublish: () => void
  onCancel: () => void
  isPublishing?: boolean
  isSaving?: boolean
  canPublish?: boolean
  validationErrors?: string[]
  className?: string
}

export function PublishBar({
  onSaveDraft,
  onPublish,
  onCancel,
  isPublishing = false,
  isSaving = false,
  canPublish = true,
  validationErrors = [],
  className,
}: PublishBarProps) {
  const errors = Array.isArray(validationErrors) ? validationErrors : (validationErrors ?? [])
  const hasErrors = errors.length > 0

  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 flex flex-col gap-4 border-t border-border bg-card/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {hasErrors && (
        <ul className="flex-1 space-y-1 text-sm text-destructive" role="alert">
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2 sm:ml-auto">
        <Button variant="outline" onClick={onCancel} disabled={isPublishing || isSaving}>
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isPublishing || isSaving}
          aria-busy={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button
          className="gradient-primary text-primary-foreground transition-all duration-200 hover:scale-[1.02]"
          onClick={onPublish}
          disabled={!canPublish || isPublishing || isSaving || hasErrors}
          aria-busy={isPublishing}
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </div>
  )
}
