/**
 * MilestonesPreview - Inline display of milestones with quick-add/edit and dependency indicators
 */

import { useState } from 'react'
import { Plus, Pencil, Trash2, Link2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { CreateEditMilestone } from '@/types/create-edit-project'

export interface MilestonesPreviewProps {
  milestones: CreateEditMilestone[]
  onUpdate: (milestones: CreateEditMilestone[]) => void
  projectId?: string
}

function generateId(): string {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function MilestonesPreview({
  milestones = [],
  onUpdate,
  projectId = '',
}: MilestonesPreviewProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDueDate, setNewDueDate] = useState('')

  const list = Array.isArray(milestones) ? milestones : (milestones ?? [])

  const handleAdd = () => {
    const title = newTitle?.trim()
    if (!title) return
    const newMilestone: CreateEditMilestone = {
      id: generateId(),
      projectId,
      title,
      dueDate: newDueDate || undefined,
      dependencies: [],
      order: list.length,
    }
    onUpdate([...list, newMilestone])
    setNewTitle('')
    setNewDueDate('')
    setIsAdding(false)
  }

  const handleUpdate = (id: string, updates: Partial<CreateEditMilestone>) => {
    onUpdate(
      list.map((m) => (m.id === id ? { ...m, ...updates } : m))
    )
    setEditingId(null)
    setEditTitle('')
  }

  const handleRemove = (id: string) => {
    onUpdate(list.filter((m) => m.id !== id))
    setEditingId(null)
  }

  const startEdit = (m: CreateEditMilestone) => {
    setEditingId(m.id)
    setEditTitle(m.title)
  }

  return (
    <Card>
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
      <CardContent className="space-y-3">
        {list.length === 0 && !isAdding && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No milestones yet. Add one or generate with AI.
          </p>
        )}
        {list.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 transition-all duration-200 hover:border-primary/30"
          >
            {editingId === m.id ? (
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Milestone title"
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate(m.id, { title: editTitle.trim() })
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(m.id, { title: editTitle.trim() })}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{m.title}</p>
                  {m.dueDate && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {m.dueDate}
                    </p>
                  )}
                  {(m.dependencies ?? []).length > 0 && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Link2 className="h-3 w-3" />
                      {m.dependencies.length} dependency(ies)
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => startEdit(m)}
                    aria-label={`Edit ${m.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleRemove(m.id)}
                    aria-label={`Remove ${m.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
        {isAdding && (
          <div className="space-y-2 rounded-xl border border-dashed border-border p-3">
            <Label htmlFor="new-milestone-title">New milestone</Label>
            <Input
              id="new-milestone-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Milestone title"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') setIsAdding(false)
              }}
            />
            <Input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="mt-2"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAdd} disabled={!newTitle?.trim()}>
                Add
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
