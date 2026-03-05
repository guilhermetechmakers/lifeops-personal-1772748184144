/**
 * AssetManager - Images, thumbnails, alt text, validation
 */

import { useState, useEffect } from 'react'
import { ImageIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { fetchAssets } from '@/api/content'
import type { AssetItem } from '@/types/content'

export interface AssetManagerProps {
  onSelectAsset?: (asset: AssetItem) => void
}

export function AssetManager({ onSelectAsset }: AssetManagerProps) {
  const [assets, setAssets] = useState<AssetItem[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      fetchAssets({ limit: 24 })
        .then((res) => setAssets(res?.data ?? []))
        .catch(() => setAssets([]))
    }
  }, [open])

  const safeAssets = Array.isArray(assets) ? assets : []

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <ImageIcon className="h-4 w-4 mr-2" />
          Assets
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Asset manager</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-dashed border-input p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Upload images (JPEG, PNG, GIF, WebP, max 5MB)
            </p>
            <Button variant="outline" size="sm" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Upload (coming soon)
            </Button>
          </div>

          <div>
            <Label className="mb-2 block">Recent assets</Label>
            <div className="grid grid-cols-2 gap-2">
              {safeAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  className="flex flex-col items-center gap-1 rounded-xl border border-input p-2 hover:border-primary/50 hover:bg-accent/30 transition-colors"
                  onClick={() => {
                    onSelectAsset?.(asset)
                    setOpen(false)
                  }}
                >
                  {asset.thumbnail ? (
                    <img
                      src={asset.thumbnail}
                      alt={asset.alt ?? asset.name}
                      className="h-16 w-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="h-16 w-full flex items-center justify-center bg-muted rounded-lg">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-xs truncate w-full text-center">
                    {asset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
