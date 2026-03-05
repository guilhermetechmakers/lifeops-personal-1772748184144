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
    return null
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
    return null
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

/** POST /ai/scope/generate -> { milestones, tasks } */
export async function generateAIScope(
  goals: string,
  constraints: string
): Promise<AIScopeResult> {
  try {
    const res = await apiPost<{ data?: AIScopeResult }>('/ai/scope/generate', {
      goals,
      constraints,
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
    return { milestones: [], tasks: [] }
  }
}
