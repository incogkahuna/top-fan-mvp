import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    // Better error logging
    console.log('Spotify callback received:', { 
      code: code?.substring(0, 20) + '...', 
      error, 
      state,
      url: request.url 
    })

    const baseUrl = process.env.NEXTAUTH_URL || 'https://earlytwentiesstorture.vercel.app'

    if (error) {
      console.error('Spotify OAuth error:', error)
      return NextResponse.redirect(`${baseUrl}/?error=spotify_${error}`)
    }

    if (!code) {
      console.error('No authorization code received from Spotify')
      return NextResponse.redirect(`${baseUrl}/?error=no_code`)
    }

    // Validate required environment variables
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      console.error('Missing Spotify credentials')
      return NextResponse.redirect(`${baseUrl}/?error=missing_credentials`)
    }

    const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3002/api/auth/spotify/callback'

    // Exchange code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText
      })
      return NextResponse.redirect(`${baseUrl}/?error=token_exchange_failed&details=${encodeURIComponent(errorText)}`)
    }

    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token, expires_in } = tokenData

    // Get user info from Spotify
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const spotifyUser = await userResponse.json()

    if (!supabaseAdmin) {
      console.error('Supabase admin not configured')
      return NextResponse.redirect(`${baseUrl}/?error=supabase_not_configured`)
    }

    // Store user in Supabase
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .upsert({
        spotify_id: spotifyUser.id,
        display_name: spotifyUser.display_name || spotifyUser.id,
        email: spotifyUser.email,
        profile_image_url: spotifyUser.images?.[0]?.url || null
      }, {
        onConflict: 'spotify_id'
      })
      .select()
      .single()

    if (userError) {
      console.error('User upsert error:', userError)
      return NextResponse.redirect(`${baseUrl}/?error=database_error&details=${encodeURIComponent(userError.message)}`)
    }

    // Store tokens
    const { error: tokenError } = await supabaseAdmin
      .from('user_tokens')
      .upsert({
        user_id: user.id,
        access_token: access_token,
        refresh_token: refresh_token,
        expires_at: new Date(Date.now() + expires_in * 1000).toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (tokenError) {
      console.error('Token storage error:', tokenError)
      return NextResponse.redirect(`${baseUrl}/?error=token_storage_error&details=${encodeURIComponent(tokenError.message)}`)
    }

    console.log('Successfully authenticated user:', spotifyUser.display_name || spotifyUser.id)

    // Set session cookie and redirect to leaderboard
    const response = NextResponse.redirect(`${baseUrl}/leaderboard`)
    response.cookies.set('spotify_access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return response
  } catch (error) {
    console.error('Spotify callback error:', error)
    const baseUrl = process.env.NEXTAUTH_URL || 'https://earlytwentiesstorture.vercel.app'
    return NextResponse.redirect(`${baseUrl}/?error=callback_error&details=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
  }
}
