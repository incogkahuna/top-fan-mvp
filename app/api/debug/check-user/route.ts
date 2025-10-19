import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const spotifyId = searchParams.get('spotify_id')

    if (!email && !spotifyId) {
      return NextResponse.json({ error: 'Email or Spotify ID required' }, { status: 400 })
    }

    let query = supabaseAdmin.from('users').select('*')

    if (email) {
      query = query.eq('email', email)
    } else if (spotifyId) {
      query = query.eq('spotify_id', spotifyId)
    }

    const { data: users, error: usersError } = await query

    if (usersError) {
      console.error('Database error:', usersError)
      return NextResponse.json({ 
        error: 'Database error', 
        details: usersError.message,
        code: usersError.code 
      }, { status: 500 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ 
        found: false,
        message: 'User not found in database',
        searchCriteria: { email, spotifyId }
      })
    }

    // Check if user has listening data
    const { data: listeningData, error: listeningError } = await supabaseAdmin
      .from('listening_data')
      .select('id, track_name, artist_name, played_at')
      .eq('user_id', users[0].id)
      .order('played_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      found: true,
      user: users[0],
      listeningDataCount: listeningData?.length || 0,
      recentListeningData: listeningData || [],
      searchCriteria: { email, spotifyId }
    })

  } catch (error) {
    console.error('Error checking user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
