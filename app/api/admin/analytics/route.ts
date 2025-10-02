// @ts-nocheck
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

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

    // Get Sadie Jean listening data for the time range
    const { data: listeningData, error: dataError } = await supabaseAdmin!
      .from('listening_data')
      .select('*')
      .eq('artist_name', 'Sadie Jean')
      .gte('played_at', startDate.toISOString())

    if (dataError) {
      console.error('Analytics data error:', dataError)
      return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
    }

    // User growth over time
    const userGrowth = await getUserGrowth(startDate)

    // Listening patterns by hour
    const hourlyPatterns = getHourlyPatterns(listeningData || [])

    // Top tracks
    const topTracks = getTopTracks(listeningData || [])

    // Geographic distribution (if we had location data)
    const geographicData = {
      regions: [
        { name: 'North America', percentage: 65 },
        { name: 'Europe', percentage: 20 },
        { name: 'Asia', percentage: 10 },
        { name: 'Other', percentage: 5 }
      ]
    }

    // Engagement metrics
    const engagementMetrics = {
      averageSessionLength: getAverageSessionLength(listeningData || []),
      repeatListeners: getRepeatListeners(listeningData || []),
      newListeners: getNewListeners(listeningData || []),
      retentionRate: getRetentionRate(listeningData || [])
    }

    const analytics = {
      timeRange,
      userGrowth,
      hourlyPatterns,
      topTracks,
      geographicData,
      engagementMetrics,
      totalPlays: listeningData?.length || 0,
      uniqueUsers: new Set(listeningData?.map(track => track.user_id)).size || 0
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getUserGrowth(startDate: Date) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured')
  }
  
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (error) return []

  // Group by day
  const growthByDay: { [key: string]: number } = {}
  users?.forEach(user => {
    const date = new Date(user.created_at).toDateString()
    growthByDay[date] = (growthByDay[date] || 0) + 1
  })

  return Object.entries(growthByDay).map(([date, count]) => ({
    date,
    users: count
  }))
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

function getTopTracks(data: any[]) {
  const trackCounts: { [key: string]: number } = {}
  
  data.forEach(track => {
    trackCounts[track.track_name] = (trackCounts[track.track_name] || 0) + 1
  })

  return Object.entries(trackCounts)
    .map(([name, plays]) => ({ name, plays }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10)
}

function getAverageSessionLength(data: any[]) {
  if (data.length === 0) return 0

  const sessionData: { [key: string]: any[] } = {}
  
  data.forEach(track => {
    const sessionKey = new Date(track.played_at).toDateString()
    if (!sessionData[sessionKey]) sessionData[sessionKey] = []
    sessionData[sessionKey].push(track)
  })

  const sessionLengths = Object.values(sessionData).map(session => {
    return session.reduce((sum, track) => sum + (track.duration_ms || 0), 0)
  })

  return sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length / 1000 / 60 // minutes
}

function getRepeatListeners(data: any[]) {
  const userPlayCounts: { [key: string]: number } = {}
  
  data.forEach(track => {
    userPlayCounts[track.user_id] = (userPlayCounts[track.user_id] || 0) + 1
  })

  return Object.values(userPlayCounts).filter(count => count > 1).length
}

function getNewListeners(data: any[]) {
  const uniqueUsers = new Set(data.map(track => track.user_id))
  return uniqueUsers.size
}

function getRetentionRate(data: any[]) {
  // Simplified retention calculation
  const uniqueUsers = new Set(data.map(track => track.user_id))
  const totalUsers = uniqueUsers.size
  
  if (totalUsers === 0) return 0
  
  // Users who listened more than once
  const userPlayCounts: { [key: string]: number } = {}
  data.forEach(track => {
    userPlayCounts[track.user_id] = (userPlayCounts[track.user_id] || 0) + 1
  })
  
  const retainedUsers = Object.values(userPlayCounts).filter(count => count > 1).length
  
  return (retainedUsers / totalUsers) * 100
}
