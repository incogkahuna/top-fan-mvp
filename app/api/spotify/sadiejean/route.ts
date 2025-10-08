import { NextRequest, NextResponse } from 'next/server'
import { getValidAccessToken } from '@/lib/spotify-tokens'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  duration_ms: number
  played_at?: string
}

interface SadieJeanStats {
  totalPlays: number
  totalListeningTime: number // in milliseconds
  topTracks: Array<{
    name: string
    plays: number
    duration_ms: number
  }>
  recentPlays: Array<{
    track_name: string
    played_at: string
    duration_ms: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params or headers
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Get valid access token (will refresh if needed)
    const accessToken = await getValidAccessToken(userId)
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No valid access token found. Please reconnect your Spotify account.' },
        { status: 401 }
      )
    }

    const sadieJeanArtistId = '0sMAHzxguan2KpnKFZPW2d'
    const sadieJeanStats: SadieJeanStats = {
      totalPlays: 0,
      totalListeningTime: 0,
      topTracks: [],
      recentPlays: []
    }

    // Track counts for top tracks
    const trackCounts: { [key: string]: { count: number; duration_ms: number } } = {}

    // Fetch recently played tracks
    const recentResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (recentResponse.ok) {
      const recentData = await recentResponse.json()
      
      for (const item of recentData.items) {
        const track = item.track
        
        // Check if this is a Sadie Jean track
        const isSadieJeanTrack = track.artists.some((artist: any) => artist.id === sadieJeanArtistId)
        
        if (isSadieJeanTrack) {
          sadieJeanStats.totalPlays++
          sadieJeanStats.totalListeningTime += track.duration_ms
          
          // Add to recent plays
          sadieJeanStats.recentPlays.push({
            track_name: track.name,
            played_at: item.played_at,
            duration_ms: track.duration_ms
          })
          
          // Count for top tracks
          const trackKey = `${track.name}`
          if (trackCounts[trackKey]) {
            trackCounts[trackKey].count++
          } else {
            trackCounts[trackKey] = {
              count: 1,
              duration_ms: track.duration_ms
            }
          }
        }
      }
    }

    // Fetch top tracks (short term)
    const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (topTracksResponse.ok) {
      const topTracksData = await topTracksResponse.json()
      
      for (const track of topTracksData.items) {
        // Check if this is a Sadie Jean track
        const isSadieJeanTrack = track.artists.some((artist: any) => artist.id === sadieJeanArtistId)
        
        if (isSadieJeanTrack) {
          // Add to track counts (this gives us more data points)
          const trackKey = `${track.name}`
          if (trackCounts[trackKey]) {
            trackCounts[trackKey].count++
          } else {
            trackCounts[trackKey] = {
              count: 1,
              duration_ms: track.duration_ms
            }
          }
        }
      }
    }

    // Convert track counts to top tracks array
    sadieJeanStats.topTracks = Object.entries(trackCounts)
      .map(([name, data]) => ({
        name,
        plays: data.count,
        duration_ms: data.duration_ms
      }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 10) // Top 10 tracks

    // Sort recent plays by most recent
    sadieJeanStats.recentPlays.sort((a, b) => 
      new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
    )

    return NextResponse.json({
      success: true,
      data: sadieJeanStats,
      artistId: sadieJeanArtistId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Sadie Jean data fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Sadie Jean listening data' },
      { status: 500 }
    )
  }
}
