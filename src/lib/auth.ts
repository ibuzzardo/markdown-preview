import { NextRequest, NextResponse } from 'next/server'
import type { AuthCookie } from '@/types'

const API_KEY = process.env.API_KEY
const COOKIE_NAME = 'vps-auth'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days

export function isAuthEnabled(): boolean {
  return Boolean(API_KEY)
}

export function validateApiKey(key: string): boolean {
  if (!isAuthEnabled()) {
    return true // Auth disabled in development
  }
  return key === API_KEY
}

export function createAuthCookie(apiKey: string): string {
  const authData: AuthCookie = {
    apiKey,
    expires: Date.now() + COOKIE_MAX_AGE,
  }
  return Buffer.from(JSON.stringify(authData)).toString('base64')
}

export function parseAuthCookie(cookieValue: string): AuthCookie | null {
  try {
    const decoded = Buffer.from(cookieValue, 'base64').toString('utf-8')
    const authData: AuthCookie = JSON.parse(decoded)
    
    // Check if cookie is expired
    if (Date.now() > authData.expires) {
      return null
    }
    
    return authData
  } catch {
    return null
  }
}

export function getAuthFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Check cookie
  const cookie = request.cookies.get(COOKIE_NAME)
  if (cookie) {
    const authData = parseAuthCookie(cookie.value)
    if (authData && validateApiKey(authData.apiKey)) {
      return authData.apiKey
    }
  }
  
  return null
}

export function requireAuth(request: NextRequest): NextResponse | null {
  if (!isAuthEnabled()) {
    return null // Auth disabled
  }
  
  const apiKey = getAuthFromRequest(request)
  if (!apiKey || !validateApiKey(apiKey)) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid or missing API key' },
      { status: 401 }
    )
  }
  
  return null // Auth successful
}

export function createAuthResponse(apiKey: string): NextResponse {
  const response = NextResponse.json({ success: true })
  
  response.cookies.set(COOKIE_NAME, createAuthCookie(apiKey), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE / 1000, // seconds
    path: '/',
  })
  
  return response
}

export function clearAuthCookie(): NextResponse {
  const response = NextResponse.json({ success: true })
  
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  
  return response
}