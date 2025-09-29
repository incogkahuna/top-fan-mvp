import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getRecentlyPlayed } from '@/lib/spotify'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Get all users with valid tokens
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        display_name,
        user_tokens!inner(
          access_token,
          expires_at
        )
      `)

    if (usersError) {
      console.error('Users fetch error:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    const syncResults = []

    for (const user of users || []) {
      try {
        const tokenData = user.user_tokens[0]
        
        // Check if token is still valid
        const expiresAt = new Date(tokenData.expires_at)
        if (expiresAt <= new Date()) {
          console.log(`Token expired for user ${user.display_name}`)
          continue
        }

        // Get the last sync time for this user
        const { data: lastSync } = await supabaseAdmin
          .from('users')
          .select('updated_at')
          .eq('id', user.id)
          .single()

        // Fetch recently played tracks
        const recentlyPlayed = await getRecentlyPlayed(tokenData.access_token, 50)
        
        // Filter for tracks played after the last sync (if available)
        let newTracks = recentlyPlayed.items
        if (lastSync?.updated_at) {
          const lastSyncTime = new Date(lastSync.updated_at)
          newTracks = recentlyPlayed.items.filter((item: any) =>
            new Date(item.played_at) > lastSyncTime
          )
        }

        if (newTracks.length === 0) {
          syncResults.push({
            userId: user.id,
            displayName: user.display_name,
            newTracks: 0,
            status: 'no_new_data'
          })
          continue
        }

        // Process and store new listening data
        const listeningData = newTracks.map((item: any) => ({
          user_id: user.id,
          track_id: item.track.id,
          track_name: item.track.name,
          artist_name: item.track.artists[0].name,
          played_at: item.played_at,
          duration_ms: item.track.duration_ms
        }))

        // Batch insert new listening data
        const { error: insertError } = await supabaseAdmin
          .from('listening_data')
          .upsert(listeningData, {
            onConflict: 'user_id,track_id,played_at'
          })

        if (insertError) {
          console.error('Insert error for user', user.display_name, ':', insertError)
          syncResults.push({
            userId: user.id,
            displayName: user.display_name,
            newTracks: 0,
            status: 'error',
            error: insertError.message
          })
          continue
        }

        // Update user's total plays count
        const { data: playCount } = await supabaseAdmin
          .from('listening_data')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)

        await supabaseAdmin
          .from('users')
          .update({ 
            total_plays: playCount?.length || 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        syncResults.push({
          userId: user.id,
          displayName: user.display_name,
          newTracks: newTracks.length,
          status: 'success',
          totalPlays: playCount?.length || 0
        })

      } catch (userError) {
        console.error('Sync error for user', user.display_name, ':', userError)
        syncResults.push({
          userId: user.id,
          displayName: user.display_name,
          newTracks: 0,
          status: 'error',
          error: userError instanceof Error ? userError.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      syncedUsers: syncResults.length,
      results: syncResults,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Auto sync error:', error)
    return NextResponse.json({ error: 'Auto sync failed' }, { status: 500 })
  }
}

// GET endpoint to check sync status
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Get sync statistics
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, display_name, total_plays, updated_at')

    if (usersError) {
      return NextResponse.json({ error: 'Failed to fetch sync status' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      users: users?.map(user => ({
        id: user.id,
        displayName: user.display_name,
        totalPlays: user.total_plays,
        lastSync: user.updated_at
      })),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Sync status error:', error)
    return NextResponse.json({ error: 'Failed to get sync status' }, { status: 500 })
  }
}
