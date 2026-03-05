import { Shield, Eye, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface PermissioningTipsPanelProps {
  className?: string
}

const tips = [
  {
    icon: Shield,
    title: 'Permission-first design',
    content:
      'AI agents in LifeOps only suggest actions—they never execute without your approval. Configure granular permissions in Settings > Agent Permissions to control what each agent can propose.',
  },
  {
    icon: Eye,
    title: 'Explainable actions',
    content:
      'Every suggestion includes a clear rationale. Expand any AI recommendation to see why it was made, what data it used, and what the expected outcome is. This transparency helps you make informed decisions.',
  },
  {
    icon: CheckCircle2,
    title: 'Best practices',
    content:
      'Start with conservative permissions and expand as you gain confidence. Review the audit trail regularly to see what agents have suggested. Use module-specific permissions to limit scope (e.g., Finance-only vs. full access).',
  },
]

export function PermissioningTipsPanel({ className }: PermissioningTipsPanelProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" aria-hidden />
          <h3 className="font-semibold text-lg">Agent Permissioning & Explainability</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Understand how AI agents work and how to configure them safely.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <tip.icon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{tip.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {tip.content}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
