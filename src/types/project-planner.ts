/**
 * Project Detail & Planner data models
 * Aligns with API contract and supports runtime safety
 */

export type PlannerProjectStatus =
  | 'Planning'
  | 'Active'
  | 'On Hold'
  | 'Completed'
  | 'Cancelled'

export type MilestoneStatus = 'Pending' | 'Active' | 'Complete'

export type TaskStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done'

export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface PlannerProject {
  id: string
  ownerId: string
  title: string
  description?: string
  status: PlannerProjectStatus
  progress: number
  templateId?: string
  createdAt: string
  updatedAt: string
}

export interface PlannerMilestone {
  id: string
  projectId: string
  title: string
  dueDate: string
  order: number
  status: MilestoneStatus
}

export interface PlannerTask {
  id: string
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: string
  assigneeId?: string
  priority?: TaskPriority
  order?: number
}

export interface PlannerSubtask {
  id: string
  taskId: string
  title: string
  isCompleted: boolean
}

export interface PlannerDependency {
  id: string
  fromTaskId: string
  toTaskId: string
}

export interface PlannerAuditLog {
  id: string
  projectId: string
  actionType: string
  actor: string
  timestamp: string
  details?: string
}

export interface PlannerAISuggestion {
  id: string
  projectId: string
  content: string
  explanation: string
  createdAt: string
}

export interface ProjectDetailData {
  project: PlannerProject | null
  milestones: PlannerMilestone[]
  tasks: PlannerTask[]
  subtasks: PlannerSubtask[]
  dependencies: PlannerDependency[]
  auditLogs: PlannerAuditLog[]
  aiSuggestions: PlannerAISuggestion[]
}

export type KanbanColumnId = 'Backlog' | 'In Progress' | 'Review' | 'Done'
