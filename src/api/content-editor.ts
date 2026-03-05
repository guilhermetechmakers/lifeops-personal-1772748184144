/**
 * Content Editor API - Posts, templates, channels, versions
 * LifeOps Personal - Ready for Supabase/Edge Function integration
 */

import { apiGet, apiPost, apiPatch } from '@/lib/api'
import type {
  PostDraft,
  PostVersion,
  ContentTemplate,
  Channel,
  SEOData,
  ContentMetrics,
} from '@/types/content-editor'

const defaultSEO: SEOData = {
  keywords: [],
  title: '',
  description: '',
  readabilityScore: 0,
  metaTags: [],
}

const defaultMetrics: ContentMetrics = {
  score: 0,
  completeness: 0,
  readability: 0,
  engagementPotential: 0,
}

/** Mock channels for development */
const MOCK_CHANNELS: Channel[] = [
  { id: 'ch-blog', name: 'Blog', platform: 'blog', icon: 'FileText' },
  { id: 'ch-twitter', name: 'Twitter/X', platform: 'twitter', icon: 'Twitter' },
  { id: 'ch-linkedin', name: 'LinkedIn', platform: 'linkedin', icon: 'Linkedin' },
  { id: 'ch-facebook', name: 'Facebook', platform: 'facebook', icon: 'Facebook' },
  { id: 'ch-instagram', name: 'Instagram', platform: 'instagram', icon: 'Instagram' },
]

/** Mock templates for development */
const MOCK_TEMPLATES: ContentTemplate[] = [
  {
    id: 'tpl-article-1',
    type: 'article',
    name: 'How-to Guide',
    content: '# {{title}}\n\n## Introduction\n\n[Write your introduction here...]\n\n## Main Content\n\n### Step 1\n\n[First step...]\n\n### Step 2\n\n[Second step...]\n\n### Step 3\n\n[Third step...]\n\n## Conclusion\n\n[Wrap up your guide...]',
    seoSnippets: {
      keywords: ['how to', 'guide', 'tutorial'],
      metaDescription: 'A comprehensive guide to {{topic}}.',
      titleTemplate: 'How to {{topic}}: Complete Guide',
    },
  },
  {
    id: 'tpl-social-1',
    type: 'social',
    name: 'LinkedIn Post',
    content: '{{hook}}\n\n{{body}}\n\n{{cta}}',
    seoSnippets: {
      keywords: [],
      metaDescription: '',
      titleTemplate: '',
    },
  },
]

/** GET /posts?status=&channel=&tag= */
export async function fetchPosts(params?: {
  status?: string
  channel?: string
  tag?: string
  limit?: number
  offset?: number
}): Promise<{ data: PostDraft[]; total: number }> {
  try {
    const search = new URLSearchParams()
    if (params?.status) search.set('status', params.status)
    if (params?.channel) search.set('channel', params.channel)
    if (params?.tag) search.set('tag', params.tag)
    search.set('limit', String(params?.limit ?? 50))
    search.set('offset', String(params?.offset ?? 0))
    const query = search.toString()
    const path = query ? `/posts?${query}` : '/posts'
    const res = await apiGet<{ data: PostDraft[]; total: number }>(path)
    const list = Array.isArray(res?.data) ? res.data : []
    const total = typeof res?.total === 'number' ? res.total : list.length
    return { data: list, total }
  } catch {
    return { data: [], total: 0 }
  }
}

/** POST /posts - create draft */
export async function createPost(data: {
  title: string
  content: string
  channel_ids?: string[]
  scheduled_at?: string | null
  seo?: Partial<SEOData>
}): Promise<PostDraft | null> {
  try {
    const res = await apiPost<{ data: PostDraft }>('/posts', {
      ...data,
      seo: { ...defaultSEO, ...data.seo },
    })
    return res?.data ?? null
  } catch {
    const now = new Date().toISOString()
    return {
      id: `post-${Date.now()}`,
      title: data.title || 'Untitled',
      content: data.content || '',
      status: 'draft',
      channel_ids: data.channel_ids ?? [],
      scheduled_at: data.scheduled_at ?? null,
      seo: { ...defaultSEO, ...data.seo },
      metrics: defaultMetrics,
      version_id: null,
      created_at: now,
      updated_at: now,
      author_id: 'local',
    }
  }
}

/** PATCH /posts/{id} */
export async function updatePost(
  id: string,
  data: Partial<{
    title: string
    content: string
    scheduled_at: string | null
    status: PostDraft['status']
    seo: SEOData
    channel_ids: string[]
  }>
): Promise<PostDraft | null> {
  try {
    const res = await apiPatch<{ data: PostDraft }>(`/posts/${id}`, data)
    return res?.data ?? null
  } catch {
    return null
  }
}

/** POST /posts/{id}/publish */
export async function publishPost(
  id: string,
  channelIds?: string[]
): Promise<PostDraft | null> {
  try {
    const res = await apiPost<{ data: PostDraft }>(`/posts/${id}/publish`, {
      channel_ids: channelIds,
    })
    return res?.data ?? null
  } catch {
    return null
  }
}

/** GET /templates */
export async function fetchTemplates(): Promise<ContentTemplate[]> {
  try {
    const res = await apiGet<{ data: ContentTemplate[] }>('/templates')
    return Array.isArray(res?.data) ? res.data : []
  } catch {
    return MOCK_TEMPLATES
  }
}

/** GET /templates/{id} */
export async function getTemplate(id: string): Promise<ContentTemplate | null> {
  try {
    const res = await apiGet<{ data: ContentTemplate }>(`/templates/${id}`)
    return res?.data ?? null
  } catch {
    return MOCK_TEMPLATES.find((t) => t.id === id) ?? null
  }
}

/** GET /channels */
export async function fetchChannels(): Promise<Channel[]> {
  try {
    const res = await apiGet<{ data: Channel[] }>('/channels')
    return Array.isArray(res?.data) ? res.data : []
  } catch {
    return MOCK_CHANNELS
  }
}

/** GET /versions/{post_id} */
export async function fetchVersions(postId: string): Promise<PostVersion[]> {
  try {
    const res = await apiGet<{ data: PostVersion[] }>(`/versions/${postId}`)
    return Array.isArray(res?.data) ? res.data : []
  } catch {
    return []
  }
}

/** POST /versions */
export async function createVersion(data: {
  post_id: string
  content: string
  title: string
}): Promise<PostVersion | null> {
  try {
    const res = await apiPost<{ data: PostVersion }>('/versions', data)
    return res?.data ?? null
  } catch {
    return {
      id: `ver-${Date.now()}`,
      post_id: data.post_id,
      content: data.content,
      title: data.title,
      timestamp: new Date().toISOString(),
      author_id: 'local',
    }
  }
}
