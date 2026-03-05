/**
 * Projects API - LifeOps Personal
 * API-ready scaffolding with safe null handling
 */

import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api'
import type {
  Project,
  ProjectDetail,
  MilestoneDetail,
  Task,
  Subtask,
  Dependency,
  AuditLog,
  AISuggestion,
} from '@/types/projects'

export interface ProjectsResponse {
  data: Project[] | null
}

export interface ProjectResponse {
  data: Project | null
}

/** Mock projects for development when API is not connected */
function getMockProjects(): Project[] {
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  return [
    {
      id: '1',
      title: 'Q1 Product Launch',
      status: 'Active',
      progress: 65,
      nextMilestone: { id: 'm1', title: 'Design review complete', dueDate: nextWeek, completed: false },
      assignedTasksCount: 12,
      dueDate: nextMonth,
      priority: 'High',
      tags: ['product', 'launch'],
      aiRecommendation: 'Schedule design review meeting this week to unblock development.',
      createdAt: lastWeek,
      updatedAt: now.toISOString(),
    },
    {
      id: '2',
      title: 'Blog Redesign',
      status: 'Active',
      progress: 40,
      nextMilestone: { id: 'm2', title: 'Wireframes approved', dueDate: nextWeek, completed: false },
      assignedTasksCount: 8,
      dueDate: nextMonth,
      priority: 'Medium',
      tags: ['design', 'content'],
      aiRecommendation: 'Prioritize mobile wireframes to align with Q1 launch timeline.',
      createdAt: lastWeek,
      updatedAt: now.toISOString(),
    },
    {
      id: '3',
      title: 'Annual Report',
      status: 'Completed',
      progress: 100,
      nextMilestone: null,
      assignedTasksCount: 15,
      dueDate: lastWeek,
      priority: 'High',
      tags: ['report', 'finance'],
      aiRecommendation: null,
      createdAt: lastWeek,
      updatedAt: now.toISOString(),
    },
    {
      id: '4',
      title: 'Marketing Campaign',
      status: 'Paused',
      progress: 10,
      nextMilestone: { id: 'm4', title: 'Campaign brief', dueDate: nextMonth, completed: false },
      assignedTasksCount: 5,
      dueDate: nextMonth,
      priority: 'Medium',
      tags: ['marketing'],
      aiRecommendation: 'Consider breaking into smaller phases to reduce scope and accelerate delivery.',
      createdAt: lastWeek,
      updatedAt: now.toISOString(),
    },
  ]
}

/** Fetch projects with optional filters. Returns empty array on null. */
export async function fetchProjects(params?: {
  search?: string
  status?: string
  tags?: string[]
  dueDate?: string
  priority?: string
}): Promise<Project[]> {
  try {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set('search', params.search)
    if (params?.status && params.status !== 'All') searchParams.set('status', params.status)
    if (params?.tags?.length) searchParams.set('tags', params.tags.join(','))
    if (params?.dueDate) searchParams.set('dueDate', params.dueDate)
    if (params?.priority && params.priority !== 'All') searchParams.set('priority', params.priority)
    const query = searchParams.toString()
    const path = query ? `/projects?${query}` : '/projects'
    const res = await apiGet<ProjectsResponse>(path)
    const list = Array.isArray(res?.data) ? res.data : (res?.data ?? [])
    if (list.length > 0) return list
    return getMockProjects()
  } catch {
    return getMockProjects()
  }
}

/** Create project */
export async function createProject(data: Partial<Project>): Promise<Project | null> {
  try {
    const res = await apiPost<ProjectResponse>('/projects', data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Get project by ID */
export async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await apiGet<ProjectResponse>(`/projects/${id}`)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Update project */
export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  try {
    const res = await apiPut<ProjectResponse>(`/projects/${id}`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Archive project */
export async function archiveProject(id: string): Promise<boolean> {
  try {
    await apiPost(`/projects/${id}/archive`)
    return true
  } catch {
    return false
  }
}

/** Generate AI plan for project */
export async function generateAiPlan(id: string): Promise<unknown> {
  try {
    return await apiPost(`/projects/${id}/ai-plan`)
  } catch {
    return null
  }
}

/** Project Detail & Planner API */

/** Mock project detail for development */
function getMockProjectDetail(projectId: string): ProjectDetail {
  const now = new Date()
  const base = now.getTime()
  const d = (days: number) => new Date(base + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const iso = (days: number) => new Date(base + days * 24 * 60 * 60 * 1000).toISOString()

  const milestones: MilestoneDetail[] = [
    { id: 'm1', projectId, title: 'Design review complete', dueDate: d(7), order: 0, status: 'Active' },
    { id: 'm2', projectId, title: 'Development phase 1', dueDate: d(21), order: 1, status: 'Pending' },
    { id: 'm3', projectId, title: 'Launch readiness', dueDate: d(45), order: 2, status: 'Pending' },
  ]

  const tasks: Task[] = [
    { id: 't1', projectId, title: 'Research competitors', status: 'Done', dueDate: d(3), priority: 'High', order: 0 },
    { id: 't2', projectId, title: 'Draft outline', status: 'Done', dueDate: d(5), priority: 'Medium', order: 1 },
    { id: 't3', projectId, title: 'Design mockups', status: 'In Progress', dueDate: d(10), priority: 'High', order: 2 },
    { id: 't4', projectId, title: 'User testing', status: 'Backlog', dueDate: d(15), priority: 'Medium', order: 3 },
    { id: 't5', projectId, title: 'Final review', status: 'Backlog', dueDate: d(20), priority: 'High', order: 4 },
  ]

  const subtasks: Subtask[] = [
    { id: 's1', taskId: 't3', title: 'Mobile wireframes', isCompleted: true },
    { id: 's2', taskId: 't3', title: 'Desktop wireframes', isCompleted: false },
  ]

  const dependencies: Dependency[] = [
    { id: 'dep1', fromTaskId: 't1', toTaskId: 't2' },
    { id: 'dep2', fromTaskId: 't3', toTaskId: 't4' },
  ]

  const auditLogs: AuditLog[] = [
    { id: 'a1', projectId, actionType: 'task_completed', actor: 'User', timestamp: iso(-2), details: 'Research competitors marked done' },
    { id: 'a2', projectId, actionType: 'task_updated', actor: 'AI', timestamp: iso(-1), details: 'Suggested breaking design into phases' },
  ]

  const aiSuggestions: AISuggestion[] = [
    {
      id: 'ai1',
      projectId,
      content: 'Add milestone: QA sign-off before launch',
      explanation: 'Based on similar projects, adding a QA checkpoint reduces post-launch bugs by ~40%.',
      createdAt: iso(0),
    },
  ]

  const project: Project = {
    id: projectId,
    ownerId: 'user-1',
    title: 'Q1 Product Launch',
    description: 'Launch new product features for Q1',
    status: 'Active',
    progress: 65,
    nextMilestone: { id: 'm1', title: 'Design review complete', dueDate: d(7), completed: false },
    templateId: null,
    createdAt: iso(-30),
    updatedAt: iso(0),
  }

  return { project, milestones, tasks, subtasks, dependencies, auditLogs, aiSuggestions }
}

/** Fetch full project detail for planner */
export async function fetchProjectDetail(projectId: string): Promise<ProjectDetail | null> {
  try {
    const res = await apiGet<{ data: ProjectDetail }>(`/projects/${projectId}/detail`)
    const data = res?.data ?? null
    if (data) return data
    return getMockProjectDetail(projectId)
  } catch {
    return getMockProjectDetail(projectId)
  }
}

/** Alias for fetchProjectDetail */
export const getProjectDetail = fetchProjectDetail

/** Create milestone */
export async function createMilestone(projectId: string, data: Partial<MilestoneDetail>): Promise<MilestoneDetail | null> {
  try {
    const res = await apiPost<{ data: MilestoneDetail }>(`/projects/${projectId}/milestones`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Update milestone */
export async function updateMilestone(id: string, data: Partial<MilestoneDetail>): Promise<MilestoneDetail | null> {
  try {
    const res = await apiPatch<{ data: MilestoneDetail }>(`/milestones/${id}`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Create task */
export async function createTask(projectId: string, data: Partial<Task>): Promise<Task | null> {
  try {
    const res = await apiPost<{ data: Task }>(`/projects/${projectId}/tasks`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Update task (including status for Kanban) */
export async function updateTask(id: string, data: Partial<Task>): Promise<Task | null> {
  try {
    const res = await apiPatch<{ data: Task }>(`/tasks/${id}`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Add task dependency */
export async function addTaskDependency(taskId: string, toTaskId: string): Promise<Dependency | null> {
  try {
    const res = await apiPost<{ data: Dependency }>(`/tasks/${taskId}/dependencies`, { toTaskId })
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Fetch audit log */
export async function fetchAuditLog(projectId: string): Promise<AuditLog[]> {
  try {
    const res = await apiGet<{ data: AuditLog[] }>(`/projects/${projectId}/audit-log`)
    const list = Array.isArray(res?.data) ? res.data : (res?.data ?? [])
    return list
  } catch {
    return []
  }
}

/** Fetch AI suggestions */
export async function fetchAISuggestions(projectId: string): Promise<AISuggestion[]> {
  try {
    const res = await apiGet<{ data: AISuggestion[] }>(`/projects/${projectId}/ai-suggestions`)
    const list = Array.isArray(res?.data) ? res.data : (res?.data ?? [])
    return list
  } catch {
    return []
  }
}

/** Apply AI suggestion */
export async function applyAISuggestion(suggestionId: string, projectId: string): Promise<boolean> {
  try {
    await apiPost('/ai-apply', { suggestionId, projectId })
    return true
  } catch {
    return false
  }
}

/** Update subtask */
export async function updateSubtask(id: string, data: Partial<Subtask>): Promise<Subtask | null> {
  try {
    const res = await apiPatch<{ data: Subtask }>(`/subtasks/${id}`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

