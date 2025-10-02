import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyAuthUrl } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    // Debug environment variables
    console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? 'SET' : 'NOT SET')
    console.log('SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? 'SET' : 'NOT SET')
    console.log('SPOTIFY_REDIRECT_URI:', process.env.SPOTIFY_REDIRECT_URI)
    
    const authUrl = getSpotifyAuthUrl()
    console.log('Generated Spotify auth URL:', authUrl)
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Spotify auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
