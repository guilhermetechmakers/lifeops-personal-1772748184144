/**
 * MilestonesPanel - List of milestones with progress, due dates, dependency indicators
 */

import { useState } from 'react'
import { Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { MilestoneDetail, Dependency } from '@/types/projects'
import { formatDate } from '@/utils/date'

const MILESTONE_STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-muted',
  Active: 'bg-primary',
  Complete: 'bg-primary',
}

export interface MilestonesPanelProps {
  milestones: MilestoneDetail[]
  dependencies?: Dependency[]
  onAddMilestone?: (title: string, dueDate: string) => void
  onMilestoneClick?: (milestone: MilestoneDetail) => void
}

export function MilestonesPanel({
  milestones = [],
  dependencies = [],
  onAddMilestone,
  onMilestoneClick,
}: MilestonesPanelProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDueDate, setNewDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString().slice(0, 10)
  })

  const sortedMilestones = [...(milestones ?? [])].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
  void dependencies

  const handleAdd = () => {
    const title = newTitle?.trim()
    if (!title) return
    onAddMilestone?.(title, newDueDate)
    setNewTitle('')
    setNewDueDate(() => {
      const d = new Date()
      d.setDate(d.getDate() + 7)
      return d.toISOString().slice(0, 10)
    })
    setIsAdding(false)
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Milestones</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding((p) => !p)}
          className="transition-all duration-200 hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
            <Input
              placeholder="Milestone title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-9"
            />
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="h-9 flex-1"
              />
              <Button size="sm" onClick={handleAdd} disabled={!newTitle?.trim()}>
                Add
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {(sortedMilestones ?? []).length === 0 && !isAdding ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No milestones yet. Add one to track progress.
          </p>
        ) : (
          <ul className="space-y-3">
            {(sortedMilestones ?? []).map((m, idx) => {
              const status = m?.status ?? 'Pending'
              const progress = status === 'Complete' ? 100 : status === 'Active' ? 50 : 0
              return (
                <li key={m?.id ?? idx}>
                  <button
                    type="button"
                    onClick={() => onMilestoneClick?.(m)}
                    className={cn(
                      'w-full rounded-lg border border-border bg-card p-3 text-left transition-all duration-200',
                      'hover:shadow-card-hover hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-ring'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{m?.title ?? 'Untitled'}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(m?.dueDate)}
                        </div>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                          status === 'Complete' && 'bg-primary/20 text-primary-foreground',
                          status === 'Active' && 'bg-primary/20 text-primary-foreground',
                          status === 'Pending' && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {status}
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className={cn('mt-2 h-1.5', MILESTONE_STATUS_COLORS[status])}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
