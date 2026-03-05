/**
 * useSeoSuggestions - Returns keywords, readability, title/meta suggestions
 * Abstracted for future API integration
 */

import { useCallback, useMemo, useState } from 'react'
import type { SEOSuggestion } from '@/types/content'

export interface SeoSuggestionsResult {
  keywords: string[]
  readabilityScore: number
  titleSuggestion: string
  metaSuggestion: string
  suggestions: SEOSuggestion[]
  isLoading: boolean
  analyze: (content: string, title?: string) => Promise<void>
}

/** Simple readability approximation: avg words per sentence, sentence count */
function estimateReadability(text: string): number {
  const trimmed = (text ?? '').trim()
  if (!trimmed) return 0
  const sentences = trimmed.split(/[.!?]+/).filter(Boolean)
  const words = trimmed.split(/\s+/).filter(Boolean)
  if (sentences.length === 0) return 70
  const avgWords = words.length / sentences.length
  if (avgWords <= 12) return 90
  if (avgWords <= 18) return 75
  if (avgWords <= 25) return 60
  return Math.max(30, 80 - avgWords)
}

/** Extract potential keywords from content (simple word frequency) */
function extractKeywords(text: string, limit = 8): string[] {
  const words = (text ?? '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4)
  const counts: Record<string, number> = {}
  for (const w of words) {
    counts[w] = (counts[w] ?? 0) + 1
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k]) => k)
}

export function useSeoSuggestions(): SeoSuggestionsResult {
  const [keywords, setKeywords] = useState<string[]>([])
  const [readabilityScore, setReadabilityScore] = useState(0)
  const [titleSuggestion, setTitleSuggestion] = useState('')
  const [metaSuggestion, setMetaSuggestion] = useState('')
  const [suggestions, setSuggestions] = useState<SEOSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const analyze = useCallback(async (content: string, title?: string) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 400))
      const score = estimateReadability(content)
      setReadabilityScore(score)
      setKeywords(extractKeywords(content))
      const t = (title ?? '').trim() || 'Your compelling title here'
      setTitleSuggestion(t.length <= 60 ? t : t.slice(0, 57) + '...')
      const meta =
        content.slice(0, 155).replace(/\s+/g, ' ').trim() +
        (content.length > 155 ? '...' : '')
      setMetaSuggestion(meta)
      const sugs: SEOSuggestion[] = []
      if (score < 60)
        sugs.push({
          id: 'r1',
          text: 'Shorten sentences for better readability',
          type: 'readability',
        })
      if (!content.includes('alt=') && content.includes('<img'))
        sugs.push({
          id: 'a1',
          text: 'Add alt text to images',
          type: 'alt',
        })
      extractKeywords(content).slice(0, 3).forEach((k, i) => {
        sugs.push({ id: `k${i}`, text: `Use keyword: ${k}`, type: 'keyword' })
      })
      setSuggestions(sugs)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return useMemo(
    () => ({
      keywords,
      readabilityScore,
      titleSuggestion,
      metaSuggestion,
      suggestions,
      isLoading,
      analyze,
    }),
    [
      keywords,
      readabilityScore,
      titleSuggestion,
      metaSuggestion,
      suggestions,
      isLoading,
      analyze,
    ]
  )
}
