/**
 * Create / Edit Project data models
 * Aligns with API contract and supports runtime safety
 */

export type ProjectPriority = 'Low' | 'Medium' | 'High'
export type ProjectStatus = 'Draft' | 'Published'
export type TaskStatus = 'Todo' | 'InProgress' | 'Done'

export interface CreateEditProject {
  id: string
  title: string
  description?: string
  tags: string[]
  priority: ProjectPriority
  startDate?: string
  endDate?: string
  templateId?: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}

export interface CreateEditMilestone {
  id: string
  projectId: string
  title: string
  dueDate?: string
  dependencies: string[]
  order: number
}

export interface CreateEditTask {
  id: string
  milestoneId: string
  title: string
  status: TaskStatus
  dueDate?: string
  dependencies: string[]
  assignee?: string
  order: number
}

export interface Collaborator {
  id: string
  projectId: string
  email: string
  role: string
  invitedAt: string
  acceptedAt?: string
}

/** Pending collaborator for create form (no projectId yet) */
export interface PendingCollaborator {
  id: string
  email: string
  role: string
  status?: 'pending' | 'accepted'
}

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  previewUrl?: string
  defaultMetadata?: Partial<CreateEditProject>
  defaultMilestones?: Omit<CreateEditMilestone, 'id' | 'projectId'>[]
  defaultTasks?: Omit<CreateEditTask, 'id' | 'milestoneId'>[]
}

export interface AIScopeResult {
  milestones: CreateEditMilestone[]
  tasks: CreateEditTask[]
}
