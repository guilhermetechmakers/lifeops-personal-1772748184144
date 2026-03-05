/**
 * EscalationModal - Create escalation ticket to support with summary and notes.
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { User } from '@/types/admin'

export interface EscalationModalProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (userId: string, subject: string, notes: string) => Promise<void>
}

export function EscalationModal({
  user,
  open,
  onOpenChange,
  onSubmit,
}: EscalationModalProps) {
  const [subject, setSubject] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user?.id || !subject.trim()) return
    setIsSubmitting(true)
    try {
      await onSubmit(user.id, subject.trim(), notes.trim())
      onOpenChange(false)
      setSubject('')
      setNotes('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escalate to Support</DialogTitle>
          <DialogDescription>
            Create an escalation ticket for {user?.username ?? 'this user'}. Support will review
            and follow up.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="Brief summary of the issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional context for support..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !subject.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Escalate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
