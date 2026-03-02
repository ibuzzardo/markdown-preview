import * as si from 'systeminformation'
import type { SystemMetrics } from '@/types'

export async function getSystemMetrics(): Promise<SystemMetrics> {
  try {
    const [cpu, memory, fsSize, networkStats, uptime, osInfo] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.time(),
      si.osInfo(),
    ])

    // Get per-core CPU usage
    const cores = cpu.cpus?.map(core => ({ usage: Math.round(core.load) })) || []

    // Filter out virtual/loop filesystems and get main mount points
    const diskInfo = fsSize
      .filter(disk => 
        disk.mount && 
        !disk.mount.includes('/snap/') && 
        !disk.mount.includes('/dev/loop') &&
        disk.size > 0
      )
      .map(disk => ({
        mount: disk.mount,
        used: Math.round(disk.used / (1024 ** 3) * 100) / 100, // GB
        total: Math.round(disk.size / (1024 ** 3) * 100) / 100, // GB
        percentage: Math.round(disk.use),
      }))

    // Get primary network interface stats
    const primaryInterface = networkStats.find(iface => 
      iface.iface && !iface.iface.includes('lo') && iface.rx_bytes > 0
    ) || networkStats[0] || { rx_sec: 0, tx_sec: 0, rx_bytes: 0, tx_bytes: 0 }

    return {
      cpu: {
        usage: Math.round(cpu.currentLoad),
        cores,
      },
      memory: {
        used: Math.round(memory.used / (1024 ** 3) * 100) / 100, // GB
        total: Math.round(memory.total / (1024 ** 3) * 100) / 100, // GB
        percentage: Math.round((memory.used / memory.total) * 100),
      },
      disk: diskInfo,
      network: {
        rx: Math.round(primaryInterface.rx_sec || 0), // bytes/sec
        tx: Math.round(primaryInterface.tx_sec || 0), // bytes/sec
        totalRx: Math.round((primaryInterface.rx_bytes || 0) / (1024 ** 3) * 100) / 100, // GB
        totalTx: Math.round((primaryInterface.tx_bytes || 0) / (1024 ** 3) * 100) / 100, // GB
      },
      uptime: uptime.uptime,
      os: {
        hostname: osInfo.hostname,
        platform: osInfo.platform,
        distro: osInfo.distro,
        kernel: osInfo.kernel,
        arch: osInfo.arch,
        nodeVersion: process.version,
      },
    }
  } catch (error) {
    console.error('Error fetching system metrics:', error)
    throw new Error('Failed to fetch system metrics')
  }
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`
}