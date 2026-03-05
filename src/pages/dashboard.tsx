import { Link } from 'react-router-dom'
import {
  FolderKanban,
  FileText,
  Wallet,
  Heart,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const moduleShortcuts = [
  { to: '/dashboard/projects/new', icon: FolderKanban, label: 'Create Project', color: 'bg-primary/10 text-primary' },
  { to: '/dashboard/content/new', icon: FileText, label: 'New Content', color: 'bg-primary/10 text-primary' },
  { to: '/dashboard/finance/budget', icon: Wallet, label: 'Add Budget', color: 'bg-primary/10 text-primary' },
  { to: '/dashboard/health/workout', icon: Heart, label: 'Log Workout', color: 'bg-primary/10 text-primary' },
]

const summaryData = [
  { label: 'Projects', value: 12, trend: '+2', href: '/dashboard/projects' },
  { label: 'Content', value: 8, trend: '+1', href: '/dashboard/content' },
  { label: 'Budget Health', value: 'Good', trend: '↑', href: '/dashboard/finance' },
  { label: 'Workouts', value: 5, trend: 'This week', href: '/dashboard/health' },
]

const activityFeed = [
  { id: 1, text: 'AI suggested 3 tasks for "Q1 Launch"', time: '2h ago', action: 'View' },
  { id: 2, text: 'Budget anomaly: $120 at Coffee Shop', time: '5h ago', action: 'Review' },
  { id: 3, text: 'Content "Blog Post" scheduled for tomorrow', time: '1d ago', action: 'View' },
]

const aiDecisions = [
  { id: 1, action: 'Suggested calendar block for project review', rationale: 'Based on your project deadlines and availability', confidence: 92 },
  { id: 2, action: 'Flagged transaction for review', rationale: 'Unusual amount for this merchant category', confidence: 88 },
]

const chartData = [
  { name: 'Mon', value: 4 },
  { name: 'Tue', value: 3 },
  { name: 'Wed', value: 6 },
  { name: 'Thu', value: 5 },
  { name: 'Fri', value: 7 },
  { name: 'Sat', value: 2 },
  { name: 'Sun', value: 4 },
]

export function DashboardPage() {
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
        {summaryData.map((item) => (
          <Link key={item.label} to={item.href}>
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
                <span className="text-xs text-primary">{item.trend}</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Module shortcuts */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moduleShortcuts.map((item) => (
            <Link key={item.label} to={item.to}>
              <Card className="flex items-center gap-4 p-4 transition-all duration-200 hover:shadow-card-hover">
                <div className={`rounded-xl p-3 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="font-medium">{item.label}</span>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent activity</CardTitle>
            <Link to="/dashboard/notifications">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {activityFeed.map((item) => (
                <li key={item.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{item.text}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">{item.action}</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Explainability panel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recent AI decisions
            </CardTitle>
            <Button variant="ghost" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {aiDecisions.map((item) => (
                <li key={item.id} className="rounded-xl border border-border p-4">
                  <p className="font-medium">{item.action}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.rationale}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Confidence: {item.confidence}%
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Why?</Button>
                      <Button variant="ghost" size="sm">Undo</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly activity</CardTitle>
          <CardDescription>Tasks completed across modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(255 212 0)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(255 212 0)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid rgb(230 232 236)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgb(255 212 0)"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
