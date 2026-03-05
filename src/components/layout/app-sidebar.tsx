import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Wallet,
  Heart,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  CreditCard,
  Receipt,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const SIDEBAR_KEY = 'lifeops-sidebar-collapsed'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/dashboard/content', icon: FileText, label: 'Content' },
  { to: '/dashboard/finance', icon: Wallet, label: 'Finance' },
  { to: '/dashboard/health', icon: Heart, label: 'Health' },
]

const bottomItems = [
  { to: '/dashboard/checkout', icon: CreditCard, label: 'Checkout' },
  { to: '/dashboard/finance/history', icon: Receipt, label: 'Order History' },
  { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function AppSidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true'
    } catch {
      return false
    }
  })

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem(SIDEBAR_KEY, String(next))
    } catch {
      // ignore
    }
  }

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-lg gradient-text">LifeOps</span>
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

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>

        <div className="mt-4 border-t border-border pt-4">
          {bottomItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {!collapsed && (
        <div className="border-t border-border p-4">
          <Link to="/dashboard/projects/new">
            <Button className="w-full gradient-primary text-primary-foreground font-semibold">
              <Plus className="h-5 w-5" />
              New Project
            </Button>
          </Link>
        </div>
      )}
    </aside>
  )
}

export function GlobalSearchTrigger() {
  return (
    <Button variant="outline" size="sm" className="gap-2">
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-xs font-mono sm:inline">
        ⌘K
      </kbd>
    </Button>
  )
}
