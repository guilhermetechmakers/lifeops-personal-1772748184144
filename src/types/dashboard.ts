/**
 * Dashboard data models for LifeOps Personal
 * All types align with API contract and support runtime safety
 */

export type ProjectStatus = 'planning' | 'in-progress' | 'done'
export type ContentStatus = 'draft' | 'scheduled' | 'published'

export interface Project {
  id: string
  title: string
  status: ProjectStatus
  progress: number
  dueDate?: string
  notes?: string[]
}

export interface ContentDraft {
  id: string
  title: string
  status: ContentStatus
  scheduleDate?: string
  preview?: string
}

export interface FinanceRecord {
  id: string
  month: string
  netCashflow: number
  forecast: number
  expenses: number
}

export interface HealthMetric {
  id: string
  metricName: string
  value: number
  unit: string
  timestamp: string
}

export interface AIActionAudit {
  id: string
  actionType: string
  timestamp: string
  actor: string
  rationale: string
  sources: string[]
  confidence: number
}

export interface DashboardSummary {
  projects: Project[]
  contentDrafts: ContentDraft[]
  finance: FinanceRecord[]
  health: HealthMetric[]
  aiAudits: AIActionAudit[]
}

export interface AIExplainResponse {
  actionId: string
  explanation: string
  sources: string[]
  rationale: string
  confidence: number
}

export interface SearchResult {
  type: 'project' | 'content' | 'finance' | 'health'
  item: Project | ContentDraft | FinanceRecord | HealthMetric
}

export interface SearchResponse {
  results: SearchResult[]
}

export type ActivityType =
  | 'agent_action'
  | 'content_published'
  | 'transaction_flagged'
  | 'workout_completed'

export interface ActivityItem {
  id: string
  type: ActivityType
  text: string
  timestamp: string
  actionId?: string
  href?: string
}
