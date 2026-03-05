/**
 * Content Library - Type definitions
 * LifeOps Personal
 */

export type ContentStatus = 'draft' | 'scheduled' | 'published'

export interface ContentItem {
  id: string
  title: string
  status: ContentStatus
  channel: string
  publishDate?: string
  scheduledDate?: string
  thumbnailUrl?: string
  wordCount?: number
  seoScore?: number
  tags?: string[]
  version?: number
  createdAt?: string
  updatedAt?: string
}

export interface AssetItem {
  id: string
  name: string
  url: string
  thumbnail?: string
  type: string
  size?: number
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
