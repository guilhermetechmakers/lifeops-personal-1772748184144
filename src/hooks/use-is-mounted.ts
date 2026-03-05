import { useEffect, useRef, useCallback } from 'react'

/**
 * Returns a function that returns whether the component is mounted.
 * Use before setState in async callbacks to avoid setting state on unmounted components.
 */
export function useIsMounted(): () => boolean {
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return useCallback(() => mountedRef.current, [])
}
