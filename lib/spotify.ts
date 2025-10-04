import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'https://earlytwentiesstorture.vercel.app/api/auth/spotify/callback',
})

export { spotifyApi }

export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  album: {
    id: string
    name: string
    images: Array<{
      url: string
      width: number
      height: number
    }>
  }
  duration_ms: number
  played_at?: string
}

export interface SpotifyUser {
  id: string
  display_name: string
  email: string
  images: Array<{
    url: string
    width: number
    height: number
  }>
}

export interface SpotifyRecentlyPlayed {
  items: Array<{
    track: SpotifyTrack
    played_at: string
  }>
}

// Spotify API helper functions
export async function getSpotifyUser(accessToken: string): Promise<SpotifyUser> {
  spotifyApi.setAccessToken(accessToken)
  const user = await spotifyApi.getMe()
  return {
    id: user.body.id,
    display_name: user.body.display_name || 'Unknown User',
    email: user.body.email || '',
    images: (user.body.images || []).map(img => ({
      url: img.url,
      width: img.width || 0,
      height: img.height || 0
    }))
  }
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  if (!response.ok) {
    throw new Error('Failed to refresh access token')
  }

  return await response.json()
}

export async function getRecentlyPlayed(accessToken: string, limit = 50): Promise<any> {
  spotifyApi.setAccessToken(accessToken)
  const recentlyPlayed = await spotifyApi.getMyRecentlyPlayedTracks({ limit })
  return recentlyPlayed.body
}

export async function getTopTracks(accessToken: string, timeRange = 'medium_term', limit = 50): Promise<any> {
  spotifyApi.setAccessToken(accessToken)
  const topTracks = await spotifyApi.getMyTopTracks({ time_range: timeRange as any, limit })
  return topTracks.body
}

export async function getTopArtists(accessToken: string, timeRange = 'medium_term', limit = 50): Promise<any> {
  spotifyApi.setAccessToken(accessToken)
  const topArtists = await spotifyApi.getMyTopArtists({ time_range: timeRange as any, limit })
  return topArtists.body
}

// Generate Spotify OAuth URL
export function getSpotifyAuthUrl(): string {
  const scopes = [
    'user-read-email',
    'user-read-private',
    'user-top-read',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-read-currently-playing'
  ]

  console.log('Creating Spotify auth URL with scopes:', scopes)
  console.log('Spotify API client ID:', process.env.SPOTIFY_CLIENT_ID)
  console.log('Spotify API redirect URI:', process.env.SPOTIFY_REDIRECT_URI)
  
  try {
    const authUrl = spotifyApi.createAuthorizeURL(scopes, 'state')
    console.log('Successfully created auth URL:', authUrl)
    return authUrl
  } catch (error) {
    console.error('Error creating Spotify auth URL:', error)
    throw error
  }
}

// Exchange authorization code for access token
export async function getAccessToken(code: string) {
  const data = await spotifyApi.authorizationCodeGrant(code)
  return {
    accessToken: data.body.access_token,
    refreshToken: data.body.refresh_token,
    expiresIn: data.body.expires_in
  }
}
