import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ContentEditorPage() {
  const { id } = useParams()
  const isNew = id === 'new'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/content">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? 'New content' : `Edit content ${id}`}
          </h1>
          <p className="text-muted-foreground">
            WYSIWYG editor with AI ideation and SEO
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Content title" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Body</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="min-h-[300px] w-full rounded-xl border border-input bg-card p-4"
                placeholder="Write your content..."
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Generate ideas</Button>
              <Button variant="outline" className="mt-2 w-full">SEO suggestions</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Channel</Label>
                <Input placeholder="Blog, LinkedIn, etc." />
              </div>
              <Button className="mt-4 w-full gradient-primary text-primary-foreground">
                Publish
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
