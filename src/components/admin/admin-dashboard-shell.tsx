/**
 * AdminDashboardShell - Layout container for Admin Dashboard.
 * Header, collapsible side nav, bottom nav on mobile.
 * Uses warm yellow accents per design system.
 */

import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const SIDEBAR_KEY = 'lifeops-admin-sidebar-collapsed'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/users', icon: Users, label: 'User Management' },
  { to: '/admin/moderation', icon: ShieldAlert, label: 'Moderation' },
  { to: '/admin/alerts', icon: Bell, label: 'Alerts' },
]

export function AdminDashboardShell() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem(SIDEBAR_KEY, String(next))
    } catch {
      // ignore
    }
  }

  const SidebarContent = () => (
    <nav className="flex flex-col gap-1 p-2">
      {(navItems ?? []).map((item) => {
        const isActive =
          item.to === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.to)
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[240px]'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-bold text-lg gradient-text">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile header with menu */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
              <div className="flex h-14 items-center border-b border-border px-4">
                <span className="font-bold text-lg gradient-text">Admin</span>
              </div>
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex-1" />
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              Back to App
            </Button>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-6">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-card py-2 md:hidden"
          aria-label="Admin navigation"
        >
          {(navItems ?? []).map((item) => {
            const isActive =
              item.to === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5" aria-hidden />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
