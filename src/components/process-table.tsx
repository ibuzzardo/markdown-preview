'use client'

import { useState } from 'react'
import { Play, Square, RotateCcw } from 'lucide-react'
import { StatusBadge } from './status-badge'
import { ConfirmDialog } from './confirm-dialog'
import { formatProcessUptime } from '@/lib/pm2-client'
import { apiClient, handleApiError } from '@/lib/api-client'
import type { Pm2Process } from '@/types'

interface ProcessTableProps {
  processes: Pm2Process[]
  onProcessUpdate: () => void
}

interface PendingAction {
  processId: number
  action: 'restart' | 'stop' | 'start'
  processName: string
}

export function ProcessTable({ processes, onProcessUpdate }: ProcessTableProps): JSX.Element {
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAction = (processId: number, action: 'restart' | 'stop' | 'start', processName: string): void => {
    setPendingAction({ processId, action, processName })
  }

  const confirmAction = async (): Promise<void> => {
    if (!pendingAction) return

    setActionLoading(pendingAction.processId)
    setError(null)

    try {
      switch (pendingAction.action) {
        case 'restart':
          await apiClient.restartPm2Process(pendingAction.processId)
          break
        case 'stop':
          await apiClient.stopPm2Process(pendingAction.processId)
          break
        case 'start':
          await apiClient.startPm2Process(pendingAction.processId)
          break
      }
      
      onProcessUpdate()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setActionLoading(null)
      setPendingAction(null)
    }
  }

  const cancelAction = (): void => {
    setPendingAction(null)
  }

  const getActionText = (action: string): string => {
    switch (action) {
      case 'restart': return 'restart'
      case 'stop': return 'stop'
      case 'start': return 'start'
      default: return action
    }
  }

  if (processes.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center">
        <div className="text-secondary-text">
          No PM2 processes found. Make sure PM2 is installed and running.
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {error && (
          <div className="bg-error/10 border-b border-error/20 px-4 py-3">
            <div className="text-error text-sm">{error}</div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-alt">
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-secondary-text">
                  Process
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-secondary-text">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-secondary-text">
                  CPU
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-secondary-text">
                  Memory
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-secondary-text">
                  Uptime
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-secondary-text">
                  Restarts
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wide text-secondary-text">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr
                  key={process.pm_id}
                  className="border-b border-surface-alt hover:bg-surface-alt/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="text-sm text-primary-text font-medium">
                      {process.name}
                    </div>
                    <div className="text-xs text-secondary-text">
                      ID: {process.pm_id}
                      {process.pid && ` • PID: ${process.pid}`}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={process.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-primary-text font-mono">
                      {process.cpu}%
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-primary-text font-mono">
                      {process.memory} MB
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-secondary-text">
                      {formatProcessUptime(process.uptime)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-secondary-text">
                      {process.restarts}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end space-x-2">
                      {process.status === 'stopped' ? (
                        <button
                          onClick={() => handleAction(process.pm_id, 'start', process.name)}
                          disabled={actionLoading === process.pm_id}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-success/10 text-success hover:bg-success/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAction(process.pm_id, 'restart', process.name)}
                            disabled={actionLoading === process.pm_id}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Restart
                          </button>
                          <button
                            onClick={() => handleAction(process.pm_id, 'stop', process.name)}
                            disabled={actionLoading === process.pm_id}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-error/10 text-error hover:bg-error/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Square className="h-3 w-3 mr-1" />
                            Stop
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={pendingAction !== null}
        onConfirm={confirmAction}
        onCancel={cancelAction}
        title={`${getActionText(pendingAction?.action || '')} Process`}
        message={`Are you sure you want to ${getActionText(pendingAction?.action || '')} the process "${pendingAction?.processName}"?`}
        confirmText={getActionText(pendingAction?.action || '')}
        isDestructive={pendingAction?.action === 'stop'}
      />
    </>
  )
}