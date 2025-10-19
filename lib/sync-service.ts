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
  const startTime = Date.now()
  console.log(`🚀 [Sync] Starting sync for ${isSpotifyId ? 'Spotify ID' : 'Database ID'}: ${userId}`)
  
  try {
    if (!supabaseAdmin) {
      return { success: false, synced: 0, totalPlays: 0, error: 'Supabase not configured' }
    }

    let databaseUserId = userId
    let accessToken: string
    let refreshToken: string

    // If Spotify ID provided, find the database user ID and get tokens
    if (isSpotifyId) {
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('id, spotify_access_token, spotify_refresh_token, token_expires_at')
        .eq('spotify_id', userId)
        .single()

      if (userError || !user) {
        console.error(`❌ [Sync] User not found for Spotify ID: ${userId}`, userError?.message)
        return { success: false, synced: 0, totalPlays: 0, error: 'User not found' }
      }

      databaseUserId = user.id
      accessToken = user.spotify_access_token
      refreshToken = user.spotify_refresh_token
      
      if (!accessToken || !refreshToken) {
        console.error(`❌ [Sync] Missing tokens for user: ${userId}`)
        return { success: false, synced: 0, totalPlays: 0, error: 'No Spotify tokens found' }
      }

      // Check if token is expired and refresh if needed (with 5 minute buffer)
      const now = new Date()
      const expiresAt = new Date(user.token_expires_at)
      const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
      
      if (now.getTime() >= (expiresAt.getTime() - bufferTime)) {
        console.log('🔄 [Sync] Access token expired or expiring soon, refreshing...')
        try {
          const refreshResult = await refreshAccessToken(refreshToken)
          accessToken = refreshResult.access_token
          
          // Update the token in users table
          const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({
              spotify_access_token: refreshResult.access_token,
              token_expires_at: new Date(Date.now() + refreshResult.expires_in * 1000).toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
          
          if (updateError) {
            console.error('⚠️ [Sync] Failed to update token in database:', updateError.message)
          } else {
            console.log('✅ [Sync] Token refreshed and updated successfully')
          }
        } catch (refreshError) {
          console.error('❌ [Sync] Token refresh failed:', refreshError)
          return { success: false, synced: 0, totalPlays: 0, error: 'Failed to refresh access token' }
        }
      }

      // Fetch recently played tracks with increased limit for better sync
      console.log('📊 [Sync] Fetching recently played tracks...')
      const recentlyPlayed = await getRecentlyPlayed(accessToken, 50)
      
      if (!recentlyPlayed.items || recentlyPlayed.items.length === 0) {
        console.log('ℹ️ [Sync] No recently played tracks found')
        return { success: true, synced: 0, totalPlays: 0 }
      }

      console.log(`📊 [Sync] Found ${recentlyPlayed.items.length} recently played tracks`)

      // Filter for only Sadie Jean tracks (case insensitive)
      const sadieJeanTracks = recentlyPlayed.items.filter((item: any) => {
        const artistName = item.track.artists[0]?.name?.toLowerCase() || ''
        return artistName.includes('sadie jean')
      })

      console.log(`🎵 [Sync] Found ${sadieJeanTracks.length} Sadie Jean tracks`)

      if (sadieJeanTracks.length === 0) {
        console.log('ℹ️ [Sync] No Sadie Jean tracks found in recent plays')
        return { success: true, synced: 0, totalPlays: 0 }
      }
      
      // Process and store Sadie Jean listening data with more fields
      const listeningData = sadieJeanTracks.map((item: any) => ({
        user_id: databaseUserId,
        track_id: item.track.id,
        track_name: item.track.name,
        artist_name: item.track.artists[0].name,
        album_name: item.track.album?.name || '',
        played_at: item.played_at,
        duration_ms: item.track.duration_ms,
        is_local: item.track.is_local || false,
        spotify_uri: item.track.uri,
        album_image_url: item.track.album?.images?.[0]?.url || null,
        preview_url: item.track.preview_url || null,
        popularity: item.track.popularity || null,
        explicit: item.track.explicit || false,
        added_at: new Date().toISOString()
      }))

      console.log('💾 [Sync] Storing listening data...')

      // Batch insert listening data using upsert to handle duplicates
      const { error: insertError } = await supabaseAdmin
        .from('listening_data')
        .upsert(listeningData, {
          onConflict: 'user_id,track_id,played_at'
        })

      if (insertError) {
        console.error('❌ [Sync] Insert error:', insertError)
        return { success: false, synced: 0, totalPlays: 0, error: 'Failed to store listening data' }
      }

      console.log(`✅ [Sync] Successfully stored ${listeningData.length} listening records`)

      // Update user's total plays count - count only Sadie Jean tracks
      console.log('📊 [Sync] Updating total plays count...')
      const { data: sadieJeanPlayCount, error: countError } = await supabaseAdmin
        .from('listening_data')
        .select('id', { count: 'exact' })
        .eq('user_id', databaseUserId)
        .ilike('artist_name', '%sadie jean%')

      if (countError) {
        console.error('⚠️ [Sync] Error counting plays:', countError.message)
      }

      const totalPlays = sadieJeanPlayCount?.length || 0
      
      // Update user's total plays and last sync time
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ 
          total_plays: totalPlays,
          last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', databaseUserId)

      if (updateError) {
        console.error('⚠️ [Sync] Error updating user stats:', updateError.message)
      } else {
        console.log(`✅ [Sync] Updated total_plays to: ${totalPlays}`)
      }

      const duration = Date.now() - startTime
      console.log(`🎉 [Sync] Completed successfully in ${duration}ms - Synced: ${listeningData.length}, Total Plays: ${totalPlays}`)

      return { 
        success: true, 
        synced: listeningData.length,
        totalPlays: totalPlays
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
