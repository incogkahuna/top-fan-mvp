import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🎯 SPOTIFY AUTH ROUTE CALLED!')
  console.log('Request URL:', request.url)
  
  try {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI
    
    console.log('Client ID exists:', !!clientId)
    console.log('Redirect URI exists:', !!redirectUri)
    
    if (!clientId || !redirectUri) {
      console.log('❌ Spotify configuration missing')
      return NextResponse.json(
        { error: 'Spotify configuration missing' },
        { status: 500 }
      )
    }

    // Scopes for Sadie Jean listening data only
    const scopes = [
      'user-read-recently-played',
      'user-top-read',
      'user-read-private'
    ].join(' ')

    // Generate state parameter for security
    const state = Math.random().toString(36).substring(2, 15)
    
    // Store state in a secure way (you might want to use a database or session)
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
      state: state,
    })

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
    
    console.log('🚀 Redirecting to Spotify:', spotifyAuthUrl)
    return NextResponse.redirect(spotifyAuthUrl)
  } catch (error) {
    console.error('Spotify auth error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Spotify authentication' },
      { status: 500 }
    )
  }
}
