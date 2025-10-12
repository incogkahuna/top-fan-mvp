// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// Point calculation system for Sadie Jean listening only
function calculateUserPoints(listeningData: any[]): number {
  let points = 0
  const trackPlays: { [key: string]: number } = {}
  const sessionData: { [key: string]: any[] } = {}
  
  // Filter to ensure only Sadie Jean tracks
  const sadieJeanTracks = listeningData.filter(track => 
    track.artist_name && track.artist_name.toLowerCase().includes('sadie jean')
  )
  
  sadieJeanTracks.forEach(track => {
    const trackKey = track.track_name
    const sessionKey = new Date(track.played_at).toDateString()
    
    // Count plays per track
    trackPlays[trackKey] = (trackPlays[trackKey] || 0) + 1
    
    // Group by session
    if (!sessionData[sessionKey]) sessionData[sessionKey] = []
    sessionData[sessionKey].push(track)
    
    // Base points for Sadie Jean tracks
    points += 1
    
    // Full song bonus (assuming >80% duration)
    if (track.duration_ms > 0) {
      points += 1 // Full song bonus
    }
    
    // Repeat play bonus for Sadie Jean tracks
    if (trackPlays[trackKey] > 1) {
      points += 2
    }
  })
  
  // Session bonuses
  Object.values(sessionData).forEach(session => {
    const sessionDuration = session.reduce((sum, track) => sum + (track.duration_ms || 0), 0)
    const sessionMinutes = sessionDuration / 1000 / 60
    
    // 30+ minute session bonus
    if (sessionMinutes >= 30) {
      points += 5
    }
    
    // Weekend bonus
    const sessionDate = new Date(session[0].played_at)
    if (sessionDate.getDay() === 0 || sessionDate.getDay() === 6) {
      points += Math.floor(sessionMinutes / 10) // 1 point per 10 minutes on weekends
    }
    
    // Peak hours bonus (7-9 PM)
    const sessionHour = sessionDate.getHours()
    if (sessionHour >= 19 && sessionHour <= 21) {
      points += Math.floor(sessionMinutes / 5) // 1 point per 5 minutes during peak
    }
  })
  
  // Discovery bonus (first play of each unique song)
  const uniqueSongs = new Set(listeningData.map(track => track.track_name)).size
  points += uniqueSongs * 2 // 2 points per unique song discovered
  
  return Math.round(points)
}

// Get top 3 Sadie Jean songs for a user
function getTopSongs(listeningData: any[]): Array<{name: string, plays: number}> {
  const trackCounts: { [key: string]: number } = {}
  
  // Filter to only Sadie Jean tracks
  const sadieJeanTracks = listeningData.filter(track => 
    track.artist_name && track.artist_name.toLowerCase().includes('sadie jean')
  )
  
  sadieJeanTracks.forEach(track => {
    trackCounts[track.track_name] = (trackCounts[track.track_name] || 0) + 1
  })
  
  return Object.entries(trackCounts)
    .map(([name, plays]) => ({ name, plays }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 3)
}

// Calculate average session length
function calculateAvgSessionLength(listeningData: any[]): number {
  if (listeningData.length === 0) return 0
  
  const sessionData: { [key: string]: any[] } = {}
  
  listeningData.forEach(track => {
    const sessionKey = new Date(track.played_at).toDateString()
    if (!sessionData[sessionKey]) sessionData[sessionKey] = []
    sessionData[sessionKey].push(track)
  })
  
  const sessionLengths = Object.values(sessionData).map(session => {
    return session.reduce((sum, track) => sum + (track.duration_ms || 0), 0)
  })
  
  return sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length
}

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

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

    // Get all users first
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select(`
        id, 
        spotify_id,
        display_name, 
        profile_image_url, 
        total_plays
      `)
      .not('spotify_id', 'is', null)
      .order('total_plays', { ascending: false })
      .limit(limit)

    if (usersError) {
      console.error('Users query error:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Get Sadie Jean listening data for each user
    const usersWithSadieData = await Promise.all(
      users.map(async (user) => {
        const { data: sadieData, error: sadieError } = await supabaseAdmin
          .from('listening_data')
          .select('track_name, artist_name, played_at, duration_ms')
          .eq('user_id', user.spotify_id)
          .eq('artist_name', 'Sadie Jean')
        
        if (sadieError) {
          console.error('Sadie Jean data error for user', user.id, ':', sadieError)
          return { ...user, listening_data: [] }
        }
        
        return { ...user, listening_data: sadieData || [] }
      })
    )

    // Calculate detailed stats for each user using only Sadie Jean data
    const leaderboard = usersWithSadieData?.map((user, index) => {
      const sadieJeanData = user.listening_data || []
      
      // Calculate points using our point system (only Sadie Jean tracks)
      const points = calculateUserPoints(sadieJeanData)
      
      // Get top Sadie Jean songs only
      const topSongs = getTopSongs(sadieJeanData)
      
      // Calculate additional stats (only Sadie Jean data)
      const totalListeningTime = sadieJeanData.reduce((sum, track) => sum + (track.duration_ms || 0), 0)
      const uniqueSongs = new Set(sadieJeanData.map(track => track.track_name)).size
      const avgSessionLength = calculateAvgSessionLength(sadieJeanData)
      
      // Calculate Sadie Jean specific plays
      const sadieJeanPlays = sadieJeanData.length
      
      return {
        rank: index + 1,
        userId: user.spotify_id, // Use spotify_id instead of id
        displayName: user.display_name,
        profileImageUrl: user.profile_image_url,
        totalPlays: sadieJeanPlays, // Only Sadie Jean plays
        points: points,
        topSongs: topSongs,
        totalListeningTime: Math.round(totalListeningTime / 1000 / 60), // minutes
        uniqueSongs: uniqueSongs,
        avgSessionLength: Math.round(avgSessionLength / 1000 / 60) // minutes
      }
    }).filter(user => user.totalPlays > 0) || [] // Only show users with Sadie Jean plays

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}