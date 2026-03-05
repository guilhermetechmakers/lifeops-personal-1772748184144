/**
 * Centralized admin data fetching hook.
 * Handles loading, error, and data normalization with data ?? [] defaults.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getAdminMetricsHealth,
  getAdminUsers,
  getAdminModQueue,
  getAdminAlerts,
} from '@/api/admin'
import type {
  AdminMetricsHealth,
  User,
  ModerationItem,
  Alert,
} from '@/types/admin'

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface UseAdminQueryOptions {
  query?: string
  status?: string
  role?: string
  region?: string
  limit?: number
  offset?: number
}

export interface UseAdminQueryResult<T> {
  data: T
  isLoading: boolean
  error: ApiError | null
  refetch: () => void
}

/** Admin metrics - always returns object with safe defaults */
export function useAdminMetrics(): UseAdminQueryResult<AdminMetricsHealth> {
  const [data, setData] = useState<AdminMetricsHealth>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const refetch = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await getAdminMetricsHealth()
      setData(res ?? {})
    } catch (e) {
      setError(e as ApiError)
      setData({})
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

/** Admin users - always returns array */
export function useAdminUsers(options: UseAdminQueryOptions = {}): UseAdminQueryResult<{
  users: User[]
  total: number
}> {
  const [data, setData] = useState<{ users: User[]; total: number }>({ users: [], total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const refetch = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await getAdminUsers(options)
      const users = Array.isArray(res?.users) ? res.users : []
      const total = res?.total ?? users.length
      setData({ users, total })
    } catch (e) {
      setError(e as ApiError)
      setData({ users: [], total: 0 })
    } finally {
      setIsLoading(false)
    }
  }, [options.query, options.status, options.role, options.region, options.limit, options.offset])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

/** Moderation queue - always returns array */
export function useAdminModQueue(): UseAdminQueryResult<{
  items: ModerationItem[]
  total: number
}> {
  const [data, setData] = useState<{ items: ModerationItem[]; total: number }>({
    items: [],
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const refetch = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await getAdminModQueue()
      const items = Array.isArray(res?.items) ? res.items : []
      const total = res?.total ?? items.length
      setData({ items, total })
    } catch (e) {
      setError(e as ApiError)
      setData({ items: [], total: 0 })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

/** Admin alerts - always returns array */
export function useAdminAlerts(): UseAdminQueryResult<{ alerts: Alert[] }> {
  const [data, setData] = useState<{ alerts: Alert[] }>({ alerts: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const refetch = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await getAdminAlerts()
      const alerts = Array.isArray(res?.alerts) ? res.alerts : []
      setData({ alerts })
    } catch (e) {
      setError(e as ApiError)
      setData({ alerts: [] })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}
