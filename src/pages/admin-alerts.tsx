/**
 * Admin Alerts - System alerts and incidents page.
 */

import { SystemAlertsPanel } from '@/components/admin/system-alerts-panel'

export function AdminAlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Alerts</h1>
        <p className="text-muted-foreground mt-1">
          Monitor incidents and system status
        </p>
      </div>
      <SystemAlertsPanel />
    </div>
  )
}
