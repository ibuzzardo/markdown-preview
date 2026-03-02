import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey, createAuthResponse } from '@/lib/auth'

interface LoginRequest {
  apiKey: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: LoginRequest = await request.json()
    
    if (!body.apiKey) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'API key is required',
        },
        { status: 400 }
      )
    }

    if (!validateApiKey(body.apiKey)) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Invalid API key',
        },
        { status: 401 }
      )
    }

    return createAuthResponse(body.apiKey)
  } catch (error) {
    console.error('Error during authentication:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Authentication failed',
      },
      { status: 500 }
    )
  }
}