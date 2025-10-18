import { NextRequest, NextResponse } from 'next/server'
import { syncUserListeningData } from '@/lib/sync-service'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { spotify_id } = await request.json()
    
    if (!spotify_id) {
      return NextResponse.json({ error: 'Spotify ID required' }, { status: 400 })
    }

    console.log('🔄 User-initiated sync for:', spotify_id)

    const syncResult = await syncUserListeningData(spotify_id, true)

    if (syncResult.success) {
      console.log('✅ User sync completed:', {
        spotify_id,
        synced: syncResult.synced,
        totalPlays: syncResult.totalPlays
      })

      return NextResponse.json({
        success: true,
        message: 'Sync completed successfully',
        sync_results: {
          synced: syncResult.synced,
          totalPlays: syncResult.totalPlays
        }
      })
    } else {
      console.log('❌ User sync failed:', {
        spotify_id,
        error: syncResult.error
      })

      return NextResponse.json({
        success: false,
        error: syncResult.error || 'Sync failed'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ User sync error:', error)
    return NextResponse.json({ 
      error: 'Sync failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'User sync endpoint - use POST to trigger sync',
    usage: 'POST /api/user/sync with {"spotify_id": "your_spotify_id"}'
  })
}
