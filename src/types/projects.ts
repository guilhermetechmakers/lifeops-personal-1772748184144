/**
 * Projects Dashboard data models for LifeOps Personal
 * Aligns with API contract and supports runtime safety
 */

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled' | 'Paused' | 'Archived'
export type ProjectPriority = 'Low' | 'Medium' | 'High'
export type MilestoneStatus = 'Pending' | 'Active' | 'Complete'
export type TaskStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done'

/** Dashboard list milestone summary */
export interface Milestone {
  id: string
  title: string
  dueDate?: string
  completed?: boolean
}

/** Full milestone for Project Detail & Planner */
export interface MilestoneDetail {
  id: string
  projectId: string
  title: string
  dueDate: string
  order: number
  status: MilestoneStatus
}

export interface Project {
  id: string
  ownerId?: string
  title: string
  description?: string | null
  status: ProjectStatus
  progress: number
  nextMilestone?: Milestone | null
  assignedTasksCount?: number
  dueDate?: string | null
  priority?: ProjectPriority | null
  tags?: string[] | null
  aiRecommendation?: string | null
  templateId?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string | null
  status: TaskStatus
  dueDate?: string | null
  assigneeId?: string | null
  priority?: ProjectPriority | null
  order?: number
}

export interface Subtask {
  id: string
  taskId: string
  title: string
  isCompleted: boolean
}

export interface Dependency {
  id: string
  fromTaskId: string
  toTaskId: string
}

export interface AuditLog {
  id: string
  projectId: string
  actionType: string
  actor: string
  timestamp: string
  details?: string | null
}

export interface AISuggestion {
  id: string
  projectId: string
  content: string
  explanation: string
  createdAt: string
}

export interface ProjectDetail {
  project: Project
  milestones: MilestoneDetail[]
  tasks: Task[]
  subtasks: Subtask[]
  dependencies: Dependency[]
  auditLogs: AuditLog[]
  aiSuggestions: AISuggestion[]
}

export type NextMilestoneFilter = 'all' | 'has_milestone' | 'due_this_week' | 'overdue'

export interface ProjectFilters {
  status: ProjectStatus | 'All'
  tags: string[]
  dueDatePreset: 'all' | 'overdue' | 'this_week' | 'this_month'
  priority: ProjectPriority | 'All'
  aiRecommendationsOnly?: boolean
  nextMilestone?: NextMilestoneFilter
}

export type CalendarViewMode = 'month' | 'week' | 'day'

export const DEFAULT_PROJECT_FILTERS: ProjectFilters = {
  status: 'All',
  tags: [],
  dueDatePreset: 'all',
  priority: 'All',
  aiRecommendationsOnly: false,
  nextMilestone: 'all',
}
