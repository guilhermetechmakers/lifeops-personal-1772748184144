/**
 * ContentCard - Single content item with thumbnail, metadata, quick actions
 */

import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Calendar,
  BarChart3,
  MoreHorizontal,
  Edit3,
  Send,
  Eye,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ContentItem } from '@/types/content'

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  blog: FileText,
  linkedin: FileText,
  twitter: FileText,
  newsletter: FileText,
  youtube: FileText,
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  draft: 'secondary',
  scheduled: 'default',
  published: 'outline',
}

function formatDate(val?: string): string {
  if (!val) return '—'
  try {
    const d = new Date(val)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return '—'
  }
}

export interface ContentCardProps {
  item: ContentItem
  selected?: boolean
  onSelectChange?: (id: string, selected: boolean) => void
  onOpenEditor?: (item: ContentItem) => void
}

export function ContentCard({
  item,
  selected = false,
  onSelectChange,
  onOpenEditor,
}: ContentCardProps) {
  const navigate = useNavigate()
  const id = item?.id ?? ''
  const title = item?.title ?? 'Untitled'
  const status = item?.status ?? 'draft'
  const channel = item?.channel ?? 'blog'
  const tags = Array.isArray(item?.tags) ? item.tags : []
  const wordCount = typeof item?.wordCount === 'number' ? item.wordCount : 0
  const seoScore = typeof item?.seoScore === 'number' ? item.seoScore : null
  const displayDate = item?.scheduledDate ?? item?.publishDate
  const ChannelIcon = CHANNEL_ICONS[channel.toLowerCase()] ?? FileText

  const handleClick = () => {
    if (onOpenEditor) onOpenEditor(item)
    else navigate(`/dashboard/content/${id}`)
  }

  const handleCheckbox = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:scale-[1.01]',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        'border border-border'
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open content: ${title}`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="relative min-h-[80px] w-full overflow-hidden rounded-xl bg-muted/50">
          {item?.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[80px] items-center justify-center">
              <FileText className="h-10 w-10 text-muted-foreground/50" aria-hidden />
            </div>
          )}
          {onSelectChange && (
            <div
              className="absolute left-2 top-2 rounded-md bg-card/90 p-1"
              onClick={handleCheckbox}
            >
              <Checkbox
                checked={selected}
                onCheckedChange={(c) => onSelectChange(id, c === true)}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Select ${title}`}
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-base">{title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={STATUS_VARIANTS[status] ?? 'secondary'} className="text-xs capitalize">
                {status}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <ChannelIcon className="h-3.5 w-3.5" />
                {channel}
              </span>
            </div>
          </div>
          <div onClick={handleDropdown}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="More actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleClick()}>
                  <Edit3 className="h-4 w-4" />
                  Open Editor
                </DropdownMenuItem>
                {status === 'draft' && (
                  <DropdownMenuItem>
                    <Send className="h-4 w-4" />
                    Schedule
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Eye className="h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {displayDate && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(displayDate)}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {wordCount > 0 && (
            <span>{wordCount} words</span>
          )}
          {seoScore != null && seoScore > 0 && (
            <span className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              SEO {seoScore}
            </span>
          )}
        </div>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
