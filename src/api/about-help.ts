/**
 * API stubs for About / Help page.
 * Replace with real fetch calls when backend is connected.
 *
 * Placeholder endpoints:
 * - GET /docs/articles?search=&category=
 * - GET /docs/faqs?category=
 * - GET /docs/guides
 * - POST /support/contact
 * - GET /status
 */

import type { Article, FAQ, Guide, StatusItem, SupportFormData } from '@/types/about-help'
import {
  MOCK_ARTICLES,
  MOCK_FAQS,
  MOCK_GUIDES,
  MOCK_STATUS,
} from '@/data/about-help'

export interface ArticlesResponse {
  items: Article[]
  count: number
}

export interface FAQsResponse {
  items: FAQ[]
  count: number
}

export interface GuidesResponse {
  items: Guide[]
  count: number
}

export interface StatusResponse {
  items: StatusItem[]
  updatedAt: string
}

export interface SupportContactResponse {
  success: boolean
  ticketId?: string
  message: string
}

/** Placeholder: GET /docs/articles */
export async function fetchArticles(
  search?: string,
  category?: string
): Promise<ArticlesResponse> {
  await new Promise((r) => setTimeout(r, 100))
  let items = Array.isArray(MOCK_ARTICLES) ? [...MOCK_ARTICLES] : []
  if (category && category !== 'all') {
    items = items.filter((a) => a.category === category)
  }
  if (search && search.length >= 3) {
    const q = search.toLowerCase()
    items = items.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        (a.tags ?? []).some((t) => t.toLowerCase().includes(q))
    )
  }
  return { items, count: items.length }
}

/** Placeholder: GET /docs/faqs */
export async function fetchFAQs(category?: string): Promise<FAQsResponse> {
  await new Promise((r) => setTimeout(r, 50))
  let items = Array.isArray(MOCK_FAQS) ? [...MOCK_FAQS] : []
  if (category && category !== 'all') {
    items = items.filter((f) => f.category === category)
  }
  return { items, count: items.length }
}

/** Placeholder: GET /docs/guides */
export async function fetchGuides(): Promise<GuidesResponse> {
  await new Promise((r) => setTimeout(r, 50))
  const items = Array.isArray(MOCK_GUIDES) ? [...MOCK_GUIDES] : []
  return { items, count: items.length }
}

/** Placeholder: GET /status */
export async function fetchStatus(): Promise<StatusResponse> {
  await new Promise((r) => setTimeout(r, 50))
  const items = Array.isArray(MOCK_STATUS) ? [...MOCK_STATUS] : []
  return { items, updatedAt: new Date().toISOString() }
}

/** Placeholder: POST /support/contact */
export async function submitSupportContact(
  _data: SupportFormData
): Promise<SupportContactResponse> {
  await new Promise((r) => setTimeout(r, 500))
  return {
    success: true,
    ticketId: `TKT-${Date.now()}`,
    message: 'Your message has been received. We will respond within 24 hours.',
  }
}
