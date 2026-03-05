import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SNOOZE_PRESETS } from '@/types/notifications'

export interface SnoozeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (durationMs: number) => void
  onCancel?: () => void
}

export function SnoozeModal({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: SnoozeModalProps) {
  const handlePreset = (durationMs: number) => {
    if (typeof durationMs !== 'number' || durationMs < 60000) return
    onConfirm(durationMs)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={true} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Snooze notification</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <p className="text-sm text-muted-foreground">
            Choose how long to snooze this notification.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SNOOZE_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => handlePreset(preset.durationMs)}
                className="transition-transform hover:scale-[1.02]"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
