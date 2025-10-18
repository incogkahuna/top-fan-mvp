import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { refreshAccessToken, getRecentlyPlayed } from '@/lib/spotify-api'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { spotify_id } = await request.json()
    
    if (!spotify_id) {
      return NextResponse.json({ error: 'Spotify ID required' }, { status: 400 })
    }

    console.log('🔄 Force sync: Starting sync for Spotify ID:', spotify_id)

    // Find user by Spotify ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, spotify_id, display_name, spotify_access_token, spotify_refresh_token, token_expires_at')
      .eq('spotify_id', spotify_id)
      .single()

    if (userError) {
      if (userError.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
      }
      throw userError
    }

    console.log('✅ User found:', user.id, user.display_name)

    // Get user's tokens
    if (!user.spotify_access_token) {
      return NextResponse.json({ error: 'No Spotify access token found for user' }, { status: 401 })
    }

    let accessToken = user.spotify_access_token

    // Check if token is expired and refresh if needed
    const now = new Date()
    const expiresAt = new Date(user.token_expires_at)
    
    if (now >= expiresAt) {
      console.log('🔄 Access token expired, refreshing...')
      try {
        const refreshResult = await refreshAccessToken(user.spotify_refresh_token)
        accessToken = refreshResult.access_token
        
        // Update the token in users table
        await supabaseAdmin
          .from('users')
          .update({
            spotify_access_token: refreshResult.access_token,
            token_expires_at: new Date(Date.now() + refreshResult.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
        
        console.log('✅ Token refreshed successfully')
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError)
        return NextResponse.json({ error: 'Failed to refresh access token. Please reconnect to Spotify.' }, { status: 401 })
      }
    }

    // Fetch recently played tracks (limit to 50 for more data)
    const recentlyPlayed = await getRecentlyPlayed(accessToken, 50)
    
    if (!recentlyPlayed.items || recentlyPlayed.items.length === 0) {
      return NextResponse.json({ 
        success: true, 
        synced: 0,
        message: 'No tracks found in Spotify API'
      })
    }

    console.log('📊 Found', recentlyPlayed.items.length, 'recently played tracks')

    // Filter for only Sadie Jean tracks
    const sadieJeanTracks = recentlyPlayed.items.filter((item: any) => {
      const artistName = item.track.artists[0]?.name?.toLowerCase() || ''
      return artistName.includes('sadie jean')
    })

    console.log('🎵 Found', sadieJeanTracks.length, 'Sadie Jean tracks')

    if (sadieJeanTracks.length === 0) {
      return NextResponse.json({ 
        success: true, 
        synced: 0,
        message: 'No Sadie Jean tracks found in recent listening history'
      })
    }
    
    // Process and store Sadie Jean listening data
    const listeningData = sadieJeanTracks.map((item: any) => ({
      user_id: user.id,
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
      console.error('❌ Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to store listening data' }, { status: 500 })
    }

    console.log('✅ Listening data stored successfully')

    // Update user's total plays count - count only Sadie Jean tracks
    const { data: sadieJeanPlayCount } = await supabaseAdmin
      .from('listening_data')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .ilike('artist_name', '%sadie jean%') // Only count Sadie Jean tracks

    await supabaseAdmin
      .from('users')
      .update({ 
        total_plays: sadieJeanPlayCount?.length || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    console.log('✅ Updated total_plays to:', sadieJeanPlayCount?.length || 0)

    return NextResponse.json({ 
      success: true, 
      user: {
        database_id: user.id,
        spotify_id: user.spotify_id,
        display_name: user.display_name
      },
      sync_results: {
        total_tracks_found: recentlyPlayed.items.length,
        sadie_jean_tracks_synced: listeningData.length,
        total_plays_updated: sadieJeanPlayCount?.length || 0
      },
      message: 'Sync completed successfully'
    })

  } catch (error) {
    console.error('Force sync error:', error)
    return NextResponse.json({ error: 'Force sync failed' }, { status: 500 })
  }
}
