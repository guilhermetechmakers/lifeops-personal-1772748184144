/**
 * AssetBrowser - Media assets grid with insert/reuse actions
 */

import { useState, useEffect } from 'react'
import { ImageIcon, Copy, Check } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { fetchAssets } from '@/api/content'
import type { AssetItem } from '@/types/content'

export interface AssetBrowserProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectAsset?: (asset: AssetItem) => void
  className?: string
}

function formatSize(bytes: number | undefined): string {
  if (typeof bytes !== 'number') return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AssetBrowser({
  open,
  onOpenChange,
  onSelectAsset,
  className,
}: AssetBrowserProps) {
  const [assets, setAssets] = useState<AssetItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setIsLoading(true)
    fetchAssets({ query: query.trim() || undefined })
      .then((res) => {
        if (!cancelled) {
          const list = Array.isArray(res?.data) ? res.data : []
          setAssets(list)
        }
      })
      .catch(() => {
        if (!cancelled) setAssets([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, query])

  const handleSelect = (asset: AssetItem) => {
    onSelectAsset?.(asset)
    onOpenChange(false)
  }

  const handleCopyUrl = async (asset: AssetItem) => {
    try {
      await navigator.clipboard.writeText(asset?.url ?? '')
      setCopiedId(asset?.id ?? null)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // ignore
    }
  }

  const safeAssets = Array.isArray(assets) ? assets : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn('flex flex-col w-full max-w-md sm:max-w-lg', className)}
      >
        <SheetHeader>
          <SheetTitle>Asset Browser</SheetTitle>
          <SheetDescription>
            Select an asset to insert into your content or copy its URL
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          <Input
            placeholder="Search assets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
            aria-label="Search assets"
          />
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : safeAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <ImageIcon className="h-8 w-8 text-muted-foreground" aria-hidden />
              </div>
              <p className="mt-4 font-medium">No assets found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload assets to reuse them in your content
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {safeAssets.map((asset) => (
                <div
                  key={asset?.id ?? ''}
                  className={cn(
                    'group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:shadow-card-hover hover:border-primary/50'
                  )}
                >
                  <div className="aspect-square bg-muted">
                    {asset?.thumbnail ?? asset?.url ? (
                      <img
                        src={asset.thumbnail ?? asset.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground/50" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="truncate text-sm font-medium" title={asset?.name ?? ''}>
                      {asset?.name ?? 'Untitled'}
                    </p>
                    {typeof asset?.size === 'number' && (
                      <p className="text-xs text-muted-foreground">
                        {formatSize(asset.size)}
                      </p>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex gap-1 p-2 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-t from-card to-transparent">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 h-8 text-xs"
                      onClick={() => handleSelect(asset)}
                    >
                      Insert
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleCopyUrl(asset)}
                      aria-label="Copy URL"
                    >
                      {copiedId === asset?.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
