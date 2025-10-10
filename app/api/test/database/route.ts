import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Test database connection
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(5)

    if (usersError) {
      console.error('Database error:', usersError)
      return NextResponse.json({ 
        error: 'Database error', 
        details: usersError.message,
        code: usersError.code 
      }, { status: 500 })
    }

    // Check if Spotify columns exist by trying to query them
    const { data: spotifyUsers, error: spotifyError } = await supabaseAdmin
      .from('users')
      .select('spotify_id, display_name, email, profile_image')
      .limit(5)

    return NextResponse.json({
      connection: 'success',
      totalUsers: users?.length || 0,
      users: users || [],
      spotifyColumns: spotifyError ? {
        error: spotifyError.message,
        code: spotifyError.code
      } : {
        success: true,
        spotifyUsers: spotifyUsers || []
      }
    })
  } catch (error) {
    console.error('Test database error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}