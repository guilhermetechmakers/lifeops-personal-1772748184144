/**
 * AdminUserManagementPage - Search, filter, user table, per-row and bulk actions.
 */

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminUsers } from '@/hooks/use-admin-query'
import { getAdminUser, suspendUser, reactivateUser, escalateToSupport } from '@/api/admin'
import { toast } from 'sonner'
import {
  AdminUserSearchBar,
  UserActionsMenu,
  BulkActionsToolbar,
  ProfileDrawer,
  SuspensionModal,
  EscalationModal,
  ExportModal,
} from '@/components/admin'
import type { User } from '@/types/admin'

function formatDate(s?: string | null): string {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleDateString()
  } catch {
    return '—'
  }
}

export function AdminUserManagementPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')
  const [region, setRegion] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [suspendUserState, setSuspendUserState] = useState<User | null>(null)
  const [suspendAction, setSuspendAction] = useState<'suspend' | 'reactivate'>('suspend')
  const [escalateUser, setEscalateUser] = useState<User | null>(null)
  const [exportUsersList, setExportUsersList] = useState<User[]>([])
  const [exportOpen, setExportOpen] = useState(false)

  const { data, isLoading, error, refetch } = useAdminUsers({
    query: query || undefined,
    status: status && status !== 'all' ? status : undefined,
    role: role && role !== 'all' ? role : undefined,
    region: region && region !== 'all' ? region : undefined,
  })

  const users = (data?.users ?? []) as User[]
  const total = data?.total ?? 0

  const handleViewProfile = useCallback(async (user: User) => {
    setProfileUser(user)
    setProfileOpen(true)
    setProfileLoading(true)
    try {
      const full = await getAdminUser(user?.id ?? '')
      setProfileUser(full ?? user)
    } catch {
      setProfileUser(user)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  const handleSuspend = useCallback((user: User) => {
    setSuspendUserState(user)
    setSuspendAction('suspend')
  }, [])

  const handleReactivate = useCallback((user: User) => {
    setSuspendUserState(user)
    setSuspendAction('reactivate')
  }, [])

  const handleSuspendConfirm = useCallback(
    async (userId: string, reason?: string) => {
      try {
        await suspendUser(userId, reason)
        toast.success('User suspended')
        refetch()
      } catch (e) {
        toast.error((e as Error)?.message ?? 'Failed to suspend')
      }
    },
    [refetch]
  )

  const handleReactivateConfirm = useCallback(
    async (userId: string) => {
      try {
        await reactivateUser(userId)
        toast.success('User reactivated')
        refetch()
      } catch (e) {
        toast.error((e as Error)?.message ?? 'Failed to reactivate')
      }
    },
    [refetch]
  )

  const handleExport = useCallback((user: User) => {
    setExportUsersList([user])
    setExportOpen(true)
  }, [])

  const handleEscalate = useCallback((user: User) => {
    setEscalateUser(user)
  }, [])

  const handleEscalateSubmit = useCallback(
    async (userId: string, subject: string, notes: string) => {
      await escalateToSupport({ userId, subject, notes })
      toast.success('Escalation created')
      setEscalateUser(null)
    },
    []
  )

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(users.map((u) => u?.id).filter(Boolean) as string[]))
    }
  }

  const selectedUsers = users.filter((u) => u?.id && selectedIds.has(u.id))
  const hasSuspendedInSelection = selectedUsers.some((u) => u?.status === 'suspended')

  const handleExportSelected = () => {
    setExportUsersList(selectedUsers)
    setExportOpen(true)
  }

  const handleExportAll = () => {
    setExportUsersList(users)
    setExportOpen(true)
  }

  if (error) {
    toast.error(error?.message ?? 'Failed to load users')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">User Management</h1>
        <p className="mt-1 text-muted-foreground">
          Search, filter, and manage user accounts
        </p>
      </div>

      <AdminUserSearchBar
        query={query}
        status={status}
        role={role}
        region={region}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onRoleChange={setRole}
        onRegionChange={setRegion}
      />

      <BulkActionsToolbar
        selectedCount={selectedIds.size}
        totalCount={total}
        onSelectAll={selectAll}
        onExportSelected={handleExportSelected}
        onExportAll={handleExportAll}
        onBulkSuspend={() => toast.info('Bulk suspend requires confirmation')}
        onBulkReactivate={() => toast.info('Bulk reactivate requires confirmation')}
        hasSuspendedInSelection={hasSuspendedInSelection}
      />

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <p className="text-sm text-muted-foreground">{total} total</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {(Array.from({ length: 5 }) ?? []).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="w-10 px-4 py-3 text-left">
                      <Checkbox
                        checked={users.length > 0 && selectedIds.size === users.length}
                        onCheckedChange={selectAll}
                        aria-label="Select all"
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-medium">User</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Last Active</th>
                    <th className="w-12 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {(users ?? []).map((user) => (
                    <tr
                      key={user?.id}
                      className="border-b border-border hover:bg-accent/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedIds.has(user?.id ?? '')}
                          onCheckedChange={() => toggleSelect(user?.id ?? '')}
                          aria-label={`Select ${user?.username}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatarUrl ?? undefined} />
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {(user?.username ?? '?').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user?.username ?? '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {user?.email ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={user?.status === 'suspended' ? 'destructive' : 'default'}
                        >
                          {user?.status ?? '—'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(user?.lastActiveAt)}
                      </td>
                      <td className="px-4 py-3">
                        <UserActionsMenu
                          user={user}
                          onViewProfile={handleViewProfile}
                          onSuspend={handleSuspend}
                          onReactivate={handleReactivate}
                          onExport={handleExport}
                          onEscalate={handleEscalate}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ProfileDrawer
        user={profileUser}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        isLoading={profileLoading}
      />

      <SuspensionModal
        user={suspendUserState}
        action={suspendAction}
        open={!!suspendUserState}
        onOpenChange={(open) => !open && setSuspendUserState(null)}
        onConfirm={
          suspendAction === 'suspend'
            ? handleSuspendConfirm
            : (id) => handleReactivateConfirm(id)
        }
      />

      <EscalationModal
        user={escalateUser}
        open={!!escalateUser}
        onOpenChange={(open) => !open && setEscalateUser(null)}
        onSubmit={handleEscalateSubmit}
      />

      <ExportModal
        users={exportUsersList}
        open={exportOpen}
        onOpenChange={setExportOpen}
      />
    </div>
  )
}
