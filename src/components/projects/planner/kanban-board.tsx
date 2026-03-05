/**
 * KanbanBoard - Columns: Backlog, In Progress, Review, Done with drag-and-drop
 */

import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TaskCard } from './task-card'
import { cn } from '@/lib/utils'
import type { Task, Subtask, Dependency, TaskStatus } from '@/types/projects'

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'Backlog', title: 'Backlog' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Review', title: 'Review' },
  { id: 'Done', title: 'Done' },
]

export interface KanbanBoardProps {
  tasks: Task[]
  subtasks?: Subtask[]
  dependencies?: Dependency[]
  projectId?: string
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void
  onTaskTitleChange?: (taskId: string, title: string) => void
  onSubtaskToggle?: (subtaskId: string, isCompleted: boolean) => void
  onAddTask?: (status: TaskStatus) => void
}

export function KanbanBoard({
  tasks = [],
  subtasks = [],
  dependencies = [],
  projectId: _projectId,
  onTaskStatusChange,
  onTaskTitleChange,
  onSubtaskToggle,
  onAddTask,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)

  const taskList = Array.isArray(tasks) ? tasks : []
  const subList = Array.isArray(subtasks) ? subtasks : []
  const depList = Array.isArray(dependencies) ? dependencies : []

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => taskList.filter((t) => t?.status === status),
    [taskList]
  )

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(status)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault()
    setDragOverColumn(null)
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json') ?? '{}')
      const taskId = data?.taskId
      if (taskId) {
        onTaskStatusChange?.(taskId, targetStatus)
      }
    } catch {
      // ignore
    }
    setDraggedTask(null)
  }

  const handleDragStart = (_e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const columnTasks = getTasksByStatus(col.id)
        const isOver = dragOverColumn === col.id
        return (
          <div
            key={col.id}
            className="flex min-w-[280px] flex-1 flex-col"
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <Card
              className={cn(
                'flex min-h-[400px] flex-1 flex-col transition-all duration-200',
                isOver && 'border-primary bg-primary/5 ring-2 ring-primary/30'
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{col.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onAddTask?.(col.id)}
                  aria-label={`Add task to ${col.title}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 overflow-y-auto">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    subtasks={subList}
                    dependencies={depList}
                    isDragging={draggedTask?.id === task.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onTitleChange={onTaskTitleChange}
                    onSubtaskToggle={onSubtaskToggle}
                  />
                ))}
                {columnTasks.length === 0 && !isOver && (
                  <div className="flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                    Drop tasks here
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
