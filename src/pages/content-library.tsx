/**
 * ContentLibraryPage - Content Library with filters, search, bulk actions, asset browser
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  ContentCard,
  ContentLibraryFilters,
  BulkActionsBar,
  AssetBrowser,
  CreateContentFab,
  ContentCardSkeleton,
  ContentEmptyState,
} from '@/components/content-library'
import { fetchContent, bulkContentAction } from '@/api/content'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import type { ContentItem, ContentFilters, AssetItem } from '@/types/content'
import { toast } from 'sonner'

function parseFiltersFromSearchParams(searchParams: URLSearchParams): ContentFilters {
  const status = searchParams.getAll('status[]')
  const channel = searchParams.getAll('channel[]')
  const tags = searchParams.getAll('tags[]')
  const dateFrom = searchParams.get('from') ?? ''
  const dateTo = searchParams.get('to') ?? ''
  const query = searchParams.get('q') ?? ''
  return {
    status: status.length > 0 ? status : undefined,
    channel: channel.length > 0 ? channel : undefined,
    tags: tags.length > 0 ? tags : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    query: query.trim() || undefined,
  }
}

function applyClientFilters(
  items: ContentItem[],
  filters: ContentFilters
): ContentItem[] {
  let result = items ?? []
  if (!result.length) return result

  const statusList = Array.isArray(filters?.status) ? filters.status : []
  if (statusList.length > 0) {
    result = result.filter((item) => statusList.includes(item?.status ?? ''))
  }

  const channelList = Array.isArray(filters?.channel) ? filters.channel : []
  if (channelList.length > 0) {
    result = result.filter((item) =>
      channelList.some((c) => (item?.channel ?? '').toLowerCase() === c.toLowerCase())
    )
  }

  const tagList = Array.isArray(filters?.tags) ? filters.tags : []
  if (tagList.length > 0) {
    result = result.filter((item) => {
      const itemTags = Array.isArray(item?.tags) ? item.tags : []
      return tagList.some((t) => itemTags.includes(t))
    })
  }

  if (filters?.dateFrom) {
    result = result.filter((item) => {
      const d = item?.publishDate ?? item?.scheduledDate ?? item?.createdAt ?? ''
      return d >= filters.dateFrom!
    })
  }
  if (filters?.dateTo) {
    result = result.filter((item) => {
      const d = item?.publishDate ?? item?.scheduledDate ?? item?.createdAt ?? ''
      return d <= filters.dateTo!
    })
  }

  const q = (filters?.query ?? '').trim().toLowerCase()
  if (q) {
    result = result.filter(
      (item) =>
        (item?.title ?? '').toLowerCase().includes(q) ||
        (Array.isArray(item?.tags) && item.tags.some((t) => t?.toLowerCase().includes(q)))
    )
  }

  return result
}

export function ContentLibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  const [filters, setFilters] = useState<ContentFilters>(() =>
    parseFiltersFromSearchParams(searchParams)
  )
  const [items, setItems] = useState<ContentItem[]>([])
  const [, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBulkProcessing, setIsBulkProcessing] = useState(false)
  const [assetBrowserOpen, setAssetBrowserOpen] = useState(false)

  // Sync URL from filters
  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    const statusList = Array.isArray(filters?.status) ? filters.status : []
    const channelList = Array.isArray(filters?.channel) ? filters.channel : []
    const tagList = Array.isArray(filters?.tags) ? filters.tags : []

    next.delete('status[]')
    next.delete('channel[]')
    next.delete('tags[]')
    next.delete('from')
    next.delete('to')
    next.delete('q')

    statusList.forEach((s) => next.append('status[]', s))
    channelList.forEach((c) => next.append('channel[]', c))
    tagList.forEach((t) => next.append('tags[]', t))
    if (filters?.dateFrom) next.set('from', filters.dateFrom)
    if (filters?.dateTo) next.set('to', filters.dateTo)
    if (filters?.query?.trim()) next.set('q', filters.query.trim())

    setSearchParams(next, { replace: true })
  }, [filters, setSearchParams])


  // Sync query filter from debounced search
  useEffect(() => {
    setFilters((prev) => ({ ...prev, query: debouncedSearch || undefined }))
  }, [debouncedSearch])

  // Fetch content
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    fetchContent({
      filters: { ...filters, query: debouncedSearch || undefined },
      limit: 50,
      offset: 0,
    })
      .then((res) => {
        if (!cancelled) {
          const list = Array.isArray(res?.data) ? res.data : []
          const total = typeof res?.total === 'number' ? res.total : list.length
          setItems(list)
          setTotalCount(total)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems([])
          setTotalCount(0)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [
    filters.status?.join(','),
    filters.channel?.join(','),
    filters.tags?.join(','),
    filters.dateFrom,
    filters.dateTo,
    debouncedSearch,
  ])

  const filteredItems = useMemo(
    () => applyClientFilters(items, { ...filters, query: debouncedSearch || undefined }),
    [items, filters, debouncedSearch]
  )

  const availableTags = useMemo(() => {
    const set = new Set<string>()
    ;(items ?? []).forEach((item) => {
      ;(item?.tags ?? []).forEach((t) => t && set.add(t))
    })
    return Array.from(set)
  }, [items])

  const handleSelectChange = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (selected) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const handleBulkSchedule = useCallback(async () => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setIsBulkProcessing(true)
    try {
      const res = await bulkContentAction('schedule', ids)
      if (res.success) {
        toast.success(`Scheduled ${ids.length} item(s)`)
        setSelectedIds(new Set())
        setItems((prev) =>
          prev.map((item) =>
            ids.includes(item.id) ? { ...item, status: 'scheduled' as const } : item
          )
        )
      } else {
        toast.error('Failed to schedule')
      }
    } catch {
      toast.error('Failed to schedule')
    } finally {
      setIsBulkProcessing(false)
    }
  }, [selectedIds])

  const handleBulkPublish = useCallback(async () => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setIsBulkProcessing(true)
    try {
      const res = await bulkContentAction('publish', ids)
      if (res.success) {
        toast.success(`Published ${ids.length} item(s)`)
        setSelectedIds(new Set())
        setItems((prev) =>
          prev.map((item) =>
            ids.includes(item.id) ? { ...item, status: 'published' as const } : item
          )
        )
      } else {
        toast.error('Failed to publish')
      }
    } catch {
      toast.error('Failed to publish')
    } finally {
      setIsBulkProcessing(false)
    }
  }, [selectedIds])

  const handleBulkExport = useCallback(async () => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setIsBulkProcessing(true)
    try {
      const res = await bulkContentAction('export', ids)
      if (res.success) {
        const toExport = filteredItems.filter((item) => ids.includes(item.id))
        const blob = new Blob([JSON.stringify(toExport, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `content-export-${new Date().toISOString().slice(0, 10)}.json`
        a.click()
        URL.revokeObjectURL(url)
        toast.success(`Exported ${ids.length} item(s)`)
        setSelectedIds(new Set())
      } else {
        toast.error('Failed to export')
      }
    } catch {
      toast.error('Failed to export')
    } finally {
      setIsBulkProcessing(false)
    }
  }, [selectedIds, filteredItems])

  const handleBulkDelete = useCallback(async () => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setIsBulkProcessing(true)
    try {
      const res = await bulkContentAction('delete', ids)
      if (res.success) {
        toast.success(`Deleted ${ids.length} item(s)`)
        setSelectedIds(new Set())
        setItems((prev) => prev.filter((item) => !ids.includes(item.id)))
      } else {
        toast.error('Failed to delete')
      }
    } catch {
      toast.error('Failed to delete')
    } finally {
      setIsBulkProcessing(false)
    }
  }, [selectedIds])

  const handleSelectAsset = useCallback((asset: AssetItem) => {
    toast.success(`Asset "${asset?.name ?? 'Selected'}" ready to insert`)
    setAssetBrowserOpen(false)
  }, [])

  const safeItems = Array.isArray(filteredItems) ? filteredItems : []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Content Library</h1>
          <p className="mt-1 text-muted-foreground">
            Drafts, scheduled, and published content
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setAssetBrowserOpen(true)}
            aria-label="Open asset browser"
          >
            <ImageIcon className="h-5 w-5" />
            Assets
          </Button>
          <Link to="/dashboard/content/new">
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="h-5 w-5" />
              New Content
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <ContentLibraryFilters
          filters={filters}
          onFiltersChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
          availableTags={availableTags}
          searchValue={searchInput}
          onSearchChange={(v) => {
            setSearchInput(v)
            setFilters((prev) => ({ ...prev, query: v?.trim() || undefined }))
          }}
        />
      </div>

      {selectedIds.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.size}
          onDeselectAll={() => setSelectedIds(new Set())}
          onSchedule={handleBulkSchedule}
          onPublish={handleBulkPublish}
          onExport={handleBulkExport}
          onDelete={handleBulkDelete}
          isProcessing={isBulkProcessing}
        />
      )}

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      ) : safeItems.length === 0 ? (
        <ContentEmptyState
          title={items.length === 0 ? 'No content yet' : 'No matching content'}
          description={
            items.length === 0
              ? 'Create your first piece of content to get started. Use the editor with AI ideation and SEO assistance.'
              : 'Try adjusting your filters or search to find content.'
          }
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {safeItems.map((item) => (
            <ContentCard
              key={item?.id ?? ''}
              item={item}
              selected={selectedIds.has(item?.id ?? '')}
              onSelectChange={handleSelectChange}
            />
          ))}
        </div>
      )}

      <CreateContentFab />

      <AssetBrowser
        open={assetBrowserOpen}
        onOpenChange={setAssetBrowserOpen}
        onSelectAsset={handleSelectAsset}
      />
    </div>
  )
}
