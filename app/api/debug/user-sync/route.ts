import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const spotifyId = searchParams.get('spotify_id')
    
    if (!spotifyId) {
      return NextResponse.json({ error: 'Spotify ID required' }, { status: 400 })
    }

    console.log('🔍 Debug: Checking user sync status for Spotify ID:', spotifyId)

    // Check if user exists in users table
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, spotify_id, display_name, email, total_plays, created_at, updated_at')
      .eq('spotify_id', spotifyId)
      .single()

    if (userError) {
      if (userError.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: 'User not found in database',
          spotify_id: spotifyId,
          debug: {
            user_exists: false,
            listening_data_count: 0,
            total_plays: 0
          }
        })
      }
      throw userError
    }

    console.log('✅ User found in database:', user.id, user.display_name)

    // Check listening data for this user
    const { data: listeningData, error: listeningError } = await supabaseAdmin
      .from('listening_data')
      .select('id, track_name, artist_name, played_at, duration_ms')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })

    if (listeningError) {
      console.error('Listening data error:', listeningError)
      return NextResponse.json({ error: 'Failed to fetch listening data' }, { status: 500 })
    }

    // Count Sadie Jean tracks specifically
    const sadieJeanData = listeningData?.filter(track => 
      track.artist_name && track.artist_name.toLowerCase().includes('sadie jean')
    ) || []

    console.log('📊 Listening data found:', {
      total_tracks: listeningData?.length || 0,
      sadie_jean_tracks: sadieJeanData.length
    })

    return NextResponse.json({
      success: true,
      user: {
        database_id: user.id,
        spotify_id: user.spotify_id,
        display_name: user.display_name,
        email: user.email,
        total_plays: user.total_plays,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      listening_data: {
        total_tracks: listeningData?.length || 0,
        sadie_jean_tracks: sadieJeanData.length,
        recent_tracks: listeningData?.slice(0, 5) || [],
        sadie_jean_tracks_detail: sadieJeanData.slice(0, 5)
      },
      debug: {
        user_exists: true,
        has_listening_data: (listeningData?.length || 0) > 0,
        has_sadie_jean_data: sadieJeanData.length > 0,
        total_plays_field: user.total_plays,
        actual_sadie_jean_count: sadieJeanData.length,
        sync_needed: user.total_plays !== sadieJeanData.length
      }
    })

  } catch (error) {
    console.error('Debug user sync error:', error)
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 })
  }
}
