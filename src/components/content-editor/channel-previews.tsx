/**
 * ChannelPreviews - Per-channel preview of how content will look
 */

import { FileText, Twitter, Linkedin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  blog: FileText,
  twitter: Twitter,
  linkedin: Linkedin,
}

export interface ChannelPreviewsProps {
  content: string
  title: string
  channels?: string[]
  className?: string
}

function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text
  return text.slice(0, max - 3) + '...'
}

export function ChannelPreviews({
  content = '',
  title = '',
  channels = ['blog', 'twitter', 'linkedin'],
  className,
}: ChannelPreviewsProps) {
  const safeChannels = Array.isArray(channels) ? channels : []
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <CardTitle className="text-base">Channel preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={safeChannels[0] ?? 'blog'} className="w-full">
          <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${safeChannels.length}, 1fr)` }}>
            {safeChannels.map((ch) => {
              const Icon = CHANNEL_ICONS[ch] ?? FileText
              return (
                <TabsTrigger key={ch} value={ch} className="gap-1.5">
                  <Icon className="h-4 w-4" />
                  {ch}
                </TabsTrigger>
              )
            })}
          </TabsList>
          {safeChannels.map((ch) => (
            <TabsContent key={ch} value={ch} className="mt-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                {ch === 'blog' && (
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold">{title || 'Untitled'}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-4">
                      {truncate(plainText, 200)}
                    </p>
                  </div>
                )}
                {ch === 'twitter' && (
                  <div className="text-sm">
                    <p className="font-medium">{title || 'Untitled'}</p>
                    <p className="text-muted-foreground mt-1 line-clamp-3">
                      {truncate(plainText, 280)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {plainText.length}/280 chars
                    </p>
                  </div>
                )}
                {ch === 'linkedin' && (
                  <div className="text-sm">
                    <p className="font-semibold">{title || 'Untitled'}</p>
                    <p className="text-muted-foreground mt-1 line-clamp-4">
                      {truncate(plainText, 300)}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
