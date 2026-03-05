/**
 * ProjectsPanel - Active projects, progress, upcoming milestones
 * LifeOps Personal Dashboard
 */

import { Link } from 'react-router-dom'
import { FolderKanban, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { Project } from '@/types/dashboard'

export interface ProjectsPanelProps {
  projects?: Project[] | null
  isLoading?: boolean
}

const statusLabels: Record<string, string> = {
  planning: 'Planning',
  'in-progress': 'In progress',
  done: 'Done',
}

export function ProjectsPanel({ projects, isLoading }: ProjectsPanelProps) {
  const items = (projects ?? []).slice(0, 4)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-primary" />
          Projects
        </CardTitle>
        <Link to="/dashboard/projects">
          <Button variant="ghost" size="sm">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No active projects. Create one to get started.
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((p) => (
              <li key={p.id} className="rounded-xl border border-border p-4">
                <Link to={`/dashboard/projects/${p.id}`} className="block">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{p.title}</span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        p.status === 'done' && 'bg-green-100 text-green-800',
                        p.status === 'in-progress' && 'bg-primary/20 text-primary-foreground',
                        p.status === 'planning' && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {statusLabels[p.status] ?? p.status}
                    </span>
                  </div>
                  <Progress value={p.progress ?? 0} className="mt-2 h-2" />
                  {p.dueDate && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Due {new Date(p.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
