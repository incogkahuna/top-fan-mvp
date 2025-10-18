import { NextRequest, NextResponse } from 'next/server'
import { syncAllUsers } from '@/lib/sync-service'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting background sync for all users...')

    const results = await syncAllUsers()

    const successful = results.filter(r => r.result.success).length
    const failed = results.filter(r => !r.result.success).length
    const totalSynced = results.reduce((sum, r) => sum + r.result.synced, 0)

    console.log(`✅ Background sync completed: ${successful} successful, ${failed} failed, ${totalSynced} total tracks synced`)

    return NextResponse.json({
      success: true,
      message: 'Background sync completed',
      stats: {
        totalUsers: results.length,
        successful,
        failed,
        totalSynced
      },
      results: results.map(r => ({
        userId: r.userId,
        success: r.result.success,
        synced: r.result.synced,
        totalPlays: r.result.totalPlays,
        error: r.result.error
      }))
    })

  } catch (error) {
    console.error('❌ Background sync error:', error)
    return NextResponse.json({ 
      error: 'Background sync failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Background sync endpoint - use POST to trigger sync',
    usage: 'POST /api/sync/all-users to sync all users'
  })
}
