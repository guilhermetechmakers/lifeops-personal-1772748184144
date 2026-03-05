import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Settings, User, Shield, Plug, Bot, Bell, Download, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSection } from './profile-section'
import { SecuritySection } from './security-section'
import { IntegrationsSection } from './integrations-section'
import { AgentPermissionsManager } from './agent-permissions-manager'
import { NotificationsSection } from './notifications-section'
import { DataExportSection } from './data-export-section'
import { SubscriptionSection } from './subscription-section'

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'agent-permissions', label: 'Agent Permissions', icon: Bot },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data-export', label: 'Data Export', icon: Download },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

export function SettingsContainer() {
  const location = useLocation()
  const navigate = useNavigate()
  const hash = location.hash.slice(1) as SectionId | ''
  const [activeTab, setActiveTab] = useState<SectionId>(
    (SECTIONS.some((s) => s.id === hash) ? hash : 'profile') as SectionId
  )
  const [errorBanner, setErrorBanner] = useState<string | null>(null)

  useEffect(() => {
    if (hash && SECTIONS.some((s) => s.id === hash)) {
      setActiveTab(hash as SectionId)
    }
  }, [hash])

  const handleTabChange = (value: string) => {
    const id = value as SectionId
    setActiveTab(id)
    navigate(`/dashboard/settings#${id}`, { replace: true })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <Settings className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Account, security, integrations, and preferences
        </p>
      </div>

      {errorBanner && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm text-destructive">{errorBanner}</p>
            <button
              type="button"
              onClick={() => setErrorBanner(null)}
              className="text-destructive underline"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </CardContent>
        </Card>
      )}

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="flex h-auto flex-wrap gap-1 bg-muted p-1">
          {SECTIONS.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <section.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{section.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <ProfileSection />
        </TabsContent>
        <TabsContent value="security" className="mt-0">
          <SecuritySection />
        </TabsContent>
        <TabsContent value="integrations" className="mt-0">
          <IntegrationsSection />
        </TabsContent>
        <TabsContent value="agent-permissions" className="mt-0">
          <AgentPermissionsManager />
        </TabsContent>
        <TabsContent value="notifications" className="mt-0">
          <NotificationsSection />
        </TabsContent>
        <TabsContent value="data-export" className="mt-0">
          <DataExportSection />
        </TabsContent>
        <TabsContent value="subscription" className="mt-0">
          <SubscriptionSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
