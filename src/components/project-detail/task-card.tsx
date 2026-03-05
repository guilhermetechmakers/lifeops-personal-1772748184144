/**
 * TaskCard - Kanban task card with subtasks, assignees, due date, dependencies
 */

import { useState } from 'react'
import { Calendar, Link2, GripVertical, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Task, Subtask, Dependency } from '@/types/projects'
import { formatDate } from '@/utils/date'

const PRIORITY_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive'> = {
  Low: 'secondary',
  Medium: 'default',
  High: 'destructive',
}

export interface TaskCardProps {
  task: Task
  subtasks?: Subtask[]
  dependencies?: Dependency[]
  isDragging?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
  onStatusChange?: (taskId: string, status: Task['status']) => void
  onTitleChange?: (taskId: string, title: string) => void
  onSubtaskToggle?: (subtaskId: string, isCompleted: boolean) => void
}

export function TaskCard({
  task,
  subtasks = [],
  dependencies = [],
  isDragging = false,
  onDragStart,
  onDragEnd,
  onTitleChange,
  onSubtaskToggle,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task?.title ?? '')

  const taskSubtasks = (subtasks ?? []).filter((s) => s?.taskId === task?.id)
  const completedCount = taskSubtasks.filter((s) => s?.isCompleted).length
  const hasDeps = (dependencies ?? []).some(
    (d) => d?.fromTaskId === task?.id || d?.toTaskId === task?.id
  )

  const handleBlur = () => {
    const t = editTitle?.trim()
    if (t && t !== (task?.title ?? '')) {
      onTitleChange?.(task?.id ?? '', t)
    }
    setIsEditing(false)
  }

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'cursor-grab transition-all duration-200 active:cursor-grabbing',
        'hover:shadow-card-hover hover:scale-[1.01]',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div
            className="mt-1 shrink-0 cursor-grab text-muted-foreground"
            aria-hidden
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget.blur(), handleBlur())}
                className="h-8 text-sm"
                autoFocus
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditTitle(task?.title ?? '')
                  setIsEditing(true)
                }}
                className="w-full text-left font-medium text-sm hover:text-primary"
              >
                {task?.title ?? 'Untitled'}
              </button>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {task?.priority && (
                <Badge variant={PRIORITY_VARIANTS[task.priority] ?? 'secondary'} className="text-xs">
                  {task.priority}
                </Badge>
              )}
              {hasDeps && (
                <span className="text-muted-foreground" title="Has dependencies">
                  <Link2 className="h-3.5 w-3.5 inline" />
                </span>
              )}
              {task?.dueDate && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
            {taskSubtasks.length > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <span>
                  {completedCount}/{taskSubtasks.length} subtasks
                </span>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Edit title
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {taskSubtasks.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-border pt-2">
            {taskSubtasks.map((st) => (
              <label
                key={st?.id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={st?.isCompleted ?? false}
                  onChange={(e) => onSubtaskToggle?.(st?.id ?? '', e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <span
                  className={cn(
                    st?.isCompleted && 'text-muted-foreground line-through'
                  )}
                >
                  {st?.title ?? ''}
                </span>
              </label>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
