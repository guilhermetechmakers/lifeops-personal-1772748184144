/**
 * Create / Edit Project API - Contract stubs for future integration
 * GET /templates, POST /projects, PUT /projects/:id, POST /projects/:id/invite, POST /ai/scope/generate
 */

import { apiGet, apiPost, apiPut } from '@/lib/api'
import type {
  CreateEditProject,
  CreateEditMilestone,
  CreateEditTask,
  Collaborator,
  ProjectTemplate,
  AIScopeResult,
} from '@/types/create-edit-project'
import { PROJECT_TEMPLATES } from '@/data/templates'

function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** GET /templates -> Template[] */
export async function fetchTemplates(): Promise<ProjectTemplate[]> {
  try {
    const res = await apiGet<{ data?: ProjectTemplate[] }>('/templates')
    const list = Array.isArray(res?.data) ? res.data : (res?.data ?? [])
    if (list.length > 0) return list
    return PROJECT_TEMPLATES
  } catch {
    return PROJECT_TEMPLATES
  }
}

/** POST /projects -> Project & initial Milestones/Tasks */
export async function createProjectWithScope(data: {
  project: Partial<CreateEditProject>
  milestones?: CreateEditMilestone[]
  tasks?: CreateEditTask[]
}): Promise<{ project: CreateEditProject; milestones: CreateEditMilestone[]; tasks: CreateEditTask[] } | null> {
  try {
    const res = await apiPost<{
      data?: { project: CreateEditProject; milestones: CreateEditMilestone[]; tasks: CreateEditTask[] }
    }>('/projects', data)
    const d = res?.data ?? null
    if (d) {
      return {
        project: d.project,
        milestones: Array.isArray(d.milestones) ? d.milestones : [],
        tasks: Array.isArray(d.tasks) ? d.tasks : [],
      }
    }
    return null
  } catch {
    const now = new Date().toISOString()
    const projectId = generateId()
    const p = data.project ?? {}
    const ms = (data.milestones ?? []).map((m, i) => ({
      ...m,
      id: m.id ?? generateId(),
      projectId: m.projectId || projectId,
      order: i,
    }))
    const ts = (data.tasks ?? []).map((t, i) => ({
      ...t,
      id: t.id ?? generateId(),
      milestoneId: t.milestoneId || (ms[0]?.id ?? 'm0'),
      order: i,
    }))
    return {
      project: {
        id: projectId,
        title: p.title ?? 'Untitled',
        description: p.description,
        tags: p.tags ?? [],
        priority: p.priority ?? 'Medium',
        startDate: p.startDate,
        endDate: p.endDate,
        templateId: p.templateId,
        status: p.status ?? 'Draft',
        createdAt: p.createdAt ?? now,
        updatedAt: now,
      } as CreateEditProject,
      milestones: ms,
      tasks: ts,
    }
  }
}

/** PUT /projects/:id -> Project + updated Milestones/Tasks */
export async function updateProjectWithScope(
  id: string,
  data: {
    project: Partial<CreateEditProject>
    milestones?: CreateEditMilestone[]
    tasks?: CreateEditTask[]
  }
): Promise<{ project: CreateEditProject; milestones: CreateEditMilestone[]; tasks: CreateEditTask[] } | null> {
  try {
    const res = await apiPut<{
      data?: { project: CreateEditProject; milestones: CreateEditMilestone[]; tasks: CreateEditTask[] }
    }>(`/projects/${id}`, data)
    const d = res?.data ?? null
    if (d) {
      return {
        project: d.project,
        milestones: Array.isArray(d.milestones) ? d.milestones : [],
        tasks: Array.isArray(d.tasks) ? d.tasks : [],
      }
    }
    return null
  } catch {
    const now = new Date().toISOString()
    const p = data.project ?? {}
    const ms = (data.milestones ?? []).map((m, i) => ({
      ...m,
      id: m.id ?? generateId(),
      projectId: m.projectId || id,
      order: i,
    }))
    const ts = (data.tasks ?? []).map((t, i) => ({
      ...t,
      id: t.id ?? generateId(),
      milestoneId: t.milestoneId || (ms[0]?.id ?? 'm0'),
      order: i,
    }))
    return {
      project: {
        id,
        title: p.title ?? 'Untitled',
        description: p.description,
        tags: p.tags ?? [],
        priority: p.priority ?? 'Medium',
        startDate: p.startDate,
        endDate: p.endDate,
        templateId: p.templateId,
        status: p.status ?? 'Draft',
        createdAt: p.createdAt ?? now,
        updatedAt: now,
      } as CreateEditProject,
      milestones: ms,
      tasks: ts,
    }
  }
}

/** POST /projects/:id/invite -> Collaboration */
export async function inviteCollaborator(
  projectId: string,
  email: string,
  role: string
): Promise<Collaborator | null> {
  try {
    const res = await apiPost<{ data?: Collaborator }>(`/projects/${projectId}/invite`, {
      email,
      role,
    })
    return res?.data ?? null
  } catch {
    return null
  }
}

/** Stub AI scope - returns sample milestones/tasks when API unavailable */
function getStubAIScope(_goals: string): AIScopeResult {
  const base = Date.now()
  const d = (days: number) =>
    new Date(base + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const m1 = generateId()
  const m2 = generateId()
  return {
    milestones: [
      { id: m1, projectId: '', title: 'Define scope & requirements', dueDate: d(7), dependencies: [], order: 0 },
      { id: m2, projectId: '', title: 'Design & planning', dueDate: d(14), dependencies: [m1], order: 1 },
      { id: generateId(), projectId: '', title: 'Execution & delivery', dueDate: d(30), dependencies: [m2], order: 2 },
    ],
    tasks: [
      { id: generateId(), milestoneId: m1, title: 'Gather requirements', status: 'Todo', dependencies: [], order: 0 },
      { id: generateId(), milestoneId: m1, title: 'Create project brief', status: 'Todo', dependencies: [], order: 1 },
      { id: generateId(), milestoneId: m2, title: 'Draft initial plan', status: 'Todo', dependencies: [], order: 2 },
      { id: generateId(), milestoneId: m2, title: 'Review and approve', status: 'Todo', dependencies: [], order: 3 },
    ],
  }
}

/** POST /ai/scope/generate -> { milestones, tasks } */
export async function generateAIScope(
  goals: string,
  _constraints: string
): Promise<AIScopeResult> {
  try {
    const res = await apiPost<{ data?: AIScopeResult }>('/ai/scope/generate', {
      goals,
      constraints: _constraints,
    })
    const d = res?.data ?? null
    if (d) {
      return {
        milestones: Array.isArray(d.milestones) ? d.milestones : [],
        tasks: Array.isArray(d.tasks) ? d.tasks : [],
      }
    }
    return { milestones: [], tasks: [] }
  } catch {
    await new Promise((r) => setTimeout(r, 800))
    return getStubAIScope(goals)
  }
}
