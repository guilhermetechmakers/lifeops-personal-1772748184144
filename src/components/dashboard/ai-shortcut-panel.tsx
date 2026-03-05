/**
 * AIShortcutPanel - Module shortcuts (Create Project, Content, Budget, Workout)
 * LifeOps Personal Dashboard
 */

import { Link } from 'react-router-dom'
import { FolderKanban, FileText, Wallet, Heart, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const shortcuts = [
  {
    to: '/dashboard/projects/new',
    icon: FolderKanban,
    label: 'Create Project',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    to: '/dashboard/content/new',
    icon: FileText,
    label: 'Create Content',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    to: '/dashboard/finance/budget',
    icon: Wallet,
    label: 'Create Budget',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    to: '/dashboard/health/workout',
    icon: Heart,
    label: 'Create Workout',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
] as const

export function AIShortcutPanel() {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">Quick actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map((item) => (
          <Link key={item.label} to={item.to}>
            <Card
              className={cn(
                'flex items-center gap-4 p-4 transition-all duration-200',
                'hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98]'
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                  item.color
                )}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-medium">{item.label}</span>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
