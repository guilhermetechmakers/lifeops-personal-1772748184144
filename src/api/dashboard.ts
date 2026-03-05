/**
 * Dashboard API - LifeOps Personal
 * Mock data with runtime safety guards for development
 */

import { apiGet, apiPost } from '@/lib/api'
import type {
  DashboardSummary,
  AIExplainResponse,
  SearchResults,
  Project,
  ContentDraft,
  Finance,
  Health,
  AIActionAudit,
} from '@/types/dashboard'

/** Response shape guards */
function asArray<T>(data: unknown, guard: (x: unknown) => T): T[] {
  return Array.isArray(data) ? data.map(guard) : []
}

function asProject(x: unknown): Project {
  if (x && typeof x === 'object' && 'id' in x && 'title' in x) {
    const o = x as Record<string, unknown>
    return {
      id: String(o.id ?? ''),
      title: String(o.title ?? ''),
      status: (['planning', 'in-progress', 'done'].includes(String(o.status)) ? o.status : 'planning') as Project['status'],
      progress: typeof o.progress === 'number' ? o.progress : 0,
      dueDate: o.dueDate != null ? String(o.dueDate) : undefined,
      notes: Array.isArray(o.notes) ? o.notes.map(String) : undefined,
    }
  }
  return { id: '', title: '', status: 'planning', progress: 0 }
}

function asContentDraft(x: unknown): ContentDraft {
  if (x && typeof x === 'object' && 'id' in x && 'title' in x) {
    const o = x as Record<string, unknown>
    return {
      id: String(o.id ?? ''),
      title: String(o.title ?? ''),
      status: (['draft', 'scheduled', 'published'].includes(String(o.status)) ? o.status : 'draft') as ContentDraft['status'],
      scheduleDate: o.scheduleDate != null ? String(o.scheduleDate) : undefined,
      preview: o.preview != null ? String(o.preview) : undefined,
    }
  }
  return { id: '', title: '', status: 'draft' }
}

function asFinance(x: unknown): Finance {
  if (x && typeof x === 'object' && 'id' in x) {
    const o = x as Record<string, unknown>
    return {
      id: String(o.id ?? ''),
      month: String(o.month ?? ''),
      netCashflow: typeof o.netCashflow === 'number' ? o.netCashflow : 0,
      forecast: typeof o.forecast === 'number' ? o.forecast : 0,
      expenses: typeof o.expenses === 'number' ? o.expenses : 0,
    }
  }
  return { id: '', month: '', netCashflow: 0, forecast: 0, expenses: 0 }
}

function asHealth(x: unknown): Health {
  if (x && typeof x === 'object' && 'id' in x) {
    const o = x as Record<string, unknown>
    return {
      id: String(o.id ?? ''),
      metricName: String(o.metricName ?? ''),
      value: typeof o.value === 'number' ? o.value : 0,
      unit: String(o.unit ?? ''),
      timestamp: String(o.timestamp ?? ''),
    }
  }
  return { id: '', metricName: '', value: 0, unit: '', timestamp: '' }
}

function asAIAudit(x: unknown): AIActionAudit {
  if (x && typeof x === 'object' && 'id' in x) {
    const o = x as Record<string, unknown>
    return {
      id: String(o.id ?? ''),
      actionType: String(o.actionType ?? ''),
      timestamp: String(o.timestamp ?? ''),
      actor: String(o.actor ?? ''),
      rationale: String(o.rationale ?? ''),
      sources: Array.isArray(o.sources) ? o.sources.map(String) : [],
      confidence: typeof o.confidence === 'number' ? o.confidence : 0,
    }
  }
  return { id: '', actionType: '', timestamp: '', actor: '', rationale: '', sources: [], confidence: 0 }
}

/** GET /api/dashboard/summary */
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  try {
    const res = await apiGet<DashboardSummary | { data?: DashboardSummary }>('/dashboard/summary')
    if (res && typeof res === 'object' && 'projects' in res) {
      const raw = res as Record<string, unknown>
      return {
        projects: asArray(raw.projects, asProject),
        contentDrafts: asArray(raw.contentDrafts, asContentDraft),
        finance: asArray(raw.finance, asFinance),
        health: asArray(raw.health, asHealth),
        aiAudits: asArray(raw.aiAudits, asAIAudit),
      }
    }
    const data = (res as { data?: DashboardSummary })?.data
    if (data) {
      return {
        projects: asArray(data.projects, asProject),
        contentDrafts: asArray(data.contentDrafts, asContentDraft),
        finance: asArray(data.finance, asFinance),
        health: asArray(data.health, asHealth),
        aiAudits: asArray(data.aiAudits, asAIAudit),
      }
    }
  } catch {
    // Fall through to mock
  }
  return getMockDashboardSummary()
}

/** GET /api/dashboard/ai-explain/:actionId */
export async function fetchAIExplain(actionId: string): Promise<AIExplainResponse | null> {
  if (!actionId?.trim()) return null
  try {
    const res = await apiGet<AIExplainResponse | { data?: AIExplainResponse }>(
      `/dashboard/ai-explain/${encodeURIComponent(actionId)}`
    )
    if (res && typeof res === 'object' && 'actionId' in res) {
      return res as AIExplainResponse
    }
    const data = (res as { data?: AIExplainResponse })?.data ?? null
    return data ?? getMockAIExplain(actionId)
  } catch {
    return getMockAIExplain(actionId)
  }
}

/** POST /api/dashboard/ai-action/undo */
export async function undoAIAction(actionId: string): Promise<{ success: boolean; actionId: string }> {
  if (!actionId?.trim()) return { success: false, actionId: '' }
  try {
    const res = await apiPost<{ success?: boolean; actionId?: string }>('/dashboard/ai-action/undo', { actionId })
    return {
      success: (res as { success?: boolean })?.success ?? false,
      actionId: (res as { actionId?: string })?.actionId ?? actionId,
    }
  } catch {
    return { success: false, actionId }
  }
}

/** GET /api/dashboard/search?q=... */
export async function searchDashboard(q: string): Promise<SearchResults> {
  const query = (q ?? '').trim()
  if (!query) return { results: [] }
  try {
    const res = await apiGet<SearchResults | { data?: SearchResults }>(
      `/dashboard/search?q=${encodeURIComponent(query)}`
    )
    if (res && typeof res === 'object' && 'results' in res) {
      const raw = res as { results: unknown[] }
      const results = Array.isArray(raw.results) ? raw.results : []
      return {
        results: results
          .filter((r) => r && typeof r === 'object' && 'type' in r && 'item' in r)
          .map((r) => ({
            type: (r as { type: string }).type as SearchResults['results'][0]['type'],
            item: r as SearchResults['results'][0]['item'],
          })),
      }
    }
    const data = (res as { data?: SearchResults })?.data
    return data ?? getMockSearch(query)
  } catch {
    return getMockSearch(query)
  }
}

/** Mock data */
function getMockDashboardSummary(): DashboardSummary {
  const now = new Date()
  const projects: Project[] = [
    { id: 'p1', title: 'Q1 Launch', status: 'in-progress', progress: 65, dueDate: '2025-03-15', notes: [] },
    { id: 'p2', title: 'Content Strategy', status: 'planning', progress: 20, dueDate: '2025-04-01' },
    { id: 'p3', title: 'Website Redesign', status: 'done', progress: 100, dueDate: '2025-02-28' },
  ]
  const contentDrafts: ContentDraft[] = [
    { id: 'c1', title: 'Blog Post: Life Hacks', status: 'scheduled', scheduleDate: '2025-03-06', preview: '10 tips...' },
    { id: 'c2', title: 'Social Campaign', status: 'draft' },
    { id: 'c3', title: 'Newsletter March', status: 'published', scheduleDate: '2025-03-01' },
  ]
  const finance: Finance[] = [
    { id: 'f1', month: '2025-03', netCashflow: 2450, forecast: 2200, expenses: 1850 },
    { id: 'f2', month: '2025-02', netCashflow: 2100, forecast: 2000, expenses: 1920 },
  ]
  const health: Health[] = [
    { id: 'h1', metricName: 'Steps', value: 8420, unit: 'steps', timestamp: now.toISOString() },
    { id: 'h2', metricName: 'Sleep', value: 7.2, unit: 'hours', timestamp: now.toISOString() },
    { id: 'h3', metricName: 'Workouts', value: 5, unit: 'this week', timestamp: now.toISOString() },
  ]
  const aiAudits: AIActionAudit[] = [
    {
      id: 'a1',
      actionType: 'calendar_block_suggested',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      actor: 'Planning Agent',
      rationale: 'Based on your project deadlines and availability',
      sources: ['project/Q1 Launch', 'calendar/availability'],
      confidence: 92,
    },
    {
      id: 'a2',
      actionType: 'transaction_flagged',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      actor: 'Finance Agent',
      rationale: 'Unusual amount for this merchant category',
      sources: ['transaction/coffee_shop_120', 'budget/category'],
      confidence: 88,
    },
    {
      id: 'a3',
      actionType: 'content_scheduled',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      actor: 'Content Agent',
      rationale: 'Optimal engagement window based on audience analytics',
      sources: ['content/Blog Post', 'analytics/engagement'],
      confidence: 85,
    },
  ]
  return { projects, contentDrafts, finance, health, aiAudits }
}

function getMockAIExplain(actionId: string): AIExplainResponse | null {
  const audits = getMockDashboardSummary().aiAudits
  const audit = (audits ?? []).find((a) => a.id === actionId)
  if (!audit) return null
  return {
    actionId: audit.id,
    explanation: audit.rationale,
    sources: audit.sources ?? [],
    rationale: audit.rationale,
    confidence: audit.confidence,
  }
}

function getMockSearch(q: string): SearchResults {
  const summary = getMockDashboardSummary()
  const lower = q.toLowerCase()
  const results: SearchResults['results'] = []
  ;(summary.projects ?? []).forEach((p) => {
    if (p.title?.toLowerCase().includes(lower)) {
      results.push({ type: 'project', item: p })
    }
  })
  ;(summary.contentDrafts ?? []).forEach((c) => {
    if (c.title?.toLowerCase().includes(lower)) {
      results.push({ type: 'content', item: c })
    }
  })
  ;(summary.finance ?? []).forEach((f) => {
    if (f.month?.toLowerCase().includes(lower)) {
      results.push({ type: 'finance', item: f })
    }
  })
  ;(summary.health ?? []).forEach((h) => {
    if (h.metricName?.toLowerCase().includes(lower) || h.unit?.toLowerCase().includes(lower)) {
      results.push({ type: 'health', item: h })
    }
  })
  return { results }
}
