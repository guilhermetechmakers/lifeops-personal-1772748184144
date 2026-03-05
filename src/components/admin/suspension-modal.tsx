/**
 * SuspensionModal - Confirm suspend/reactivate with optional reason and audit log.
 */

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { User } from '@/types/admin'

export interface SuspensionModalProps {
  user: User | null
  action: 'suspend' | 'reactivate'
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (userId: string, reason?: string) => Promise<void>
}

export function SuspensionModal({
  user,
  action,
  open,
  onOpenChange,
  onConfirm,
}: SuspensionModalProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!user?.id) return
    setIsSubmitting(true)
    try {
      await onConfirm(user.id, reason || undefined)
      onOpenChange(false)
      setReason('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSuspend = action === 'suspend'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSuspend ? 'Suspend Account' : 'Reactivate Account'}
          </DialogTitle>
          <DialogDescription>
            {isSuspend
              ? `You are about to suspend ${user?.username ?? 'this user'}. They will not be able to access their account until reactivated.`
              : `You are about to reactivate ${user?.username ?? 'this user'}. They will regain full access.`}
          </DialogDescription>
        </DialogHeader>
        {isSuspend && (
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for suspension..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={isSuspend ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : isSuspend ? 'Suspend' : 'Reactivate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
