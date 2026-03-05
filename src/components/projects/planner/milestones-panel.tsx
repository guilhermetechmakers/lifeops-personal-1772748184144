/**
 * MilestonesPanel - List of milestones with progress, due dates, dependency indicators
 */

import { useState } from 'react'
import { Plus, Calendar, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { MilestoneDetail, Dependency } from '@/types/projects'

export interface MilestonesPanelProps {
  milestones: MilestoneDetail[]
  dependencies?: Dependency[]
  onAddMilestone?: (title: string, dueDate: string) => void
  onMilestoneClick?: (milestone: MilestoneDetail) => void
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function getMilestoneProgress(m: MilestoneDetail): number {
  if (m.status === 'Complete') return 100
  if (m.status === 'Active') return 50
  return 0
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

  const sorted = [...(milestones ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const deps = Array.isArray(dependencies) ? dependencies : []

  const handleSubmit = () => {
    const title = newTitle?.trim()
    if (!title) return
    onAddMilestone?.(title, newDueDate)
    setNewTitle('')
    setNewDueDate(() => {
      const d = new Date()
      d.setDate(d.getDate() + 14)
      return d.toISOString().slice(0, 10)
    })
    setIsAdding(false)
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Milestones</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="gap-2"
          aria-label="Add milestone"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <Input
              placeholder="Milestone title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              aria-label="New milestone title"
            />
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="flex h-10 flex-1 rounded-xl border border-input bg-card px-4 py-2 text-sm"
                aria-label="Due date"
              />
              <Button size="sm" onClick={handleSubmit} disabled={!newTitle?.trim()}>
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {sorted.length === 0 && !isAdding ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No milestones yet. Add one to get started.</p>
        ) : (
          <ul className="space-y-3" role="list">
            {sorted.map((m) => {
              const hasDeps = deps.some((d) => d.fromTaskId === m.id || d.toTaskId === m.id)
              const progress = getMilestoneProgress(m)
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => onMilestoneClick?.(m)}
                    className={cn(
                      'w-full rounded-xl border border-border bg-card p-4 text-left transition-all duration-200',
                      'hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium">{m.title ?? 'Untitled'}</h4>
                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(m.dueDate ?? '')}
                          </span>
                          {hasDeps && (
                            <span className="flex items-center gap-1" title="Has dependencies">
                              <Link2 className="h-4 w-4" />
                              Dependencies
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                          m.status === 'Complete' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                          m.status === 'Active' && 'bg-primary/20 text-primary-foreground',
                          m.status === 'Pending' && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {m.status}
                      </span>
                    </div>
                    <Progress value={progress} className="mt-3 h-1.5" />
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
