import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
// DISABLED: Spotify import removed

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's tokens using admin client
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('user_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', userId)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'No valid token found' }, { status: 401 })
    }

    let accessToken = tokenData.access_token

    // Check if token is expired and refresh if needed
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)
    
    if (now >= expiresAt) {
      console.log('Access token expired, refreshing...')
      // DISABLED: Spotify functions removed
      /*
      try {
        const refreshResult = await refreshAccessToken(tokenData.refresh_token)
        accessToken = refreshResult.access_token
        
        // Update the token in database
        await supabaseAdmin
          .from('user_tokens')
          .update({
            access_token: refreshResult.access_token,
            expires_at: new Date(Date.now() + refreshResult.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
        
        console.log('Token refreshed successfully')
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        return NextResponse.json({ error: 'Failed to refresh access token. Please reconnect to music service.' }, { status: 401 })
      }
      */
      // Return error since Spotify functions are disabled
      return NextResponse.json({ error: 'Music service integration disabled' }, { status: 503 })
    }

    // Fetch recently played tracks (limit to 20 for faster response)
    // DISABLED: Spotify functions removed
    // const recentlyPlayed = await getRecentlyPlayed(accessToken, 20)
    
    // Return placeholder response since Spotify functions are disabled
    return NextResponse.json({ 
      message: 'Music service integration disabled',
      tracks: [],
      total: 0
    })
    
    // DISABLED: All Spotify-related code commented out
    /*
    if (!recentlyPlayed.items || recentlyPlayed.items.length === 0) {
      return NextResponse.json({ 
        success: true, 
        synced: 0,
        message: 'No tracks found in music API'
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

    // Process only Sadie Jean tracks
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
      totalPlays: playCount?.length || 0
    })
    */
  } catch (error) {
    console.error('Data sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
