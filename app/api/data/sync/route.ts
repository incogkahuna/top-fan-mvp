import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { refreshAccessToken, getRecentlyPlayed } from '@/lib/spotify-api'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's tokens from users table (Spotify auth stores tokens here)
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('users')
      .select('spotify_access_token, spotify_refresh_token, token_expires_at')
      .eq('id', userId)
      .single()

    if (tokenError || !tokenData || !tokenData.spotify_access_token) {
      return NextResponse.json({ error: 'No valid Spotify token found' }, { status: 401 })
    }

    let accessToken = tokenData.spotify_access_token

    // Check if token is expired and refresh if needed
    const now = new Date()
    const expiresAt = new Date(tokenData.token_expires_at)
    
    if (now >= expiresAt) {
      console.log('Access token expired, refreshing...')
      try {
        const refreshResult = await refreshAccessToken(tokenData.spotify_refresh_token)
        accessToken = refreshResult.access_token
        
        // Update the token in users table
        await supabaseAdmin
          .from('users')
          .update({
            spotify_access_token: refreshResult.access_token,
            token_expires_at: new Date(Date.now() + refreshResult.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
        
        console.log('Token refreshed successfully')
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        return NextResponse.json({ error: 'Failed to refresh access token. Please reconnect to Spotify.' }, { status: 401 })
      }
    }

    // Fetch recently played tracks (limit to 20 for faster response)
    const recentlyPlayed = await getRecentlyPlayed(accessToken, 20)
    
    if (!recentlyPlayed.items || recentlyPlayed.items.length === 0) {
      return NextResponse.json({ 
        success: true, 
        synced: 0,
        message: 'No tracks found in Spotify API'
      })
    }

    // Filter for only Sadie Jean tracks
    const sadieJeanTracks = recentlyPlayed.items.filter((item: any) => {
      const artistName = item.track.artists[0]?.name?.toLowerCase() || ''
      return artistName.includes('sadie jean')
    })

    if (sadieJeanTracks.length === 0) {
      return NextResponse.json({ 
        success: true, 
        synced: 0,
        message: 'No Sadie Jean tracks found in recent listening history'
      })
    }
    
    // Process and store only Sadie Jean listening data
    const listeningData = sadieJeanTracks.map((item: any) => ({
      user_id: userId,
      track_id: item.track.id,
      track_name: item.track.name,
      artist_name: item.track.artists[0].name,
      played_at: item.played_at,
      duration_ms: item.track.duration_ms
    }))

    // Batch insert listening data using admin client
    const { error: insertError } = await supabaseAdmin
      .from('listening_data')
      .upsert(listeningData, {
        onConflict: 'user_id,track_id,played_at'
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to store listening data' }, { status: 500 })
    }

    // Update user's total plays count
    const { data: playCount } = await supabaseAdmin
      .from('listening_data')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)

    await supabaseAdmin
      .from('users')
      .update({ 
        total_plays: playCount?.length || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    return NextResponse.json({ 
      success: true, 
      synced: listeningData.length,
      totalPlays: playCount?.length || 0,
      message: 'Sync completed successfully'
    })
  } catch (error) {
    console.error('Data sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
