import { Outlet } from 'react-router-dom'
import { AppSidebar, GlobalSearchTrigger } from '@/components/layout/app-sidebar'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
          <GlobalSearchTrigger />
          <div className="flex items-center gap-2">
            <Link to="/dashboard/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
