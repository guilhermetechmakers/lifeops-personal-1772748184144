/**
 * ContentEditorPage - Full Content Editor & SEO Assistant
 * WYSIWYG editor with AI ideation, SEO, scoring, scheduling
 */

import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ContentEditorPanel,
  AIIdeaOutlineGenerator,
  SEOPanel,
  ContentScoringPanel,
  SchedulerPanel,
  PublishQueueChannelPreviews,
  ContentTemplatesLibrary,
} from '@/components/content-editor'
import { ContentEditorProvider, useContentEditor } from '@/context/content-editor-context'
import {
  getContent,
  createContent,
  updateContent,
  publishContent,
} from '@/api/content'
import type { ContentItem } from '@/types/content'
import { toast } from 'sonner'

function ContentEditorInner() {
  const { id } = useParams()
  const isNew = id === 'new' || !id
  const {
    draft,
    loadDraft,
    getDraftForSave,
  } = useContentEditor()

  const [loading, setLoading] = useState(!isNew)
  const [publishing, setPublishing] = useState(false)
  const [scheduledAt, setScheduledAt] = useState<string | null>(null)
  const [channelIds, setChannelIds] = useState<string[]>([])
  useEffect(() => {
    if (isNew) return
    const contentId = id ?? ''
    setLoading(true)
    getContent(contentId)
      .then((item) => {
        if (item) loadDraft(item as ContentItem)
        setScheduledAt(item?.scheduled_at ?? item?.scheduledDate ?? null)
        setChannelIds(Array.isArray(item?.channel_ids) ? item.channel_ids : [])
      })
      .finally(() => setLoading(false))
  }, [id, isNew, loadDraft])

  const handleScheduleChange = useCallback((date: string | null, ids: string[]) => {
    setScheduledAt(date)
    setChannelIds(ids)
  }, [])

  const handlePublish = useCallback(async () => {
    const d = getDraftForSave()
    if (!d) return
    const titleLen = (d.title ?? '').trim().length
    const contentLen = (d.content ?? '').replace(/<[^>]*>/g, '').trim().length
    if (titleLen < 6 || titleLen > 120) {
      toast.error('Title must be 6-120 characters')
      return
    }
    if (contentLen < 20) {
      toast.error('Content must be at least 20 characters')
      return
    }

    setPublishing(true)
    try {
      let pid = d.id
      if (isNew || !pid) {
        const created = await createContent({
          title: d.title?.trim(),
          content: d.content,
          channel: d.channel ?? 'blog',
          channel_ids: channelIds.length > 0 ? channelIds : (d.channel_ids ?? []),
          scheduled_at: scheduledAt,
          draft: true,
        })
        pid = created?.id ?? ''
        if (pid && created) loadDraft(created as ContentItem)
      } else {
        await updateContent(pid, {
          title: d.title?.trim(),
          content: d.content,
          channel_ids: channelIds.length > 0 ? channelIds : d.channel_ids,
          scheduled_at: scheduledAt ?? undefined,
        })
      }

      if (scheduledAt) {
        toast.success('Content scheduled')
      } else if (pid) {
        await publishContent(pid)
        toast.success('Published!')
      }
    } catch {
      toast.error('Failed to publish')
    } finally {
      setPublishing(false)
    }
  }, [getDraftForSave, isNew, channelIds, scheduledAt, loadDraft])

  const scheduledItems = scheduledAt
    ? [
        {
          id: draft?.id ?? 'temp',
          title: draft?.title ?? 'Untitled',
          channel: 'blog',
          scheduledAt,
          status: 'pending' as const,
        },
      ]
    : []

  if (loading && !isNew) {
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
            {isNew ? 'New content' : `Edit: ${draft?.title ?? 'Content'}`}
          </h1>
          <p className="text-muted-foreground">
            Content Editor & SEO Assistant
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ContentEditorPanel />
        </div>

        <div className="space-y-6">
          <AIIdeaOutlineGenerator />
          <SEOPanel />
          <ContentScoringPanel />
          <SchedulerPanel
            onScheduleChange={handleScheduleChange}
            onAutoScheduleChange={() => {}}
          />
          <ContentTemplatesLibrary />
          <PublishQueueChannelPreviews
            draftTitle={draft?.title ?? ''}
            draftContent={draft?.content ?? ''}
            scheduledItems={scheduledItems}
            selectedChannelIds={channelIds}
          />

          <div className="sticky bottom-4">
            <Button
              className="w-full gradient-primary text-primary-foreground h-12 text-base hover:scale-[1.02] transition-transform"
              onClick={handlePublish}
              disabled={publishing}
            >
              {publishing ? (
                'Publishing...'
              ) : scheduledAt ? (
                <>
                  <Calendar className="h-5 w-5" />
                  Schedule
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Publish now
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ContentEditorPage() {
  return (
    <ContentEditorProvider>
      <ContentEditorInner />
    </ContentEditorProvider>
  )
}
