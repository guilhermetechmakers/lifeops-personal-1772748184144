import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { Bot, Search, Info, History } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { fetchAgentPermissions, updateAgentPermissions } from '@/api/settings'
import { formatRelativeTime } from '@/utils/date-format'
import type {
  AgentPermission,
  AgentPermissionAuditEntry,
  PermissionLevel,
} from '@/types/settings'

const PERMISSION_LEVELS: PermissionLevel[] = ['read', 'write', 'execute', 'admin']
const PERMISSION_LABELS: Record<PermissionLevel, string> = {
  read: 'Read',
  write: 'Write',
  execute: 'Execute',
  admin: 'Admin',
}

const IO_PREVIEW: Record<PermissionLevel, string> = {
  read: 'Agent can view and read data',
  write: 'Agent can create and modify data',
  execute: 'Agent can perform actions (e.g., send emails, schedule)',
  admin: 'Agent can change settings and manage access',
}

export function AgentPermissionsManager() {
  const [agents, setAgents] = useState<AgentPermission[]>([])
  const [audit, setAudit] = useState<AgentPermissionAuditEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewLevel, setPreviewLevel] = useState<PermissionLevel | null>(null)
  const [auditOpen, setAuditOpen] = useState(false)
  const [pendingUpdates, setPendingUpdates] = useState<
    Record<string, Record<string, boolean>>
  >({})

  const loadPermissions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchAgentPermissions()
      setAgents(Array.isArray(data?.agents) ? data.agents : [])
      setAudit(Array.isArray(data?.audit) ? data.audit : [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPermissions()
  }, [loadPermissions])

  const filteredAgents = (agents ?? []).filter((a) =>
    (a.agent_name ?? '')
      .toLowerCase()
      .includes((searchQuery ?? '').trim().toLowerCase())
  )

  const getPermissionValue = (
    agent: AgentPermission,
    level: PermissionLevel
  ): boolean => {
    const pending = pendingUpdates[agent.agent_id]?.[level]
    if (pending !== undefined) return pending
    return agent.permissions?.[level] ?? false
  }

  const handleToggle = (agentId: string, level: PermissionLevel, value: boolean) => {
    setPendingUpdates((prev) => ({
      ...prev,
      [agentId]: {
        ...(prev[agentId] ?? {}),
        [level]: value,
      },
    }))
  }

  const handleSave = async () => {
    const updates: Record<string, Record<string, boolean>> = {}
    for (const [agentId, perms] of Object.entries(pendingUpdates)) {
      if (Object.keys(perms).length > 0) {
        updates[agentId] = perms
      }
    }
    if (Object.keys(updates).length === 0) {
      toast.info('No changes to save')
      return
    }
    try {
      const ok = await updateAgentPermissions(updates)
      if (ok) {
        setAgents((prev) =>
          prev.map((a) => ({
            ...a,
            permissions: {
              ...(a.permissions ?? { read: false, write: false, execute: false, admin: false }),
              ...(pendingUpdates[a.agent_id] ?? {}),
            },
          }))
        )
        setPendingUpdates({})
        toast.success('Permissions updated')
        void loadPermissions()
      } else {
        toast.error('Failed to update permissions')
      }
    } catch {
      toast.error('Failed to update permissions')
    }
  }

  const hasPendingChanges = Object.keys(pendingUpdates).length > 0

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="mt-2 h-4 w-32 rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded-xl bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Agent permissions</CardTitle>
          <CardDescription>
            Control what each agent can read, write, execute, and administer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search agents"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuditOpen(true)}
                className="gap-1"
              >
                <History className="h-4 w-4" />
                Audit history
              </Button>
              {hasPendingChanges && (
                <Button
                  size="sm"
                  onClick={() => void handleSave()}
                  className="gradient-primary"
                >
                  Save changes
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[500px]" role="grid">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Agent
                  </th>
                  {PERMISSION_LEVELS.map((level) => (
                    <th key={level} className="px-4 py-3 text-center">
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-1 text-sm font-medium hover:text-primary"
                        onClick={() =>
                          setPreviewLevel((p) => (p === level ? null : level))
                        }
                        aria-label={`${PERMISSION_LABELS[level]} - click for info`}
                      >
                        {PERMISSION_LABELS[level]}
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(filteredAgents ?? []).map((agent) => (
                  <tr
                    key={agent.agent_id}
                    className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{agent.agent_name}</span>
                      </div>
                    </td>
                    {PERMISSION_LEVELS.map((level) => (
                      <td key={level} className="px-4 py-3 text-center">
                        <Switch
                          checked={getPermissionValue(agent, level)}
                          onCheckedChange={(v) =>
                            handleToggle(agent.agent_id, level, !!v)
                          }
                          aria-label={`${agent.agent_name} ${PERMISSION_LABELS[level]}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {previewLevel && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="font-medium text-primary">
                {PERMISSION_LABELS[previewLevel]}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {IO_PREVIEW[previewLevel]}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={auditOpen} onOpenChange={setAuditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit history</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto">
            {(audit ?? []).length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No audit entries yet
              </p>
            ) : (
              <ul className="space-y-3">
                {(audit ?? []).map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-lg border border-border p-3 text-sm"
                  >
                    <p className="font-medium">{entry.permission_id}</p>
                    <p className="text-muted-foreground">
                      By {entry.changed_by} · {formatRelativeTime(entry.changed_at)}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="secondary">
                        Was: {JSON.stringify(entry.previous_state)}
                      </Badge>
                      <Badge variant="default">
                        Now: {JSON.stringify(entry.new_state)}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
