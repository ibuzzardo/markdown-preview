'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Server, Lock, Eye, EyeOff } from 'lucide-react'
import { apiClient, handleApiError } from '@/lib/api-client'
import { useAuth } from '@/hooks/use-auth'

export default function LoginPage(): JSX.Element {
  const [apiKey, setApiKey] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { isAuthenticated, isAuthEnabled } = useAuth()

  useEffect(() => {
    // If auth is disabled or user is already authenticated, redirect to dashboard
    if (isAuthenticated === true || isAuthEnabled === false) {
      router.push('/')
    }
  }, [isAuthenticated, isAuthEnabled, router])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    
    if (!apiKey.trim()) {
      setError('Please enter your API key')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await apiClient.login(apiKey)
      router.push('/')
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-secondary-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-accent/10 rounded-full">
                <Server className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-primary-text mb-2">
              VPS Command Center
            </h1>
            <p className="text-secondary-text">
              Enter your API key to access the dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-secondary-text mb-2">
                API Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-secondary-text" />
                </div>
                <input
                  id="apiKey"
                  type={showPassword ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full pl-10 pr-10 py-3 bg-surface-alt border border-border rounded-lg text-primary-text placeholder-secondary-text focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-colors"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-text hover:text-primary-text transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                <div className="text-error text-sm">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="w-full py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-secondary-text">
              The API key is configured in your server's environment variables.
              Contact your system administrator if you don't have access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}