/**
 * Projects Dashboard data models for LifeOps Personal
 * Aligns with API contract and supports runtime safety
 */

export type ProjectStatus = 'Active' | 'Paused' | 'Completed' | 'Archived'
export type ProjectPriority = 'Low' | 'Medium' | 'High'

export interface Milestone {
  id: string
  title: string
  dueDate?: string
  completed?: boolean
}

export interface Project {
  id: string
  title: string
  status: ProjectStatus
  progress: number
  nextMilestone?: Milestone | null
  assignedTasksCount?: number
  dueDate?: string | null
  priority?: ProjectPriority | null
  tags?: string[] | null
  aiRecommendation?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface ProjectFilters {
  status: ProjectStatus | 'All'
  tags: string[]
  dueDatePreset: 'all' | 'overdue' | 'this_week' | 'this_month'
  priority: ProjectPriority | 'All'
}

export const DEFAULT_PROJECT_FILTERS: ProjectFilters = {
  status: 'All',
  tags: [],
  dueDatePreset: 'all',
  priority: 'All',
}
