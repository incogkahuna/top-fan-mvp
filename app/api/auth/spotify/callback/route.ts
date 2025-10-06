import { NextRequest, NextResponse } from 'next/server'

interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
  refresh_token: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      console.error('Spotify auth error:', error)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://your-app-name.vercel.app'}/login?error=spotify_auth_failed`)
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://your-app-name.vercel.app'}/login?error=no_auth_code`)
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

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://your-app-name.vercel.app'}/login?error=token_exchange_failed`)
    }

    const tokens: SpotifyTokenResponse = await tokenResponse.json()

    // Get user profile to identify the user
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })

    if (!userResponse.ok) {
      console.error('Failed to get user profile')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://your-app-name.vercel.app'}/login?error=user_profile_failed`)
    }

    const userProfile = await userResponse.json()

    // TODO: Store tokens in database with user ID
    // For now, we'll redirect with success and handle storage in the next step
    console.log('User authenticated:', {
      spotifyId: userProfile.id,
      displayName: userProfile.display_name,
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token
    })

    // Redirect to leaderboard with success
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://your-app-name.vercel.app'}/leaderboard?spotify_connected=true`)
  } catch (error) {
    console.error('Spotify callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'https://your-app-name.vercel.app'}/login?error=callback_failed`)
  }
}
