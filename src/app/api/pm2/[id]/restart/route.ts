import { NextRequest, NextResponse } from 'next/server'
import { restartProcess } from '@/lib/pm2-client'
import { requireAuth } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Check authentication
    const authError = requireAuth(request)
    if (authError) {
      return authError
    }

    const processId = parseInt(params.id, 10)
    
    if (isNaN(processId)) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Invalid process ID',
        },
        { status: 400 }
      )
    }

    const updatedProcess = await restartProcess(processId)
    return NextResponse.json(updatedProcess)
  } catch (error) {
    console.error('Error restarting PM2 process:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to restart PM2 process',
      },
      { status: 500 }
    )
  }
}