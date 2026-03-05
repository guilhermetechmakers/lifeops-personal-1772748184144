import { Outlet, useLocation, Link } from 'react-router-dom'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { GlobalSearchBar } from '@/components/dashboard/global-search-bar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Wallet,
  Heart,
  Plus,
  User,
  Settings,
  Bell,
  ShieldCheck,
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
            <Link to="/dashboard/notifications">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={undefined} alt="User" />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/notifications">
                    <Bell className="h-4 w-4" />
                    Notifications Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin">
                    <ShieldCheck className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

        {/* Mobile FAB - context-aware: Content vs Projects */}
        <Link
          to={location.pathname.startsWith('/dashboard/content') ? '/dashboard/content/new' : '/dashboard/projects/new'}
          className="fixed bottom-20 right-4 z-50 md:hidden"
          aria-label={location.pathname.startsWith('/dashboard/content') ? 'Create new content' : 'Create new project'}
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
