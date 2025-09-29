import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getRecentlyPlayed, refreshAccessToken } from '@/lib/spotify'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Get user tokens
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('user_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', 'c8701e94-0f11-4b81-822c-953e2507210d')
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'No token found for user' }, { status: 404 })
    }

    let accessToken = tokenData.access_token

    // Check if token is expired and refresh if needed
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)
    
    if (now >= expiresAt) {
      console.log('Access token expired, refreshing...')
      try {
        const refreshResult = await refreshAccessToken(tokenData.refresh_token)
        accessToken = refreshResult.access_token
      } catch (refreshError) {
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 })
      }
    }

    // Get recently played tracks directly from Spotify
    const recentlyPlayed = await getRecentlyPlayed(accessToken, 10)
    
    // Get the last sync time
    const { data: lastSyncData } = await supabaseAdmin
      .from('users')
      .select('updated_at')
      .eq('id', 'c8701e94-0f11-4b81-822c-953e2507210d')
      .single()

    return NextResponse.json({
      success: true,
      spotifyTracks: recentlyPlayed.items?.map((item: any) => ({
        track_name: item.track.name,
        artist_name: item.track.artists[0].name,
        played_at: item.played_at,
        duration_ms: item.track.duration_ms
      })) || [],
      lastSyncTime: lastSyncData?.updated_at,
      currentTime: now.toISOString(),
      totalTracks: recentlyPlayed.items?.length || 0
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
