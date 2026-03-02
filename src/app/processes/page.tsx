'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ProcessTable } from '@/components/process-table'
import { usePoll } from '@/hooks/use-poll'
import { useRequireAuth } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api-client'
import type { Pm2Process } from '@/types'

export default function ProcessesPage(): JSX.Element {
  useRequireAuth()
  
  const [refreshKey, setRefreshKey] = useState(0)
  
  const { data: processes, error, loading, refetch } = usePoll<Pm2Process[]>(
    () => apiClient.getPm2Processes(),
    {
      interval: 3000, // 3 seconds
      onError: (error) => {
        console.error('Failed to fetch PM2 processes:', error)
      },
    }
  )

  const handleRefresh = async (): Promise<void> => {
    await refetch()
    setRefreshKey(prev => prev + 1)
  }

  const handleProcessUpdate = (): void => {
    // Trigger a refresh after process action
    handleRefresh()
  }

  if (loading && !processes) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary-text">PM2 Processes</h1>
          <div className="text-sm text-secondary-text">Loading...</div>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-surface-alt rounded flex-1"></div>
                <div className="h-4 bg-surface-alt rounded w-20"></div>
                <div className="h-4 bg-surface-alt rounded w-16"></div>
                <div className="h-4 bg-surface-alt rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error && !processes) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary-text">PM2 Processes</h1>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <div className="text-error mb-4">Unable to fetch PM2 processes</div>
          <div className="text-secondary-text mb-4">{error}</div>
          <div className="text-sm text-secondary-text mb-4">
            Make sure PM2 is installed and running on this system.
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const onlineProcesses = processes?.filter(p => p.status === 'online').length || 0
  const totalProcesses = processes?.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-text">PM2 Processes</h1>
          <p className="text-sm text-secondary-text mt-1">
            {onlineProcesses} of {totalProcesses} processes online
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Process Table */}
      <ProcessTable 
        key={refreshKey}
        processes={processes || []} 
        onProcessUpdate={handleProcessUpdate}
      />

      {/* Help Text */}
      {processes && processes.length === 0 && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary-text mb-2">No PM2 processes found</h3>
          <p className="text-secondary-text mb-4">
            It looks like you don't have any PM2 processes running. Here are some common commands to get started:
          </p>
          <div className="bg-surface-alt rounded-lg p-4 font-mono text-sm text-primary-text space-y-2">
            <div># Start an application with PM2</div>
            <div>pm2 start app.js --name "my-app"</div>
            <div></div>
            <div># Start from package.json</div>
            <div>pm2 start npm --name "my-app" -- start</div>
            <div></div>
            <div># Save PM2 configuration</div>
            <div>pm2 save</div>
            <div>pm2 startup</div>
          </div>
        </div>
      )}
    </div>
  )
}