import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
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
  return user.body
}

export async function getRecentlyPlayed(accessToken: string, limit = 50): Promise<SpotifyRecentlyPlayed> {
  spotifyApi.setAccessToken(accessToken)
  const recentlyPlayed = await spotifyApi.getMyRecentlyPlayedTracks({ limit })
  return recentlyPlayed.body
}

export async function getTopTracks(accessToken: string, timeRange = 'medium_term', limit = 50) {
  spotifyApi.setAccessToken(accessToken)
  const topTracks = await spotifyApi.getMyTopTracks({ time_range: timeRange, limit })
  return topTracks.body
}

export async function getTopArtists(accessToken: string, timeRange = 'medium_term', limit = 50) {
  spotifyApi.setAccessToken(accessToken)
  const topArtists = await spotifyApi.getMyTopArtists({ time_range: timeRange, limit })
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

  return spotifyApi.createAuthorizeURL(scopes, 'state')
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
