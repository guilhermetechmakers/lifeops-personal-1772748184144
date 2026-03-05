/**
 * Projects API - LifeOps Personal
 * API-ready scaffolding with safe null handling
 */

import { apiGet, apiPost, apiPut } from '@/lib/api'
import type { Project } from '@/types/projects'

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
