import { NextRequest, NextResponse } from 'next/server'
import { scanProjects } from '@/lib/project-scanner'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const authError = requireAuth(request)
    if (authError) {
      return authError
    }

    const projects = await scanProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error scanning projects:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to scan projects',
      },
      { status: 500 }
    )
  }
}