'use client'

import { clsx } from 'clsx'

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  icon?: React.ComponentType<{ className?: string }>
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend = 'neutral',
  className,
}: StatCardProps): JSX.Element {
  return (
    <div className={clsx('stat-card', className)}>
      <div className="flex items-center justify-between">
        <div className="stat-label">{label}</div>
        {Icon && <Icon className="h-4 w-4 text-secondary-text" />}
      </div>
      
      <div className="stat-value">{value}</div>
      
      {subtext && (
        <div className={clsx(
          'stat-subtext',
          trend === 'up' && 'text-success',
          trend === 'down' && 'text-error'
        )}>
          {subtext}
        </div>
      )}
    </div>
  )
}