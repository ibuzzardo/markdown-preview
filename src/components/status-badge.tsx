'use client'

import { clsx } from 'clsx'
import type { Pm2Process } from '@/types'

interface StatusBadgeProps {
  status: Pm2Process['status']
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps): JSX.Element {
  const getStatusStyles = (status: Pm2Process['status']): string => {
    switch (status) {
      case 'online':
        return 'bg-success/10 text-success'
      case 'errored':
        return 'bg-error/10 text-error'
      case 'launching':
        return 'bg-warning/10 text-warning'
      case 'stopping':
        return 'bg-warning/10 text-warning'
      case 'stopped':
      default:
        return 'bg-secondary-text/10 text-secondary-text'
    }
  }

  const getStatusText = (status: Pm2Process['status']): string => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'errored':
        return 'Errored'
      case 'launching':
        return 'Starting'
      case 'stopping':
        return 'Stopping'
      case 'stopped':
      default:
        return 'Stopped'
    }
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        getStatusStyles(status),
        className
      )}
    >
      <span
        className={clsx(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          status === 'online' && 'bg-success',
          status === 'errored' && 'bg-error',
          (status === 'launching' || status === 'stopping') && 'bg-warning',
          status === 'stopped' && 'bg-secondary-text'
        )}
      />
      {getStatusText(status)}
    </span>
  )
}