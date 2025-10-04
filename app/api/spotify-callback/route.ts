import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    console.log('Spotify callback received:', { 
      code: code?.substring(0, 20) + '...', 
      error 
    })

    if (error) {
      console.error('Spotify OAuth error:', error)
      return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/?error=spotify_' + error)
    }

    if (!code) {
      console.error('No authorization code received from Spotify')
      return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/?error=no_code')
    }

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
        redirect_uri: 'https://earlytwentiesstorture.vercel.app/api/spotify-callback'
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', errorText)
      return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/?error=token_failed')
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

    // Store user in Supabase (if configured)
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from('users').upsert({
          spotify_id: spotifyUser.id,
          display_name: spotifyUser.display_name || spotifyUser.id,
          email: spotifyUser.email,
          profile_image_url: spotifyUser.images?.[0]?.url || null
        }, { onConflict: 'spotify_id' })

        await supabaseAdmin.from('user_tokens').upsert({
          user_id: spotifyUser.id,
          access_token: access_token,
          refresh_token: refresh_token,
          expires_at: new Date(Date.now() + expires_in * 1000).toISOString()
        }, { onConflict: 'user_id' })
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Continue anyway - don't fail the auth
      }
    }

    console.log('Successfully authenticated user:', spotifyUser.display_name || spotifyUser.id)

    // Set session cookie and redirect to leaderboard
    const response = NextResponse.redirect('https://earlytwentiesstorture.vercel.app/leaderboard')
    response.cookies.set('spotify_access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return response
  } catch (error) {
    console.error('Spotify callback error:', error)
    return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/?error=callback_error')
  }
}