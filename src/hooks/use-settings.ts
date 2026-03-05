import { useState, useCallback, useEffect } from 'react'
import {
  fetchProfile,
  updateProfile,
  fetchSecurity,
  updateSecurity,
  changePassword,
  revokeSession,
  revokeAllSessions,
  fetchIntegrations,
  connectIntegration,
  disconnectIntegration,
  fetchAgentPermissions,
  updateAgentPermissions,
  fetchNotificationSettings,
  updateNotificationSettings,
  fetchExports,
  requestExport,
  fetchSubscription,
  upgradeSubscription,
  downgradeSubscription,
} from '@/api/settings'
import type {
  UserProfile,
  SecurityState,
  Integration,
  AgentPermission,
  AgentPermissionAuditEntry,
  NotificationPreferences,
  DataExport,
  Subscription,
} from '@/types/settings'

export function useSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [security, setSecurity] = useState<SecurityState | null>(null)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [agentPermissions, setAgentPermissions] = useState<{
    agents: AgentPermission[]
    audit: AgentPermissionAuditEntry[]
  }>({ agents: [], audit: [] })
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null)
  const [exports, setExports] = useState<DataExport[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [p, s, i, a, n, e, sub] = await Promise.all([
        fetchProfile(),
        fetchSecurity(),
        fetchIntegrations(),
        fetchAgentPermissions(),
        fetchNotificationSettings(),
        fetchExports(),
        fetchSubscription(),
      ])
      setProfile(p ?? null)
      setSecurity(s ?? null)
      setIntegrations(Array.isArray(i) ? i : [])
      setAgentPermissions({
        agents: Array.isArray(a?.agents) ? a.agents : [],
        audit: Array.isArray(a?.audit) ? a.audit : [],
      })
      setNotificationPrefs(n ?? null)
      setExports(Array.isArray(e) ? e : [])
      setSubscription(sub ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const saveProfile = useCallback(async (p: Partial<UserProfile>) => {
    const updated = await updateProfile(p)
    if (updated) setProfile(updated)
    return updated
  }, [])

  const saveSecurity = useCallback(async (s: Partial<SecurityState>) => {
    const updated = await updateSecurity(s)
    if (updated) setSecurity(updated)
    return updated
  }, [])

  const doChangePassword = useCallback(async (current: string, newPw: string) => {
    return changePassword({ current_password: current, new_password: newPw }).then(
      (r) => r.success
    )
  }, [])

  const doRevokeSession = useCallback(async (id: string) => {
    const ok = await revokeSession(id)
    if (ok) {
      setSecurity((prev) => ({
        ...prev!,
        active_sessions: (prev?.active_sessions ?? []).filter((s) => s.id !== id),
      }))
    }
    return ok
  }, [])

  const doRevokeAllSessions = useCallback(async () => {
    const ok = await revokeAllSessions()
    if (ok) {
      setSecurity((prev) => ({
        ...prev!,
        active_sessions: (prev?.active_sessions ?? []).filter((s) => s.is_active),
      }))
    }
    return ok
  }, [])

  const doConnectIntegration = useCallback(async (provider: string) => {
    const result = await connectIntegration(provider)
    if (result) {
      setIntegrations((prev) => [...prev, result])
    }
    return result
  }, [])

  const doDisconnectIntegration = useCallback(async (id: string) => {
    const ok = await disconnectIntegration(id)
    if (ok) {
      setIntegrations((prev) => prev.filter((i) => i.id !== id))
    }
    return ok
  }, [])

  const saveAgentPermissions = useCallback(async (updates: Record<string, Record<string, boolean>>) => {
    const ok = await updateAgentPermissions(updates)
    if (ok) {
      const fresh = await fetchAgentPermissions()
      setAgentPermissions({
        agents: fresh.agents ?? [],
        audit: fresh.audit ?? [],
      })
    }
    return ok
  }, [])

  const saveNotificationPrefs = useCallback(async (prefs: Partial<NotificationPreferences>) => {
    const updated = await updateNotificationSettings(prefs)
    if (updated) setNotificationPrefs(updated)
    return updated
  }, [])

  const doRequestExport = useCallback(async () => {
    const result = await requestExport()
    if (result) {
      setExports((prev) => [...prev, result])
    }
    return result
  }, [])

  const doUpgradeSubscription = useCallback(async (planId: string) => {
    const ok = await upgradeSubscription(planId)
    if (ok) {
      const fresh = await fetchSubscription()
      setSubscription(fresh ?? null)
    }
    return ok
  }, [])

  const doDowngradeSubscription = useCallback(async (planId: string) => {
    const ok = await downgradeSubscription(planId)
    if (ok) {
      const fresh = await fetchSubscription()
      setSubscription(fresh ?? null)
    }
    return ok
  }, [])

  return {
    profile,
    security,
    integrations,
    agentPermissions,
    notificationPrefs,
    exports,
    subscription,
    loading,
    error,
    refresh: loadAll,
    saveProfile,
    saveSecurity,
    changePassword: doChangePassword,
    revokeSession: doRevokeSession,
    revokeAllSessions: doRevokeAllSessions,
    connectIntegration: doConnectIntegration,
    disconnectIntegration: doDisconnectIntegration,
    updateAgentPermissions: saveAgentPermissions,
    saveNotificationPrefs: saveNotificationPrefs,
    requestExport: doRequestExport,
    upgradeSubscription: doUpgradeSubscription,
    downgradeSubscription: doDowngradeSubscription,
  }
}
