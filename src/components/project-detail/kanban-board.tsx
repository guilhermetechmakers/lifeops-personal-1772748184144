/**
 * KanbanBoard - Columns Backlog, In Progress, Review, Done with drag-and-drop
 */

import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Task, Subtask, Dependency, TaskStatus } from '@/types/projects'
import { TaskCard } from './task-card'

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
  onTaskStatusChange?: (taskId: string, status: TaskStatus) => void
  onTaskTitleChange?: (taskId: string, title: string) => void
  onSubtaskToggle?: (subtaskId: string, isCompleted: boolean) => void
  onAddTask?: (status: TaskStatus, title: string) => void
}

export function KanbanBoard({
  tasks = [],
  subtasks = [],
  dependencies = [],
  onTaskStatusChange,
  onTaskTitleChange,
  onSubtaskToggle,
  onAddTask,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)
  const [addingColumn, setAddingColumn] = useState<TaskStatus | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const tasksByStatus = useCallback(
    (status: TaskStatus) =>
      (tasks ?? []).filter((t) => (t?.status ?? 'Backlog') === status),
    [tasks]
  )

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.setData('text/plain', task?.id ?? '')
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) {
      onTaskStatusChange?.(taskId, columnId)
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleAddTask = (columnId: TaskStatus) => {
    const title = newTaskTitle?.trim()
    if (!title) return
    onAddTask?.(columnId, title)
    setNewTaskTitle('')
    setAddingColumn(null)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold">Kanban Board</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const columnTasks = tasksByStatus(col.id)
          const isOver = dragOverColumn === col.id

          return (
            <div
              key={col.id}
              className={cn(
                'min-w-[280px] flex-1 shrink-0 rounded-xl border-2 border-dashed transition-colors duration-200',
                isOver ? 'border-primary bg-primary/5' : 'border-border'
              )}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{col.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setAddingColumn((p) => (p === col.id ? null : col.id))}
                    aria-label={`Add task to ${col.title}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {addingColumn === col.id && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Task title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTask(col.id)
                          if (e.key === 'Escape') setAddingColumn(null)
                        }}
                        className="h-9 text-sm"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleAddTask(col.id)} disabled={!newTaskTitle?.trim()}>
                        Add
                      </Button>
                    </div>
                  )}

                  {(columnTasks ?? []).map((task) => (
                    <TaskCard
                      key={task?.id}
                      task={task}
                      subtasks={subtasks}
                      dependencies={dependencies}
                      isDragging={draggedTask?.id === task?.id}
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      onTitleChange={onTaskTitleChange}
                      onSubtaskToggle={onSubtaskToggle}
                    />
                  ))}

                  {columnTasks.length === 0 && addingColumn !== col.id && (
                    <div
                      className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground"
                      onDragOver={(e) => handleDragOver(e, col.id)}
                      onDrop={(e) => handleDrop(e, col.id)}
                    >
                      Drop tasks here
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}