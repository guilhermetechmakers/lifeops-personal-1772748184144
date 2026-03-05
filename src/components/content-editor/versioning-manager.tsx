/**
 * VersioningManager - Version history, compare, revert
 */

import { useState, useEffect } from 'react'
import { History, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { fetchVersions, createVersion } from '@/api/content'
import { useContentEditor } from '@/context/content-editor-context'
import type { PostVersion } from '@/types/content'

export function VersioningManager() {
  const { draft, loadDraft } = useContentEditor()
  const postId = draft?.id ?? ''
  const [versions, setVersions] = useState<PostVersion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (postId && open) {
      setLoading(true)
      fetchVersions(postId)
        .then((list) => setVersions(Array.isArray(list) ? list : []))
        .finally(() => setLoading(false))
    }
  }, [postId, open])

  const handleRevert = (v: PostVersion) => {
    loadDraft({
      ...draft,
      content: v.content,
      title: v.title,
    } as Parameters<typeof loadDraft>[0])
    setOpen(false)
  }

  const handleSaveVersion = async () => {
    if (!draft?.id) return
    await createVersion({
      post_id: draft.id,
      content: draft.content,
      title: draft.title,
    })
    const list = await fetchVersions(draft.id)
    setVersions(Array.isArray(list) ? list : [])
  }

  const safeVersions = Array.isArray(versions) ? versions : []

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <History className="h-4 w-4 mr-2" />
          Version history
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Version history</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleSaveVersion}
            disabled={!draft?.id}
          >
            Save current version
          </Button>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : safeVersions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No versions yet. Save to create one.
            </p>
          ) : (
            <ul className="space-y-2">
              {safeVersions
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                )
                .map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-input p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{v.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(v.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRevert(v)}
                      aria-label="Revert to this version"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
