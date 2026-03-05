/**
 * ProjectCard - Card representing a single project with metadata and quick actions
 */

import { useNavigate } from 'react-router-dom'
import { FolderKanban } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { Project } from '@/types/projects'
import { DateBadge } from './date-badge'
import { TagChip } from './tag-chip'
import { PriorityPill } from './priority-pill'
import { AIRecommendationsBar } from './ai-recommendations-bar'
import { QuickActionsMenu } from './quick-actions-menu'

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'success' | 'outline'> = {
  Active: 'default',
  Planning: 'secondary',
  'On Hold': 'secondary',
  Paused: 'secondary',
  Completed: 'success',
  Cancelled: 'outline',
  Archived: 'outline',
}

export interface ProjectCardProps {
  project: Project
  onOpen?: (projectId: string) => void
  onEdit?: (projectId: string) => void
  onDuplicate?: (projectId: string) => void
  onAiPlan?: (projectId: string) => void
  onArchive?: (projectId: string) => void
}

export function ProjectCard({
  project,
  onOpen,
  onEdit,
  onDuplicate,
  onAiPlan,
  onArchive,
}: ProjectCardProps) {
  const navigate = useNavigate()
  const id = project?.id ?? ''
  const title = project?.title ?? 'Untitled'
  const status = project?.status ?? 'Active'
  const progress = typeof project?.progress === 'number' ? Math.min(100, Math.max(0, project.progress)) : 0
  const tags = Array.isArray(project?.tags) ? project.tags : []
  const nextMilestone = project?.nextMilestone
  const dueDate = project?.dueDate ?? nextMilestone?.dueDate

  const handleOpen = () => {
    if (onOpen) onOpen(id)
    else navigate(`/dashboard/projects/${id}`)
  }

  const handleEdit = () => {
    if (onEdit) onEdit(id)
    else navigate(`/dashboard/projects/${id}?edit=true`)
  }

  const handleDuplicate = () => {
    if (onDuplicate) onDuplicate(id)
    else navigate(`/dashboard/projects/new?duplicate=${id}`)
  }

  const handleAiPlan = () => {
    if (onAiPlan) onAiPlan(id)
    else navigate(`/dashboard/projects/${id}?aiPlan=true`)
  }

  const handleArchive = () => {
    if (onArchive) onArchive(id)
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01]',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
      )}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleOpen()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open project ${title}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FolderKanban className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base truncate">{title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant={STATUS_VARIANTS[status] ?? 'secondary'} className="text-xs">
                  {status}
                </Badge>
                <PriorityPill priority={project?.priority ?? null} />
              </div>
            </div>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <QuickActionsMenu
              projectId={id}
              onOpen={handleOpen}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onAiPlan={handleAiPlan}
              onArchive={handleArchive}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
        </div>

        {nextMilestone && (
          <div className="mt-4 flex items-center gap-2">
            <DateBadge
              date={nextMilestone.dueDate ?? undefined}
              label="Next:"
              variant={nextMilestone.completed ? 'default' : 'upcoming'}
            />
            <span className="text-sm text-muted-foreground truncate">
              {nextMilestone.title ?? 'Milestone'}
            </span>
          </div>
        )}

        {project?.aiRecommendation?.trim() && (
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            <AIRecommendationsBar recommendation={project.aiRecommendation} />
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {typeof project?.assignedTasksCount === 'number' && (
            <span>{project.assignedTasksCount} tasks</span>
          )}
          {dueDate && (
            <DateBadge date={dueDate} variant="default" />
          )}
          {tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
