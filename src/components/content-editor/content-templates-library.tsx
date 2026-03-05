/**
 * ContentTemplatesLibrary - Prebuilt templates, SEO snippets, apply to editor
 */

import { useState, useEffect } from 'react'
import { FileText, Share2, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { fetchTemplates } from '@/api/content'
import { useContentEditor } from '@/context/content-editor-context'
import type { ContentTemplate } from '@/types/content'

export function ContentTemplatesLibrary() {
  const [templates, setTemplates] = useState<ContentTemplate[]>([])
  const [open, setOpen] = useState(false)
  const { loadDraft, draft } = useContentEditor()

  useEffect(() => {
    fetchTemplates().then((list) => setTemplates(Array.isArray(list) ? list : []))
  }, [])

  const handleApply = (t: ContentTemplate) => {
    const base = draft ?? {
      id: '',
      title: '',
      content: '',
      status: 'draft' as const,
      channel: 'blog',
      channel_ids: [],
      seo: {},
      tags: [],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    loadDraft({
      ...base,
      content: t.content,
      seo: {
        ...base.seo,
        keywords: t.seoSnippets?.keywords ?? [],
        description: t.seoSnippets?.metaDescription ?? '',
        title: t.seoSnippets?.titleTemplate ?? '',
      },
    })
    setOpen(false)
  }

  const safeTemplates = Array.isArray(templates) ? templates : []

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <FileText className="h-4 w-4 mr-2" />
          Templates
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Templates</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {safeTemplates.map((t) => (
            <Card key={t.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {t.type === 'article' ? (
                    <FileText className="h-5 w-5 text-primary" />
                  ) : (
                    <Share2 className="h-5 w-5 text-primary" />
                  )}
                  <CardTitle className="text-base">{t.name}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground capitalize">{t.type}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap line-clamp-4 bg-muted/50 p-2 rounded-lg">
                  {t.content}
                </pre>
                {t.seoSnippets && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                    SEO snippets included
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleApply(t)}
                >
                  Apply to editor
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
