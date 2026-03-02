'use client'

import { useState } from 'react'
import { Cpu, HardDrive, Activity, Wifi, Clock, Server } from 'lucide-react'
import { StatCard } from '@/components/stat-card'
import { ProgressBar } from '@/components/progress-bar'
import { MetricGauge } from '@/components/metric-gauge'
import { usePoll } from '@/hooks/use-poll'
import { useRequireAuth } from '@/hooks/use-auth'
import { apiClient } from '@/lib/api-client'
import { formatUptime, formatBytes } from '@/lib/system-info'
import type { SystemMetrics } from '@/types'

export default function Dashboard(): JSX.Element {
  useRequireAuth()
  
  const [retryCount, setRetryCount] = useState(0)
  
  const { data: metrics, error, loading } = usePoll<SystemMetrics>(
    () => apiClient.getSystemMetrics(),
    {
      interval: 3000, // 3 seconds
      onError: (error) => {
        console.error('Failed to fetch system metrics:', error)
      },
    }
  )

  const handleRetry = (): void => {
    setRetryCount(prev => prev + 1)
  }

  if (loading && !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary-text">Dashboard</h1>
          <div className="text-sm text-secondary-text">Loading...</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 bg-surface-alt rounded mb-2"></div>
              <div className="h-8 bg-surface-alt rounded mb-2"></div>
              <div className="h-3 bg-surface-alt rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary-text">Dashboard</h1>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <div className="text-error mb-4">Unable to fetch system metrics</div>
          <div className="text-secondary-text mb-4">{error}</div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!metrics) {
    return <div>No data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary-text">Dashboard</h1>
        <div className="flex items-center space-x-4 text-sm text-secondary-text">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4" />
            <span>{metrics.os.hostname}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Uptime: {formatUptime(metrics.uptime)}</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="CPU Usage"
          value={`${metrics.cpu.usage}%`}
          subtext={`${metrics.cpu.cores.length} cores`}
          icon={Cpu}
        />
        
        <StatCard
          label="Memory"
          value={`${metrics.memory.used} GB`}
          subtext={`${metrics.memory.percentage}% of ${metrics.memory.total} GB`}
          icon={Activity}
        />
        
        <StatCard
          label="Disk Usage"
          value={metrics.disk.length > 0 ? `${metrics.disk[0].percentage}%` : 'N/A'}
          subtext={metrics.disk.length > 0 ? `${metrics.disk[0].used} GB / ${metrics.disk[0].total} GB` : 'No disks'}
          icon={HardDrive}
        />
        
        <StatCard
          label="Network"
          value={`${formatBytes(metrics.network.rx + metrics.network.tx)}/s`}
          subtext={`↓ ${formatBytes(metrics.network.totalRx)} ↑ ${formatBytes(metrics.network.totalTx)}`}
          icon={Wifi}
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Details */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary-text mb-4">CPU Cores</h2>
          <div className="flex items-center justify-center mb-6">
            <MetricGauge
              value={metrics.cpu.usage}
              label="Overall CPU"
              size="lg"
            />
          </div>
          <div className="space-y-3">
            {metrics.cpu.cores.map((core, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-sm text-secondary-text w-12">
                  Core {index + 1}
                </div>
                <div className="flex-1">
                  <ProgressBar value={core.usage} />
                </div>
                <div className="text-sm text-primary-text font-mono w-12 text-right">
                  {core.usage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory & Disk Details */}
        <div className="space-y-6">
          {/* Memory */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-primary-text mb-4">Memory Usage</h2>
            <div className="flex items-center justify-center mb-4">
              <MetricGauge
                value={metrics.memory.percentage}
                label="Memory"
                size="md"
              />
            </div>
            <div className="text-center text-sm text-secondary-text">
              {metrics.memory.used} GB / {metrics.memory.total} GB
            </div>
          </div>

          {/* Disk Usage */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-primary-text mb-4">Disk Usage</h2>
            <div className="space-y-4">
              {metrics.disk.map((disk, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-secondary-text">
                      {disk.mount}
                    </div>
                    <div className="text-sm text-primary-text font-mono">
                      {disk.used} GB / {disk.total} GB
                    </div>
                  </div>
                  <ProgressBar value={disk.percentage} showLabel={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-primary-text mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-secondary-text">Hostname</div>
            <div className="text-primary-text font-mono">{metrics.os.hostname}</div>
          </div>
          <div>
            <div className="text-secondary-text">OS</div>
            <div className="text-primary-text">{metrics.os.distro}</div>
          </div>
          <div>
            <div className="text-secondary-text">Kernel</div>
            <div className="text-primary-text font-mono">{metrics.os.kernel}</div>
          </div>
          <div>
            <div className="text-secondary-text">Architecture</div>
            <div className="text-primary-text">{metrics.os.arch}</div>
          </div>
          <div>
            <div className="text-secondary-text">Node.js</div>
            <div className="text-primary-text font-mono">{metrics.os.nodeVersion}</div>
          </div>
          <div>
            <div className="text-secondary-text">Uptime</div>
            <div className="text-primary-text">{formatUptime(metrics.uptime)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}