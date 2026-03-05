/**
 * TasksPreview - Inline display of tasks with Kanban-friendly hints and quick-add/edit
 */

import { useState } from 'react'
import { Plus, Pencil, Trash2, Link2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { CreateEditTask, TaskStatus } from '@/types/create-edit-project'

export interface TasksPreviewProps {
  tasks: CreateEditTask[]
  onUpdate: (tasks: CreateEditTask[]) => void
  milestoneId?: string
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'Todo', label: 'Todo' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
]

function generateId(): string {
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function TasksPreview({
  tasks = [],
  onUpdate,
  milestoneId = '',
}: TasksPreviewProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newStatus, setNewStatus] = useState<TaskStatus>('Todo')

  const list = Array.isArray(tasks) ? tasks : (tasks ?? [])

  const handleAdd = () => {
    const title = newTitle?.trim()
    if (!title) return
    const newTask: CreateEditTask = {
      id: generateId(),
      milestoneId,
      title,
      status: newStatus,
      dependencies: [],
      order: list.length,
    }
    onUpdate([...list, newTask])
    setNewTitle('')
    setNewStatus('Todo')
    setIsAdding(false)
  }

  const handleUpdate = (id: string, updates: Partial<CreateEditTask>) => {
    onUpdate(list.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    setEditingId(null)
    setEditTitle('')
  }

  const handleRemove = (id: string) => {
    onUpdate(list.filter((t) => t.id !== id))
    setEditingId(null)
  }

  const startEdit = (t: CreateEditTask) => {
    setEditingId(t.id)
    setEditTitle(t.title)
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Todo':
        return 'bg-muted'
      case 'InProgress':
        return 'bg-primary/20 text-primary'
      case 'Done':
        return 'bg-primary/10 text-primary'
      default:
        return 'bg-muted'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Tasks</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="gap-2"
          aria-label="Add task"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.length === 0 && !isAdding && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No tasks yet. Add one or generate with AI.
          </p>
        )}
        {list.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 transition-all duration-200 hover:border-primary/30"
          >
            {editingId === t.id ? (
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Task title"
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate(t.id, { title: editTitle.trim() })
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(t.id, { title: editTitle.trim() })}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <span
                  className={cn(
                    'rounded px-2 py-0.5 text-xs font-medium',
                    getStatusColor(t.status)
                  )}
                >
                  {t.status}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{t.title}</p>
                  {t.dueDate && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {t.dueDate}
                    </p>
                  )}
                  {(t.dependencies ?? []).length > 0 && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Link2 className="h-3 w-3" />
                      {t.dependencies.length} dependency(ies)
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => startEdit(t)}
                    aria-label={`Edit ${t.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleRemove(t.id)}
                    aria-label={`Remove ${t.title}`}
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
            <Label htmlFor="new-task-title">New task</Label>
            <Input
              id="new-task-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') setIsAdding(false)
              }}
            />
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as TaskStatus)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
