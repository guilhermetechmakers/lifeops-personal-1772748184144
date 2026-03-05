import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

export interface PermissionConfig {
  id: string
  label: string
  description: string
  enabled: boolean
}

export interface PermissionManagerPanelProps {
  modulePermissions: Record<string, boolean>
  agentPermissions: Record<string, boolean>
  onModuleChange: (moduleId: string, enabled: boolean) => void
  onAgentChange: (agentId: string, enabled: boolean) => void
  auditTrailHref?: string
}

const defaultAgents = [
  { id: 'scheduler-agent', label: 'Scheduler Agent', description: 'Suggests calendar blocks and deadlines' },
  { id: 'finance-agent', label: 'Finance Agent', description: 'Flags anomalies and forecasts' },
  { id: 'content-agent', label: 'Content Agent', description: 'Recommends schedules and drafts' },
]

export function PermissionManagerPanel({
  modulePermissions,
  agentPermissions,
  onModuleChange,
  onAgentChange,
  auditTrailHref = '/dashboard',
}: PermissionManagerPanelProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border p-4">
        <p className="font-medium">Suggest by default</p>
        <p className="text-sm text-muted-foreground">
          AI will propose actions. You review and approve before they run.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Module connections</h3>
        <p className="text-sm text-muted-foreground">
          Enable modules to connect and sync data. You can change this in Settings.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {['projects', 'content', 'finance', 'health'].map((id) => (
            <div
              key={id}
              className="flex items-center justify-between rounded-xl border border-border p-4"
            >
              <div>
                <Label htmlFor={`module-${id}`} className="font-medium capitalize">
                  {id}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {id === 'projects' && 'Projects & tasks'}
                  {id === 'content' && 'Content drafts & schedule'}
                  {id === 'finance' && 'Finance & budgets'}
                  {id === 'health' && 'Health & workouts'}
                </p>
              </div>
              <Switch
                id={`module-${id}`}
                checked={modulePermissions[id] ?? false}
                onCheckedChange={(checked) => onModuleChange(id, checked)}
                aria-label={`Enable ${id} module`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Agent permissions</h3>
        <p className="text-sm text-muted-foreground">
          Grant agents permission to suggest actions. Require approval for actions — no automatic actions without your explicit approval.
        </p>
        <div className="space-y-3">
          {defaultAgents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between rounded-xl border border-border p-4"
            >
              <div>
                <Label htmlFor={`agent-${agent.id}`} className="font-medium">
                  {agent.label}
                </Label>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </div>
              <Switch
                id={`agent-${agent.id}`}
                checked={agentPermissions[agent.id] ?? true}
                onCheckedChange={(checked) => onAgentChange(agent.id, checked)}
                aria-label={`Enable ${agent.label}`}
              />
            </div>
          ))}
        </div>
      </div>

      {auditTrailHref && (
        <Link
          to={auditTrailHref}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          View audit trail
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
