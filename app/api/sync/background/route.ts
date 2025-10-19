import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { syncUserListeningData } from '@/lib/sync-service'

export const dynamic = 'force-dynamic'

/**
 * Background sync endpoint for all users
 * This endpoint can be called periodically to keep all users' data up to date
 */
export async function POST(request: NextRequest) {
  console.log('🔄 [Background Sync] Starting background sync for all active users...')

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 })
  }

  try {
    // Fetch all users who have connected Spotify (i.e., have a spotify_id)
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('spotify_id, last_synced_at')
      .not('spotify_id', 'is', null) // Only users with a Spotify ID
      .limit(50) // Limit to prevent overwhelming the API for very large user bases

    if (usersError) {
      console.error('❌ [Background Sync] Error fetching users:', usersError.message)
      return NextResponse.json({ error: 'Failed to fetch users for sync' }, { status: 500 })
    }

    if (!users || users.length === 0) {
      console.log('✅ [Background Sync] No active users found to sync.')
      return NextResponse.json({ success: true, message: 'No active users found to sync.' })
    }

    console.log(`[Background Sync] Found ${users.length} users to sync.`)

    // Filter users who haven't been synced recently (within last 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const usersToSync = users.filter(user => 
      !user.last_synced_at || new Date(user.last_synced_at) < new Date(twoHoursAgo)
    )

    console.log(`[Background Sync] ${usersToSync.length} users need syncing (${users.length - usersToSync.length} already synced recently)`)

    if (usersToSync.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'All users are already up to date.' 
      })
    }

    // Process syncs in batches to avoid overwhelming the system
    const batchSize = 5
    const results = []
    
    for (let i = 0; i < usersToSync.length; i += batchSize) {
      const batch = usersToSync.slice(i, i + batchSize)
      
      const batchPromises = batch.map(user =>
        syncUserListeningData(user.spotify_id!)
          .then(result => ({ 
            spotify_id: user.spotify_id, 
            result,
            last_synced: user.last_synced_at
          }))
          .catch(error => {
            console.error(`❌ [Background Sync] Uncaught error during sync for ${user.spotify_id}:`, error)
            return { 
              spotify_id: user.spotify_id, 
              result: { 
                success: false, 
                synced: 0, 
                totalPlays: 0, 
                error: error.message || 'Unknown error' 
              },
              last_synced: user.last_synced_at
            }
          })
      )

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
      
      // Add a small delay between batches to be nice to the API
      if (i + batchSize < usersToSync.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    const successfulSyncs = results.filter(r => r.result.success).length
    const failedSyncs = results.length - successfulSyncs
    const totalSynced = results.reduce((sum, r) => sum + r.result.synced, 0)

    console.log(`✅ [Background Sync] Sync process completed. Successful: ${successfulSyncs}, Failed: ${failedSyncs}, Total tracks synced: ${totalSynced}`)

    return NextResponse.json({
      success: true,
      message: `Background sync completed. Processed ${usersToSync.length} users.`,
      statistics: {
        totalUsers: users.length,
        usersNeedingSync: usersToSync.length,
        successfulSyncs,
        failedSyncs,
        totalTracksSynced: totalSynced
      },
      results: results
    })

  } catch (error) {
    console.error('❌ [Background Sync] Internal server error:', error)
    return NextResponse.json({ 
      error: 'Internal server error during background sync',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
