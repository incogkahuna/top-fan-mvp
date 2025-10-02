import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyAuthUrl } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    const authUrl = getSpotifyAuthUrl()
    
    // Parse the URL to show components
    const url = new URL(authUrl)
    const params = url.searchParams
    
    return NextResponse.json({
      fullUrl: authUrl,
      baseUrl: url.origin,
      pathname: url.pathname,
      clientId: params.get('client_id'),
      redirectUri: params.get('redirect_uri'),
      responseType: params.get('response_type'),
      scopes: params.get('scope'),
      state: params.get('state'),
      env: {
        SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
        SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to generate auth URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
