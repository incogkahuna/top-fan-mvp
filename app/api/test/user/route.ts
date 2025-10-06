import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Get all users from the database
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (usersError) {
      return NextResponse.json({ error: 'Failed to fetch users', details: usersError }, { status: 500 })
    }

    // Get all user tokens
    const { data: tokens, error: tokensError } = await supabaseAdmin
      .from('user_tokens')
      .select('*')
      .order('created_at', { ascending: false })

    if (tokensError) {
      return NextResponse.json({ error: 'Failed to fetch tokens', details: tokensError }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      userCount: users?.length || 0,
      tokenCount: tokens?.length || 0,
      users: users?.map(user => ({
        id: user.id,
        music_id: user.music_id,
        display_name: user.display_name,
        email: user.email,
        created_at: user.created_at
      })),
      hasTokens: tokens?.length > 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('User test error:', error)
    return NextResponse.json({ error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
