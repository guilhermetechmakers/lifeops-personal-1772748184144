/**
 * Admin Overview - Dashboard home with metrics and quick links.
 */

import { Link } from 'react-router-dom'
import { MetricsOverview } from '@/components/admin'
import { useAdminMetrics } from '@/hooks/use-admin-query'
import { Button } from '@/components/ui/button'
import { Users, ShieldAlert, Bell } from 'lucide-react'

export function AdminOverviewPage() {
  const { data, isLoading } = useAdminMetrics()

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          System metrics and quick access to admin tools
        </p>
      </div>

      <MetricsOverview data={data} isLoading={isLoading} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/admin/users">
          <Button
            variant="outline"
            className="w-full h-auto flex flex-col items-center gap-2 py-6 hover:bg-accent/30 hover:border-primary/50 transition-colors"
          >
            <Users className="h-8 w-8 text-primary" />
            <span className="font-medium">User Management</span>
            <span className="text-xs text-muted-foreground">Search, suspend, export</span>
          </Button>
        </Link>
        <Link to="/admin/moderation">
          <Button
            variant="outline"
            className="w-full h-auto flex flex-col items-center gap-2 py-6 hover:bg-accent/30 hover:border-primary/50 transition-colors"
          >
            <ShieldAlert className="h-8 w-8 text-primary" />
            <span className="font-medium">Moderation</span>
            <span className="text-xs text-muted-foreground">Review flagged content</span>
          </Button>
        </Link>
        <Link to="/admin/alerts">
          <Button
            variant="outline"
            className="w-full h-auto flex flex-col items-center gap-2 py-6 hover:bg-accent/30 hover:border-primary/50 transition-colors"
          >
            <Bell className="h-8 w-8 text-primary" />
            <span className="font-medium">System Alerts</span>
            <span className="text-xs text-muted-foreground">Incidents and logs</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
