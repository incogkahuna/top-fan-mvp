import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Get user profile data
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('custom_handle, bio, custom_avatar_url, privacy_settings')
      .eq('spotify_id', userId)
      .single()

    if (userError) {
      if (userError.code === 'PGRST116') {
        // User not found, return default profile
        return NextResponse.json({
          custom_handle: null,
          bio: null,
          custom_avatar_url: null,
          privacy_settings: {}
        })
      }
      throw userError
    }

    return NextResponse.json(user || {
      custom_handle: null,
      bio: null,
      custom_avatar_url: null,
      privacy_settings: {}
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, custom_handle, bio, custom_avatar_url, privacy_settings } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Check if custom handle is unique (if provided)
    if (custom_handle) {
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('spotify_id')
        .eq('custom_handle', custom_handle)
        .neq('spotify_id', userId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existingUser) {
        return NextResponse.json({ error: 'Custom handle already taken' }, { status: 409 })
      }
    }

    // Update user profile
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        custom_handle,
        bio,
        custom_avatar_url,
        privacy_settings,
        updated_at: new Date().toISOString()
      })
      .eq('spotify_id', userId)
      .select('custom_handle, bio, custom_avatar_url, privacy_settings')
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json(updatedUser)

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
