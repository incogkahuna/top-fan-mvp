import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    const artistFilter = searchParams.get('artist') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0) // All time
    }

    // Build query
    let query = supabase
      .from('listening_data')
      .select(`
        user_id,
        users!inner(display_name, profile_image_url),
        count:count(*)
      `)
      .gte('played_at', startDate.toISOString())
      .order('count', { ascending: false })
      .limit(limit)

    // Apply artist filter if specified
    if (artistFilter !== 'all') {
      query = query.eq('artist_name', artistFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Leaderboard query error:', error)
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }

    // Format leaderboard data
    const leaderboard = data?.map((entry, index) => ({
      rank: index + 1,
      userId: entry.user_id,
      displayName: entry.users.display_name,
      profileImageUrl: entry.users.profile_image_url,
      totalPlays: entry.count
    })) || []

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
