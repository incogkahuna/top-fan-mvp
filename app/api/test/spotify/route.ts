import { NextResponse } from 'next/server'
import { spotifyApi } from '@/lib/spotify'

export async function GET() {
  try {
    // Test Spotify API credentials
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Spotify credentials not configured' }, { status: 400 })
    }

    // Test client credentials flow
    const data = await spotifyApi.clientCredentialsGrant()
    
    if (data.body.access_token) {
      return NextResponse.json({ success: true, message: 'Spotify API credentials are valid' })
    } else {
      return NextResponse.json({ error: 'Invalid Spotify credentials' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Spotify API test failed' }, { status: 500 })
  }
}
