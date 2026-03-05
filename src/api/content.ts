/**
 * Content API - LifeOps Personal
 * Content Library, CRUD, publish, schedule, bulk actions, assets
 * Content Editor: posts, versions, templates, channels
 */

import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api'
import type {
  ContentItem,
  AssetItem,
  ContentFilters,
  ContentListResponse,
  AssetListResponse,
  BulkActionType,
  ContentTemplate,
  Channel,
  PostVersion,
} from '@/types/content'

/** Mock content for development when API is not connected */
function getMockContent(): ContentItem[] {
  const now = new Date()
  const iso = (days: number) =>
    new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()
  const date = (days: number) => iso(days).slice(0, 10)
  const past = iso(-7).slice(0, 10)
  const future = date(10)

  return [
    {
      id: '1',
      title: 'Blog: Getting Started with AI',
      status: 'published',
      channel: 'blog',
      publishDate: past,
      thumbnailUrl: undefined,
      wordCount: 1200,
      seoScore: 85,
      tags: ['ai', 'productivity'],
      version: 2,
      createdAt: iso(-14),
      updatedAt: iso(-1),
    },
    {
      id: '2',
      title: 'LinkedIn Post: Q1 Wins',
      status: 'scheduled',
      channel: 'linkedin',
      scheduledDate: future,
      thumbnailUrl: undefined,
      wordCount: 280,
      seoScore: 72,
      tags: ['linkedin', 'quarterly'],
      version: 1,
      createdAt: iso(-3),
      updatedAt: iso(0),
    },
    {
      id: '3',
      title: 'Twitter Thread: Productivity Tips',
      status: 'draft',
      channel: 'twitter',
      wordCount: 0,
      seoScore: 0,
      tags: ['tips', 'productivity'],
      version: 1,
      createdAt: iso(-1),
      updatedAt: iso(0),
    },
    {
      id: '4',
      title: 'Newsletter: March Edition',
      status: 'draft',
      channel: 'newsletter',
      wordCount: 450,
      seoScore: 68,
      tags: ['newsletter', 'monthly'],
      version: 1,
      createdAt: iso(-5),
      updatedAt: iso(-2),
    },
    {
      id: '5',
      title: 'YouTube Script: Intro to LifeOps',
      status: 'published',
      channel: 'youtube',
      publishDate: iso(-30).slice(0, 10),
      wordCount: 2100,
      seoScore: 90,
      tags: ['video', 'intro'],
      version: 3,
      createdAt: iso(-45),
      updatedAt: iso(-30),
    },
  ]
}

/** Mock assets for development */
function getMockAssets(): AssetItem[] {
  return [
    {
      id: 'a1',
      name: 'hero-banner.png',
      url: 'https://placehold.co/800x400/FFD400/0B0F14?text=Hero',
      thumbnail: 'https://placehold.co/200x100/FFD400/0B0F14?text=Hero',
      type: 'image',
      size: 125000,
    },
    {
      id: 'a2',
      name: 'chart-placeholder.svg',
      url: 'https://placehold.co/400x300/FFD400/0B0F14?text=Chart',
      thumbnail: 'https://placehold.co/200x150/FFD400/0B0F14?text=Chart',
      type: 'image',
      size: 8200,
    },
    {
      id: 'a3',
      name: 'profile-avatar.jpg',
      url: 'https://placehold.co/200x200/FFD400/0B0F14?text=Avatar',
      thumbnail: 'https://placehold.co/100x100/FFD400/0B0F14?text=Avatar',
      type: 'image',
      size: 45000,
    },
  ]
}

/** Build query string from filters */
function buildContentQuery(params: {
  filters?: ContentFilters
  limit?: number
  offset?: number
}): string {
  const { filters, limit = 24, offset = 0 } = params ?? {}
  const search = new URLSearchParams()
  search.set('limit', String(limit))
  search.set('offset', String(offset))
  if (filters?.status?.length) {
    filters.status.forEach((s) => search.append('status[]', s))
  }
  if (filters?.channel?.length) {
    filters.channel.forEach((c) => search.append('channel[]', c))
  }
  if (filters?.tags?.length) {
    filters.tags.forEach((t) => search.append('tags[]', t))
  }
  if (filters?.dateFrom) search.set('from', filters.dateFrom)
  if (filters?.dateTo) search.set('to', filters.dateTo)
  if (filters?.query?.trim()) search.set('q', filters.query.trim())
  return search.toString()
}

/** Fetch content list with filters. Returns empty array on null. */
export async function fetchContent(params?: {
  filters?: ContentFilters
  limit?: number
  offset?: number
}): Promise<{ data: ContentItem[]; total: number }> {
  try {
    const query = buildContentQuery(params ?? {})
    const path = query ? `/content?${query}` : '/content'
    const res = await apiGet<ContentListResponse>(path)
    const list = Array.isArray(res?.data) ? res.data : []
    const total = typeof res?.total === 'number' ? res.total : list.length
    if (list.length > 0) return { data: list, total }
    const mock = getMockContent()
    return { data: mock, total: mock.length }
  } catch {
    const mock = getMockContent()
    return { data: mock, total: mock.length }
  }
}

/** Get content by ID */
export async function getContent(id: string): Promise<ContentItem | null> {
  try {
    const res = await apiGet<{ data: ContentItem }>(`/content/${id}`)
    return res?.data ?? null
  } catch {
    const mock = getMockContent().find((c) => c.id === id)
    return mock ?? null
  }
}

/** Create content */
export async function createContent(
  data: Partial<ContentItem> & { draft?: boolean }
): Promise<ContentItem | null> {
  try {
    const res = await apiPost<{ data: ContentItem }>('/content', data)
    return res?.data ?? null
  } catch {
    const mock: ContentItem = {
      id: `new-${Date.now()}`,
      title: data?.title ?? 'Untitled',
      content: data?.content ?? '',
      status: 'draft',
      channel: data?.channel ?? 'blog',
      channel_ids: Array.isArray(data?.channel_ids) ? data.channel_ids : [],
      scheduled_at: data?.scheduled_at ?? null,
      seo: data?.seo ?? {},
      tags: Array.isArray(data?.tags) ? data.tags : [],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    }
    return mock
  }
}

/** Update content */
export async function updateContent(
  id: string,
  data: Partial<ContentItem>
): Promise<ContentItem | null> {
  try {
    const res = await apiPut<{ data: ContentItem }>(`/content/${id}`, data)
    return res?.data ?? null
  } catch {
    const mock = getMockContent().find((c) => c.id === id)
    return mock ? { ...mock, ...data } : null
  }
}

/** Publish content now */
export async function publishContent(id: string): Promise<ContentItem | null> {
  try {
    const res = await apiPost<{ data: ContentItem }>(`/content/${id}/publish`)
    return res?.data ?? null
  } catch {
    const mock = getMockContent().find((c) => c.id === id)
    return mock ? { ...mock, status: 'published' as const } : null
  }
}

/** Schedule content */
export async function scheduleContent(
  id: string,
  payload: { date: string; channel?: string }
): Promise<ContentItem | null> {
  try {
    const res = await apiPost<{ data: ContentItem }>('/content/${id}/schedule', payload)
    return res?.data ?? null
  } catch {
    const mock = getMockContent().find((c) => c.id === id)
    return mock ? { ...mock, status: 'scheduled' as const, scheduledDate: payload.date } : null
  }
}

/** Bulk actions */
export async function bulkContentAction(
  action: BulkActionType,
  ids: string[]
): Promise<{ success: boolean; results: unknown[] }> {
  try {
    const res = await apiPost<{ success: boolean; results: unknown[] }>('/content/bulk', {
      action,
      ids,
    })
    return {
      success: res?.success ?? true,
      results: Array.isArray(res?.results) ? res.results : [],
    }
  } catch {
    return { success: true, results: ids.map(() => ({})) }
  }
}

/** Fetch assets */
export async function fetchAssets(params?: {
  type?: string
  tag?: string
  query?: string
  limit?: number
  offset?: number
}): Promise<{ data: AssetItem[]; total: number }> {
  try {
    const search = new URLSearchParams()
    if (params?.type) search.set('type', params.type)
    if (params?.tag) search.set('tag', params.tag)
    if (params?.query) search.set('query', params.query)
    search.set('limit', String(params?.limit ?? 24))
    search.set('offset', String(params?.offset ?? 0))
    const query = search.toString()
    const path = query ? `/assets?${query}` : '/assets'
    const res = await apiGet<AssetListResponse>(path)
    const list = Array.isArray(res?.data) ? res.data : []
    const total = typeof res?.total === 'number' ? res.total : list.length
    if (list.length > 0) return { data: list, total }
    const mock = getMockAssets()
    return { data: mock, total: mock.length }
  } catch {
    const mock = getMockAssets()
    return { data: mock, total: mock.length }
  }
}

/** Get asset by ID */
export async function getAsset(id: string): Promise<AssetItem | null> {
  try {
    const res = await apiGet<{ data: AssetItem }>(`/assets/${id}`)
    return res?.data ?? null
  } catch {
    return getMockAssets().find((a) => a.id === id) ?? null
  }
}

/** Fetch content templates */
export async function fetchTemplates(): Promise<ContentTemplate[]> {
  try {
    const res = await apiGet<{ data: ContentTemplate[] }>('/templates')
    const list = Array.isArray(res?.data) ? res.data : []
    if (list.length > 0) return list
    return getMockTemplates()
  } catch {
    return getMockTemplates()
  }
}

/** Get template by ID */
export async function getTemplate(id: string): Promise<ContentTemplate | null> {
  try {
    const res = await apiGet<{ data: ContentTemplate }>(`/templates/${id}`)
    return res?.data ?? null
  } catch {
    return getMockTemplates().find((t) => t.id === id) ?? null
  }
}

/** Fetch publish channels */
export async function fetchChannels(): Promise<Channel[]> {
  try {
    const res = await apiGet<{ data: Channel[] }>('/channels')
    const list = Array.isArray(res?.data) ? res.data : []
    if (list.length > 0) return list
    return getMockChannels()
  } catch {
    return getMockChannels()
  }
}

/** Fetch version history for a post */
export async function fetchVersions(postId: string): Promise<PostVersion[]> {
  try {
    const res = await apiGet<{ data: PostVersion[] }>(`/versions/${postId}`)
    return Array.isArray(res?.data) ? res.data : []
  } catch {
    return []
  }
}

/** Create version */
export async function createVersion(payload: {
  post_id: string
  content: string
  title: string
}): Promise<PostVersion | null> {
  try {
    const res = await apiPost<{ data: PostVersion }>('/versions', payload)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** PATCH /content/{id} - update content, status, schedule */
export async function patchPost(
  id: string,
  data: Partial<{
    title: string
    content: string
    scheduled_at: string | null
    status: ContentItem['status']
    seo: ContentItem['seo']
    channel_ids: string[]
  }>
): Promise<ContentItem | null> {
  try {
    const res = await apiPatch<{ data: ContentItem }>(`/content/${id}`, data)
    return res?.data ?? null
  } catch {
    const mock = getMockContent().find((c) => c.id === id)
    return mock ? { ...mock, ...data } : null
  }
}

/** POST /content/{id}/publish */
export async function publishPost(
  id: string,
  channelIds?: string[]
): Promise<ContentItem | null> {
  try {
    const res = await apiPost<{ data: ContentItem }>(`/content/${id}/publish`, {
      channel_ids: channelIds,
    })
    return res?.data ?? null
  } catch {
    const mock = getMockContent().find((c) => c.id === id)
    return mock ? { ...mock, status: 'published' as const } : null
  }
}

/** Mock templates */
function getMockTemplates(): ContentTemplate[] {
  return [
    {
      id: 't1',
      type: 'article',
      name: 'Blog Post',
      content: '## Introduction\n\n{{intro}}\n\n## Main Content\n\n{{body}}\n\n## Conclusion\n\n{{conclusion}}',
      seoSnippets: {
        keywords: ['blog', 'content'],
        metaDescription: 'A compelling blog post about {{topic}}.',
        titleTemplate: '{{topic}} - {{brand}}',
      },
    },
    {
      id: 't2',
      type: 'social',
      name: 'LinkedIn Post',
      content: '{{hook}}\n\n{{body}}\n\n{{cta}}',
      seoSnippets: {
        keywords: ['linkedin', 'professional'],
        metaDescription: 'A professional LinkedIn post.',
        titleTemplate: 'LinkedIn: {{topic}}',
      },
    },
    {
      id: 't3',
      type: 'social',
      name: 'Twitter/X Thread',
      content: '{{tweet1}}\n\n{{tweet2}}\n\n{{tweet3}}',
      seoSnippets: {
        keywords: ['twitter', 'thread'],
        metaDescription: 'A Twitter thread.',
        titleTemplate: 'Thread: {{topic}}',
      },
    },
  ]
}

/** Mock channels */
function getMockChannels(): Channel[] {
  return [
    { id: 'ch1', name: 'Blog', platform: 'blog', icon: 'FileText' },
    { id: 'ch2', name: 'Twitter/X', platform: 'twitter', icon: 'Twitter' },
    { id: 'ch3', name: 'LinkedIn', platform: 'linkedin', icon: 'Linkedin' },
    { id: 'ch4', name: 'Facebook', platform: 'facebook', icon: 'Facebook' },
    { id: 'ch5', name: 'Instagram', platform: 'instagram', icon: 'Instagram' },
  ]
}
