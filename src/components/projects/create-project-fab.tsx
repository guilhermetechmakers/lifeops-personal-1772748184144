/**
 * CreateProjectFab - Fixed bottom FAB for creating new projects
 * Visible on desktop; mobile uses layout FAB
 */

import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface CreateProjectFabProps {
  className?: string
}

export function CreateProjectFab({ className }: CreateProjectFabProps) {
  return (
    <Link
      to="/dashboard/projects/new"
      className={cn(
        'fixed bottom-8 right-6 z-40 hidden md:flex',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full',
        className
      )}
      aria-label="Create new project"
    >
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg gradient-primary text-primary-foreground hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  )
}
