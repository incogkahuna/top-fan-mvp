import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri = 'https://earlytwentiesstorture.vercel.app/api/spotify-callback'
  
  return NextResponse.json({
    // Environment check
    clientIdExists: !!clientId,
    clientSecretExists: !!clientSecret,
    clientIdValue: clientId ? clientId.substring(0, 8) + '...' : 'NOT_FOUND',
    clientSecretValue: clientSecret ? clientSecret.substring(0, 8) + '...' : 'NOT_FOUND',
    
    // Configuration
    redirectUri: redirectUri,
    environment: process.env.NODE_ENV,
    
    // Spotify app settings (hardcoded for comparison)
    expectedClientId: '3d8d032ed282470cac128ad3e41ccf6a',
    expectedClientSecret: '68dff20af10c4b129b1db3a12f0c4ef8',
    
    // Validation
    clientIdMatches: clientId === '3d8d032ed282470cac128ad3e41ccf6a',
    clientSecretMatches: clientSecret === '68dff20af10c4b129b1db3a12f0c4ef8',
    
    timestamp: new Date().toISOString()
  })
}
