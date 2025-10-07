import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // For now, we'll use a simple approach - check for a Spotify user ID in localStorage
    // In a real app, you'd use proper session management
    const { searchParams } = new URL(request.url)
    const spotifyUserId = searchParams.get('userId')
    
    if (!spotifyUserId) {
      return NextResponse.json({ error: 'No user ID provided' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }
    
    // Get user from database
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('spotify_id, display_name, email, profile_image')
      .eq('spotify_id', spotifyUserId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      spotify_id: user.spotify_id,
      display_name: user.display_name,
      email: user.email,
      profile_image: user.profile_image
    })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
