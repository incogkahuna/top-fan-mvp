import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyAuthUrl } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const authUrl = getSpotifyAuthUrl()
    console.log('Generated Spotify auth URL:', authUrl)
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Spotify auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
