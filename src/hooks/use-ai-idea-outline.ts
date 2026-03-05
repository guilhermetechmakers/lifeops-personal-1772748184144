/**
 * useAiIdeaOutline - Abstracted hook for AI idea/outline generation
 * Supports cancellation; returns ideas and outline blocks
 */

import { useCallback, useRef, useState } from 'react'
import type { AIOutlineContext, OutlineBlock } from '@/types/content'

export interface UseAiIdeaOutlineResult {
  ideas: string[]
  outline: OutlineBlock[]
  isLoading: boolean
  error: string | null
  generate: (context: AIOutlineContext) => Promise<void>
  cancel: () => void
}

/** Local mock generation - no external API */
function mockGenerateIdeas(context: AIOutlineContext): string[] {
  const topic = context?.topic?.trim() || 'your topic'
  return [
    `5 key points to cover about ${topic}`,
    `Common misconceptions about ${topic}`,
    `Step-by-step guide for ${topic}`,
    `Expert tips for ${topic}`,
    `Case study: ${topic} in action`,
  ]
}

/** Local mock outline - no external API */
function mockGenerateOutline(context: AIOutlineContext): OutlineBlock[] {
  const topic = context?.topic?.trim() || 'Topic'
  return [
    { id: '1', title: `Introduction to ${topic}`, content: '', order: 0 },
    { id: '2', title: 'Key Concepts', content: '', order: 1 },
    { id: '3', title: 'Practical Applications', content: '', order: 2 },
    { id: '4', title: 'Best Practices', content: '', order: 3 },
    { id: '5', title: 'Conclusion', content: '', order: 4 },
  ]
}

export function useAiIdeaOutline(): UseAiIdeaOutlineResult {
  const [ideas, setIdeas] = useState<string[]>([])
  const [outline, setOutline] = useState<OutlineBlock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cancelledRef = useRef(false)

  const cancel = useCallback(() => {
    cancelledRef.current = true
  }, [])

  const generate = useCallback(async (context: AIOutlineContext) => {
    cancelledRef.current = false
    setIsLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 800))
      if (cancelledRef.current) return
      setIdeas(mockGenerateIdeas(context))
      if (cancelledRef.current) return
      setOutline(mockGenerateOutline(context))
    } catch (e) {
      if (!cancelledRef.current) {
        setError(e instanceof Error ? e.message : 'Generation failed')
      }
    } finally {
      if (!cancelledRef.current) setIsLoading(false)
    }
  }, [])

  return { ideas, outline, isLoading, error, generate, cancel }
}
