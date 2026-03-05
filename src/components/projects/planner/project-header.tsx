/**
 * ProjectHeader - Project metadata, status, progress, and quick actions
 */

import { Link } from 'react-router-dom'
import { ArrowLeft, Pencil, FileStack, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/types/projects'

export interface ProjectHeaderProps {
  project: Project
  onEdit?: () => void
  onTemplateApply?: () => void
  onAISummary?: () => void
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'outline'> = {
  Planning: 'secondary',
  Active: 'default',
  'On Hold': 'warning',
  Completed: 'success',
  Cancelled: 'outline',
  Paused: 'warning',
  Archived: 'outline',
}

export function ProjectHeader({
  project,
  onEdit,
  onTemplateApply,
  onAISummary,
}: ProjectHeaderProps) {
  const title = project?.title ?? 'Untitled'
  const status = project?.status ?? 'Active'
  const progress = typeof project?.progress === 'number' ? Math.min(100, Math.max(0, project.progress)) : 0
  const ownerId = project?.ownerId ?? 'Unknown'

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <Link to="/dashboard/projects">
            <Button variant="ghost" size="icon" aria-label="Back to projects">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={STATUS_VARIANTS[status] ?? 'secondary'} className="text-xs">
                {status}
              </Badge>
              <span className="text-sm text-muted-foreground">Owner: {ownerId}</span>
            </div>
            {project?.description?.trim() && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onTemplateApply} className="gap-2">
            <FileStack className="h-4 w-4" />
            Template
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onAISummary}
            className="gradient-primary gap-2 text-primary-foreground"
          >
            <Sparkles className="h-4 w-4" />
            AI Summary
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}
