/**
 * Dashboard API - LifeOps Personal
 * Mock data with API stubs; guards against null/undefined
 */

import type {
  DashboardSummary,
  AIExplainResponse,
  SearchResponse,
  Project,
  ContentDraft,
  FinanceRecord,
  HealthMetric,
  AIActionAudit,
} from '@/types/dashboard'
import { apiGet, apiPost } from '@/lib/api'

/** Response shape guards */
function asProjects(data: unknown): Project[] {
  return Array.isArray(data) ? (data as Project[]) : []
}

function asContentDrafts(data: unknown): ContentDraft[] {
  return Array.isArray(data) ? (data as ContentDraft[]) : []
}

function asFinance(data: unknown): FinanceRecord[] {
  return Array.isArray(data) ? (data as FinanceRecord[]) : []
}

function asHealth(data: unknown): HealthMetric[] {
  return Array.isArray(data) ? (data as HealthMetric[]) : []
}

function asAIAudits(data: unknown): AIActionAudit[] {
  return Array.isArray(data) ? (data as AIActionAudit[]) : []
}

function asSearchResults(data: unknown): SearchResponse['results'] {
  return Array.isArray(data) ? (data as SearchResponse['results']) : []
}

/** GET /api/dashboard/summary */
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  try {
    const res = await apiGet<DashboardSummary | { data?: DashboardSummary }>(
      '/dashboard/summary'
    )
    if (res && typeof res === 'object' && 'projects' in res) {
      const d = res as DashboardSummary
      return {
        projects: asProjects(d.projects),
        contentDrafts: asContentDrafts(d.contentDrafts),
        finance: asFinance(d.finance),
        health: asHealth(d.health),
        aiAudits: asAIAudits(d.aiAudits),
      }
    }
    const data = (res as { data?: DashboardSummary })?.data
    if (data) {
      return {
        projects: asProjects(data.projects),
        contentDrafts: asContentDrafts(data.contentDrafts),
        finance: asFinance(data.finance),
        health: asHealth(data.health),
        aiAudits: asAIAudits(data.aiAudits),
      }
    }
  } catch {
    // Fall through to mock
  }
  return getMockDashboardSummary()
}

/** GET /api/dashboard/ai-explain/:actionId */
export async function fetchAIExplain(
  actionId: string
): Promise<AIExplainResponse | null> {
  if (!actionId?.trim()) return null
  try {
    const res = await apiGet<AIExplainResponse>(
      `/dashboard/ai-explain/${encodeURIComponent(actionId)}`
    )
    if (res && typeof res === 'object' && 'actionId' in res) {
      return res as AIExplainResponse
    }
  } catch {
    // Fall through
  }
  return getMockAIExplain(actionId)
}

/** POST /api/dashboard/ai-action/undo */
export async function undoAIAction(
  actionId: string
): Promise<{ success: boolean; actionId: string }> {
  if (!actionId?.trim()) {
    return { success: false, actionId: '' }
  }
  try {
    const res = await apiPost<{ success: boolean; actionId: string }>(
      '/dashboard/ai-action/undo',
      { actionId }
    )
    if (res && typeof res === 'object' && 'success' in res) {
      return res as { success: boolean; actionId: string }
    }
  } catch {
    // Fall through
  }
  return { success: true, actionId }
}

/** GET /api/dashboard/search?q=... */
export async function searchDashboard(
  query: string
): Promise<SearchResponse['results']> {
  if (!query?.trim()) return []
  try {
    const res = await apiGet<SearchResponse | { results?: SearchResponse['results'] }>(
      `/dashboard/search?q=${encodeURIComponent(query.trim())}`
    )
    if (res && typeof res === 'object' && 'results' in res) {
      return asSearchResults((res as SearchResponse).results)
    }
    const data = (res as { results?: SearchResponse['results'] })?.results
    return data ? asSearchResults(data) : getMockSearchResults(query)
  } catch {
    return getMockSearchResults(query)
  }
}

/** Mock data */
function getMockDashboardSummary(): DashboardSummary {
  const now = new Date()
  const projects: Project[] = [
    {
      id: 'p1',
      title: 'Q1 Launch',
      status: 'in-progress',
      progress: 65,
      dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: ['Design review', 'Dev sprint'],
    },
    {
      id: 'p2',
      title: 'Content Strategy',
      status: 'planning',
      progress: 20,
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
    {
      id: 'p3',
      title: 'API Migration',
      status: 'done',
      progress: 100,
      dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  ]

  const contentDrafts: ContentDraft[] = [
    {
      id: 'c1',
      title: 'Blog: LifeOps Intro',
      status: 'scheduled',
      scheduleDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      preview: 'Introducing LifeOps...',
    },
    {
      id: 'c2',
      title: 'Social: Product Launch',
      status: 'draft',
      preview: 'Excited to announce...',
    },
    {
      id: 'c3',
      title: 'Newsletter March',
      status: 'published',
      scheduleDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
  ]

  const finance: FinanceRecord[] = [
    {
      id: 'f1',
      month: 'Mar',
      netCashflow: 1240,
      forecast: 1100,
      expenses: 2860,
    },
    {
      id: 'f2',
      month: 'Feb',
      netCashflow: 980,
      forecast: 950,
      expenses: 3020,
    },
    {
      id: 'f3',
      month: 'Jan',
      netCashflow: 1150,
      forecast: 1200,
      expenses: 2850,
    },
  ]

  const health: HealthMetric[] = [
    {
      id: 'h1',
      metricName: 'Steps',
      value: 8420,
      unit: 'steps',
      timestamp: now.toISOString(),
    },
    {
      id: 'h2',
      metricName: 'Sleep',
      value: 7.2,
      unit: 'hours',
      timestamp: now.toISOString(),
    },
    {
      id: 'h3',
      metricName: 'Workouts',
      value: 5,
      unit: 'this week',
      timestamp: now.toISOString(),
    },
  ]

  const aiAudits: AIActionAudit[] = [
    {
      id: 'ai1',
      actionType: 'Suggested calendar block for project review',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      actor: 'scheduler-agent',
      rationale: 'Based on your project deadlines and availability',
      sources: ['projects/p1', 'calendar/slots'],
      confidence: 92,
    },
    {
      id: 'ai2',
      actionType: 'Flagged transaction for review',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      actor: 'finance-agent',
      rationale: 'Unusual amount for this merchant category',
      sources: ['finance/f1', 'merchant-history'],
      confidence: 88,
    },
    {
      id: 'ai3',
      actionType: 'Recommended content schedule',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      actor: 'content-agent',
      rationale: 'Optimal engagement based on audience analytics',
      sources: ['content/c1', 'analytics/engagement'],
      confidence: 85,
    },
  ]

  return {
    projects,
    contentDrafts,
    finance,
    health,
    aiAudits,
  }
}

function getMockAIExplain(actionId: string): AIExplainResponse | null {
  const audits = getMockDashboardSummary().aiAudits
  const audit = (audits ?? []).find((a) => a?.id === actionId)
  if (!audit) return null
  return {
    actionId: audit.id,
    explanation: audit.rationale,
    sources: audit.sources ?? [],
    rationale: audit.rationale,
    confidence: audit.confidence,
  }
}

function getMockSearchResults(query: string): SearchResponse['results'] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const summary = getMockDashboardSummary()
  const results: SearchResponse['results'] = []

  ;(summary.projects ?? []).forEach((p) => {
    if (p?.title?.toLowerCase().includes(q)) {
      results.push({ type: 'project', item: p })
    }
  })
  ;(summary.contentDrafts ?? []).forEach((c) => {
    if (c?.title?.toLowerCase().includes(q) || c?.preview?.toLowerCase().includes(q)) {
      results.push({ type: 'content', item: c })
    }
  })
  ;(summary.finance ?? []).forEach((f) => {
    if (f?.month?.toLowerCase().includes(q)) {
      results.push({ type: 'finance', item: f })
    }
  })
  ;(summary.health ?? []).forEach((h) => {
    if (h?.metricName?.toLowerCase().includes(q) || h?.unit?.toLowerCase().includes(q)) {
      results.push({ type: 'health', item: h })
    }
  })

  return results.slice(0, 10)
}
