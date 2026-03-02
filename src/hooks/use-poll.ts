'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UsePollOptions {
  interval: number
  enabled?: boolean
  onError?: (error: Error) => void
}

interface UsePollResult<T> {
  data: T | null
  error: string | null
  loading: boolean
  refetch: () => Promise<void>
}

export function usePoll<T>(
  fetcher: () => Promise<T>,
  options: UsePollOptions
): UsePollResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  const { interval, enabled = true, onError } = options

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setError(null)
      const result = await fetcher()
      
      if (mountedRef.current) {
        setData(result)
        setLoading(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      
      if (mountedRef.current) {
        setError(errorMessage)
        setLoading(false)
      }
      
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage))
      }
    }
  }, [fetcher, onError])

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true)
    await fetchData()
  }, [fetchData])

  useEffect(() => {
    mountedRef.current = true
    
    if (!enabled) {
      return
    }

    // Initial fetch
    fetchData()

    // Set up polling
    intervalRef.current = setInterval(fetchData, interval)

    return () => {
      mountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [fetchData, interval, enabled])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    data,
    error,
    loading,
    refetch,
  }
}