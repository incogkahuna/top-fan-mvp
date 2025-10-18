import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
  refresh_token: string
}

export async function GET(request: NextRequest) {
  try {
    console.log('🎯 Spotify OAuth callback started')
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    // Check if this is a mobile device
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())

    console.log('🎯 Spotify callback received:', { code: !!code, state, error, isMobile })

    if (error) {
      console.error('Spotify auth error:', error)
      const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
      const redirectPath = isMobile ? '/mobile-redirect' : '/profile'
      return NextResponse.redirect(`${baseUrl}${redirectPath}?error=spotify_auth_failed&message=${encodeURIComponent(error)}`)
    }

    if (!code) {
      console.error('No authorization code received')
      const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
      const redirectPath = isMobile ? '/mobile-redirect' : '/profile'
      return NextResponse.redirect(`${baseUrl}${redirectPath}?error=no_auth_code&message=${encodeURIComponent('No authorization code received')}`)
    }

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: 'Spotify configuration missing' },
        { status: 500 }
      )
    }

    // Exchange code for tokens
    console.log('🔄 Attempting token exchange with Spotify...')
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      })
    })

    console.log('🔍 Token exchange response status:', tokenResponse.status)

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('❌ Token exchange failed:', errorData)
      const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
      const redirectPath = isMobile ? '/mobile-redirect' : '/test-redirect'
      return NextResponse.redirect(`${baseUrl}${redirectPath}?error=token_exchange_failed`)
    }

    const tokens: SpotifyTokenResponse = await tokenResponse.json()

    // Get user profile to identify the user
    console.log('🔄 Fetching user profile from Spotify...')
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })

    console.log('🔍 User profile response status:', userResponse.status)

    if (!userResponse.ok) {
      console.error('❌ Failed to get user profile, status:', userResponse.status)
      const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
      const redirectPath = isMobile ? '/mobile-redirect' : '/test-redirect'
      return NextResponse.redirect(`${baseUrl}${redirectPath}?error=user_profile_failed`)
    }

    const userProfile = await userResponse.json()
    console.log('✅ User profile fetched successfully:', userProfile.id, userProfile.display_name)

    // Calculate token expiration
    const expiresAt = Date.now() + (tokens.expires_in * 1000)
    
    console.log('🔄 Redirecting to profile setup for new user:', userProfile.id)
    
    // Redirect to profile setup page with user data as URL parameters
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
    
    const setupParams = new URLSearchParams({
      spotify_id: userProfile.id,
      display_name: userProfile.display_name || '',
      email: userProfile.email || '',
      profile_image: userProfile.images?.[0]?.url || '',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || '',
      expires_at: expiresAt.toString(),
      scope: tokens.scope || ''
    })
    
    return NextResponse.redirect(`${baseUrl}/profile-setup?${setupParams.toString()}`)
  } catch (error) {
    console.error('Spotify callback error:', error)
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
    const redirectPath = isMobile ? '/mobile-redirect' : '/profile'
    return NextResponse.redirect(`${baseUrl}${redirectPath}?error=callback_failed`)
  }
}
