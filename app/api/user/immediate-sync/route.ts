import { NextRequest, NextResponse } from 'next/server'
import { syncUserListeningData } from '@/lib/sync-service'

export const dynamic = 'force-dynamic'

/**
 * Immediate sync endpoint for new users
 * This endpoint is called right after user registration to sync their data quickly
 */
export async function POST(request: NextRequest) {
  try {
    const { spotify_id } = await request.json()

    if (!spotify_id) {
      return NextResponse.json({ error: 'Spotify ID required' }, { status: 400 })
    }

    console.log(`🚀 [Immediate Sync] Starting immediate sync for new user: ${spotify_id}`)

    // Perform immediate sync with Spotify ID
    const syncResult = await syncUserListeningData(spotify_id, true)

    if (syncResult.success) {
      console.log(`✅ [Immediate Sync] Completed successfully for ${spotify_id}:`, {
        synced: syncResult.synced,
        totalPlays: syncResult.totalPlays
      })
      
      return NextResponse.json({
        success: true,
        message: 'Immediate sync completed successfully',
        sync_results: {
          synced: syncResult.synced,
          totalPlays: syncResult.totalPlays,
          timestamp: new Date().toISOString()
        }
      })
    } else {
      console.error(`❌ [Immediate Sync] Failed for ${spotify_id}:`, syncResult.error)
      
      return NextResponse.json({
        success: false,
        error: syncResult.error || 'Immediate sync failed',
        sync_results: {
          synced: syncResult.synced,
          totalPlays: syncResult.totalPlays,
          timestamp: new Date().toISOString()
        }
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ [Immediate Sync] Internal server error:', error)
    return NextResponse.json({ 
      error: 'Internal server error during immediate sync',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
