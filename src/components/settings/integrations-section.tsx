import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { Wallet, Calendar, Heart, Share2, RefreshCw, Link2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatRelativeTime } from '@/utils/date-format'
import { fetchIntegrations, connectIntegration, disconnectIntegration } from '@/api/settings'
import type { Integration } from '@/types/settings'
import { cn } from '@/lib/utils'

const PROVIDER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  bank_plaid: Wallet,
  google_calendar: Calendar,
  health_apple: Heart,
  social: Share2,
}

const PROVIDER_LABELS: Record<string, string> = {
  bank_plaid: 'Bank (Plaid)',
  google_calendar: 'Google Calendar',
  health_apple: 'Health App',
  social: 'Social',
}

const AVAILABLE_PROVIDERS = [
  { id: 'bank_plaid', label: 'Bank (Plaid)', icon: Wallet },
  { id: 'google_calendar', label: 'Google Calendar', icon: Calendar },
  { id: 'health_apple', label: 'Health App', icon: Heart },
  { id: 'social', label: 'Social', icon: Share2 },
]

function getStatusVariant(
  status: Integration['token_status']
): 'success' | 'warning' | 'destructive' | 'secondary' {
  switch (status) {
    case 'active':
      return 'success'
    case 'expired':
      return 'warning'
    case 'revoked':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export function IntegrationsSection() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null)

  const loadIntegrations = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchIntegrations()
      setIntegrations(Array.isArray(data) ? data : [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadIntegrations()
  }, [loadIntegrations])

  const handleConnect = useCallback(async (provider: string) => {
    setConnectingProvider(provider)
    try {
      const result = await connectIntegration(provider)
      if (result) {
        setIntegrations((prev) => [...prev, result])
        toast.success(`Connected ${PROVIDER_LABELS[provider] ?? provider}`)
        setConnectModalOpen(false)
      } else {
        toast.error('Failed to connect. Try again.')
      }
    } catch {
      toast.error('Failed to connect')
    } finally {
      setConnectingProvider(null)
    }
  }, [])

  const handleDisconnect = useCallback(async (id: string) => {
    if (!confirm('Disconnect this integration? You can reconnect later.')) return
    try {
      const ok = await disconnectIntegration(id)
      if (ok) {
        setIntegrations((prev) => prev.filter((i) => i.id !== id))
        toast.success('Disconnected')
      } else {
        toast.error('Failed to disconnect')
      }
    } catch {
      toast.error('Failed to disconnect')
    }
  }, [])

  const handleReauth = useCallback(
    async (integration: Integration) => {
      await handleDisconnect(integration.id)
      await handleConnect(integration.provider)
    },
    [handleDisconnect, handleConnect]
  )

  const getProviderLabel = (integration: Integration) =>
    integration.provider_label ?? PROVIDER_LABELS[integration.provider] ?? integration.provider
  const getProviderIcon = (provider: string) =>
    PROVIDER_ICONS[provider] ?? Wallet

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="mt-2 h-4 w-32 rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect Bank, Health, Calendar, and Social apps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(integrations ?? []).map((integration) => {
            const Icon = getProviderIcon(integration.provider)
            const label = getProviderLabel(integration)
            const isConnected = integration.token_status === 'active'
            return (
              <div
                key={integration.id}
                className={cn(
                  'flex items-center justify-between rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-card',
                  !isConnected && 'opacity-80'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">
                      {isConnected
                        ? integration.last_sync
                          ? `Last sync: ${formatRelativeTime(integration.last_sync)}`
                          : 'Connected'
                        : integration.token_status === 'expired'
                          ? 'Token expired'
                          : 'Not connected'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(integration.token_status)}>
                    {integration.token_status}
                  </Badge>
                  {isConnected ? (
                    <>
                      {integration.token_status === 'expired' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleReauth(integration)}
                          className="gap-1 transition-transform hover:scale-[1.02]"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Re-auth
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleDisconnect(integration.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleConnect(integration.provider)}
                      className="gap-1 transition-transform hover:scale-[1.02]"
                    >
                      <Link2 className="h-4 w-4" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            )
          })}

          <Button
            variant="outline"
            className="w-full gap-2 border-dashed transition-transform hover:scale-[1.01]"
            onClick={() => setConnectModalOpen(true)}
          >
            <Link2 className="h-4 w-4" />
            Connect new app
          </Button>
        </CardContent>
      </Card>

      <Dialog open={connectModalOpen} onOpenChange={setConnectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect integration</DialogTitle>
            <DialogFooter className="sr-only" />
          </DialogHeader>
          <div className="grid gap-2 py-4">
            {AVAILABLE_PROVIDERS.map((p) => {
              const isConnected = integrations.some((i) => i.provider === p.id)
              const isConnecting = connectingProvider === p.id
              return (
                <Button
                  key={p.id}
                  variant="outline"
                  className="justify-start gap-3 transition-transform hover:scale-[1.01]"
                  onClick={() => (isConnected ? null : void handleConnect(p.id))}
                  disabled={isConnected || isConnecting}
                >
                  <p.icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{p.label}</span>
                  {isConnected ? (
                    <Badge variant="success">Connected</Badge>
                  ) : isConnecting ? (
                    <span className="text-sm text-muted-foreground">Connecting...</span>
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
