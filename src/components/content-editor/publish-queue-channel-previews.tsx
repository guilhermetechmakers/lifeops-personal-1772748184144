/**
 * PublishQueue & ChannelPreviews - Queue view and per-channel previews
 */

import { useState, useEffect } from 'react'
import { Calendar, FileText, Twitter, Linkedin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { fetchChannels } from '@/api/content'
import type { Channel } from '@/types/content'
import { cn } from '@/lib/utils'

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  blog: FileText,
  twitter: Twitter,
  linkedin: Linkedin,
}

export interface ScheduledItem {
  id: string
  title: string
  channel: string
  scheduledAt: string
  status: 'pending' | 'published' | 'failed'
}

export interface PublishQueueChannelPreviewsProps {
  draftTitle?: string
  draftContent?: string
  scheduledItems?: ScheduledItem[]
  selectedChannelIds?: string[]
}

export function PublishQueueChannelPreviews({
  draftTitle = '',
  draftContent = '',
  scheduledItems = [],
  selectedChannelIds = [],
}: PublishQueueChannelPreviewsProps) {
  const [channels, setChannels] = useState<Channel[]>([])

  useEffect(() => {
    fetchChannels().then((list) => setChannels(Array.isArray(list) ? list : []))
  }, [])

  const safeItems = Array.isArray(scheduledItems) ? scheduledItems : []
  const safeChannelIds = Array.isArray(selectedChannelIds) ? selectedChannelIds : []
  const previewChannels = channels.filter((c) => safeChannelIds.includes(c.id))

  const plainText = (draftContent ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Publish Queue & Previews</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="queue">
          <TabsList className="w-full">
            <TabsTrigger value="queue" className="flex-1">
              Queue
            </TabsTrigger>
            <TabsTrigger value="previews" className="flex-1">
              Previews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="queue" className="mt-4">
            {safeItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No scheduled items. Schedule content to see it here.
              </p>
            ) : (
              <ul className="space-y-2">
                {safeItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-input p-3"
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.channel} •{' '}
                        {new Date(item.scheduledAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        item.status === 'published' && 'bg-green-100 text-green-800',
                        item.status === 'pending' && 'bg-amber-100 text-amber-800',
                        item.status === 'failed' && 'bg-red-100 text-red-800'
                      )}
                    >
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent value="previews" className="mt-4">
            {previewChannels.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Select channels in the Schedule panel to see previews.
              </p>
            ) : (
              <div className="space-y-4">
                {previewChannels.map((ch) => {
                  const Icon =
                    CHANNEL_ICONS[ch.platform] ?? FileText
                  return (
                    <div
                      key={ch.id}
                      className="rounded-xl border border-input bg-muted/30 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{ch.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="font-medium text-foreground">
                          {draftTitle || 'Untitled'}
                        </p>
                        <p className="line-clamp-3">{plainText || 'No content'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
