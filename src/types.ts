export interface SystemMetrics {
  cpu: {
    usage: number
    cores: Array<{ usage: number }>
  }
  memory: {
    used: number
    total: number
    percentage: number
  }
  disk: Array<{
    mount: string
    used: number
    total: number
    percentage: number
  }>
  network: {
    rx: number
    tx: number
    totalRx: number
    totalTx: number
  }
  uptime: number
  os: {
    hostname: string
    platform: string
    distro: string
    kernel: string
    arch: string
    nodeVersion: string
  }
}

export interface Pm2Process {
  pm_id: number
  name: string
  status: 'online' | 'stopped' | 'errored' | 'stopping' | 'launching'
  cpu: number
  memory: number
  uptime: number
  restarts: number
  pid?: number
}

export interface ProjectInfo {
  name: string
  path: string
  hasPackageJson: boolean
  packageName?: string
  packageVersion?: string
  git: {
    branch?: string
    lastCommit?: {
      message: string
      date: string
      hash: string
    }
  }
  diskUsage: string
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

export interface AuthCookie {
  apiKey: string
  expires: number
}