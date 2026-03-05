/**
 * Type definitions for About / Help page.
 * API-ready for future backend integration.
 */

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  updatedAt: string
  thumbnailUrl?: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  relatedArticles?: string[]
}

export interface GuideStep {
  id: string
  text: string
  done?: boolean
}

export interface Guide {
  id: string
  title: string
  module: string
  steps: GuideStep[]
}

export type StatusValue = 'operational' | 'degraded' | 'down'

export interface StatusItem {
  id: string
  service: string
  status: StatusValue
  updatedAt: string
  message?: string
}

export interface SupportAttachment {
  name: string
  size: number
  type: string
}

export interface SupportFormData {
  name: string
  email: string
  subject: string
  message: string
  module?: string
  priority?: string
  attachments?: File[]
  context?: Record<string, string>
}
