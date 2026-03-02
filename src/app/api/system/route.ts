import { NextRequest, NextResponse } from 'next/server'
import { getSystemMetrics } from '@/lib/system-info'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const authError = requireAuth(request)
    if (authError) {
      return authError
    }

    const metrics = await getSystemMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching system metrics:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to fetch system metrics',
      },
      { status: 500 }
    )
  }
}