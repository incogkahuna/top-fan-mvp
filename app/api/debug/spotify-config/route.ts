import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const config = {
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID ? 'Set' : 'Missing',
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ? 'Set' : 'Missing',
      SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI || 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'Missing'
    }

    // Test if we can create the auth URL
    let authUrl = 'Failed to generate'
    try {
      const { getSpotifyAuthUrl } = await import('@/lib/spotify')
      authUrl = getSpotifyAuthUrl()
    } catch (error) {
      authUrl = `Error: ${error}`
    }

    return NextResponse.json({
      config,
      authUrl,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
