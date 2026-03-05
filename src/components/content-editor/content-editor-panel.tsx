/**
 * ContentEditorPanel - Rich text editor with outline, version history, AI suggestions
 */

import { useCallback, useEffect, useState } from 'react'
import { GripVertical } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from './rich-text-editor'
import { useContentEditor } from '@/context/content-editor-context'
import { cn } from '@/lib/utils'

export interface ContentEditorPanelProps {
  onOutlineReorder?: (outline: { id: string; title: string; order: number }[]) => void
  className?: string
}

export function ContentEditorPanel({ onOutlineReorder, className }: ContentEditorPanelProps) {
  const {
    draft,
    outline,
    setTitle,
    setContent,
    setOutline,
    insertContent,
    aiIdeas,
    lastSaved,
  } = useContentEditor()

  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg')
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const title = draft?.title ?? ''
  const content = draft?.content ?? ''
  const safeOutline = Array.isArray(outline) ? outline : []

  useEffect(() => {
    onOutlineReorder?.(safeOutline.map((o) => ({ id: o.id, title: o.title, order: o.order })))
  }, [safeOutline, onOutlineReorder])

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (targetId: string) => {
      if (!draggedId || draggedId === targetId) return
      setOutline((prev) => {
        const items = [...prev]
        const fromIdx = items.findIndex((o) => o.id === draggedId)
        const toIdx = items.findIndex((o) => o.id === targetId)
        if (fromIdx < 0 || toIdx < 0) return prev
        const [removed] = items.splice(fromIdx, 1)
        items.splice(toIdx, 0, removed)
        return items.map((o, i) => ({ ...o, order: i }))
      })
      setDraggedId(null)
    },
    [draggedId, setOutline]
  )

  const handleInsertOutline = useCallback(
    (block: { id: string; title: string; content?: string }) => {
      insertContent(`\n\n## ${block.title}\n\n${block.content ?? ''}\n\n`)
    },
    [insertContent]
  )

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Title</CardTitle>
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Saved {new Date(lastSaved).toLocaleTimeString()}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Content title (6-120 characters)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
            maxLength={120}
          />
        </CardContent>
      </Card>

      {safeOutline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Outline</CardTitle>
            <p className="text-sm text-muted-foreground">
              Drag to reorder • Click to insert
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {safeOutline
                .sort((a, b) => a.order - b.order)
                .map((block) => (
                  <li
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(block.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(block.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border border-input bg-card p-3 transition-all',
                      draggedId === block.id && 'opacity-50',
                      'hover:border-primary/50 hover:shadow-sm cursor-grab active:cursor-grabbing'
                    )}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                    <button
                      type="button"
                      className="flex-1 text-left text-sm font-medium hover:text-primary"
                      onClick={() => handleInsertOutline(block)}
                    >
                      {block.title}
                    </button>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Rich text editor with formatting, lists, and AI suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={content}
            onChange={setContent}
            mode={editorMode}
            onModeChange={setEditorMode}
            suggestionChips={aiIdeas}
            onInsertSuggestion={insertContent}
            minHeight="320px"
          />
        </CardContent>
      </Card>
    </div>
  )
}

