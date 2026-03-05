import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FolderKanban, FileText, Wallet, Heart, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PermissionManagerPanel } from '@/components/onboarding/permission-manager-panel'
import { toast } from 'sonner'

const modules = [
  { id: 'projects', icon: FolderKanban, label: 'Projects', description: 'Plan and manage projects with AI assistance' },
  { id: 'content', icon: FileText, label: 'Content', description: 'Create and publish content across channels' },
  { id: 'finance', icon: Wallet, label: 'Finance', description: 'Track spending and forecast cashflow' },
  { id: 'health', icon: Heart, label: 'Health', description: 'Workouts, nutrition, and wearable data' },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [step, setStep] = useState(1)
  const [modulePermissions, setModulePermissions] = useState<Record<string, boolean>>({
    projects: true,
    content: true,
    finance: true,
    health: true,
  })
  const [agentPermissions, setAgentPermissions] = useState<Record<string, boolean>>({
    'scheduler-agent': true,
    'finance-agent': true,
    'content-agent': true,
  })

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleModuleChange = useCallback((moduleId: string, enabled: boolean) => {
    setModulePermissions((p) => ({ ...p, [moduleId]: enabled }))
  }, [])

  const handleAgentChange = useCallback((agentId: string, enabled: boolean) => {
    setAgentPermissions((p) => ({ ...p, [agentId]: enabled }))
  }, [])

  const handleContinue = () => {
    if (step < 2) {
      setStep(2)
      return
    }
    toast.success('Onboarding complete!')
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="font-bold text-xl gradient-text">
            LifeOps
          </Link>
          <span className="text-sm text-muted-foreground">Step {step} of 2</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 ? 'Choose your modules' : 'Agent permissions'}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? 'Select the life areas you want to manage with LifeOps. You can add more later.'
                : 'Agents will suggest actions. You approve before anything happens. You can change this in Settings.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {modules.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggle(m.id)}
                    className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                      selected.has(m.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="rounded-lg bg-primary/20 p-2">
                      <m.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{m.label}</p>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <PermissionManagerPanel
                modulePermissions={modulePermissions}
                agentPermissions={agentPermissions}
                onModuleChange={handleModuleChange}
                onAgentChange={handleAgentChange}
                auditTrailHref="/dashboard"
              />
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              <Button
                className="gradient-primary text-primary-foreground"
                onClick={handleContinue}
              >
                {step < 2 ? 'Continue' : 'Finish'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
