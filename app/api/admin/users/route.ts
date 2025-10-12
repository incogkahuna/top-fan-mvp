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

    // Get all users with their Sadie Jean listening data
    const { data: users, error: usersError } = await supabaseAdmin!
      .from('users')
      .select(`
        id,
        display_name,
        email,
        profile_image_url,
        created_at,
        listening_data!inner(track_name, artist_name, played_at, duration_ms)
      `)
      .eq('listening_data.artist_name', 'Sadie Jean')

    if (usersError) {
      console.error('Users query error:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Process users data
    const usersWithStats = users?.map(user => {
      const sadieJeanData = user.listening_data || []
      const totalPlays = sadieJeanData.length
      const points = sadieJeanData.reduce((sum, track) => {
        let trackPoints = 1 // Base point
        if (track.duration_ms > 0) trackPoints += 1 // Full song bonus
        return sum + trackPoints
      }, 0)

      // Get last activity
      const lastActivity = sadieJeanData.length > 0 
        ? new Date(Math.max(...sadieJeanData.map(track => new Date(track.played_at).getTime())))
        : new Date(user.created_at)

      // Determine if user is active (activity in last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const isActive = lastActivity > sevenDaysAgo

      return {
        id: user.id,
        name: user.display_name,
        email: user.email,
        totalPlays,
        points,
        rank: 0, // Will be calculated on frontend
        lastActive: lastActivity.toLocaleDateString(),
        profileImage: user.profile_image_url,
        isActive
      }
    }) || []

    // Sort by points and assign ranks
    usersWithStats.sort((a, b) => b.points - a.points)
    usersWithStats.forEach((user, index) => {
      user.rank = index + 1
    })

    return NextResponse.json(usersWithStats)
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
