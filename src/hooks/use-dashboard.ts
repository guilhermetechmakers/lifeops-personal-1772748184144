/**
 * Dashboard data hooks - LifeOps Personal
 * Fetches dashboard summary with loading/error states
 */

import { useState, useEffect, useCallback } from 'react'
import {
  fetchDashboardSummary,
  searchDashboard,
  undoAIAction,
  fetchAIExplain,
} from '@/api/dashboard'
import type { DashboardSummary, AIExplainResponse, SearchResponse } from '@/types/dashboard'

export function useDashboardSummary() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchDashboardSummary()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load dashboard'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function useDashboardSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse['results']>([])
  const [isSearching, setIsSearching] = useState(false)

  const search = useCallback(async (q: string) => {
    const trimmed = (q ?? '').trim()
    setQuery(trimmed)
    if (!trimmed) {
      setResults([])
      return
    }
    setIsSearching(true)
    try {
      const res = await searchDashboard(trimmed)
      setResults(Array.isArray(res) ? res : [])
    } catch {
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  return { query, results, isSearching, search }
}

export function useUndoAIAction() {
  const [isUndoing, setIsUndoing] = useState(false)

  const undo = useCallback(async (actionId: string) => {
    if (!actionId?.trim()) return { success: false }
    setIsUndoing(true)
    try {
      const res = await undoAIAction(actionId)
      return res
    } finally {
      setIsUndoing(false)
    }
  }, [])

  return { undo, isUndoing }
}

export function useAIExplain(actionId: string | null) {
  const [explanation, setExplanation] = useState<AIExplainResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!actionId?.trim()) {
      setExplanation(null)
      return
    }
    let cancelled = false
    setIsLoading(true)
    fetchAIExplain(actionId)
      .then((res) => {
        if (!cancelled) setExplanation(res ?? null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [actionId])

  return { explanation, isLoading }
}
