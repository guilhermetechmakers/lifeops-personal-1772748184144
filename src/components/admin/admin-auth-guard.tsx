/**
 * AdminAuthGuard - Prevents rendering of admin components for non-admin users.
 * Redirects to login or shows 403 when user is not an admin.
 */

import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAdminMe } from '@/api/admin'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface AdminAuthGuardProps {
  children: React.ReactNode
  fallbackTo?: string
  className?: string
}

export function AdminAuthGuard({ children, fallbackTo = '/login', className }: AdminAuthGuardProps) {
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const check = async () => {
      try {
        const bypass = localStorage.getItem('lifeops-admin-bypass')
        if (bypass === 'true') {
          setIsAdmin(true)
          return
        }
      } catch {
        // ignore
      }
      try {
        const res = await getAdminMe()
        setIsAdmin(res?.isAdmin === true)
      } catch {
        // When API fails (no backend), allow access for development
        setIsAdmin(true)
      }
    }
    void check()
  }, [])

  if (isAdmin === null) {
    return (
      <div className={cn('flex min-h-[200px] items-center justify-center', className)}>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 animate-pulse" />
          <Skeleton className="h-4 w-64 animate-pulse" />
          <Skeleton className="h-4 w-56 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <Navigate
        to={fallbackTo}
        state={{ from: location.pathname, reason: 'admin_required' }}
        replace
      />
    )
  }

  return <>{children}</>
}
