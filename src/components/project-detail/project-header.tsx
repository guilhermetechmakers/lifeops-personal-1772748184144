/**
 * ProjectHeader - Project metadata, status, progress, and quick actions
 */

import { Link } from 'react-router-dom'
import { ArrowLeft, Pencil, FileStack, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Project } from '@/types/projects'

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'success' | 'outline'> = {
  Active: 'default',
  Planning: 'secondary',
  'On Hold': 'secondary',
  Paused: 'secondary',
  Completed: 'success',
  Cancelled: 'outline',
  Archived: 'outline',
}

export interface ProjectHeaderProps {
  project: Project
  onEdit?: () => void
  onTemplateApply?: () => void
  onAISummary?: () => void
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
  const description = project?.description ?? ''

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <Link to="/dashboard/projects">
            <Button variant="ghost" size="icon" aria-label="Back to projects">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
              <Badge variant={STATUS_VARIANTS[status] ?? 'secondary'} className="text-xs">
                {status}
              </Badge>
            </div>
            {description && (
              <p className="mt-1 text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="transition-all duration-200 hover:scale-[1.02]"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:scale-[1.02]"
              >
                <FileStack className="h-4 w-4" />
                Template
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onTemplateApply}>
                Apply template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            onClick={onAISummary}
            className="gradient-primary text-primary-foreground transition-all duration-200 hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            AI Summary
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Progress</span>
          <span className="text-sm font-semibold">{progress}%</span>
        </div>
        <Progress value={progress} className={cn('mt-2 h-2')} />
      </div>
    </div>
  )
}
