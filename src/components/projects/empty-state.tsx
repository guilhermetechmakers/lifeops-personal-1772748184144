/**
 * EmptyState - Placeholder view for zero projects with CTA
 */

import { Link } from 'react-router-dom'
import { FolderKanban, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title?: string
  description?: string
  className?: string
}

export function EmptyState({
  title = 'No projects yet',
  description = 'Create your first project to get started. Use AI-assisted planning to break down goals into milestones and tasks.',
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <FolderKanban className="h-10 w-10 text-primary" aria-hidden />
        </div>
        <h3 className="mt-6 font-semibold text-xl">{title}</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          {description}
        </p>
        <Link to="/dashboard/projects/new">
          <Button
            size="lg"
            className="mt-6 gradient-primary text-primary-foreground font-semibold"
            aria-label="Create your first project"
          >
            <Plus className="h-5 w-5" />
            Create Project
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
