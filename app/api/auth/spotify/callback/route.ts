import { NextRequest, NextResponse } from 'next/server'
import { storeSpotifyTokens } from '@/lib/spotify-tokens'

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
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    console.log('Spotify callback received:', { code: !!code, state, error })
    console.log('Callback environment check:', {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
      request_url: request.url
    })

    if (error) {
      console.error('Spotify auth error:', error)
      const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002'
      return NextResponse.redirect(`${baseUrl}/user?error=spotify_auth_failed&message=${encodeURIComponent(error)}`)
    }

    if (!code) {
      console.error('No authorization code received')
      const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002'
      return NextResponse.redirect(`${baseUrl}/user?error=no_auth_code&message=${encodeURIComponent('No authorization code received')}`)
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
      const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002'
      return NextResponse.redirect(`${baseUrl}/login?error=token_exchange_failed`)
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
      const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002'
      return NextResponse.redirect(`${baseUrl}/login?error=user_profile_failed`)
    }

    const userProfile = await userResponse.json()

            // Store tokens in database
            try {
              const expiresAt = Date.now() + (tokens.expires_in * 1000)
              
              await storeSpotifyTokens(
                userProfile.id,
                {
                  access_token: tokens.access_token,
                  refresh_token: tokens.refresh_token,
                  expires_at: expiresAt,
                  scope: tokens.scope
                },
                {
                  spotify_id: userProfile.id,
                  display_name: userProfile.display_name,
                  email: userProfile.email,
                  profile_image: userProfile.images?.[0]?.url
                }
              )
              
              console.log('User authenticated and tokens stored:', {
                spotifyId: userProfile.id,
                displayName: userProfile.display_name,
                hasAccessToken: !!tokens.access_token,
                hasRefreshToken: !!tokens.refresh_token
              })
            } catch (storageError) {
              console.error('Failed to store tokens:', storageError)
              // Continue with redirect even if storage fails
            }

    // Redirect to user page with success and user ID (user page will handle localStorage storage)
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002'
    const redirectUrl = `${baseUrl}/user?spotify_connected=true&spotify_user_id=${userProfile.id}`
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('Spotify callback error:', error)
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002'
    return NextResponse.redirect(`${baseUrl}/login?error=callback_failed`)
  }
}
