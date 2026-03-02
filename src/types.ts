export interface MarkdownProcessorResult {
  html: string
  error?: string
}

export interface ClipboardResult {
  success: boolean
  error?: string
}

export interface HealthCheckResponse {
  status: 'ok'
}