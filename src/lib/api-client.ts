import type { SystemMetrics, Pm2Process, ProjectInfo, ApiResponse } from '@/types'

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:4002'
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    return this.request<SystemMetrics>('/system')
  }

  async getPm2Processes(): Promise<Pm2Process[]> {
    return this.request<Pm2Process[]>('/pm2')
  }

  async restartPm2Process(id: number): Promise<Pm2Process> {
    return this.request<Pm2Process>(`/pm2/${id}/restart`, {
      method: 'POST',
    })
  }

  async stopPm2Process(id: number): Promise<Pm2Process> {
    return this.request<Pm2Process>(`/pm2/${id}/stop`, {
      method: 'POST',
    })
  }

  async startPm2Process(id: number): Promise<Pm2Process> {
    return this.request<Pm2Process>(`/pm2/${id}/start`, {
      method: 'POST',
    })
  }

  async getProjects(): Promise<ProjectInfo[]> {
    return this.request<ProjectInfo[]>('/projects')
  }

  async login(apiKey: string): Promise<void> {
    await this.request('/auth', {
      method: 'POST',
      body: JSON.stringify({ apiKey }),
    })
  }
}

export const apiClient = new ApiClient()

// Utility function to handle API errors consistently
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}