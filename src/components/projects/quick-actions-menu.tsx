/**
 * QuickActionsMenu - Per-card action dropdown (Open, Edit, Duplicate, AI-Assist, Archive)
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Copy,
  Sparkles,
  Archive,
} from 'lucide-react'

export interface QuickActionsMenuProps {
  projectId: string
  onOpen: () => void
  onEdit: () => void
  onDuplicate: () => void
  onAiPlan: () => void
  onArchive: () => void
}

export function QuickActionsMenu({
  onOpen,
  onEdit,
  onDuplicate,
  onAiPlan,
  onArchive,
}: QuickActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Project actions"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpen(); }} aria-label="Open project">
          <ExternalLink className="h-4 w-4" />
          Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }} aria-label="Edit project">
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }} aria-label="Duplicate project">
          <Copy className="h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAiPlan(); }} aria-label="AI-assisted planning">
          <Sparkles className="h-4 w-4" />
          AI-Assist (Plan)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={(e) => { e.stopPropagation(); onArchive(); }}
          aria-label="Archive project"
        >
          <Archive className="h-4 w-4" />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
