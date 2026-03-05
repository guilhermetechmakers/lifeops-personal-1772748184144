/**
 * Content Library - Type definitions
 * LifeOps Personal
 */

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export interface SEOData {
  keywords?: string[]
  title?: string
  description?: string
  readabilityScore?: number
  metaTags?: string[]
}

export interface ContentMetrics {
  score?: number
  completeness?: number
  readability?: number
  engagementPotential?: number
}

export interface ContentItem {
  id: string
  title: string
  status: ContentStatus
  channel: string
  channel_ids?: string[]
  content?: string
  publishDate?: string
  scheduledDate?: string
  scheduled_at?: string | null
  thumbnailUrl?: string
  wordCount?: number
  seoScore?: number
  seo?: SEOData
  metrics?: ContentMetrics
  version_id?: string | null
  version?: number
  tags?: string[]
  createdAt?: string
  updatedAt?: string
  author_id?: string
}

export interface PostDraft extends ContentItem {
  content: string
  seo: SEOData
  channel_ids: string[]
}

export interface PostVersion {
  id: string
  post_id: string
  content: string
  title: string
  timestamp: string
  author_id?: string
}

export interface TemplateSEOSnippets {
  keywords?: string[]
  metaDescription?: string
  titleTemplate?: string
}

export interface ContentTemplate {
  id: string
  type: 'article' | 'social'
  name: string
  content: string
  seoSnippets?: TemplateSEOSnippets
}

export interface Channel {
  id: string
  name: string
  platform: string
  icon?: string
}

export interface AssetItem {
  id: string
  name: string
  url: string
  thumbnail?: string
  type: string
  size?: number
  post_id?: string
  alt?: string
  width?: number
  height?: number
}

export interface ContentFilters {
  status?: string[]
  channel?: string[]
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  query?: string
}

export interface ContentListResponse {
  data: ContentItem[]
  total: number
}

export interface AssetListResponse {
  data: AssetItem[]
  total: number
}

export type BulkActionType = 'publish' | 'schedule' | 'export' | 'delete'

/** AI idea/outline context for generation */
export interface AIOutlineContext {
  topic?: string
  persona?: string
  audience?: string
  tone?: string
}

/** AI-generated outline block */
export interface OutlineBlock {
  id: string
  title: string
  content?: string
  order: number
}

/** SEO suggestion chip */
export interface SEOSuggestion {
  id: string
  text: string
  type: 'keyword' | 'title' | 'meta' | 'readability' | 'alt' | 'link'
}
