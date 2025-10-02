import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { userId } = params

    // Get detailed user information
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        listening_data!inner(track_name, artist_name, played_at, duration_ms)
      `)
      .eq('id', userId)
      .eq('listening_data.artist_name', 'Sadie Jean')

    if (userError) {
      console.error('User fetch error:', userError)
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }

    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = user[0]
    const listeningData = userData.listening_data || []

    // Calculate detailed stats
    const totalPlays = listeningData.length
    const totalPoints = listeningData.reduce((sum, track) => {
      let points = 1
      if (track.duration_ms > 0) points += 1
      return sum + points
    }, 0)

    const uniqueSongs = new Set(listeningData.map(track => track.track_name)).size
    const totalListeningTime = listeningData.reduce((sum, track) => sum + (track.duration_ms || 0), 0)

    // Get top songs
    const trackCounts: { [key: string]: number } = {}
    listeningData.forEach(track => {
      trackCounts[track.track_name] = (trackCounts[track.track_name] || 0) + 1
    })

    const topSongs = Object.entries(trackCounts)
      .map(([name, plays]) => ({ name, plays }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 5)

    // Get listening patterns
    const hourlyPatterns = getHourlyPatterns(listeningData)
    const dailyPatterns = getDailyPatterns(listeningData)

    const detailedUser = {
      id: userData.id,
      displayName: userData.display_name,
      email: userData.email,
      profileImageUrl: userData.profile_image_url,
      createdAt: userData.created_at,
      totalPlays,
      totalPoints,
      uniqueSongs,
      totalListeningTime: Math.round(totalListeningTime / 1000 / 60), // minutes
      topSongs,
      hourlyPatterns,
      dailyPatterns,
      lastActive: listeningData.length > 0 
        ? new Date(Math.max(...listeningData.map(track => new Date(track.played_at).getTime())))
        : new Date(userData.created_at)
    }

    return NextResponse.json(detailedUser)
  } catch (error) {
    console.error('User detail error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { userId } = params

    // Delete user and all associated data
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      console.error('User deletion error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('User deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { userId } = params
    const body = await request.json()
    const { displayName, email, profileImageUrl } = body

    // Update user information
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        display_name: displayName,
        email: email,
        profile_image_url: profileImageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      console.error('User update error:', updateError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getHourlyPatterns(data: any[]) {
  const hourlyCounts: { [key: number]: number } = {}
  
  data.forEach(track => {
    const hour = new Date(track.played_at).getHours()
    hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1
  })

  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    plays: hourlyCounts[hour] || 0
  }))
}

function getDailyPatterns(data: any[]) {
  const dailyCounts: { [key: string]: number } = {}
  
  data.forEach(track => {
    const date = new Date(track.played_at).toDateString()
    dailyCounts[date] = (dailyCounts[date] || 0) + 1
  })

  return Object.entries(dailyCounts).map(([date, plays]) => ({
    date,
    plays
  }))
}
