import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // For Spotify auth, we just clear the response since we use localStorage
    // The frontend will handle clearing localStorage and sessionStorage
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
    
    // Clear any potential cookies (though we primarily use localStorage)
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
