/**
 * ContentEmptyState - Empty state for content library
 */

import { Link } from 'react-router-dom'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface ContentEmptyStateProps {
  title?: string
  description?: string
  className?: string
}

export function ContentEmptyState({
  title = 'No content yet',
  description = 'Create your first piece of content to get started. Use the editor with AI ideation and SEO assistance.',
  className,
}: ContentEmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <FileText className="h-10 w-10 text-primary" aria-hidden />
        </div>
        <h3 className="mt-6 font-semibold text-xl">{title}</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          {description}
        </p>
        <Link to="/dashboard/content/new">
          <Button
            size="lg"
            className="mt-6 gradient-primary text-primary-foreground font-semibold"
            aria-label="Create new content"
          >
            <Plus className="h-5 w-5" />
            Create Content
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
