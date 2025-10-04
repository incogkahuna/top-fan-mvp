import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const redirectUri = 'https://earlytwentiesstorture.vercel.app/api/spotify-callback'
    
    if (!clientId) {
      return NextResponse.json({ error: 'Spotify client ID not configured' }, { status: 500 })
    }

    const scopes = [
      'user-read-email',
      'user-read-private',
      'user-top-read',
      'user-read-recently-played'
    ].join(' ')

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=spotify_auth`

    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Spotify auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
