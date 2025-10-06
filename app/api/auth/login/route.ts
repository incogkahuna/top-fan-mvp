import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { musicId } = await request.json()

    if (!musicId) {
      return NextResponse.json({ error: 'Music ID required' }, { status: 400 })
    }

    // Find user by Music ID
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('music_id', musicId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        music_id: user.music_id,
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
