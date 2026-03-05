/**
 * ContentEditorPage - WYSIWYG editor with AI ideation, SEO, and publish
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { SEOInsightsPanel } from '@/components/content-editor/seo-insights-panel'
import { getContent } from '@/api/content'
import type { ContentItem } from '@/types/content'
import { toast } from 'sonner'

export function ContentEditorPage() {
  const { id } = useParams()
  const isNew = id === 'new' || !id

  const [content, setContent] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(!isNew)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [channel, setChannel] = useState('')

  useEffect(() => {
    if (isNew) return
    const contentId = id ?? ''
    setLoading(true)
    getContent(contentId)
      .then((item) => {
        if (item) {
          setContent(item)
          setTitle(item?.title ?? '')
          setChannel(item?.channel ?? '')
        }
      })
      .finally(() => setLoading(false))
  }, [id, isNew])

  const handleGenerateIdeas = () => {
    toast.info('Generating ideas...')
  }

  const handleSEOSuggestions = () => {
    toast.info('Fetching SEO suggestions...')
  }

  const handlePublish = () => {
    toast.success('Publish flow would run here')
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/content">
          <Button variant="ghost" size="icon" aria-label="Back to content library">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? 'New content' : `Edit: ${content?.title ?? 'Content'}`}
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
              <Input
                placeholder="Content title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
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
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleGenerateIdeas}>
                Generate ideas
              </Button>
              <Button variant="outline" className="w-full" onClick={handleSEOSuggestions}>
                SEO suggestions
              </Button>
            </CardContent>
          </Card>
          <SEOInsightsPanel
            seoScore={content?.seoScore ?? 0}
            suggestions={[]}
            outlineSuggestions={[]}
          />
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="channel">Channel</Label>
                <Input
                  id="channel"
                  placeholder="Blog, LinkedIn, etc."
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                />
              </div>
              <Button
                className="mt-4 w-full gradient-primary text-primary-foreground"
                onClick={handlePublish}
              >
                Publish
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
