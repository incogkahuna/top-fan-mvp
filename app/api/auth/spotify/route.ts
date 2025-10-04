import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const redirectUri = 'https://earlytwentiesstorture.vercel.app/api/spotify-callback'
    
    console.log('Spotify auth route called')
    console.log('Client ID exists:', !!clientId)
    console.log('Redirect URI:', redirectUri)
    
    if (!clientId) {
      console.error('SPOTIFY_CLIENT_ID not found in environment variables')
      return NextResponse.json({ 
        error: 'Spotify client ID not configured',
        details: 'SPOTIFY_CLIENT_ID environment variable is missing'
      }, { status: 500 })
    }

    const scopes = [
      'user-read-email',
      'user-read-private'
    ].join(' ')

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=spotify_auth`

    console.log('Redirecting to Spotify:', authUrl.substring(0, 100) + '...')
    
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Spotify auth error:', error)
    return NextResponse.json({ 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}