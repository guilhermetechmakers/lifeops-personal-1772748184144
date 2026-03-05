/**
 * RichTextEditor - WYSIWYG/Markdown editor with toolbar
 * Supports formatting, lists, headings, links, images
 */

import * as React from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Link,
  Image,
  Code,
  Undo,
  Redo,
  Type,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  mode?: 'wysiwyg' | 'markdown'
  onModeChange?: (mode: 'wysiwyg' | 'markdown') => void
  suggestionChips?: string[]
  onInsertSuggestion?: (text: string) => void
  className?: string
}

const toolbarButtons: Array<{
  cmd: string
  value?: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}> = [
  { cmd: 'bold', icon: Bold, label: 'Bold' },
  { cmd: 'italic', icon: Italic, label: 'Italic' },
  { cmd: 'insertUnorderedList', icon: List, label: 'Bullet list' },
  { cmd: 'insertOrderedList', icon: ListOrdered, label: 'Numbered list' },
  { cmd: 'formatBlock', value: 'h2', icon: Heading2, label: 'Heading' },
  { cmd: 'createLink', icon: Link, label: 'Link' },
  { cmd: 'insertImage', icon: Image, label: 'Image' },
  { cmd: 'formatBlock', value: 'pre', icon: Code, label: 'Code block' },
]

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content...',
  minHeight = '320px',
  mode = 'wysiwyg',
  onModeChange,
  suggestionChips = [],
  onInsertSuggestion,
  className,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const lastExternalValue = React.useRef(value)
  const [history, setHistory] = React.useState<string[]>([value])
  const [historyIndex, setHistoryIndex] = React.useState(0)

  React.useEffect(() => {
    if (editorRef.current && value !== lastExternalValue.current) {
      lastExternalValue.current = value
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const execCmd = React.useCallback(
    (cmd: string, value?: string) => {
      if (mode !== 'wysiwyg') return
      document.execCommand(cmd, false, value ?? '')
      editorRef.current?.focus()
    },
    [mode]
  )

  const handleInput = React.useCallback(() => {
    const html = editorRef.current?.innerHTML ?? ''
    lastExternalValue.current = html
    onChange(html)
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1)
      next.push(html)
      if (next.length > 50) next.shift()
      else setHistoryIndex(next.length - 1)
      return next
    })
  }, [onChange, historyIndex])

  const handleUndo = React.useCallback(() => {
    if (historyIndex <= 0) return
    const prev = history[historyIndex - 1]
    setHistoryIndex(historyIndex - 1)
    onChange(prev)
    if (editorRef.current) {
      editorRef.current.innerHTML = prev
    }
  }, [history, historyIndex, onChange])

  const handleRedo = React.useCallback(() => {
    if (historyIndex >= history.length - 1) return
    const next = history[historyIndex + 1]
    setHistoryIndex(historyIndex + 1)
    onChange(next)
    if (editorRef.current) {
      editorRef.current.innerHTML = next
    }
  }, [history, historyIndex, onChange])

  const handleLink = React.useCallback(() => {
    const url = window.prompt('Enter URL:')
    if (url) execCmd('createLink', url)
  }, [execCmd])

  const handleImage = React.useCallback(() => {
    const url = window.prompt('Enter image URL:')
    if (url) execCmd('insertImage', url)
  }, [execCmd])

  const safeChips = Array.isArray(suggestionChips) ? suggestionChips : []

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-input bg-muted/50 px-2 py-1.5">
        {onModeChange && (
          <Tabs value={mode} onValueChange={(v) => onModeChange(v as 'wysiwyg' | 'markdown')}>
            <TabsList className="h-8">
              <TabsTrigger value="wysiwyg" className="text-xs">
                <Type className="h-3.5 w-3 mr-1" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="markdown" className="text-xs">
                Markdown
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        <div className="h-4 w-px bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleUndo}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleRedo}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        {toolbarButtons.map((btn) => {
          const v = 'value' in btn ? btn.value : undefined
          const { cmd, icon: Icon, label } = btn
          return (
            <Button
              key={cmd + (v ?? '')}
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                cmd === 'createLink'
                  ? handleLink()
                  : cmd === 'insertImage'
                    ? handleImage()
                    : execCmd(cmd, v)
              }
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}
      </div>

      {mode === 'wysiwyg' ? (
        <div
          ref={editorRef}
          contentEditable
          className={cn(
            'min-w-0 rounded-b-xl border border-input bg-card px-4 py-3 text-sm prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground'
          )}
          data-placeholder={placeholder}
          style={{ minHeight }}
          suppressContentEditableWarning
          onInput={handleInput}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="rounded-b-xl rounded-t-none font-mono text-sm"
          style={{ minHeight }}
        />
      )}

      {safeChips.length > 0 && onInsertSuggestion && (
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-xs text-muted-foreground self-center">Insert:</span>
          {safeChips.slice(0, 5).map((chip, i) => (
            <button
              key={i}
              type="button"
              className="rounded-lg border border-primary/50 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 hover:scale-[1.02]"
              onClick={() => onInsertSuggestion(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
