/**
 * TaskCard - Kanban task card with subtasks, assignees, due date, dependencies
 */

import { useState } from 'react'
import { Calendar, User, Link2, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Task, Subtask, Dependency } from '@/types/projects'

export interface TaskCardProps {
  task: Task
  subtasks?: Subtask[]
  dependencies?: Dependency[]
  isDragging?: boolean
  onDragStart?: (e: React.DragEvent, task: Task) => void
  onDragEnd?: (e: React.DragEvent) => void
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onTitleChange?: (taskId: string, title: string) => void
  onSubtaskToggle?: (subtaskId: string, isCompleted: boolean) => void
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export function TaskCard({
  task,
  subtasks = [],
  dependencies = [],
  isDragging,
  onDragStart,
  onDragEnd,
  onTitleChange,
  onSubtaskToggle,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task?.title ?? '')
  const [showSubtasks, setShowSubtasks] = useState(true)

  const taskSubtasks = Array.isArray(subtasks) ? subtasks.filter((s) => s?.taskId === task?.id) : []
  const completedCount = taskSubtasks.filter((s) => s?.isCompleted).length
  const taskDeps = Array.isArray(dependencies) ? dependencies.filter((d) => d?.toTaskId === task?.id) : []

  const handleBlur = () => {
    const t = editTitle?.trim()
    if (t && t !== task?.title) {
      onTitleChange?.(task.id, t)
    }
    setIsEditing(false)
  }

  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task?.id, status: task?.status }))
        e.dataTransfer.effectAllowed = 'move'
        onDragStart?.(e, task)
      }}
      onDragEnd={onDragEnd}
      className={cn(
        'cursor-grab transition-all duration-200 active:cursor-grabbing',
        'hover:shadow-card-hover hover:scale-[1.01]',
        isDragging && 'opacity-50 shadow-lg',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
      )}
    >
      <CardContent className="p-4">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleBlur()
              if (e.key === 'Escape') {
                setEditTitle(task?.title ?? '')
                setIsEditing(false)
              }
            }}
            autoFocus
            className="mb-2"
          />
        ) : (
          <h4
            role="button"
            tabIndex={0}
            onClick={() => setIsEditing(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsEditing(true)
              }
            }}
            className="font-medium hover:text-primary"
          >
            {task?.title ?? 'Untitled'}
          </h4>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {task?.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(task.dueDate)}
            </span>
          )}
          {task?.assigneeId && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {task.assigneeId}
            </span>
          )}
          {taskDeps.length > 0 && (
            <span className="flex items-center gap-1" title="Has dependencies">
              <Link2 className="h-3.5 w-3.5" />
              {taskDeps.length}
            </span>
          )}
        </div>

        {task?.priority && (
          <Badge variant="outline" className="mt-2 text-xs">
            {task.priority}
          </Badge>
        )}

        {taskSubtasks.length > 0 && (
          <div className="mt-3 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground"
            >
              <span>
                {completedCount}/{taskSubtasks.length} subtasks
              </span>
              {showSubtasks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showSubtasks && (
              <ul className="mt-2 space-y-1">
                {taskSubtasks.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSubtaskToggle?.(s.id, !s.isCompleted)}
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                        s.isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                      )}
                      aria-label={s.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {s.isCompleted && <Check className="h-3 w-3" />}
                    </button>
                    <span className={cn('text-sm', s.isCompleted && 'line-through text-muted-foreground')}>
                      {s.title ?? 'Untitled'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
