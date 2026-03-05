import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const mockContent = [
  { id: '1', title: 'Blog: Getting Started with AI', status: 'published', channel: 'Blog' },
  { id: '2', title: 'LinkedIn Post: Q1 Wins', status: 'scheduled', channel: 'LinkedIn' },
  { id: '3', title: 'Twitter Thread: Tips', status: 'draft', channel: 'X' },
]

export function ContentLibraryPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Content Library</h1>
          <p className="mt-1 text-muted-foreground">
            Drafts, scheduled, and published content
          </p>
        </div>
        <Link to="/dashboard/content/new">
          <Button className="gradient-primary text-primary-foreground">
            <Plus className="h-5 w-5" />
            New Content
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search content..."
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
        {mockContent.map((item) => (
          <Link key={item.id} to={`/dashboard/content/${item.id}`}>
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <CardContent className="p-5">
                <h3 className="font-semibold">{item.title}</h3>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                    {item.status}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.channel}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
