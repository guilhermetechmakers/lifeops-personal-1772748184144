/**
 * ProjectDetailLinkCard - Small utility to navigate to Project Detail & Planner
 */

import { Link } from 'react-router-dom'
import { LayoutDashboard, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface ProjectDetailLinkCardProps {
  projectId: string
  className?: string
}

export function ProjectDetailLinkCard({ projectId, className }: ProjectDetailLinkCardProps) {
  return (
    <Link to={`/dashboard/projects/${projectId}`}>
      <Card
        className={cn(
          'transition-all duration-200 hover:scale-[1.01] hover:shadow-card-hover',
          className
        )}
      >
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Project Detail & Planner</p>
              <p className="text-sm text-muted-foreground">
                View milestones, Kanban, timeline, and calendar
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  )
}
