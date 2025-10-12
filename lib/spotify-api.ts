// Spotify API helper functions
export interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
  refresh_token?: string
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  duration_ms: number
}

export interface SpotifyPlayHistoryItem {
  track: SpotifyTrack
  played_at: string
}

export interface SpotifyRecentlyPlayedResponse {
  items: SpotifyPlayHistoryItem[]
  next: string | null
  cursors: {
    after: string | null
    before: string | null
  }
}

// Refresh Spotify access token
export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Spotify configuration missing')
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Token refresh failed: ${errorData.error_description || errorData.error}`)
  }

  return response.json()
}

// Get recently played tracks from Spotify
export async function getRecentlyPlayed(accessToken: string, limit: number = 50): Promise<SpotifyRecentlyPlayedResponse> {
  const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to fetch recently played: ${errorData.error?.message || 'Unknown error'}`)
  }

  return response.json()
}
