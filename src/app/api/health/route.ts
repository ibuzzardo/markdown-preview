import { NextResponse } from 'next/server'
import type { HealthCheckResponse } from '@/types'

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  try {
    const response: HealthCheckResponse = {
      status: 'ok'
    }
    
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Health check error:', error)
    
    const errorResponse: HealthCheckResponse = {
      status: 'ok'
    }
    
    return NextResponse.json(errorResponse, { status: 200 })
  }
}