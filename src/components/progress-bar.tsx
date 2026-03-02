'use client'

import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressBar({
  value,
  className,
  showLabel = false,
  size = 'md',
}: ProgressBarProps): JSX.Element {
  const percentage = Math.min(Math.max(value, 0), 100)
  
  const getBarColor = (value: number): string => {
    if (value >= 90) return 'bg-error'
    if (value >= 80) return 'bg-warning'
    return 'bg-accent'
  }
  
  const getHeight = (size: string): string => {
    switch (size) {
      case 'sm': return 'h-1'
      case 'lg': return 'h-3'
      default: return 'h-2'
    }
  }

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-secondary-text mb-1">
          <span>Usage</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      )}
      
      <div className={clsx(
        'bg-surface-alt rounded-full overflow-hidden',
        getHeight(size)
      )}>
        <div
          className={clsx(
            'rounded-full transition-all duration-300 ease-out',
            getHeight(size),
            getBarColor(percentage)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}