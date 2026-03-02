'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UseAuthResult {
  isAuthenticated: boolean | null // null = checking
  isAuthEnabled: boolean
  logout: () => void
}

export function useAuth(): UseAuthResult {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isAuthEnabled, setIsAuthEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async (): Promise<void> => {
    try {
      // Try to fetch system metrics to check if we're authenticated
      const response = await fetch('/api/system')
      
      if (response.status === 401) {
        // Auth is enabled but we're not authenticated
        setIsAuthEnabled(true)
        setIsAuthenticated(false)
      } else if (response.ok) {
        // Either auth is disabled or we're authenticated
        setIsAuthEnabled(false) // We'll assume auth is disabled if we can access without auth
        setIsAuthenticated(true)
      } else {
        // Some other error, assume we need to check auth
        setIsAuthEnabled(true)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthEnabled(true)
      setIsAuthenticated(false)
    }
  }

  const logout = (): void => {
    // Clear the auth cookie by setting it to expire
    document.cookie = 'vps-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setIsAuthenticated(false)
    router.push('/login')
  }

  return {
    isAuthenticated,
    isAuthEnabled,
    logout,
  }
}

// Hook for protecting pages that require authentication
export function useRequireAuth(): void {
  const { isAuthenticated, isAuthEnabled } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated === false && isAuthEnabled) {
      router.push('/login')
    }
  }, [isAuthenticated, isAuthEnabled, router])
}