/**
 * Content Editor & SEO Assistant - Type definitions
 * LifeOps Personal
 */

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export interface SEOData {
  keywords: string[]
  title: string
  description: string
  readabilityScore: number
  metaTags: string[]
}

export interface ContentMetrics {
  score: number
  completeness: number
  readability: number
  engagementPotential: number
}

export interface PostDraft {
  id: string
  title: string
  content: string
  status: PostStatus
  channel_ids: string[]
  scheduled_at: string | null
  seo: SEOData
  metrics: ContentMetrics
  version_id: string | null
  created_at: string
  updated_at: string
  author_id: string
}

export interface PostVersion {
  id: string
  post_id: string
  content: string
  title: string
  timestamp: string
  author_id: string
}

export type TemplateType = 'article' | 'social'

export interface SEOSnippets {
  keywords: string[]
  metaDescription: string
  titleTemplate: string
}

export interface ContentTemplate {
  id: string
  type: TemplateType
  name: string
  content: string
  seoSnippets: SEOSnippets
}

export interface Channel {
  id: string
  name: string
  platform: string
  icon: string
}

export interface ContentAsset {
  id: string
  post_id: string
  url: string
  alt: string
  width: number
  height: number
}

export interface OutlineBlock {
  id: string
  title: string
  content?: string
  order: number
}

export interface AIOutlineResult {
  outline: OutlineBlock[]
  headlines: string[]
}

export interface AIIdeasResult {
  ideas: string[]
  outline: OutlineBlock[]
}

export interface SEOSuggestionResult {
  keywords: string[]
  readabilityScore: number
  titleSuggestion: string
  metaSuggestion: string
  onPageChecks: {
    altTextCoverage: number
    internalLinks: number
    externalLinks: number
    imageOptimizationHints: string[]
  }
}

export interface ContentScoreResult {
  completeness: number
  relevance: number
  readability: number
  engagementPotential: number
  overall: number
  recommendations: string[]
}
