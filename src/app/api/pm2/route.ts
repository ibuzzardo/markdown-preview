import { NextRequest, NextResponse } from 'next/server'
import { listProcesses } from '@/lib/pm2-client'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const authError = requireAuth(request)
    if (authError) {
      return authError
    }

    const processes = await listProcesses()
    return NextResponse.json(processes)
  } catch (error) {
    console.error('Error fetching PM2 processes:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to fetch PM2 processes',
      },
      { status: 500 }
    )
  }
}