import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection
    const supabaseStatus = supabaseAdmin ? 'Connected' : 'Not connected'
    
    // Test environment variables
    const envStatus = {
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID ? 'Set' : 'Missing',
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ? 'Set' : 'Missing',
      SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI || 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Missing',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
    }

    // Test Supabase query
    let supabaseTest = 'Not tested'
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin.from('users').select('count').limit(1)
        supabaseTest = error ? `Error: ${error.message}` : 'Working'
      } catch (err) {
        supabaseTest = `Error: ${err}`
      }
    }

    return NextResponse.json({
      supabaseStatus,
      envStatus,
      supabaseTest,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
