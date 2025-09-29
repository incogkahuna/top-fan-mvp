import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { spotifyId } = await request.json()

    if (!spotifyId) {
      return NextResponse.json({ error: 'Spotify ID required' }, { status: 400 })
    }

    // Find user by Spotify ID
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('spotify_id', spotifyId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        spotify_id: user.spotify_id,
        display_name: user.display_name,
        email: user.email,
        profile_image_url: user.profile_image_url,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
