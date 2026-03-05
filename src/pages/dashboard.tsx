import { useMemo, useState, useEffect } from 'react'
import {
  SummaryCard,
  ProjectsPanel,
  ContentPanel,
  FinancePanel,
  HealthPanel,
  ActivityFeed,
  AIExplainabilityPanel,
  AIShortcutPanel,
  ChartContainer,
  AuditTrailList,
} from '@/components/dashboard'
import { fetchDashboardSummary } from '@/api/dashboard'
import { FolderKanban, FileText, Wallet, Heart } from 'lucide-react'
// Custom hook for dashboard data - uses native fetch with mock fallback
function useDashboardSummary() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchDashboardSummary>> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardSummary()
      .then((res) => {
        setData(res)
        setIsLoading(false)
      })
      .catch(() => {
        setData({
          projects: [],
          contentDrafts: [],
          finance: [],
          health: [],
          aiAudits: [],
        })
        setIsLoading(false)
      })
  }, [])

  return { data, isLoading }
}

export function DashboardPage() {
  const { data, isLoading } = useDashboardSummary()

  const summary = data ?? {
    projects: [],
    contentDrafts: [],
    finance: [],
    health: [],
    aiAudits: [],
  }

  const projects = summary.projects ?? []
  const contentDrafts = summary.contentDrafts ?? []
  const finance = summary.finance ?? []
  const health = summary.health ?? []
  const aiAudits = summary.aiAudits ?? []

  const activeProjects = useMemo(
    () => projects.filter((p) => p?.status === 'in-progress' || p?.status === 'planning'),
    [projects]
  )
  const upcomingContent = useMemo(
    () =>
      contentDrafts.filter(
        (c) => c?.status === 'scheduled' || c?.status === 'draft'
      ).length,
    [contentDrafts]
  )
  const netCashflow = useMemo(() => {
    const latest = finance[0]
    return latest?.netCashflow ?? 0
  }, [finance])
  const wellnessMetric = useMemo(() => {
    const steps = health.find((h) => h?.metricName === 'Steps')
    return steps ? `${(steps.value ?? 0).toLocaleString()} steps` : '—'
  }, [health])

  const chartData = useMemo(
    () => [
      { name: 'Mon', value: 4 },
      { name: 'Tue', value: 3 },
      { name: 'Wed', value: 6 },
      { name: 'Thu', value: 5 },
      { name: 'Fri', value: 7 },
      { name: 'Sat', value: 2 },
      { name: 'Sun', value: 4 },
    ],
    []
  )

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Your unified control center for projects, content, finance, and health
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Active projects"
          value={activeProjects.length}
          trend={`${projects.length} total`}
          href="/dashboard/projects"
          icon={FolderKanban}
        />
        <SummaryCard
          title="Upcoming content"
          value={upcomingContent}
          trend="drafts & scheduled"
          href="/dashboard/content"
          icon={FileText}
        />
        <SummaryCard
          title="Net cashflow"
          value={
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }).format(netCashflow)
          }
          trend={netCashflow >= 0 ? '↑' : '↓'}
          trendUp={netCashflow >= 0}
          href="/dashboard/finance"
          icon={Wallet}
        />
        <SummaryCard
          title="Today's wellness"
          value={wellnessMetric}
          trend="steps"
          href="/dashboard/health"
          icon={Heart}
        />
      </div>

      {/* Module shortcuts */}
      <AIShortcutPanel />

      {/* Panels grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectsPanel projects={projects} isLoading={isLoading} />
        <ContentPanel contentDrafts={contentDrafts} isLoading={isLoading} />
        <FinancePanel finance={finance} isLoading={isLoading} />
        <HealthPanel health={health} isLoading={isLoading} />
      </div>

      {/* Activity feed & Explainability */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed summary={summary} isLoading={isLoading} />
        <AIExplainabilityPanel aiAudits={aiAudits} isLoading={isLoading} />
      </div>

      {/* Audit trail */}
      <AuditTrailList aiAudits={aiAudits} isLoading={isLoading} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartContainer
          title="Weekly activity"
          description="Tasks completed across modules"
          weeklyData={chartData}
          variant="area"
        />
        <ChartContainer
          title="Cashflow by month"
          description="Net cashflow trend"
          financeData={finance}
          variant="bar"
        />
      </div>
    </div>
  )
}
