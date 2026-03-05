import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const mockProjects = [
  { id: '1', name: 'Q1 Product Launch', status: 'active', tasks: 12, progress: 65 },
  { id: '2', name: 'Blog Redesign', status: 'active', tasks: 8, progress: 40 },
  { id: '3', name: 'Annual Report', status: 'completed', tasks: 15, progress: 100 },
  { id: '4', name: 'Marketing Campaign', status: 'planning', tasks: 5, progress: 10 },
]

export function ProjectsListPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Manage projects with AI-assisted planning
          </p>
        </div>
        <Link to="/dashboard/projects/new">
          <Button className="gradient-primary text-primary-foreground">
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <Link key={project.id} to={`/dashboard/projects/${project.id}`}>
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground capitalize">
                      {project.status}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={(e) => e.preventDefault()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>{project.tasks} tasks</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
