import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, getSpotifyUser } from '@/lib/spotify'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=access_denied`)
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=no_code`)
    }

    // Exchange code for access token
    const { accessToken, refreshToken, expiresIn } = await getAccessToken(code)
    
    // Get user info from Spotify
    const spotifyUser = await getSpotifyUser(accessToken)

    if (!supabaseAdmin) {
      console.error('Supabase admin client not available')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=supabase_not_configured`)
    }

    // Store or update user in Supabase using admin client (bypasses RLS)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .upsert({
        spotify_id: spotifyUser.id,
        display_name: spotifyUser.display_name,
        email: spotifyUser.email,
        profile_image_url: spotifyUser.images[0]?.url,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'spotify_id'
      })
      .select()
      .single()

    if (userError) {
      console.error('User upsert error:', userError)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=database_error`)
    }

    // Store tokens securely using admin client (bypasses RLS)
    const { error: tokenError } = await supabaseAdmin
      .from('user_tokens')
      .upsert({
        user_id: user.id,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (tokenError) {
      console.error('Token storage error:', tokenError)
      return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/?error=token_error')
    }

    // Set session cookie and redirect to leaderboard
    const response = NextResponse.redirect('https://earlytwentiesstorture.vercel.app/leaderboard')
    response.cookies.set('spotify_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    return response
  } catch (error) {
    console.error('Spotify callback error:', error)
    return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/?error=callback_error')
  }
}
