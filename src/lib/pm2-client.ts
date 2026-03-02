import pm2 from 'pm2'
import type { Pm2Process } from '@/types'

function connectPm2(): Promise<void> {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function disconnectPm2(): void {
  pm2.disconnect()
}

export async function listProcesses(): Promise<Pm2Process[]> {
  try {
    await connectPm2()
    
    return new Promise((resolve, reject) => {
      pm2.list((err, processes) => {
        disconnectPm2()
        
        if (err) {
          reject(err)
          return
        }
        
        const formattedProcesses: Pm2Process[] = processes.map(proc => ({
          pm_id: proc.pm_id || 0,
          name: proc.name || 'unknown',
          status: mapPm2Status(proc.pm2_env?.status),
          cpu: Math.round(proc.monit?.cpu || 0),
          memory: Math.round((proc.monit?.memory || 0) / (1024 * 1024)), // MB
          uptime: proc.pm2_env?.pm_uptime ? Date.now() - proc.pm2_env.pm_uptime : 0,
          restarts: proc.pm2_env?.restart_time || 0,
          pid: proc.pid,
        }))
        
        resolve(formattedProcesses)
      })
    })
  } catch (error) {
    console.error('Error listing PM2 processes:', error)
    throw new Error('Failed to list PM2 processes')
  }
}

export async function restartProcess(id: number): Promise<Pm2Process> {
  try {
    await connectPm2()
    
    return new Promise((resolve, reject) => {
      pm2.restart(id, (err, proc) => {
        if (err) {
          disconnectPm2()
          reject(err)
          return
        }
        
        // Get updated process info
        pm2.describe(id, (descErr, processes) => {
          disconnectPm2()
          
          if (descErr || !processes || processes.length === 0) {
            reject(descErr || new Error('Process not found'))
            return
          }
          
          const process = processes[0]
          const formattedProcess: Pm2Process = {
            pm_id: process.pm_id || 0,
            name: process.name || 'unknown',
            status: mapPm2Status(process.pm2_env?.status),
            cpu: Math.round(process.monit?.cpu || 0),
            memory: Math.round((process.monit?.memory || 0) / (1024 * 1024)),
            uptime: process.pm2_env?.pm_uptime ? Date.now() - process.pm2_env.pm_uptime : 0,
            restarts: process.pm2_env?.restart_time || 0,
            pid: process.pid,
          }
          
          resolve(formattedProcess)
        })
      })
    })
  } catch (error) {
    console.error('Error restarting PM2 process:', error)
    throw new Error('Failed to restart PM2 process')
  }
}

export async function stopProcess(id: number): Promise<Pm2Process> {
  try {
    await connectPm2()
    
    return new Promise((resolve, reject) => {
      pm2.stop(id, (err) => {
        if (err) {
          disconnectPm2()
          reject(err)
          return
        }
        
        // Get updated process info
        pm2.describe(id, (descErr, processes) => {
          disconnectPm2()
          
          if (descErr || !processes || processes.length === 0) {
            reject(descErr || new Error('Process not found'))
            return
          }
          
          const process = processes[0]
          const formattedProcess: Pm2Process = {
            pm_id: process.pm_id || 0,
            name: process.name || 'unknown',
            status: mapPm2Status(process.pm2_env?.status),
            cpu: Math.round(process.monit?.cpu || 0),
            memory: Math.round((process.monit?.memory || 0) / (1024 * 1024)),
            uptime: process.pm2_env?.pm_uptime ? Date.now() - process.pm2_env.pm_uptime : 0,
            restarts: process.pm2_env?.restart_time || 0,
            pid: process.pid,
          }
          
          resolve(formattedProcess)
        })
      })
    })
  } catch (error) {
    console.error('Error stopping PM2 process:', error)
    throw new Error('Failed to stop PM2 process')
  }
}

export async function startProcess(id: number): Promise<Pm2Process> {
  try {
    await connectPm2()
    
    return new Promise((resolve, reject) => {
      pm2.start(id, (err) => {
        if (err) {
          disconnectPm2()
          reject(err)
          return
        }
        
        // Get updated process info
        pm2.describe(id, (descErr, processes) => {
          disconnectPm2()
          
          if (descErr || !processes || processes.length === 0) {
            reject(descErr || new Error('Process not found'))
            return
          }
          
          const process = processes[0]
          const formattedProcess: Pm2Process = {
            pm_id: process.pm_id || 0,
            name: process.name || 'unknown',
            status: mapPm2Status(process.pm2_env?.status),
            cpu: Math.round(process.monit?.cpu || 0),
            memory: Math.round((process.monit?.memory || 0) / (1024 * 1024)),
            uptime: process.pm2_env?.pm_uptime ? Date.now() - process.pm2_env.pm_uptime : 0,
            restarts: process.pm2_env?.restart_time || 0,
            pid: process.pid,
          }
          
          resolve(formattedProcess)
        })
      })
    })
  } catch (error) {
    console.error('Error starting PM2 process:', error)
    throw new Error('Failed to start PM2 process')
  }
}

function mapPm2Status(status: string | undefined): Pm2Process['status'] {
  switch (status) {
    case 'online':
      return 'online'
    case 'stopped':
      return 'stopped'
    case 'errored':
      return 'errored'
    case 'stopping':
      return 'stopping'
    case 'launching':
      return 'launching'
    default:
      return 'stopped'
  }
}

export function formatProcessUptime(uptime: number): string {
  if (uptime === 0) return '0s'
  
  const seconds = Math.floor(uptime / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return `${seconds}s`
  }
}