import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const columns = [
  { id: 'todo', title: 'To Do', tasks: ['Research competitors', 'Draft outline'] },
  { id: 'progress', title: 'In Progress', tasks: ['Design mockups'] },
  { id: 'done', title: 'Done', tasks: ['Kickoff meeting', 'Set up repo'] },
]

export function ProjectDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Project {id}</h1>
          <p className="text-muted-foreground">Q1 Product Launch</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-semibold">Kanban</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((col) => (
              <Card key={col.id} className="min-w-[280px] flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{col.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {col.tasks.map((task) => (
                    <div
                      key={task}
                      className="rounded-lg border border-border bg-card p-3 text-sm"
                    >
                      {task}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI suggestions will appear here. Use the scope generator when creating projects.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Generate tasks
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
