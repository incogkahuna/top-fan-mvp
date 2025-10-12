import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/admin-auth'

const ADMIN_PASSWORD = 'Gaviotagoeshard!!'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const password = formData.get('password') as string
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password required' }, 
        { status: 400 }
      )
    }
    
    // Verify password directly
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' }, 
        { status: 401 }
      )
    }
    
    // Create admin session
    const sessionToken = createAdminSession()
    
    // Set admin session cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Login failed' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Check if already logged in
  const { verifyAdminSession } = await import('@/lib/admin-auth')
  const sessionResult = verifyAdminSession(request)
  
  if (sessionResult.authorized) {
    return NextResponse.json({ authenticated: true })
  }
  
  return NextResponse.json({ authenticated: false })
}
