// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResult = verifyAdminSession(request)
  
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error || 'Admin authentication required' }, 
      { status: 401 }
    )
  }

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Get total users
    const { count: totalUsers, error: usersError } = await supabaseAdmin!
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (usersError) {
      console.error('Users count error:', usersError)
      return NextResponse.json({ error: 'Failed to fetch user count' }, { status: 500 })
    }

    // Get active users (users with recent activity)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: activeUsers, error: activeUsersError } = await supabaseAdmin!
      .from('listening_data')
      .select('user_id', { count: 'exact', head: true })
      .gte('played_at', thirtyDaysAgo.toISOString())

    if (activeUsersError) {
      console.error('Active users count error:', activeUsersError)
    }

    // Get total plays and points for Sadie Jean only
    const { data: sadieJeanData, error: sadieJeanError } = await supabaseAdmin!
      .from('listening_data')
      .select('*')
      .eq('artist_name', 'Sadie Jean')

    if (sadieJeanError) {
      console.error('Sadie Jean data error:', sadieJeanError)
      return NextResponse.json({ error: 'Failed to fetch Sadie Jean data' }, { status: 500 })
    }

    const totalPlays = sadieJeanData?.length || 0
    const totalPoints = sadieJeanData?.reduce((sum, track) => {
      // Simple point calculation
      let points = 1 // Base point
      if (track.duration_ms > 0) points += 1 // Full song bonus
      return sum + points
    }, 0) || 0

    // Get top fan
    const { data: topFanData, error: topFanError } = await supabaseAdmin!
      .from('users')
      .select(`
        id,
        display_name,
        profile_image_url,
        listening_data!inner(track_name, artist_name, played_at, duration_ms)
      `)
      .eq('listening_data.artist_name', 'Sadie Jean')
      .order('listening_data.played_at', { ascending: false })
      .limit(1)

    let topFan = null
    if (topFanData && topFanData.length > 0) {
      const user = topFanData[0]
      const userPlays = user.listening_data?.length || 0
      const userPoints = user.listening_data?.reduce((sum, track) => {
        let points = 1
        if (track.duration_ms > 0) points += 1
        return sum + points
      }, 0) || 0

      topFan = {
        name: user.display_name,
        plays: userPlays,
        points: userPoints
      }
    }

    // Get recent activity (simplified)
    const { data: recentActivity, error: activityError } = await supabaseAdmin!
      .from('listening_data')
      .select(`
        id,
        played_at,
        user_id,
        track_name,
        users!inner(display_name)
      `)
      .eq('artist_name', 'Sadie Jean')
      .order('played_at', { ascending: false })
      .limit(10)

    const recentActivityFormatted = recentActivity?.map(activity => ({
      id: activity.id,
      user: activity.users?.[0]?.display_name || 'Unknown',
      action: `Played "${activity.track_name}"`,
      timestamp: new Date(activity.played_at).toLocaleDateString()
    })) || []

    const stats = {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalPlays,
      totalPoints,
      topFan,
      recentActivity: recentActivityFormatted
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
