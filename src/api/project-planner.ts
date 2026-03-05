/**
 * Project Detail & Planner API
 * All array responses use safe guards (data ?? [], Array.isArray)
 */

import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
} from '@/lib/api'
import type {
  PlannerProject,
  PlannerMilestone,
  PlannerTask,
  PlannerSubtask,
  PlannerDependency,
  PlannerAuditLog,
  PlannerAISuggestion,
  ProjectDetailData,
} from '@/types/project-planner'

/** Mock project detail for development when API is not connected */
function getMockProjectDetail(projectId: string): ProjectDetailData {
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  return {
    project: {
      id: projectId,
      ownerId: 'user-1',
      title: 'Q1 Product Launch',
      description: 'Launch the new product line for Q1',
      status: 'Active',
      progress: 45,
      templateId: undefined,
      createdAt: lastWeek,
      updatedAt: now.toISOString(),
    },
    milestones: [
      { id: 'm1', projectId, title: 'Design review complete', dueDate: nextWeek, order: 1, status: 'Active' },
      { id: 'm2', projectId, title: 'Development phase 1', dueDate: nextMonth, order: 2, status: 'Pending' },
      { id: 'm3', projectId, title: 'QA and launch', dueDate: nextMonth, order: 3, status: 'Pending' },
    ],
    tasks: [
      { id: 't1', projectId, title: 'Research competitors', status: 'Done', dueDate: nextWeek, priority: 'High', order: 1 },
      { id: 't2', projectId, title: 'Draft outline', status: 'Done', dueDate: nextWeek, priority: 'Medium', order: 2 },
      { id: 't3', projectId, title: 'Design mockups', status: 'In Progress', dueDate: nextWeek, priority: 'High', order: 3 },
      { id: 't4', projectId, title: 'Design review meeting', status: 'Backlog', dueDate: nextWeek, priority: 'High', order: 4 },
      { id: 't5', projectId, title: 'Implement feedback', status: 'Backlog', dueDate: nextMonth, priority: 'Medium', order: 5 },
    ],
    subtasks: [
      { id: 's1', taskId: 't3', title: 'Create wireframes', isCompleted: true },
      { id: 's2', taskId: 't3', title: 'High-fidelity mockups', isCompleted: false },
    ],
    dependencies: [
      { id: 'd1', fromTaskId: 't3', toTaskId: 't4' },
    ],
    auditLogs: [
      { id: 'a1', projectId, actionType: 'task_status_change', actor: 'user', timestamp: lastWeek, details: 'Task t1 moved to Done' },
      { id: 'a2', projectId, actionType: 'milestone_created', actor: 'ai', timestamp: lastWeek, details: 'AI suggested milestone: Design review complete' },
    ],
    aiSuggestions: [
      {
        id: 'ai1',
        projectId,
        content: 'Schedule design review meeting this week to unblock development.',
        explanation: 'Design mockups are in progress. A review meeting will align stakeholders and allow the team to proceed with implementation.',
        createdAt: lastWeek,
      },
    ],
  }
}

/** Fetch full project detail (project, milestones, tasks, subtasks, dependencies, audit logs, AI suggestions) */
export async function fetchProjectDetail(projectId: string): Promise<ProjectDetailData> {
  try {
    const res = await apiGet<ProjectDetailData>(`/projects/${projectId}/detail`)
    const data = res ?? {}
    return {
      project: data.project ?? null,
      milestones: Array.isArray(data.milestones) ? data.milestones : [],
      tasks: Array.isArray(data.tasks) ? data.tasks : [],
      subtasks: Array.isArray(data.subtasks) ? data.subtasks : [],
      dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
      auditLogs: Array.isArray(data.auditLogs) ? data.auditLogs : [],
      aiSuggestions: Array.isArray(data.aiSuggestions) ? data.aiSuggestions : [],
    }
  } catch {
    return getMockProjectDetail(projectId)
  }
}

/** Update project */
export async function updatePlannerProject(
  projectId: string,
  data: Partial<PlannerProject>
): Promise<PlannerProject | null> {
  try {
    const res = await apiPut<{ data: PlannerProject }>(`/projects/${projectId}`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Create milestone */
export async function createMilestone(
  projectId: string,
  data: Partial<PlannerMilestone>
): Promise<PlannerMilestone | null> {
  try {
    const res = await apiPost<{ data: PlannerMilestone }>(`/projects/${projectId}/milestones`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Update milestone */
export async function updateMilestone(
  id: string,
  data: Partial<PlannerMilestone>
): Promise<PlannerMilestone | null> {
  try {
    const res = await apiPatch<{ data: PlannerMilestone }>(`/milestones/${id}`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Create task */
export async function createTask(
  projectId: string,
  data: Partial<PlannerTask>
): Promise<PlannerTask | null> {
  try {
    const res = await apiPost<{ data: PlannerTask }>(`/projects/${projectId}/tasks`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Update task (including status for Kanban) */
export async function updateTask(
  id: string,
  data: Partial<PlannerTask>
): Promise<PlannerTask | null> {
  try {
    const res = await apiPatch<{ data: PlannerTask }>(`/tasks/${id}`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Add task dependency */
export async function addTaskDependency(
  taskId: string,
  toTaskId: string
): Promise<PlannerDependency | null> {
  try {
    const res = await apiPost<{ data: PlannerDependency }>(`/tasks/${taskId}/dependencies`, { toTaskId })
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Fetch AI suggestions for project */
export async function fetchAISuggestions(projectId: string): Promise<PlannerAISuggestion[]> {
  try {
    const res = await apiGet<{ data: PlannerAISuggestion[] }>(`/projects/${projectId}/ai-suggestions`)
    const list = Array.isArray(res?.data) ? res.data : (res?.data ?? [])
    if (list.length > 0) return list
    const mock = getMockProjectDetail(projectId)
    return mock.aiSuggestions ?? []
  } catch {
    const mock = getMockProjectDetail(projectId)
    return mock.aiSuggestions ?? []
  }
}

/** Apply AI suggestion to project */
export async function applyAISuggestion(
  suggestionId: string,
  projectId: string
): Promise<boolean> {
  try {
    await apiPost('/ai-apply', { suggestionId, projectId })
    return true
  } catch {
    return false
  }
}

/** Fetch audit log */
export async function fetchAuditLog(projectId: string): Promise<PlannerAuditLog[]> {
  try {
    const res = await apiGet<{ data: PlannerAuditLog[] }>(`/projects/${projectId}/audit-log`)
    return Array.isArray(res?.data) ? res.data : (res?.data ?? [])
  } catch {
    const mock = getMockProjectDetail(projectId)
    return mock.auditLogs ?? []
  }
}

/** Update subtask */
export async function updateSubtask(
  id: string,
  data: Partial<PlannerSubtask>
): Promise<PlannerSubtask | null> {
  try {
    const res = await apiPatch<{ data: PlannerSubtask }>(`/subtasks/${id}`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}
