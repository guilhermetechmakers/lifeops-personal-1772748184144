import { Outlet, useLocation, Link } from 'react-router-dom'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { GlobalSearchBar } from '@/components/dashboard/global-search-bar'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Wallet,
  Heart,
  Plus,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/dashboard/content', icon: FileText, label: 'Content' },
  { to: '/dashboard/finance', icon: Wallet, label: 'Finance' },
  { to: '/dashboard/health', icon: Heart, label: 'Health' },
]

export function DashboardLayout() {
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
          <GlobalSearchBar />
          <div className="flex items-center gap-2">
            <Link to="/dashboard/profile">
              <Button variant="ghost" size="icon" aria-label="Profile">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-6">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-card py-2 md:hidden"
          aria-label="Main navigation"
        >
          {mobileNavItems.map((item) => {
            const isActive =
              item.to === '/dashboard'
                ? location.pathname === '/dashboard'
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

        {/* Mobile FAB */}
        <Link
          to="/dashboard/projects/new"
          className="fixed bottom-20 right-4 z-50 md:hidden"
          aria-label="Create new"
        >
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg gradient-primary text-primary-foreground hover:scale-105 active:scale-95"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
