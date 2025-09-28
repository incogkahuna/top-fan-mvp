import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getRecentlyPlayed, getTopTracks } from '@/lib/spotify'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's access token
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_tokens')
      .select('access_token')
      .eq('user_id', userId)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'No valid token found' }, { status: 401 })
    }

    // Fetch recently played tracks
    const recentlyPlayed = await getRecentlyPlayed(tokenData.access_token, 50)
    
    // Process and store listening data
    const listeningData = recentlyPlayed.items.map(item => ({
      user_id: userId,
      track_id: item.track.id,
      track_name: item.track.name,
      artist_name: item.track.artists[0].name,
      played_at: item.played_at,
      duration_ms: item.track.duration_ms
    }))

    // Batch insert listening data
    const { error: insertError } = await supabase
      .from('listening_data')
      .upsert(listeningData, {
        onConflict: 'user_id,track_id,played_at'
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to store listening data' }, { status: 500 })
    }

    // Update user's total plays count
    const { data: playCount } = await supabase
      .from('listening_data')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)

    await supabase
      .from('users')
      .update({ 
        total_plays: playCount?.length || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    return NextResponse.json({ 
      success: true, 
      synced: listeningData.length,
      totalPlays: playCount?.length || 0
    })
  } catch (error) {
    console.error('Data sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
