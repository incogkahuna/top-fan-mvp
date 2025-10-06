import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Get access token from cookie
    const accessToken = request.cookies.get('music_access_token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 })
    }

    // Find user by access token
    const { data: userToken, error: tokenError } = await supabaseAdmin
      .from('user_tokens')
      .select('user_id')
      .eq('access_token', accessToken)
      .single()

    if (tokenError || !userToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, music_id, display_name, email, profile_image_url')
      .eq('id', userToken.user_id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
