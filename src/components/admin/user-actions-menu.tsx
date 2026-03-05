/**
 * UserActionsMenu - Per-row actions: View Profile, Suspend/Reactivate, Export, Escalate.
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, User as UserIcon, Ban, CheckCircle, Download, AlertCircle } from 'lucide-react'
import type { User } from '@/types/admin'

export interface UserActionsMenuProps {
  user: User
  onViewProfile: (user: User) => void
  onSuspend: (user: User) => void
  onReactivate: (user: User) => void
  onExport: (user: User) => void
  onEscalate: (user: User) => void
}

export function UserActionsMenu({
  user,
  onViewProfile,
  onSuspend,
  onReactivate,
  onExport,
  onEscalate,
}: UserActionsMenuProps) {
  const isSuspended = user?.status === 'suspended'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="User actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onViewProfile(user)}>
          <UserIcon className="h-4 w-4" />
          View Profile
        </DropdownMenuItem>
        {isSuspended ? (
          <DropdownMenuItem onClick={() => onReactivate(user)}>
            <CheckCircle className="h-4 w-4" />
            Reactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onSuspend(user)} className="text-amber-600">
            <Ban className="h-4 w-4" />
            Suspend
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onExport(user)}>
          <Download className="h-4 w-4" />
          Export Data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEscalate(user)}>
          <AlertCircle className="h-4 w-4" />
          Escalate to Support
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
