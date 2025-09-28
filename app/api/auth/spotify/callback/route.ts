import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, getSpotifyUser } from '@/lib/spotify'
import { supabase } from '@/lib/supabase'

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

    // Store or update user in Supabase
    const { data: user, error: userError } = await supabase
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

    // Store tokens securely (in a real app, you'd want to encrypt these)
    const { error: tokenError } = await supabase
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
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=token_error`)
    }

    // Redirect to dashboard with success
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?success=connected`)
  } catch (error) {
    console.error('Spotify callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/?error=callback_error`)
  }
}
