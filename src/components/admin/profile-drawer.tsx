/**
 * ProfileDrawer - Detailed user profile view with activity and usage stats.
 */

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { User } from '@/types/admin'

export interface ProfileDrawerProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
}

function formatDate(s?: string | null): string {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleString()
  } catch {
    return '—'
  }
}

export function ProfileDrawer({
  user,
  open,
  onOpenChange,
  isLoading,
}: ProfileDrawerProps) {
  const initials = user?.username
    ? (user.username.slice(0, 2) ?? '').toUpperCase()
    : '?'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>Detailed account information</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : user ? (
          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.username} />
                <AvatarFallback className="bg-primary/20 text-primary text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{user?.username ?? '—'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email ?? '—'}</p>
                <Badge
                  variant={user?.status === 'suspended' ? 'destructive' : 'default'}
                  className="mt-1"
                >
                  {user?.status ?? '—'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role</span>
                <span>{user?.role ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Region</span>
                <span>{user?.region ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Active</span>
                <span>{formatDate(user?.lastActiveAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(user?.createdAt)}</span>
              </div>
            </div>
            {user?.profile?.bio && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Bio</h4>
                <p className="text-sm">{user.profile.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground pt-6">No user selected.</p>
        )}
      </SheetContent>
    </Sheet>
  )
}
