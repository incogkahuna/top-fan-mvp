import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/?error=access_denied')
    }

    if (!code) {
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
        redirect_uri: 'https://earlytwentiesstorture.vercel.app/api/auth/spotify/callback'
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed')
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
      return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/?error=supabase_not_configured')
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
      return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/?error=database_error')
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
      return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/?error=token_error')
    }

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
