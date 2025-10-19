import { NextRequest, NextResponse } from 'next/server'
import { syncUserListeningData } from '@/lib/sync-service'

export const dynamic = 'force-dynamic'

/**
 * Manual sync endpoint for user-initiated sync
 * This endpoint allows users to manually trigger a sync from their profile page
 */
export async function POST(request: NextRequest) {
  try {
    const { spotify_id } = await request.json()

    if (!spotify_id) {
      return NextResponse.json({ error: 'Spotify ID required' }, { status: 400 })
    }

    console.log(`🔄 [Manual Sync] User-initiated sync requested for Spotify ID: ${spotify_id}`)

    const syncResult = await syncUserListeningData(spotify_id, true)

    if (syncResult.success) {
      console.log(`✅ [Manual Sync] Completed successfully for ${spotify_id}. Synced ${syncResult.synced} tracks.`)
      return NextResponse.json({
        success: true,
        message: 'Sync completed successfully',
        sync_results: {
          synced: syncResult.synced,
          totalPlays: syncResult.totalPlays,
          timestamp: new Date().toISOString()
        }
      })
    } else {
      console.error(`❌ [Manual Sync] Failed for ${spotify_id}:`, syncResult.error)
      return NextResponse.json({
        success: false,
        error: syncResult.error || 'Failed to sync listening data'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ [Manual Sync] Internal server error:', error)
    return NextResponse.json({ 
      error: 'Internal server error during manual sync',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
