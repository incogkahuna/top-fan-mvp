import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get all listening data for the user
    const { data: listeningData, error: listeningError } = await supabaseAdmin
      .from('listening_data')
      .select('*')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })

    if (listeningError) {
      console.error('Listening data error:', listeningError)
      return NextResponse.json({ error: 'Failed to fetch listening data' }, { status: 500 })
    }

    // Calculate aggregates
    const totalPlays = listeningData?.length || 0
    
    // Get most played artists
    const artistCounts: { [key: string]: number } = {}
    const artistNames: { [key: string]: string } = {}
    
    listeningData?.forEach(track => {
      const artist = track.artist_name
      artistCounts[artist] = (artistCounts[artist] || 0) + 1
      artistNames[artist] = artist
    })
    
    const topArtists = Object.entries(artistCounts)
      .map(([artist, count]) => ({ name: artist, plays: count }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 5)

    // Get most played tracks
    const trackCounts: { [key: string]: { count: number, artist: string } } = {}
    
    listeningData?.forEach(track => {
      const key = `${track.track_name} - ${track.artist_name}`
      trackCounts[key] = {
        count: (trackCounts[key]?.count || 0) + 1,
        artist: track.artist_name
      }
    })
    
    const topTracks = Object.entries(trackCounts)
      .map(([track, data]) => ({ 
        name: track.split(' - ')[0], 
        artist: data.artist,
        plays: data.count 
      }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 5)

    // Get recent listening activity (last 10 tracks)
    const recentActivity = listeningData?.slice(0, 10).map(track => ({
      track_name: track.track_name,
      artist_name: track.artist_name,
      played_at: track.played_at,
      duration_ms: track.duration_ms
    })) || []

    // Calculate listening time
    const totalListeningTimeMs = listeningData?.reduce((total, track) => total + track.duration_ms, 0) || 0
    const totalListeningHours = Math.round((totalListeningTimeMs / (1000 * 60 * 60)) * 100) / 100

    // Get unique artists count
    const uniqueArtists = new Set(listeningData?.map(track => track.artist_name)).size

    // Get unique tracks count
    const uniqueTracks = new Set(listeningData?.map(track => `${track.track_name} - ${track.artist_name}`)).size

    return NextResponse.json({
      success: true,
      totalPlays,
      totalListeningHours,
      uniqueArtists,
      uniqueTracks,
      topArtists,
      topTracks,
      recentActivity,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Listening data API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
