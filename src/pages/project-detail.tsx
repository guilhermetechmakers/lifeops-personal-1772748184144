/**
 * Project Detail & Planner Page
 * Comprehensive view: header, milestones, Kanban, timeline, AI assistant, calendar, audit log
 */

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  fetchProjectDetail,
  updateTask,
  createMilestone,
  createTask,
  updateSubtask,
  applyAISuggestion,
  fetchAISuggestions,
} from '@/api/projects'
import {
  ProjectHeader,
  MilestonesPanel,
  KanbanBoard,
  TimelineView,
  AIAssistantPane,
  ActivityAuditLog,
  CalendarView,
} from '@/components/projects/planner'
import type { ProjectDetail, TaskStatus } from '@/types/projects'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const projectId = id ?? ''

  const [data, setData] = useState<ProjectDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState<ProjectDetail['aiSuggestions']>([])

  const loadData = useCallback(async () => {
    if (!projectId) return
    setIsLoading(true)
    try {
      const result = await fetchProjectDetail(projectId)
      setData(result)
      if (result?.aiSuggestions?.length) {
        setAiSuggestions(result.aiSuggestions ?? [])
      } else {
        const suggestions = await fetchAISuggestions(projectId)
        setAiSuggestions(Array.isArray(suggestions) ? suggestions : [])
      }
    } catch {
      setData(null)
      setAiSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleTaskStatusChange = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      if (!data) return
      const prev = data.tasks ?? []
      setData({
        ...data,
        tasks: prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      })
      const updated = await updateTask(taskId, { status: newStatus })
      if (!updated) {
        setData({ ...data, tasks: prev })
        toast.error('Failed to update task')
      } else {
        toast.success('Task updated')
      }
    },
    [data]
  )

  const handleTaskTitleChange = useCallback(
    async (taskId: string, title: string) => {
      if (!data) return
      const prev = data.tasks ?? []
      setData({
        ...data,
        tasks: prev.map((t) => (t.id === taskId ? { ...t, title } : t)),
      })
      const updated = await updateTask(taskId, { title })
      if (!updated) {
        setData({ ...data, tasks: prev })
        toast.error('Failed to update task')
      }
    },
    [data]
  )

  const handleSubtaskToggle = useCallback(
    async (subtaskId: string, isCompleted: boolean) => {
      if (!data) return
      const prev = data.subtasks ?? []
      setData({
        ...data,
        subtasks: prev.map((s) => (s.id === subtaskId ? { ...s, isCompleted } : s)),
      })
      const updated = await updateSubtask(subtaskId, { isCompleted })
      if (!updated) {
        setData({ ...data, subtasks: prev })
        toast.error('Failed to update subtask')
      }
    },
    [data]
  )

  const handleAddMilestone = useCallback(
    async (title: string, dueDate: string) => {
      if (!data?.project?.id) return
      const created = await createMilestone(data.project.id, { title, dueDate, order: (data.milestones?.length ?? 0), status: 'Pending' })
      if (created) {
        setData({
          ...data,
          milestones: [...(data.milestones ?? []), created],
        })
        toast.success('Milestone added')
      } else {
        toast.error('Failed to add milestone')
      }
    },
    [data]
  )

  const handleAddTask = useCallback(
    async (status: TaskStatus) => {
      if (!data?.project?.id) return
      const created = await createTask(data.project.id, {
        title: 'New task',
        status,
        order: (data.tasks ?? []).filter((t) => t.status === status).length,
      })
      if (created) {
        setData({
          ...data,
          tasks: [...(data.tasks ?? []), created],
        })
        toast.success('Task added')
      } else {
        toast.error('Failed to add task')
      }
    },
    [data]
  )

  const handleApplyAISuggestion = useCallback(
    async (suggestionId: string) => {
      if (!data?.project?.id) return
      const ok = await applyAISuggestion(suggestionId, data.project.id)
      if (ok) {
        setAiSuggestions((prev) => prev.filter((s) => s.id !== suggestionId))
        toast.success('AI suggestion applied')
        loadData()
      } else {
        toast.error('Failed to apply suggestion')
      }
    },
    [data, loadData]
  )

  const handleEdit = (): void => {
    if (project?.id) {
      navigate(`/dashboard/projects/${project.id}/edit`)
    } else {
      toast.info('Project ID not found')
    }
  }

  const handleTemplateApply = (): void => {
    toast.info('Apply template')
  }

  const handleAISummary = (): void => {
    toast.info('AI summary')
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  const project = data.project
  const milestones = data.milestones ?? []
  const tasks = data.tasks ?? []
  const subtasks = data.subtasks ?? []
  const dependencies = data.dependencies ?? []
  const auditLogs = data.auditLogs ?? []

  const suggestions = aiSuggestions.length > 0 ? aiSuggestions : (data.aiSuggestions ?? [])

  return (
    <div className="space-y-6 animate-fade-in">
      <ProjectHeader
        project={project}
        onEdit={handleEdit}
        onTemplateApply={handleTemplateApply}
        onAISummary={handleAISummary}
      />

      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <KanbanBoard
                tasks={tasks}
                subtasks={subtasks}
                dependencies={dependencies}
                projectId={project.id}
                onTaskStatusChange={handleTaskStatusChange}
                onTaskTitleChange={handleTaskTitleChange}
                onSubtaskToggle={handleSubtaskToggle}
                onAddTask={handleAddTask}
              />
            </div>
            <div className="space-y-6">
              <MilestonesPanel
                milestones={milestones}
                dependencies={dependencies}
                onAddMilestone={handleAddMilestone}
              />
              <AIAssistantPane
                suggestions={suggestions}
                onApply={handleApplyAISuggestion}
                onRefresh={() => fetchAISuggestions(projectId).then(setAiSuggestions)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TimelineView milestones={milestones} tasks={tasks} />
            </div>
            <MilestonesPanel
              milestones={milestones}
              dependencies={dependencies}
              onAddMilestone={handleAddMilestone}
            />
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CalendarView milestones={milestones} tasks={tasks} />
            </div>
            <AIAssistantPane
              suggestions={suggestions}
              onApply={handleApplyAISuggestion}
              onRefresh={() => fetchAISuggestions(projectId).then(setAiSuggestions)}
            />
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ActivityAuditLog events={auditLogs} />
            </div>
            <AIAssistantPane
              suggestions={suggestions}
              onApply={handleApplyAISuggestion}
              onRefresh={() => fetchAISuggestions(projectId).then(setAiSuggestions)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
