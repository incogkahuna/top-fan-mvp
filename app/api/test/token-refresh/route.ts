import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
// DISABLED: Spotify import removed

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Get user tokens
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, display_name')
      .limit(1)

    if (usersError || !users || users.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 })
    }

    const user = users[0]

    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('user_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', user.id)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'No token found for user' }, { status: 404 })
    }

    // Check token expiry
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)
    const isExpired = now >= expiresAt

    return NextResponse.json({
      success: true,
      user: user.display_name,
      tokenExpired: isExpired,
      expiresAt: tokenData.expires_at,
      currentTime: now.toISOString(),
      hasRefreshToken: !!tokenData.refresh_token
    })
  } catch (error) {
    console.error('Token refresh test error:', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
