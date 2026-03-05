/**
 * Content Editor Context - Shared state for Content Editor & SEO Assistant
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  ContentItem,
  PostDraft,
  SEOData,
  ContentMetrics,
  OutlineBlock,
} from '@/types/content'

const AUTOSAVE_KEY = 'lifeops-content-editor-draft'
const AUTOSAVE_INTERVAL_MS = 45_000

export interface ContentEditorState {
  draft: PostDraft | null
  outline: OutlineBlock[]
  aiIdeas: string[]
  isGenerating: boolean
  lastSaved: string | null
}

interface ContentEditorContextValue extends ContentEditorState {
  setTitle: (title: string) => void
  setContent: (content: string) => void
  setSeo: (seo: Partial<SEOData>) => void
  setMetrics: (metrics: Partial<ContentMetrics>) => void
  setOutline: (outline: OutlineBlock[] | ((prev: OutlineBlock[]) => OutlineBlock[])) => void
  setAiIdeas: (ideas: string[]) => void
  setIsGenerating: (v: boolean) => void
  insertContent: (text: string) => void
  loadDraft: (item: ContentItem | PostDraft | null) => void
  resetDraft: () => void
  getDraftForSave: () => PostDraft | null
}

const defaultDraft = (): PostDraft => ({
  id: '',
  title: '',
  content: '',
  status: 'draft',
  channel: 'blog',
  channel_ids: [],
  seo: {},
  tags: [],
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

const ContentEditorContext = createContext<ContentEditorContextValue | null>(null)

export function ContentEditorProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<PostDraft | null>(defaultDraft())
  const [outline, setOutline] = useState<OutlineBlock[]>([])
  const [aiIdeas, setAiIdeas] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  const setTitle = useCallback((title: string) => {
    setDraft((prev) =>
      prev ? { ...prev, title, updatedAt: new Date().toISOString() } : null
    )
  }, [])

  const setContent = useCallback((content: string) => {
    setDraft((prev) =>
      prev ? { ...prev, content, updatedAt: new Date().toISOString() } : null
    )
  }, [])

  const setSeo = useCallback((seo: Partial<SEOData>) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            seo: { ...(prev.seo ?? {}), ...seo },
            updatedAt: new Date().toISOString(),
          }
        : null
    )
  }, [])

  const setMetrics = useCallback((metrics: Partial<ContentMetrics>) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            metrics: { ...(prev.metrics ?? {}), ...metrics },
            updatedAt: new Date().toISOString(),
          }
        : null
    )
  }, [])

  const insertContent = useCallback((text: string) => {
    setDraft((prev) => {
      if (!prev) return null
      const next = prev.content + text
      return { ...prev, content: next, updatedAt: new Date().toISOString() }
    })
  }, [])

  const loadDraft = useCallback((item: ContentItem | PostDraft | null) => {
    if (!item) {
      setDraft(defaultDraft())
      setOutline([])
      setAiIdeas([])
      return
    }
    const content = item?.content ?? ''
    const seo = item?.seo ?? {}
    const channelIds = Array.isArray(item?.channel_ids) ? item.channel_ids : []
    setDraft({
      id: item?.id ?? '',
      title: item?.title ?? '',
      content,
      status: (item?.status as PostDraft['status']) ?? 'draft',
      channel: item?.channel ?? 'blog',
      channel_ids: channelIds,
      seo,
      metrics: item?.metrics ?? {},
      tags: Array.isArray(item?.tags) ? item.tags : [],
      version: item?.version ?? 1,
      version_id: item?.version_id ?? null,
      scheduled_at: item?.scheduled_at ?? item?.scheduledDate ?? null,
      createdAt: item?.createdAt ?? new Date().toISOString(),
      updatedAt: item?.updatedAt ?? new Date().toISOString(),
      author_id: item?.author_id,
    })
  }, [])

  const resetDraft = useCallback(() => {
    setDraft(defaultDraft())
    setOutline([])
    setAiIdeas([])
    setLastSaved(null)
  }, [])

  const getDraftForSave = useCallback(() => draft, [draft])

  // Autosave to localStorage
  useEffect(() => {
    if (!draft?.content && !draft?.title) return
    const timer = window.setTimeout(() => {
      try {
        const payload = JSON.stringify({
          draft,
          savedAt: new Date().toISOString(),
        })
        localStorage.setItem(AUTOSAVE_KEY, payload)
        setLastSaved(new Date().toISOString())
      } catch {
        // ignore
      }
    }, AUTOSAVE_INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [draft])

  const value = useMemo<ContentEditorContextValue>(
    () => ({
      draft,
      outline,
      aiIdeas,
      isGenerating,
      lastSaved,
      setTitle,
      setContent,
      setSeo,
      setMetrics,
      setOutline,
      setAiIdeas,
      setIsGenerating,
      insertContent,
      loadDraft,
      resetDraft,
      getDraftForSave,
    }),
    [
      draft,
      outline,
      aiIdeas,
      isGenerating,
      lastSaved,
      setTitle,
      setContent,
      setSeo,
      setMetrics,
      setOutline,
      setAiIdeas,
      setIsGenerating,
      insertContent,
      loadDraft,
      resetDraft,
      getDraftForSave,
    ]
  )

  return (
    <ContentEditorContext.Provider value={value}>
      {children}
    </ContentEditorContext.Provider>
  )
}

export function useContentEditor() {
  const ctx = useContext(ContentEditorContext)
  if (!ctx) {
    throw new Error('useContentEditor must be used within ContentEditorProvider')
  }
  return ctx
}
