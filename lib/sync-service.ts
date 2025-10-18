import { supabaseAdmin } from '@/lib/supabase'
import { refreshAccessToken, getRecentlyPlayed } from '@/lib/spotify-api'

export interface SyncResult {
  success: boolean
  synced: number
  totalPlays: number
  error?: string
}

/**
 * Sync user's listening data from Spotify to database
 * @param userId - Database user ID or Spotify ID
 * @param isSpotifyId - Whether userId is a Spotify ID (true) or database ID (false)
 * @returns SyncResult with sync statistics
 */
export async function syncUserListeningData(userId: string, isSpotifyId: boolean = false): Promise<SyncResult> {
  try {
    if (!supabaseAdmin) {
      return { success: false, synced: 0, totalPlays: 0, error: 'Supabase not configured' }
    }

    let databaseUserId = userId

    // If Spotify ID provided, find the database user ID
    if (isSpotifyId) {
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, spotify_access_token, spotify_refresh_token, token_expires_at')
        .eq('spotify_id', userId)
        .single()

      if (userError || !user) {
        return { success: false, synced: 0, totalPlays: 0, error: 'User not found' }
      }

      databaseUserId = user.id
      
      // Get user's tokens
      if (!user.spotify_access_token) {
        return { success: false, synced: 0, totalPlays: 0, error: 'No Spotify access token found' }
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
          return { success: false, synced: 0, totalPlays: 0, error: 'Failed to refresh access token' }
        }
      }

      // Fetch recently played tracks (limit to 50 for more data)
      const recentlyPlayed = await getRecentlyPlayed(accessToken, 50)
      
      if (!recentlyPlayed.items || recentlyPlayed.items.length === 0) {
        return { success: true, synced: 0, totalPlays: 0 }
      }

      console.log('📊 Found', recentlyPlayed.items.length, 'recently played tracks')

      // Filter for only Sadie Jean tracks
      const sadieJeanTracks = recentlyPlayed.items.filter((item: any) => {
        const artistName = item.track.artists[0]?.name?.toLowerCase() || ''
        return artistName.includes('sadie jean')
      })

      console.log('🎵 Found', sadieJeanTracks.length, 'Sadie Jean tracks')

      if (sadieJeanTracks.length === 0) {
        return { success: true, synced: 0, totalPlays: 0 }
      }
      
      // Process and store Sadie Jean listening data
      const listeningData = sadieJeanTracks.map((item: any) => ({
        user_id: databaseUserId,
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
        return { success: false, synced: 0, totalPlays: 0, error: 'Failed to store listening data' }
      }

      console.log('✅ Listening data stored successfully')

      // Update user's total plays count - count only Sadie Jean tracks
      const { data: sadieJeanPlayCount } = await supabaseAdmin
        .from('listening_data')
        .select('id', { count: 'exact' })
        .eq('user_id', databaseUserId)
        .ilike('artist_name', '%sadie jean%') // Only count Sadie Jean tracks

      await supabaseAdmin
        .from('users')
        .update({ 
          total_plays: sadieJeanPlayCount?.length || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', databaseUserId)

      console.log('✅ Updated total_plays to:', sadieJeanPlayCount?.length || 0)

      return { 
        success: true, 
        synced: listeningData.length,
        totalPlays: sadieJeanPlayCount?.length || 0
      }

    } else {
      // If database ID provided, get user tokens first
      const { data: tokenData, error: tokenError } = await supabaseAdmin
        .from('users')
        .select('spotify_access_token, spotify_refresh_token, token_expires_at')
        .eq('id', databaseUserId)
        .single()

      if (tokenError || !tokenData || !tokenData.spotify_access_token) {
        return { success: false, synced: 0, totalPlays: 0, error: 'No valid Spotify token found' }
      }

      let accessToken = tokenData.spotify_access_token

      // Check if token is expired and refresh if needed
      const now = new Date()
      const expiresAt = new Date(tokenData.token_expires_at)
      
      if (now >= expiresAt) {
        console.log('🔄 Access token expired, refreshing...')
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
            .eq('id', databaseUserId)
          
          console.log('✅ Token refreshed successfully')
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError)
          return { success: false, synced: 0, totalPlays: 0, error: 'Failed to refresh access token' }
        }
      }

      // Fetch recently played tracks (limit to 50 for more data)
      const recentlyPlayed = await getRecentlyPlayed(accessToken, 50)
      
      if (!recentlyPlayed.items || recentlyPlayed.items.length === 0) {
        return { success: true, synced: 0, totalPlays: 0 }
      }

      console.log('📊 Found', recentlyPlayed.items.length, 'recently played tracks')

      // Filter for only Sadie Jean tracks
      const sadieJeanTracks = recentlyPlayed.items.filter((item: any) => {
        const artistName = item.track.artists[0]?.name?.toLowerCase() || ''
        return artistName.includes('sadie jean')
      })

      console.log('🎵 Found', sadieJeanTracks.length, 'Sadie Jean tracks')

      if (sadieJeanTracks.length === 0) {
        return { success: true, synced: 0, totalPlays: 0 }
      }
      
      // Process and store Sadie Jean listening data
      const listeningData = sadieJeanTracks.map((item: any) => ({
        user_id: databaseUserId,
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
        return { success: false, synced: 0, totalPlays: 0, error: 'Failed to store listening data' }
      }

      console.log('✅ Listening data stored successfully')

      // Update user's total plays count - count only Sadie Jean tracks
      const { data: sadieJeanPlayCount } = await supabaseAdmin
        .from('listening_data')
        .select('id', { count: 'exact' })
        .eq('user_id', databaseUserId)
        .ilike('artist_name', '%sadie jean%') // Only count Sadie Jean tracks

      await supabaseAdmin
        .from('users')
        .update({ 
          total_plays: sadieJeanPlayCount?.length || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', databaseUserId)

      console.log('✅ Updated total_plays to:', sadieJeanPlayCount?.length || 0)

      return { 
        success: true, 
        synced: listeningData.length,
        totalPlays: sadieJeanPlayCount?.length || 0
      }
    }

  } catch (error) {
    console.error('❌ Sync error:', error)
    return { 
      success: false, 
      synced: 0, 
      totalPlays: 0, 
      error: error instanceof Error ? error.message : 'Unknown sync error'
    }
  }
}

/**
 * Sync all users' listening data
 * @returns Array of sync results for each user
 */
export async function syncAllUsers(): Promise<Array<{ userId: string, result: SyncResult }>> {
  try {
    if (!supabaseAdmin) {
      return []
    }

    // Get all users with Spotify tokens
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, spotify_id, display_name')
      .not('spotify_access_token', 'is', null)

    if (usersError || !users) {
      console.error('❌ Error fetching users:', usersError)
      return []
    }

    console.log(`🔄 Starting sync for ${users.length} users`)

    const results: Array<{ userId: string, result: SyncResult }> = []

    // Sync each user
    for (const user of users) {
      console.log(`🔄 Syncing user: ${user.display_name} (${user.spotify_id})`)
      
      const result = await syncUserListeningData(user.id, false)
      results.push({ userId: user.id, result })
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`✅ Completed sync for ${users.length} users`)
    return results

  } catch (error) {
    console.error('❌ Batch sync error:', error)
    return []
  }
}
