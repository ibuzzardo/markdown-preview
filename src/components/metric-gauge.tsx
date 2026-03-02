'use client'

import { clsx } from 'clsx'

interface MetricGaugeProps {
  value: number // 0-100
  label: string
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

export function MetricGauge({
  value,
  label,
  size = 'md',
  showValue = true,
  className,
}: MetricGaugeProps): JSX.Element {
  const percentage = Math.min(Math.max(value, 0), 100)
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  const getColor = (value: number): string => {
    if (value >= 90) return 'text-error'
    if (value >= 80) return 'text-warning'
    return 'text-accent'
  }
  
  const getSize = (size: string): { width: number; height: number; fontSize: string } => {
    switch (size) {
      case 'sm':
        return { width: 80, height: 80, fontSize: 'text-sm' }
      case 'lg':
        return { width: 120, height: 120, fontSize: 'text-xl' }
      default:
        return { width: 100, height: 100, fontSize: 'text-lg' }
    }
  }
  
  const sizeConfig = getSize(size)

  return (
    <div className={clsx('flex flex-col items-center', className)}>
      <div className="relative" style={{ width: sizeConfig.width, height: sizeConfig.height }}>
        <svg
          width={sizeConfig.width}
          height={sizeConfig.height}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={sizeConfig.width / 2}
            cy={sizeConfig.height / 2}
            r={45}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-surface-alt"
          />
          
          {/* Progress circle */}
          <circle
            cx={sizeConfig.width / 2}
            cy={sizeConfig.height / 2}
            r={45}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={clsx('transition-all duration-300 ease-out', getColor(percentage))}
          />
        </svg>
        
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={clsx(
              'font-bold font-mono text-primary-text',
              sizeConfig.fontSize
            )}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="text-xs font-medium text-secondary-text mt-2 text-center">
        {label}
      </div>
    </div>
  )
}